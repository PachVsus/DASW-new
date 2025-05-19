// /paginas/js/editar-producto.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const id    = new URLSearchParams(location.search).get('id');

  const nombre      = document.getElementById('nombre');
  const precio      = document.getElementById('precio');
  const descripcion = document.getElementById('descripcion');
  const imageUrl    = document.getElementById('imageUrl');
  const form        = document.getElementById('editForm');

  // 🔐 Protección
  if (!token || role !== 'admin' || !id) {
    return location.href = 'home.html';
  }

  // 🔃 Obtener datos del producto
  fetch(`/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.ok ? res.json() : Promise.reject('No encontrado'))
    .then(p => {
      nombre.value      = p.nombre;
      precio.value      = p.precio;
      descripcion.value = p.descripcion;
      imageUrl.value    = p.imageUrl || '';
    })
    .catch(() => {
      Swal.fire('Error', 'Producto no encontrado', 'error');
      form.innerHTML = '<p class="text-red-600 text-center">Error al cargar producto</p>';
    });

  // 📝 Guardar cambios
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre.value.trim(),
          precio: parseFloat(precio.value),
          descripcion: descripcion.value.trim(),
          imageUrl: imageUrl.value.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');

      await Swal.fire('Guardado', 'Cambios actualizados correctamente', 'success');
      location.href = 'admin.html';
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message, 'error');
    }
  });
});
