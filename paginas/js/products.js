document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Validar sesión
  if (!token || !userId) {
    Swal.fire('Sesión no válida', 'Inicia sesión primero', 'warning')
      .then(() => window.location.href = 'login.html');
    return;
  }

  const productList = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const pagination = document.getElementById('pagination');

  let currentPage = 1;
  let totalPages = 1;
  let searchTerm = '';

  const renderProducts = (productos) => {
    productList.innerHTML = '';
    if (productos.length === 0) {
      productList.innerHTML = `<div class="text-center text-gray-500 col-span-3">No hay productos disponibles</div>`;
      return;
    }

    productos.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow text-center';

      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.nombre}" class="w-full h-48 object-cover mb-2 rounded">
        <h3 class="text-lg font-bold">${product.nombre}</h3>
        <p class="text-sm text-gray-500 mb-2">${product.description}</p>
        <p class="font-semibold mb-2">$${product.price}</p>
        <a href="${product.sceneViewer}" target="_blank" class="text-blue-500 underline">Vista 3D</a>
      `;

      productList.appendChild(card);
    });
  };

  const renderPagination = () => {
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.className = `mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        loadProducts();
      });
      pagination.appendChild(pageBtn);
    }
  };

  const loadProducts = () => {
    let url = `/api/products?page=${currentPage}`;
    if (searchTerm) url += `&nombre=${encodeURIComponent(searchTerm)}`;

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          Swal.fire('Sesión expirada', 'Inicia sesión nuevamente', 'info')
            .then(() => window.location.href = 'login.html');
          return;
        }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        if (!data) return;
        renderProducts(data.productos);
        totalPages = data.totalPages;
        renderPagination();
      })
      .catch(err => {
        console.error('Error al obtener productos:', err.message);
        productList.innerHTML = `<div class="text-center text-red-500 col-span-3">Error al cargar productos</div>`;
      });
  };

  // Buscar productos
  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    currentPage = 1;
    loadProducts();
  });

  // Cargar al iniciar
  loadProducts();

  // Logout botones
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  document.getElementById('logoutBtnMobile')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
