// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '/api';             // mismo host => ruta relativa
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

      const data = await res.json();           // siempre parsea la respuesta

      if (!res.ok) {                           // 400 ó 401
        throw new Error(data.error || data.message || 'Credenciales inválidas');
      }

      // ------- GUARDAR JWT -------
      const token = data.token;                // back responde { token: '...'}
      localStorage.setItem('token', token);

      // ------- DECODIFICAR USER ID para poder llamar /api/users/:id después -------
      const payloadBase64 = token.split('.')[1];
      const payload       = JSON.parse(atob(payloadBase64));
      localStorage.setItem('userId', payload.userId);   // mismo nombre que backend

      // ------- REDIRECCIÓN -------
      await Swal.fire({
        icon : 'success',
        title: '¡Bienvenido!',
        text : 'Inicio de sesión exitoso.',
        timer: 1500,
        showConfirmButton: false
      });

      window.location.href = 'products_index.html';
    }
    catch (err) {
      console.error(err);
      Swal.fire('Error de autenticación', err.message, 'error');
    }
  });
});
