// frontend/js/products.js
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:5000/api/products'; // ajustar si haces deploy
  const token = localStorage.getItem('token');

  // Redirigir si no hay token
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // DOM Elements
  const grid = document.getElementById('productsGrid');
  const searchBox = document.getElementById('searchInput');
  const pagDiv = document.getElementById('pagination');
  const logoutBtns = [
    document.getElementById('logoutBtn'),
    document.getElementById('logoutBtnMobile')
  ];

  // State
  let products = [];
  let currentPage = 1;
  const PAGE_SIZE = 9;

  // Fetch productos desde API
  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}?page=1&limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        return (window.location.href = 'login.html');
      }

      const data = await res.json();
      products = data.productos || [];
      render();
    } catch (err) {
      console.error('Error:', err);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
  }

  // Render productos con filtro y paginación
  function render() {
    const query = searchBox.value.toLowerCase();
    const filtered = products.filter((p) =>
  (p.nombre || '').toLowerCase().includes(query) ||
  (p.descripcion || '').toLowerCase().includes(query)
);


    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = filtered.slice(start, end);

    // Render de tarjetas
    grid.innerHTML = '';
    if (!pageItems.length) {
      grid.innerHTML =
        '<p class="col-span-full text-center text-gray-500">No hay productos disponibles.</p>';
    } else {
      pageItems.forEach((prod) => grid.appendChild(cardTemplate(prod)));
    }

    renderPagination(totalPages);
  }

  // Template de tarjeta de producto
  function cardTemplate(prod) {
    const div = document.createElement('div');
    div.className = 'bg-white shadow-md rounded-lg p-4 flex flex-col';
    div.innerHTML = `
      <h3 class="text-xl font-semibold mb-2">${prod.nombre || 'Producto'}</h3>
      <img src="${prod.imageUrl || '/img/placeholder.jpg'}"
           alt="${prod.descripcion || ''}"
           class="w-full h-48 object-cover rounded-lg mb-4">
      <p class="text-gray-700 mb-2">${prod.descripcion || 'Sin descripción'}</p>
      <p class="text-blue-600 font-bold mb-2">$${prod.precio || '0.00'}</p>
      <button class="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Añadir al carrito
      </button>
    `;
    return div;
  }

  // Render botones de paginación
  function renderPagination(totalPages) {
    pagDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `px-3 py-1 rounded mx-1 ${
        i === currentPage
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
      }`;
      btn.addEventListener('click', () => {
        currentPage = i;
        render();
      });
      pagDiv.appendChild(btn);
    }
  }

  // Eventos
  searchBox.addEventListener('input', () => {
    currentPage = 1;
    render();
  });

  logoutBtns.forEach((btn) => {
    if (btn)
      btn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
      });
  });

  // Iconos Feather (si los usas)
  if (window.feather) feather.replace();

  // Iniciar carga
  fetchProducts();
});
