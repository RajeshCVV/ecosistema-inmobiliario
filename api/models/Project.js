import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    nombre: { type: String, required: true },
    objetivo: { type: String, default: '' },
    tipoOferta: { type: String, default: '' },
    ticket: { type: String, default: '' },
    fechaInicio: { type: Date },
    fechaCierre: { type: Date },
    responsable: { type: String, default: '' },
    estado: {
        type: String,
        enum: ['en_curso', 'futuros', 'cerrados'],
        default: 'en_curso'
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
