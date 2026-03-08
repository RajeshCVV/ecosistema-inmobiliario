import connectToDatabase from './db/connect.js';
import Company from './models/Company.js';

export default async function handler(req, res) {
    // CORS Headers
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
                const companies = await Company.find({});
                res.status(200).json({ success: true, data: companies });
                break;

            case 'POST':
                const newCompany = await Company.create(req.body);
                res.status(201).json({ success: true, data: newCompany });
                break;

            case 'PUT':
            case 'PATCH':
                const { id } = req.query; // Si lo pasamos como ?id=...
                const bodyId = req.body.id || req.body._id;
                const targetId = id || bodyId;

                if (!targetId) {
                    return res.status(400).json({ success: false, error: 'ID is required' });
                }

                const updatedCompany = await Company.findByIdAndUpdate(targetId, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!updatedCompany) {
                    return res.status(404).json({ success: false, error: 'Company not found' });
                }

                res.status(200).json({ success: true, data: updatedCompany });
                break;

            case 'DELETE':
                const delId = req.query.id || req.body.id || req.body._id;
                if (!delId) {
                    return res.status(400).json({ success: false, error: 'ID is required' });
                }

                const deletedCompany = await Company.findByIdAndDelete(delId);
                if (!deletedCompany) {
                    return res.status(404).json({ success: false, error: 'Company not found' });
                }

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
