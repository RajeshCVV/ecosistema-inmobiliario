import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const MetaAdsManager = ({ project }) => {
    const { activeCompanyId, addAdSet, toggleAdSetStatus, deleteAdSet } = useContext(AppContext);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
                <span className="text-4xl mr-4 bg-blue-50 p-3 rounded-2xl">💻</span>
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestor Meta Ads</h2>
                    <p className="text-gray-500 mt-1">Administra el embudo de conversión publicitario real</p>
                </div>
            </div>

            <div className="space-y-8">
                <MetaObjective
                    funnelStage="reconocimiento"
                    title="Nivel 1: Reconocimiento (TOFU)" subtitle="Generación de autoridad y branding" color="blue"
                    project={project} companyId={activeCompanyId}
                    addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                />
                <MetaObjective
                    funnelStage="trafico"
                    title="Nivel 2: Tráfico (MOFU)" subtitle="Redirección a landing pages y WhatsApp" color="green"
                    project={project} companyId={activeCompanyId}
                    addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                />
                <MetaObjective
                    funnelStage="clientesPotenciales"
                    title="Nivel 3: Clientes (BOFU)" subtitle="Formularios nativos y conversión de leads" color="purple"
                    project={project} companyId={activeCompanyId}
                    addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                />
            </div>
        </div>
    );
};

// Componente para Objetivos de Meta y AdSets
const MetaObjective = ({ title, subtitle, color, funnelStage, project, companyId, addAdSet, toggleAdSetStatus, deleteAdSet }) => {
    const colorMap = {
        blue: { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-800', bar: 'bg-indigo-500', btn: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' },
        green: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500', btn: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' },
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-800', bar: 'bg-purple-500', btn: 'bg-purple-100 hover:bg-purple-200 text-purple-700' },
    };
    const c = colorMap[color];
    const adSets = project.campanasMeta[funnelStage] || [];

    const [isAdding, setIsAdding] = useState(false);
    const [newAdSetName, setNewAdSetName] = useState('');
    const [newAdSetFormatos, setNewAdSetFormatos] = useState('');

    const handleCreate = () => {
        if (!newAdSetName.trim()) return;
        const formats = newAdSetFormatos.split(',').map(f => f.trim()).filter(f => f !== '');
        addAdSet(companyId, project.id, funnelStage, {
            id: `adset-${Date.now()}`,
            nombre: newAdSetName,
            formatos: formats,
            status: 'pausada'
        });
        setIsAdding(false);
        setNewAdSetName('');
        setNewAdSetFormatos('');
    };

    return (
        <div className={`p-8 rounded-3xl border ${c.bg} ${c.border} relative overflow-hidden`}>
            {/* Barra lateral de acento */}
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
                        + Ad Set
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 animate-fade-in flex flex-col gap-3">
                    <input
                        type="text" placeholder="Nombre de Conjunto de Anuncios..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAdSetName} onChange={(e) => setNewAdSetName(e.target.value)}
                    />
                    <input
                        type="text" placeholder="Formatos (separados por coma. Ej: Reel, Story, Imagen)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAdSetFormatos} onChange={(e) => setNewAdSetFormatos(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 text-sm font-bold hover:text-gray-800">Cancelar</button>
                        <button onClick={handleCreate} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-black">Guardar</button>
                    </div>
                </div>
            )}

            {adSets.length === 0 ? (
                <div className="bg-white bg-opacity-60 p-4 rounded-xl text-sm font-medium text-gray-500 italic">
                    Sin conjuntos de anuncios en este nivel de embudo. Agrega un AdSet para modelar el tráfico.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {adSets.map((adSet) => (
                        <div key={adSet.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col group relative overflow-hidden">
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => deleteAdSet(companyId, project.id, funnelStage, adSet.id)}
                                    className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100" title="Eliminar Ad Set"
                                >✕</button>
                            </div>

                            <div className="flex items-center justify-between mb-3 pr-8">
                                <h4 className="font-bold text-gray-900 flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${c.bar}`}></span>
                                    <span className="truncate max-w-[150px]">{adSet.nombre}</span>
                                </h4>
                                <button
                                    onClick={() => toggleAdSetStatus(companyId, project.id, funnelStage, adSet.id)}
                                    className={`text-[10px] px-2 py-1 uppercase tracking-wider font-extrabold rounded-md shadow-sm transition-colors ${adSet.status === 'activa' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}
                                >
                                    {adSet.status === 'activa' ? '● En Circulación' : '○ Pausada'}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {adSet.formatos && adSet.formatos.length > 0 ? (
                                    adSet.formatos.map((fmt, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-md border border-gray-200 whitespace-nowrap">
                                            {fmt}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400 font-medium italic">Sin formatos</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MetaAdsManager;
