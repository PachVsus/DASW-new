// /public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '/api';  // En producción Render+Vercel cambia a URL absoluta si lo prefieres
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

      /* ---------- Guardar JWT ---------- */
      const token = data.token;
      localStorage.setItem('token', token);

      /* ---------- Decodificar payload ---------- */
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userId', payload.userId);
      localStorage.setItem('role',   payload.role);  

      /* ---------- Feedback & redirección ---------- */
      await Swal.fire({
        icon : 'success',
        title: '¡Bienvenido!',
        text : 'Inicio de sesión exitoso.',
        timer: 1500,
        showConfirmButton: false
      });

      window.location.href = 'products-index.html';
    }
    catch (err) {
      console.error(err);
      Swal.fire('Error de autenticación', err.message, 'error');
    }
  });
});
