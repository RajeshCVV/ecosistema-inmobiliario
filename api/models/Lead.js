import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    nombre: { type: String, required: true },
    telefono: { type: String, default: '' },
    email: { type: String, default: '' },
    notas: { type: String, default: '' },
    etapa: {
        type: String,
        enum: ['nuevo', 'contactado', 'cita', 'cierre', 'descartado'],
        default: 'nuevo'
    },
    origen: { type: String, default: 'Manual' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
