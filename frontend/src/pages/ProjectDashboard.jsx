import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProjectDashboard = () => {
    const { companyId, projectId } = useParams();
    const navigate = useNavigate();
    const { data, updateProject, addAdSet, toggleAdSetStatus, deleteAdSet, addLead } = useContext(AppContext);

    const company = data.companies.find(c => c.id === companyId);
    const project = company?.projects.find(p => p.id === projectId);

    const [activeTab, setActiveTab] = useState('info');

    // States for Editing Info / Planner
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [infoForm, setInfoForm] = useState({ informacion: project?.informacion || '', planner: project?.planner || '', estrategia: project?.estrategia || '' });

    // CRM State
    const [isAddingLead, setIsAddingLead] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', notes: '' });

    if (!company || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">Proyecto no encontrado</h2>
                <button onClick={() => navigate(`/${companyId}`)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Volver a la Empresa
                </button>
            </div>
        );
    }

    const { branding } = company;

    const tabs = [
        { id: 'info', label: 'Información del proyecto', icon: '📋' },
        { id: 'campañas_meta', label: 'Gestor Meta Ads', icon: '💻' },
        { id: 'planner', label: 'Planner de campañas', icon: '📅' },
        { id: 'estrategia', label: 'Estrategia de Ventas', icon: '♟️' },
        { id: 'crm', label: 'Board de Ventas (Kanban)', icon: '👥' },
    ];

    const handleSaveInfo = () => {
        updateProject(companyId, projectId, {
            informacion: infoForm.informacion,
            planner: infoForm.planner,
            estrategia: infoForm.estrategia
        });
        setIsEditingInfo(false);
    };

    const handleCreateLead = (e) => {
        e.preventDefault();
        if (!leadForm.name.trim()) return;

        addLead({
            id: `lead-${Date.now()}`,
            projectId: project.id,
            name: leadForm.name,
            phone: leadForm.phone,
            email: leadForm.email,
            notes: leadForm.notes,
            stage: 'nuevo',
            date: new Date().toISOString().split('T')[0]
        });
        setIsAddingLead(false);
        setLeadForm({ name: '', phone: '', email: '', notes: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white shadow z-10 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <button onClick={() => navigate(`/${companyId}`)} className="text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm mb-2 flex items-center">
                            ← Regresar a {company.name}
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: branding.primaryColor }}></span>
                            {project.name}
                        </h1>
                    </div>
                    <div className={`text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider border shadow-sm ${project.status === 'abiertos' ? 'bg-green-50 text-green-700 border-green-200' :
                        project.status === 'en_curso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                        {project.status.replace('_', ' ')}
                    </div>
                </div>
            </header>

            <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
                {/* Menú Lateral (Tabs) */}
                <div className="w-full md:w-72 flex-shrink-0 sticky top-28">
                    <nav className="flex flex-col space-y-2 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left font-medium ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-700 shadow-inner'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                style={activeTab === tab.id ? { backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor } : {}}
                            >
                                <span className="text-xl opacity-80">{tab.icon}</span>
                                <span className="text-[15px]">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Contenido Principal */}
                <div className="flex-grow bg-white p-8 rounded-3xl shadow-lg border border-gray-100 w-full animate-fade-in min-h-[60vh] relative">

                    {/* INFO CENTRALIZADA (Reúne Info, Planner, Estrategia en un solo motor de edición) */}
                    {(activeTab === 'info' || activeTab === 'planner' || activeTab === 'estrategia') && (
                        <div className="animate-fade-in relative">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center">
                                    <span className="text-4xl mr-4 bg-gray-50 p-3 rounded-2xl">
                                        {activeTab === 'info' ? '📋' : activeTab === 'planner' ? '📅' : '♟️'}
                                    </span>
                                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                        {activeTab === 'info' ? 'Información del Proyecto' : activeTab === 'planner' ? 'Planner Comercial' : 'Estrategia General'}
                                    </h2>
                                </div>
                                {!isEditingInfo ? (
                                    <button
                                        onClick={() => setIsEditingInfo(true)}
                                        className="text-gray-500 hover:text-blue-600 transition-colors font-bold px-4 py-2 rounded-lg bg-gray-100"
                                    >
                                        Editar Celdas
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSaveInfo}
                                        className="text-white hover:bg-blue-700 transition-colors font-bold px-4 py-2 rounded-lg bg-blue-600 shadow-lg"
                                    >
                                        Guardar Cambios
                                    </button>
                                )}
                            </div>

                            {!isEditingInfo ? (
                                <div className="space-y-8">
                                    {activeTab === 'info' && <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{project.informacion || 'Sin contenido.'}</p>}
                                    {activeTab === 'planner' && <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100 shadow-inner"><p className="text-gray-700 text-lg whitespace-pre-wrap">{project.planner || 'Pega aquí el enlace de tu Google Docs, Sheets o Notion donde esté la parrilla de contenidos.'}</p></div>}
                                    {activeTab === 'estrategia' && <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100 shadow-inner"><p className="text-gray-700 text-lg whitespace-pre-wrap">{project.estrategia || 'Define aquí la estrategia base o links vitales de Miro para el Trafficker.'}</p></div>}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeTab === 'info' && (
                                        <textarea
                                            className="w-full h-40 p-4 rounded-xl border-2 border-blue-500 outline-none bg-blue-50 text-gray-800"
                                            value={infoForm.informacion}
                                            onChange={e => setInfoForm({ ...infoForm, informacion: e.target.value })}
                                        />
                                    )}
                                    {activeTab === 'planner' && (
                                        <textarea
                                            className="w-full h-40 p-4 rounded-xl border-2 border-orange-500 outline-none bg-orange-50 text-gray-800"
                                            value={infoForm.planner}
                                            onChange={e => setInfoForm({ ...infoForm, planner: e.target.value })}
                                        />
                                    )}
                                    {activeTab === 'estrategia' && (
                                        <textarea
                                            className="w-full h-40 p-4 rounded-xl border-2 border-indigo-500 outline-none bg-indigo-50 text-gray-800"
                                            value={infoForm.estrategia}
                                            onChange={e => setInfoForm({ ...infoForm, estrategia: e.target.value })}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CAMPAÑAS META (BUIDLER CRAC) */}
                    {activeTab === 'campañas_meta' && (
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
                                    project={project} companyId={company.id}
                                    addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                                />
                                <MetaObjective
                                    funnelStage="trafico"
                                    title="Nivel 2: Tráfico (MOFU)" subtitle="Redirección a landing pages y WhatsApp" color="green"
                                    project={project} companyId={company.id}
                                    addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                                />
                                <MetaObjective
                                    funnelStage="clientesPotenciales"
                                    title="Nivel 3: Clientes (BOFU)" subtitle="Formularios nativos y conversión de leads" color="purple"
                                    project={project} companyId={company.id}
                                    addAdSet={addAdSet} toggleAdSetStatus={toggleAdSetStatus} deleteAdSet={deleteAdSet}
                                />
                            </div>
                        </div>
                    )}

                    {/* CRM KANBAN */}
                    {activeTab === 'crm' && (
                        <div className="animate-fade-in flex flex-col h-[75vh]">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <span className="text-4xl mr-4 bg-orange-50 p-3 rounded-2xl">👥</span>
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Board de Ventas</h2>
                                        <p className="text-gray-500 mt-1">Arrastra prospectos (Leads) para avanzar en el embudo comercial</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsAddingLead(true)}
                                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md"
                                >
                                    + Añadir Prospecto
                                </button>
                            </div>

                            <CRMBoard projectId={project.id} companyId={company.id} branding={branding} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Añadir Prospecto (Lead) */}
            {isAddingLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-fade-in">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Nuevo Prospecto (CRM)</h3>
                            <button onClick={() => setIsAddingLead(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleCreateLead} className="p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 flex-1" value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="Ej: Maria Gonzalez" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono / WP</label>
                                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 flex-1" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="+57 XXX..." />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 flex-1" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="correo@..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notas / Requerimientos</label>
                                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-20 resize-none" value={leadForm.notes} onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })} placeholder="Presupuesto, metros cuadrados buscados..."></textarea>
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button type="button" onClick={() => setIsAddingLead(false)} className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg transition-all" style={{ backgroundColor: branding.primaryColor }}>Añadir al Embudo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

// Componente para Objetivos de Meta y AdSets Anidados - CON CRUD AHORA
const MetaObjective = ({ title, subtitle, color, funnelStage, project, companyId, addAdSet, toggleAdSetStatus, deleteAdSet }) => {
    const colorMap = {
        blue: { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-800', bar: 'bg-indigo-500', btn: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' },
        green: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500', btn: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' },
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-800', bar: 'bg-purple-500', btn: 'bg-purple-100 hover:bg-purple-200 text-purple-700' },
    };
    const c = colorMap[color];
    const adSets = project.campanasMeta[funnelStage];

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
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 text-sm font-bold hovering:text-gray-800">Cancelar</button>
                        <button onClick={handleCreate} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-black">Guardar</button>
                    </div>
                </div>
            )}

            {!adSets || adSets.length === 0 ? (
                <div className="bg-white bg-opacity-60 p-4 rounded-xl text-sm font-medium text-gray-500 italic">
                    Sin conjuntos de anuncios en este nivel de embudo. Agrega un AdSet para modelar el tráfico.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {adSets.map((adSet) => (
                        <div key={adSet.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col group relative overflow-hidden">
                            {/* Actions overlay */}
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

                                {/* Toggle Status */}
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

// Componente CRMBoard Modificado
const CRMBoard = ({ projectId, companyId, branding }) => {
    const { data, moveLeadStage } = useContext(AppContext);
    const leads = data.leads.filter(l => l.projectId === projectId);

    const columns = [
        { id: 'nuevo', title: 'Nuevos', color: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
        { id: 'contactado', title: 'Contactados', color: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
        { id: 'cita', title: 'Cita / Recorrido', color: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
        { id: 'cierre', title: 'Cierre Exitoso', color: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' }
    ];

    const handleDragStart = (e, leadId) => {
        e.dataTransfer.setData('leadId', leadId);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Permitir el Drop
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId) {
            moveLeadStage(leadId, columnId);
        }
    };

    return (
        <div className="flex-grow flex gap-4 overflow-x-auto pb-4 custom-scrollbar mt-4">
            {columns.map(col => {
                const columnLeads = leads.filter(l => l.stage === col.id);

                return (
                    <div
                        key={col.id}
                        className={`min-w-[300px] max-w-[350px] w-full flex flex-col rounded-2xl border ${col.border} bg-gray-50/50`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        {/* Column Header */}
                        <div className={`p-4 rounded-t-2xl border-b ${col.border} ${col.color}`}>
                            <div className="flex justify-between items-center">
                                <h3 className={`font-bold ${col.text}`}>{col.title}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white bg-opacity-50 ${col.text}`}>
                                    {columnLeads.length}
                                </span>
                            </div>
                        </div>

                        {/* Column Body / Drop Zone */}
                        <div className="p-3 flex-grow overflow-y-auto space-y-3 min-h-[200px]">
                            {columnLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                                    style={{ borderLeft: `4px solid ${branding.primaryColor}` }}
                                >
                                    <h4 className="font-bold text-gray-800 mb-1">{lead.name}</h4>
                                    <div className="text-xs text-gray-500 space-y-1 mb-3">
                                        <p>📞 {lead.phone}</p>
                                        <p>✉️ {lead.email}</p>
                                    </div>
                                    <p className="text-sm border-t border-gray-50 pt-2 text-gray-600 line-clamp-2 italic">
                                        "{lead.notes || 'Sin anotaciones'}"
                                    </p>
                                </div>
                            ))}

                            {columnLeads.length === 0 && (
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 w-full text-center">
                                        Drop here
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectDashboard;
