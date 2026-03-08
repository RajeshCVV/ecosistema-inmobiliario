import connectToDatabase from './db/connect.js';
import Project from './models/Project.js';

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
                const { companyId } = req.query;
                const filter = companyId ? { companyId } : {};
                const projects = await Project.find(filter).sort({ createdAt: -1 });
                res.status(200).json({ success: true, data: projects });
                break;

            case 'POST':
                const newProject = await Project.create(req.body);
                res.status(201).json({ success: true, data: newProject });
                break;

            case 'PUT':
            case 'PATCH':
                const id = req.query.id || req.body._id;
                if (!id) return res.status(400).json({ success: false, error: 'ID is required' });

                const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
                res.status(200).json({ success: true, data: updatedProject });
                break;

            case 'DELETE':
                const delId = req.query.id || req.body._id;
                if (!delId) return res.status(400).json({ success: false, error: 'ID is required' });

                await Project.findByIdAndDelete(delId);
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
