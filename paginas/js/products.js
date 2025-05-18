// /paginas/js/products.js
document.addEventListener('DOMContentLoaded', () => {
  const API   = '/api';
  const token = localStorage.getItem('token');

  // ---- Protección: token requerido ----
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // DOM refs
  const grid       = document.getElementById('productsGrid');
  const searchBox  = document.getElementById('searchInput');
  const pagDiv     = document.getElementById('pagination');
  const logoutBtns = [document.getElementById('logoutBtn'),
                      document.getElementById('logoutBtnMobile')];

  /* ============ STATE ============ */
  let products     = [];   // cache completo
  let currentPage  = 1;    // página mostrada
  const PAGE_SIZE  = 9;    // 9 cards por página

  /* ============ API CALL ============ */
  async function fetchProducts() {
    try {
      const res = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 400) {
        localStorage.clear();
        return window.location.href = 'login.html';
      }

      products = await res.json();
      render();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
  }

  /* ============ RENDER ============ */
  function render() {
    // 1) filtrar
    const q = searchBox.value.toLowerCase();
    const filtered = products.filter(p =>
      p.description.toLowerCase().includes(q)
    );

    // 2) paginar
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const sliceStart = (currentPage - 1) * PAGE_SIZE;
    const sliceEnd   = sliceStart + PAGE_SIZE;
    const pageItems  = filtered.slice(sliceStart, sliceEnd);

    // 3) pintar cards
    grid.innerHTML = '';
    if (!pageItems.length) {
      grid.innerHTML =
        '<p class="col-span-full text-center text-gray-500">No hay productos</p>';
    } else {
      pageItems.forEach(p => grid.appendChild(cardTemplate(p)));
    }

    // 4) paginación
    renderPagination(totalPages);
  }

  function cardTemplate(prod) {
    const div   = document.createElement('div');
    div.className = 'bg-white shadow-md rounded-lg p-4 flex flex-col';
    div.innerHTML = `
      <h3 class="text-xl font-semibold mb-2">${prod.description}</h3>
      <img src="${prod.sceneViewer || '/img/placeholder.jpg'}"
           alt="${prod.description}"
           class="w-full h-48 object-cover rounded-lg mb-4">
      <p class="text-gray-700 mb-2">$${prod.price}</p>
      <button class="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Añadir al carrito
      </button>
    `;
    return div;
  }

  function renderPagination(totalPages) {
    pagDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent   = i;
      btn.className     =
        `px-3 py-1 rounded ${i === currentPage
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300'}`;
      btn.addEventListener('click', () => {
        currentPage = i;
        render();
      });
      pagDiv.appendChild(btn);
    }
  }

  /* ============ EVENTOS ============ */
  searchBox.addEventListener('input', () => { currentPage = 1; render(); });

  logoutBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  });

  // Menú mobile toggle
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('hidden');
  });

  // Iconos Feather
  feather.replace();

  // Kick-off
  fetchProducts();
});
