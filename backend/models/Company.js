const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ej: 'multivela', 'boulevard'
    branding: {
        logoUrl: { type: String },
        primaryColor: { type: String, default: '#000000' },
        secondaryColor: { type: String, default: '#FFFFFF' }
    },
    settings: {
        crmEnabled: { type: Boolean, default: true },
        projectsEnabled: { type: Boolean, default: true }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
