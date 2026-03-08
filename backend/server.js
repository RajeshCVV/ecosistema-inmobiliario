require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Mongoose Serverless Connection ---
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const Company = require('./models/Company');

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        console.error('⚠️ CRITICAL: MONGO_URI is missing from environment variables.');
        return null;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB Conectado (Serverless Vercel)');
            return mongoose;
        }).catch(err => {
            console.error('❌ Mongoose connect error:', err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;

        // Seed initial companies
        const crescendo = await Company.findOne({ slug: 'crescendo' });
        let crescendoId = null;
        if (!crescendo) {
            const newCrescendo = await Company.create({
                name: 'Crescendo',
                slug: 'crescendo',
                branding: { logoUrl: '', primaryColor: '#2b3a4a', secondaryColor: '#e5e7eb' }
            });
            crescendoId = newCrescendo._id;
            console.log('🌱 Seed: Empresa "Crescendo" creada.');
        } else {
            crescendoId = crescendo._id;
        }

        const fortress = await Company.findOne({ slug: 'fortress' });
        if (!fortress) {
            await Company.create({
                name: 'Fortress',
                slug: 'fortress',
                branding: { logoUrl: '', primaryColor: '#1a1a1a', secondaryColor: '#d4af37' }
            });
            console.log('🌱 Seed: Empresa "Fortress" creada.');
        }

        // Seed Project for Crescendo
        const Project = require('./models/Project');
        const defaultProject = await Project.findOne({ name: 'Boulevard El Parque' });
        if (!defaultProject && crescendoId) {
            const project = await Project.create({
                companyId: crescendoId,
                name: 'Boulevard El Parque',
                description: 'Ecosistema comercial, salud y de negocios en Jamundí',
                status: 'Active',
                milestones: [
                    { title: 'Lanzamiento de Campaña FB', dueDate: new Date(), completed: true }
                ]
            });
            console.log('🌱 Seed: Proyecto "Boulevard El Parque" creado.');

            const Lead = require('./models/Lead');
            await Lead.create({
                companyId: crescendoId,
                projectId: project._id,
                name: 'Lead Cero (Demo)',
                email: 'demo@crescendo.com',
                profileType: 'Investor',
                status: 'New',
                source: 'Organic'
            });
            console.log('🌱 Seed: Lead de Demo Creado.');
        }
        return cached.conn;

    } catch (e) {
        cached.promise = null;
        console.error('Error sembrando empresas o conectando DB:', e.message);
        throw e;
    }
};

// Middleware para asegurar conexión a DB en Serverless
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        try {
            await connectDB();
            req.app.locals.dbConnected = true;
        } catch (error) {
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
