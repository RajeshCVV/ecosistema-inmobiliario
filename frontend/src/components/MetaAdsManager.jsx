import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const MetaAdsManager = ({ project }) => {
    const { activeCompanyId, addAdSet, toggleAdSetStatus, deleteAdSet } = useContext(AppContext);

    // Estado para saber qué AdSet está abierto para editar sus anuncios profundos (Nivel 3)
    const [editingAdSet, setEditingAdSet] = useState(null);

    return (
        <div className="animate-fade-in relative">
            <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
                <span className="text-4xl mr-4 bg-blue-50 p-3 rounded-2xl">💻</span>
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Estrategia Publicitaria Meta Ads</h2>
                    <p className="text-gray-500 mt-1">Nivel 1 (Campañas) {'>'} Nivel 2 (Conjuntos) {'>'} Nivel 3 (Anuncios Base AIDA/PAS)</p>
                </div>
            </div>

            {/* Si NO estamos editando un AdSet profundo, mostramos las campañas */}
            {!editingAdSet ? (
                <div className="space-y-8">
                    <MetaObjective
                        funnelStage="reconocimiento"
                        title="Top of Funnel: Atracción (TOFU)" subtitle="Audiencias frías, ganar alcance y autoridad." color="blue"
                        project={project} companyId={activeCompanyId}
                        addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                        openAdSetEditor={setEditingAdSet}
                    />
                    <MetaObjective
                        funnelStage="trafico"
                        title="Middle of Funnel: Interacción (MOFU)" subtitle="Tráfico a Whatsapp o Landings, retargeting de video." color="green"
                        project={project} companyId={activeCompanyId}
                        addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                        openAdSetEditor={setEditingAdSet}
                    />
                    <MetaObjective
                        funnelStage="clientesPotenciales"
                        title="Bottom of Funnel: Conversión (BOFU)" subtitle="Lead Generation directa, formularios activos, cierre." color="purple"
                        project={project} companyId={activeCompanyId}
                        addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                        openAdSetEditor={setEditingAdSet}
                    />
                </div>
            ) : (
                <AdSetDeepEditor
                    adSet={editingAdSet.set}
                    funnelStage={editingAdSet.stage}
                    project={project}
                    onClose={() => setEditingAdSet(null)}
                />
            )}
        </div>
    );
};

