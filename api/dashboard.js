import connectToDatabase from './db/connect.js';
import Company from './models/Company.js';
import Project from './models/Project.js';
import MetaAd from './models/MetaAd.js';
import ContentPlanner from './models/ContentPlanner.js';
// Import additional models like Lead if necessary for quick metrics
import Lead from './models/Lead.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        await connectToDatabase();

        // Obtener KPIs Globales
        const totalCompanies = await Company.countDocuments({});

        // Asume que un proyecto 'activo' tiene un estado específico (ej: "En curso")
        // Como no conocemos el enum exacto, obtenemos todos o basamos la consulta en la realidad del modelo
        const activeProjectsCount = await Project.countDocuments({ status: { $in: ['En curso', 'Active', 'Activo'] } });

        // Campañas activas (aquellas dentro de MetaAds que estén 'active')
        const activeCampaignsCount = await MetaAd.countDocuments({ status: { $in: ['active', 'Activo', 'ACTIVE'] } });

        // Planner semanal (contenidos creados en los últimos 7 días o a publicarse en los próximos 7)
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() + 7);
        const upcomingContentCount = await ContentPlanner.countDocuments({
            publishDate: { $lte: dateLimit, $gte: new Date() }
        });

        const totalLeads = await Lead.countDocuments({});

        // Payload del dashboard
        const dashboardData = {
            kpis: {
                totalCompanies,
                activeProjects: activeProjectsCount || await Project.countDocuments({}), // Fallback
                activeCampaigns: activeCampaignsCount || await MetaAd.countDocuments({}), // Fallback
                upcomingContentCount,
                totalLeads
            },
            plannerWeek: await ContentPlanner.find({
                publishDate: { $lte: dateLimit, $gte: new Date() }
            }).limit(5).populate('project', 'name').populate('company', 'name'),
            alerts: [
                { id: 1, type: "warning", message: "Revisar rendimiento de la campaña 'Atracción Crescendo' (CTR bajo)." },
                { id: 2, type: "info", message: "Faltan 2 publicaciones por subir del planner semanal." }
            ]
        };

        res.status(200).json({ success: true, data: dashboardData });

    } catch (error) {
        console.error('API Dashboard Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
