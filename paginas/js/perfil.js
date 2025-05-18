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

  // Fetch del perfil
  fetch(`/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener el perfil');
      return res.json();
    })
    .then(user => {
      container.innerHTML = `
        <div class="text-center">
          <h3 class="text-xl font-bold mb-2">${user.name}</h3>
          <p><strong>Correo:</strong> ${user.email}</p>
          <p><strong>RFC:</strong> ${user.RFC}</p>
          <p><strong>Tarjeta:</strong> ${user.cardNumber}</p>
          <p><strong>Rol:</strong> ${user.role}</p>
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<div class="text-red-500 text-center">Error: ${err.message}</div>`;
    });

  // Cerrar sesión
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  document.getElementById('logoutBtnMobile')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
