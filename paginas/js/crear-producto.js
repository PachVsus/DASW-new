// /paginas/js/crear-producto.js
document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('productForm');
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  // Protección de acceso
  if (!token || role !== 'admin') {
    return location.href = 'home.html';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre      = document.getElementById('nombre').value.trim();
    const precio      = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value.trim();
    const imageUrl    = document.getElementById('imageUrl').value.trim();

    if (!nombre || isNaN(precio) || !descripcion) {
      return Swal.fire('Campos incompletos', 'Por favor llena todos los campos obligatorios.', 'warning');
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, precio, descripcion, imageUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo crear el producto');
      }

      await Swal.fire('Éxito', 'Producto creado correctamente', 'success');
      form.reset();
      location.href = 'admin.html';
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message, 'error');
    }
  });
});
