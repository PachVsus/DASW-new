require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
// import { config } from 'dotenv';
// import express from 'express';
// import morgan from 'morgan';

const app = express();
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
// import connectDB from './config/database.js';
// import userRoutes from './routes/user.routes.js'

connectDB();

app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/users', userRoutes);

// starting server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Running server on http://localhost:${PORT}`);
});

// servir archivos estáticos
app.use(express.static('paginas'));   // o 'paginas' si usas ese nombre


const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);