// ==========================================
// NIVEL 1 y 2: CAMPAÑAS Y CONJUNTOS
// ==========================================
const MetaObjective = ({ title, subtitle, color, funnelStage, project, companyId, addAdSet, toggleAdSetStatus, deleteAdSet, openAdSetEditor }) => {
    const colorMap = {
        blue: { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-800', bar: 'bg-indigo-500', btn: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' },
        green: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500', btn: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' },
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-800', bar: 'bg-purple-500', btn: 'bg-purple-100 hover:bg-purple-200 text-purple-700' },
    };
    const c = colorMap[color];
    const adSets = project.campanasMeta[funnelStage] || [];

    const [isAdding, setIsAdding] = useState(false);
    const [newAdSetName, setNewAdSetName] = useState('');

    const handleCreate = () => {
        if (!newAdSetName.trim()) return;
        addAdSet(companyId, project.id, funnelStage, {
            nombre: newAdSetName,
            status: 'pausada',
            formatos: []
        });
        setIsAdding(false);
        setNewAdSetName('');
    };

    return (
        <div className={`p-8 rounded-3xl border ${c.bg} ${c.border} relative overflow-hidden`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.bar} opacity-70`}></div>

            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h3 className={`text-2xl font-extrabold ${c.text}`}>{title}</h3>
                    <p className="text-gray-500 font-medium text-sm mt-1">{subtitle}</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors ${c.btn}`}
                    >
                        + Nuevo Público (AdSet)
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 animate-fade-in flex flex-col gap-3">
                    <input
                        type="text" placeholder="Ej. Público Interés Real Estate (Medellín)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        value={newAdSetName} onChange={(e) => setNewAdSetName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 text-sm font-bold hover:text-gray-800">Cancelar</button>
                        <button onClick={handleCreate} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-black">Guardar Público</button>
                    </div>
                </div>
            )}

            {adSets.length === 0 ? (
                <div className="bg-white bg-opacity-60 p-4 rounded-xl text-sm font-medium text-gray-500 italic">
                    Sin públicos objetivo en este nivel.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {adSets.map((adSet) => (
                        <div key={adSet._id || adSet.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col group relative overflow-hidden">
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => deleteAdSet(companyId, project.id, funnelStage, adSet._id || adSet.id)}
                                    className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100" title="Eliminar Ad Set"
                                >✕</button>
                            </div>

                            <div className="flex items-center justify-between mb-2 pr-8">
                                <h4 className="font-bold text-gray-900 flex items-center text-lg">
                                    <span className={`w-2 h-2 rounded-full mr-2 inline-block ${c.bar}`}></span>
                                    {adSet.nombre}
                                </h4>
                            </div>

                            <p className="text-xs font-bold text-gray-400 mb-4">{adSet.anuncios?.length || 0} Anuncios Estructurados</p>

                            <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-3">
                                <button
                                    onClick={() => toggleAdSetStatus(companyId, project.id, funnelStage, adSet._id || adSet.id)}
                                    className={`text-[10px] px-2 py-1 uppercase tracking-wider font-extrabold rounded-md shadow-sm transition-colors ${adSet.status === 'activa' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}
                                >
                                    {adSet.status === 'activa' ? '● En Circulación' : '○ Pausada'}
                                </button>

                                <button
                                    onClick={() => openAdSetEditor({ set: adSet, stage: funnelStage })}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    Estructurar Creativos →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// NIVEL 3: EDITOR PROFUNDO DE ANUNCIOS
// ==========================================
const AdSetDeepEditor = ({ adSet, funnelStage, onClose, project }) => {
    // Al ser un mockup puro de frontend que depende del API, 
    // mapearemos internamente para la demostración de la interfaz
    const copyModels = ['AIDA', 'PAS', 'VAR', 'Storytelling', 'Prueba Social'];
    const contentTypes = ['Ventas Directas', 'Autoridad', 'Comunidad', 'Educativo'];

    const ads = adSet.anuncios || [];

    return (
        <div className="animate-fade-in bg-white border border-gray-200 rounded-3xl p-8 shadow-sm scale-in-center">
            <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 flex items-center">
                ← Volver a Jerarquía Meta
            </button>

            <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                    <span className="text-xl mr-3">🎯</span> Nivel 3: Anuncios (Creativos & Copy)
                </h3>
                <p className="text-gray-500">Conjunto objetivo cerrado: <span className="font-bold text-gray-800">{adSet.nombre}</span></p>
            </div>

            {ads.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
                    <p className="text-gray-500 font-medium mb-4">No hay creativos asignados a este público aún.</p>
                    <button className="bg-gray-900 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        + Ensamblar Primer Anuncio
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {ads.map((ad, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg text-gray-800">{ad.nombre || `Anuncio Modelo ${i + 1}`}</h4>
                                <span className="bg-white border border-gray-200 px-3 py-1 rounded-md text-xs font-bold text-gray-600">
                                    {ad.tipoContenido || 'Contenido Estratégico'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Estructura Copy ({ad.metodologiaCopy || 'AIDA'})</label>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap h-32 overflow-y-auto">
                                        {ad.copy || 'Sin desglose de copy registrado.'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Guión Audiovisual</label>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap h-32 overflow-y-auto">
                                        {ad.guion || 'Sin guión (Solo gráfica).'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full bg-gray-100 text-gray-600 font-bold px-6 py-4 rounded-2xl border border-gray-200 border-dashed hover:bg-gray-200 transition-colors">
                        + Añadir Variante Creativa al Conjunto
                    </button>
                </div>
            )}
        </div>
    );
};

export default MetaAdsManager;
