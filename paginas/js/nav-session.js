/*  nav-session.js
    — Controla qué enlaces se ven en el navbar
    — Actualiza el badge del carrito
    — Inicializa menú móvil
    — Activa íconos Feather
*/

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  // 👤 Usuario logueado
  if (token) {
    document.querySelectorAll('.guestOnly').forEach(el => el.remove());
  } else {
    document.querySelectorAll('.authOnly').forEach(el => el.remove());
  }

  // 🛡️ Solo admin puede ver adminOnly
  if (role !== 'admin') {
    document.querySelectorAll('.adminOnly').forEach(el => el.remove());
  }

  // 🛒 Actualizar contador carrito
  updateCartBadge();

  function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  /* ---------- Reemplazar íconos Feather ---------- */
  if (window.feather) {
    feather.replace();
  }
});
