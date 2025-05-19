// /paginas/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
  const API   = '/api/products';
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const tbody = document.getElementById('adminBody');
  const createBtn = document.getElementById('createBtn');

  // 🔐 Protección por rol
  if (!token || role !== 'admin') {
    return location.href = 'home.html';
  }

  // 🔃 Cargar productos
  async function loadProducts() {
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      render(data.productos || []);
    } catch (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="3" class="py-4 text-red-600">Error al cargar productos</td></tr>';
    }
  }

  // 🧱 Render tabla
  function render(productos) {
    tbody.innerHTML = '';

    if (!productos.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="py-4 text-gray-500">No hay productos</td></tr>';
      return;
    }

    productos.forEach(prod => {
      const tr = document.createElement('tr');
      tr.className = 'border-b';

      tr.innerHTML = `
        <td class="py-2 px-4">${prod.nombre}</td>
        <td class="py-2 px-4">$${prod.precio}</td>
        <td class="py-2 px-4 space-x-2">
          <button class="editBtn text-blue-600" data-id="${prod._id}">
            <i data-feather="edit"></i>
          </button>
          <button class="delBtn text-red-600" data-id="${prod._id}">
            <i data-feather="trash-2"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    feather.replace(); // íconos

    // Eventos borrar
    document.querySelectorAll('.delBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        confirmDelete(id);
      });
    });

    // Eventos editar
    document.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        location.href = `editar-producto.html?id=${id}`; // ⬅️ Página que puedes implementar luego
      });
    });
  }

  // 🗑️ Confirmar y eliminar
  async function confirmDelete(id) {
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      await Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
      loadProducts(); // recargar tabla
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
    }
  }

  // ➕ Botón "Crear nuevo"
  createBtn.addEventListener('click', () => {
    location.href = 'crear-producto.html'; // puedes crear esta página después
  });

  // 🚀 Iniciar
  loadProducts();
});
