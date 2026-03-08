const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true }, // Ej: 'Boulevard El Parque'
    description: { type: String },
    status: { type: String, enum: ['Planning', 'Active', 'Completed', 'On Hold'], default: 'Planning' },
    startDate: { type: Date },
    endDate: { type: Date },
    milestones: [{
        title: { type: String },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
