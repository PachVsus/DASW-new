document.addEventListener('DOMContentLoaded', () => {
  const API   = '/api';
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // ---------- Protección ----------
  if (!token || !userId) {
    window.location.href = 'login.html';
    return;
  }

  // ---------- DOM ----------
  const card       = document.getElementById('profileCard');
  const logoutBtns = [
    document.getElementById('logoutBtn'),
    document.getElementById('logoutBtnMobile')
  ];

  // ---------- Cargar perfil ----------
  async function loadProfile() {
    try {
      const res = await fetch(`${API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 400) {
        localStorage.clear();
        return window.location.href = 'login.html';
      }

      const u = await res.json();

      card.innerHTML = `
        <div class="text-center">
          <i data-feather="user" class="w-16 h-16 mx-auto text-gray-500"></i>
          <h3 class="text-xl font-semibold mt-2">${u.name}</h3>
        </div>
        <div>
          <p><span class="font-semibold">Correo:</span> ${u.email}</p>
          <p><span class="font-semibold">RFC:</span> ${u.RFC}</p>
          <p><span class="font-semibold">Tarjeta:</span> ${u.cardNumber}</p>
        </div>
        <button id="editBtn"
                class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4">
          Editar datos (✱ futuro)
        </button>
      `;
      feather.replace();  // refrescar ícono dentro del card
    } catch (err) {
      console.error(err);
      card.innerHTML =
        '<p class="text-center text-red-600">Error al cargar perfil</p>';
    }
  }

  // ---------- Logout ----------
  logoutBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
      });
    }
  });

  loadProfile();
});
