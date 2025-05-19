document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const container = document.getElementById('profileCard');

  // Validar sesión
  if (!token || !userId) {
    Swal.fire('Sesión no válida', 'Inicia sesión primero', 'warning')
      .then(() => window.location.href = 'login.html');
    return;
  }

  // Obtener perfil del usuario
  fetch(`/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        Swal.fire('Sesión expirada', 'Inicia sesión nuevamente', 'info')
          .then(() => window.location.href = 'login.html');
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al obtener perfil');
      }

      return res.json();
    })
    .then(user => {
      if (!user) return;

      container.innerHTML = `
        <div class="text-center bg-white p-6 rounded shadow">
          <h3 class="text-2xl font-bold mb-3">${user.name}</h3>
          <p><strong>Correo:</strong> ${user.email}</p>
          <p><strong>RFC:</strong> ${user.RFC}</p>
          <p><strong>Tarjeta:</strong> ${user.cardNumber}</p>
          <p><strong>Rol:</strong> ${user.role}</p>
          <p class="text-sm text-gray-400 mt-3">ID: ${user._id}</p>
        </div>
      `;
    })
    .catch(err => {
      console.error('Error al cargar perfil:', err.message);
      container.innerHTML = `
        <div class="text-center text-red-500">
          Error al cargar el perfil. Intenta más tarde.
        </div>`;
    });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  document.getElementById('logoutBtnMobile')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
