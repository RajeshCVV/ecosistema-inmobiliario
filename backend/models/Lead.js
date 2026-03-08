const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Opcional, si pertenece a un proyecto
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    profileType: { type: String, enum: ['Investor', 'Merchant', 'Other'], default: 'Other' }, // Basado en Miro
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'], default: 'New' },
    source: { type: String, enum: ['Meta Ads', 'Organic', 'Referral', 'Other'], default: 'Other' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
