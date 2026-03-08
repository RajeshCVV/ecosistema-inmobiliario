import mongoose from 'mongoose';

const BuyerPersonaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edadAproximada: { type: String, default: '' },
    ocupacion: { type: String, default: '' },
    problemaPrincipal: { type: String, default: '' },
    deseoPrincipal: { type: String, default: '' },
    objeciones: { type: String, default: '' },
    motivacionesCompra: { type: String, default: '' },
    tipoContenidoConsume: { type: String, default: '' },
    redesUso: { type: String, default: '' }
});

const BrandIdentitySchema = new mongoose.Schema({
    queEs: { type: String, default: '' },
    queHace: { type: String, default: '' },
    queVende: { type: String, default: '' },
    nicho: { type: String, default: '' },
    mercadoObjetivo: { type: String, default: '' },
    diferenciador: { type: String, default: '' },
    propuestaValor: { type: String, default: '' },
    problemasResuelve: { type: String, default: '' },
    lineaComunicacion: { type: String, default: '' },
    tonoMarca: { type: String, default: '' }
});

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Fortis, Crescendo
    primaryColor: { type: String, default: '#000000' },
    brandIdentity: { type: BrandIdentitySchema, default: () => ({}) },
    buyerPersonas: { type: [BuyerPersonaSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
