// Importar librerías necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar dotenv para usar el archivo .env
dotenv.config();

// Inicializar express
const app = express();

// Middleware para aceptar JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Ruta de prueba básica
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Ruta para registrar usuarios
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// Ruta para productos
const productRoutes = require('./routes/product.routes'); // 👈 Importar las rutas
app.use('/api/products', productRoutes);   


// Ruta para pedidos
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);
// 👈 Montar la ruta


// Conectar a MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error de conexión:', error));

// Levantar el servidor en el puerto del .env o 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
