// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:5000/api';           // Puedes cambiar a '/api' en producción
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Credenciales inválidas');
      }

      // ------- GUARDAR JWT -------
      const token = data.token;
      localStorage.setItem('token', token);

      // ------- DECODIFICAR USER ID -------
      const payloadBase64 = token.split('.')[1];
      const payload       = JSON.parse(atob(payloadBase64));
      localStorage.setItem('userId', payload.userId);

      // ------- REDIRECCIÓN -------
      await Swal.fire({
        icon : 'success',
        title: '¡Bienvenido!',
        text : 'Inicio de sesión exitoso.',
        timer: 1500,
        showConfirmButton: false
      });

      window.location.href = 'products-index.html';  // ✅ Redirección corregida
    }
    catch (err) {
      console.error(err);
      Swal.fire('Error de autenticación', err.message, 'error');
    }
  });
});
