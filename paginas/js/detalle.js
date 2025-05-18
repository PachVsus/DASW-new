// /paginas/js/detalle.js

document.addEventListener('DOMContentLoaded', () => {
  const API   = '/api';
  const token = localStorage.getItem('token');
  const id    = new URLSearchParams(location.search).get('id');
  const card  = document.getElementById('productCard');

  // Redirige si no hay sesión o id de producto
  if (!token || !id) return location.href = 'login.html';

  // Obtiene datos del producto
  fetch(`${API}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.ok ? res.json() : Promise.reject('Producto no encontrado'))
    .then(producto => render(producto))
    .catch(err => {
      card.innerHTML = `<p class="text-center text-red-600">${err}</p>`;
    });

  // Renderiza la vista del producto
  function render(p) {
    const img = p.sceneViewer || '/img/placeholder.jpg';

    card.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${p.description}</h2>
      <img src="${img}" alt="${p.description}"
           class="w-full h-64 object-cover rounded-lg mb-4" />
      <p class="text-xl text-green-700 font-semibold mb-4">$${p.price}</p>
      <p class="mb-6 text-gray-700">${p.longDescription || ''}</p>

      <div class="flex items-center mb-6">
        <label class="mr-2">Cantidad</label>
        <input id="qty" type="number" value="1" min="1"
               class="w-20 px-2 py-1 border rounded" />
      </div>

      <button id="addBtn"
        class="bg-blue-600 text-white py-2 w-full rounded
               hover:bg-blue-700 transition">
        Añadir al carrito
      </button>
    `;
    feather.replace();

    document.getElementById('addBtn')
      .addEventListener('click', () => addToCart(p._id));
  }

  // Añadir producto al carrito en localStorage
  function addToCart(productId) {
    const qty = parseInt(document.getElementById('qty').value) || 1;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const index = cart.findIndex(item => item.product === productId);
    if (index >= 0) {
      cart[index].qty += qty;
    } else {
      cart.push({ product: productId, qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateBadge();

    Swal.fire('Añadido', 'Producto agregado al carrito', 'success');
  }

  // Contador del carrito (ícono superior)
  function updateBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    badge.textContent = cart.reduce((total, item) => total + item.qty, 0);
  }

  updateBadge(); // al cargar la página
});
