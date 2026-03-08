require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Variables globales para estado de DB
app.locals.dbConnected = false;

// Conexión a MongoDB (con manejo de error para permitir fallback a memoria en desarrollo)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/real-estate-ecosystem')
    .then(() => {
        console.log('✅ MongoDB Conectado');
        app.locals.dbConnected = true;
    })
    .catch(err => {
        console.log('⚠️ No se pudo conectar a MongoDB. Usando fallback en memoria para desarrollo.');
        console.log('Error:', err.message);
    });

// Importar y usar rutas
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Ruta de Salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', dbConnected: app.locals.dbConnected, message: 'Real Estate Ecosystem API is running.' });
});

// Configuración para Producción
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
    });
}

// Exportar app para Vercel Serverless
module.exports = app;
