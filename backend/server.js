require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let isDbConnected = false;
let dbConnectPromise = null;

const connectDB = async () => {
    if (isDbConnected) return;
    if (!process.env.MONGO_URI) {
        console.log('⚠️ No hay MONGO_URI, usando fallback.');
        return;
    }
    if (!dbConnectPromise) {
        dbConnectPromise = mongoose.connect(process.env.MONGO_URI);
    }
    await dbConnectPromise;
    isDbConnected = true;
    console.log('✅ MongoDB Conectado (Serverless)');
};

// Middleware para asegurar conexión a DB en Serverless
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        try {
            await connectDB();
            req.app.locals.dbConnected = isDbConnected;
        } catch (error) {
            console.error('Error DB:', error);
            req.app.locals.dbConnected = false;
        }
    }
    next();
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
