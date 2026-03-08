import mongoose from 'mongoose';

const AdMetricsSchema = new mongoose.Schema({
    alcance: { type: Number, default: 0 },
    impresiones: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    clics: { type: Number, default: 0 },
    interaccion: { type: Number, default: 0 },
    retencion: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    leadsGenerados: { type: Number, default: 0 },
    conversiones: { type: Number, default: 0 },
    costoPorLead: { type: Number, default: 0 },
    costoPorClic: { type: Number, default: 0 },
    tasaConversion: { type: Number, default: 0 },
    roi: { type: Number, default: 0 }
});

const AdSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipoContenido: { type: String, enum: ['educativo', 'ventas', 'autoridad', 'comunidad', ''], default: '' },
    guion: { type: String, default: '' },
    metodologiaCopy: { type: String, enum: ['AIDA', 'PAS', 'VAR', 'storytelling', 'prueba social', ''], default: '' },
    copy: { type: String, default: '' },
    formato: { type: String, default: '' },
    creatividad: { type: String, default: '' },
    objetivo: { type: String, default: '' },
    metricas: { type: AdMetricsSchema, default: () => ({}) }
});

const AdSetSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipoPublico: { type: String, enum: ['abierto', 'interés', 'lookalike', 'remarketing', ''], default: '' },
    presupuesto: { type: Number, default: 0 },
    anuncios: { type: [AdSchema], default: [] }
});

const CampaignSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    nombre: { type: String, required: true },
    objetivo: { type: String, enum: ['atracción', 'interacción', 'conversión', 'fidelización', ''], default: '' },
    status: { type: String, enum: ['activa', 'pausada', 'completada'], default: 'pausada' },
    adSets: { type: [AdSetSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MetaCampaign || mongoose.model('MetaCampaign', CampaignSchema);
