const Lead = require('../models/Lead');
const Project = require('../models/Project');

// Temporales en memoria por si no hay MongoDB local
let memoryLeads = [
    { _id: '1', name: 'Carlos Inversor', phone: '+57 300 123 4567', profileType: 'Investor', status: 'New', interest: 'Renta y Valorización' },
    { _id: '2', name: 'María Comerciante', phone: '+57 310 987 6543', profileType: 'Merchant', status: 'Contacted', interest: 'Expansión de Marca' },
];

let memoryProjects = [
    {
        _id: '1',
        name: 'Boulevard El Parque',
        status: 'Active',
        milestones: [
            { _id: 'm1', title: 'Definición de Perfiles (Miro)', dueDate: '2026-03-01T00:00:00.000Z', status: 'Completado' },
            { _id: 'm2', title: 'Diseño de Identidad Visual', dueDate: '2026-03-10T00:00:00.000Z', status: 'Completado' },
            { _id: 'm3', title: 'Lanzamiento Campaña Meta Ads', dueDate: '2026-03-25T00:00:00.000Z', status: 'En Proceso' }
        ]
    }
];

exports.getLeads = async (req, res) => {
    try {
        if (req.app.locals.dbConnected) {
            const leads = await Lead.find();
            return res.json(leads);
        }
        res.json(memoryLeads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLead = async (req, res) => {
    try {
        if (req.app.locals.dbConnected) {
            // Requeriría un companyId válido en DB real, mockearemos uno si no existe.
            const newLead = new Lead(req.body);
            await newLead.save();
            return res.status(201).json(newLead);
        }

        const newLead = { _id: Date.now().toString(), ...req.body };
        memoryLeads.push(newLead);
        res.status(201).json(newLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        if (req.app.locals.dbConnected) {
            const projects = await Project.find();
            return res.json(projects);
        }
        res.json(memoryProjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        if (req.app.locals.dbConnected) {
            const newProject = new Project(req.body);
            await newProject.save();
            return res.status(201).json(newProject);
        }
        const newProject = { _id: Date.now().toString(), milestones: [], ...req.body };
        memoryProjects.push(newProject);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addMilestone = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, dueDate, status } = req.body;

        if (req.app.locals.dbConnected) {
            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ error: 'Project not found' });

            project.milestones.push({ title, dueDate, completed: status === 'Completado' });
            await project.save();
            return res.json(project);
        }

        const project = memoryProjects.find(p => p._id === projectId);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        if (!project.milestones) project.milestones = [];
        project.milestones.push({ _id: Date.now().toString(), title, dueDate, status: status || 'Pendiente' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
