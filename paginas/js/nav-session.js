/*  nav-session.js
    — Controla qué enlaces se ven en el navbar
    — Actualiza el badge del carrito
*/

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  /* ---------- Mostrar / ocultar links ---------- */
  if (token) {
    // Usuario logueado → quita enlaces solo-guest
    document.querySelectorAll('.guestOnly').forEach(el => el.remove());
  } else {
    // Usuario invitado → quita enlaces solo-auth
    document.querySelectorAll('.authOnly').forEach(el => el.remove());
  }

  /* ---------- Contador de carrito ---------- */
  updateCartBadge();

  function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // imprime la suma de cantidades (no solo número de ítems)
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
});
