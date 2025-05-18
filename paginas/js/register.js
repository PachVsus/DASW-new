// /paginas/js/register.js
document.addEventListener('DOMContentLoaded', () => {
  const API = '/api';                         // misma raíz que en login.js
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Obtener campos ---
    const name        = document.getElementById('name').value.trim();
    const email       = document.getElementById('email').value.trim();
    const password    = document.getElementById('password').value;
    const password2   = document.getElementById('password2').value;
    const RFC         = document.getElementById('rfc').value.trim().toUpperCase();
    const cardNumber  = document.getElementById('cardNumber').value.trim();

    // --- Validación básica en front ---
    if (password !== password2) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const res = await fetch(`${API}/users`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ name, email, password, RFC, cardNumber })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Error al registrar');
      }

      // Exitoso
      await Swal.fire({
        icon : 'success',
        title: 'Cuenta creada',
        text : '¡Ahora inicia sesión con tu correo y contraseña!',
        timer: 1800,
        showConfirmButton: false
      });

      // Redirigir a login
      window.location.href = 'login.html';
    }
    catch (err) {
      console.error(err);
      Swal.fire('Registro fallido', err.message, 'error');
    }
  });
});
