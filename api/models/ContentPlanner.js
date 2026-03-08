import mongoose from 'mongoose';

const ContentPlannerSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'MetaCampaign', required: true },
    tipoContenido: { type: String, required: true }, // Educativo, Ventas, etc.
    guion: { type: String, default: '' },
    copy: { type: String, default: '' },
    formato: { type: String, default: '' }, // Reel, Story, etc.
    fechaGrabacion: { type: Date },
    fechaPublicacion: { type: Date },
    locacion: { type: String, default: '' },
    responsable: { type: String, default: '' },
    equipoNecesario: { type: String, default: '' },
    estado: { type: String, enum: ['idea', 'guion', 'grabacion', 'edicion', 'programado', 'publicado'], default: 'idea' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ContentPlanner || mongoose.model('ContentPlanner', ContentPlannerSchema);
