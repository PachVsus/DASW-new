const API_URL = 'http://localhost:5000/api/products'; // Cambia esto si usas Render
let paginaActual = 1;
const limite = 5;

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

const productosContainer = document.getElementById('productosContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

async function cargarProductos(pagina = 1, busqueda = '') {
  try {
    const res = await fetch(`${API_URL}?page=${pagina}&limit=${limite}&search=${busqueda}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    mostrarProductos(data.productos || []);
    actualizarPaginacion(data.totalPages || 1, pagina);
  } catch (err) {
    console.error('Error al cargar productos', err);
    productosContainer.innerHTML = '<p>Error al cargar productos.</p>';
  }
}

function mostrarProductos(productos) {
  productosContainer.innerHTML = '';
  if (productos.length === 0) {
    productosContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  productos.forEach((prod) => {
    const div = document.createElement('div');
    div.className = 'producto-card';
    div.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <p>${prod.descripcion}</p>
      ${prod.imageUrl ? `<img src="${prod.imageUrl}" alt="${prod.nombre}" width="150">` : ''}
      <button onclick="verDetalle('${prod._id}')">Ver</button>
      <button onclick="borrarProducto('${prod._id}')">Borrar</button>
    `;
    productosContainer.appendChild(div);
  });
}

function verDetalle(id) {
  window.location.href = `detalle.html?id=${id}`;
}

async function borrarProducto(id) {
  if (!confirm('¿Eliminar este producto?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      cargarProductos(paginaActual);
    } else {
      alert('Error al eliminar producto.');
    }
  } catch (err) {
    console.error('Error al borrar producto', err);
  }
}

function actualizarPaginacion(totalPages, actual) {
  pageInfo.textContent = `Página ${actual} de ${totalPages}`;
  prevBtn.disabled = actual <= 1;
  nextBtn.disabled = actual >= totalPages;
}

searchBtn.addEventListener('click', () => {
  cargarProductos(1, searchInput.value);
});

prevBtn.addEventListener('click', () => {
  if (paginaActual > 1) {
    paginaActual--;
    cargarProductos(paginaActual, searchInput.value);
  }
});

nextBtn.addEventListener('click', () => {
  paginaActual++;
  cargarProductos(paginaActual, searchInput.value);
});

// Cargar al inicio
cargarProductos(paginaActual);
