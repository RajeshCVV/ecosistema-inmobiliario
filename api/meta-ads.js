import connectToDatabase from './db/connect.js';
import MetaCampaign from './models/MetaAd.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectToDatabase();

        switch (req.method) {
            case 'GET':
                const { projectId } = req.query;
                const filter = projectId ? { projectId } : {};
                const campaigns = await MetaCampaign.find(filter).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: campaigns });
                break;

            case 'POST':
                const newCampaign = await MetaCampaign.create(req.body);
                res.status(201).json({ success: true, data: newCampaign });
                break;

            case 'PUT':
            case 'PATCH':
                const id = req.query.id || req.body._id;
                if (!id) return res.status(400).json({ success: false, error: 'ID is required' });

                // El documento entero (con AdSets y Ads anidados) puede ser reemplazado
                const updatedCampaign = await MetaCampaign.findByIdAndUpdate(id, req.body, { new: true });
                res.status(200).json({ success: true, data: updatedCampaign });
                break;

            case 'DELETE':
                const delId = req.query.id || req.body._id;
                if (!delId) return res.status(400).json({ success: false, error: 'ID is required' });

                await MetaCampaign.findByIdAndDelete(delId);
                res.status(200).json({ success: true, data: {} });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
