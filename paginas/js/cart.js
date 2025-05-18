// /paginas/js/cart.js

document.addEventListener('DOMContentLoaded', () => {
  const API   = '/api';
  const token = localStorage.getItem('token');
  if (!token) return location.href = 'login.html';

  const tbody    = document.getElementById('cartBody');
  const totalEl  = document.getElementById('total');
  const checkout = document.getElementById('checkoutBtn');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let productsCache = {};

  /* === Cargar productos desde API === */
  Promise.all(cart.map(item =>
    fetch(`${API}/products/${item.product}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
  )).then(list => {
    list.forEach(p => { productsCache[p._id] = p });
    render();
  }).catch(() => {
    tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-red-600">Error al cargar</td></tr>`;
  });

  /* === Renderizar tabla === */
  function render() {
    tbody.innerHTML = '';
    let total = 0;

    if (!cart.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="py-4">Carrito vacío</td></tr>`;
    }

    cart.forEach((item, idx) => {
      const p = productsCache[item.product];
      const subtotal = p.price * item.qty;
      total += subtotal;

      const tr = document.createElement('tr');
      tr.className = 'border-b';
      tr.innerHTML = `
        <td class="py-2 px-3">${p.description}</td>
        <td class="py-2 px-3">$${p.price}</td>
        <td class="py-2 px-3">
          <input type="number" min="1" value="${item.qty}" class="qtyInput w-16 border rounded text-center" data-idx="${idx}" />
        </td>
        <td class="py-2 px-3">$${subtotal}</td>
        <td class="py-2 px-3">
          <button class="delBtn text-red-600" data-idx="${idx}">
            <i data-feather="trash-2"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    feather.replace();
    totalEl.textContent = `Total: $${total}`;

    /* === Listeners === */
    document.querySelectorAll('.qtyInput').forEach(input => {
      input.addEventListener('change', e => {
        const i = +e.target.dataset.idx;
        cart[i].qty = Math.max(1, parseInt(e.target.value) || 1);
        save();
        render();
      });
    });

    document.querySelectorAll('.delBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const i = +e.currentTarget.dataset.idx;
        cart.splice(i, 1);
        save();
        render();
      });
    });
  }

  /* === Guardar en localStorage === */
  function save() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateBadge();
  }

  /* === Enviar pedido al backend === */
  checkout.addEventListener('click', () => {
    if (!cart.length) return Swal.fire('Carrito vacío', '', 'info');

    fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: cart })
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      Swal.fire('Pedido realizado', 'Gracias por tu compra', 'success');
      cart = [];
      save();
      render();
    })
    .catch(() => Swal.fire('Error', 'No se pudo procesar el pedido', 'error'));
  });

  /* === Contador del ícono 🛒 === */
  function updateBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  updateBadge(); // inicial
});
