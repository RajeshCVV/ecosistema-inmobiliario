import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

// Importaremos los módulos profundos en un momento
import MetaAdsManager from './MetaAdsManager';
import CRMBoard from './CRMBoard';

const ProjectsView = () => {
    const { data, activeCompanyId, addProject } = useContext(AppContext);
    const company = data.companies.find(c => c.id === activeCompanyId);

    const [isAddingProject, setIsAddingProject] = useState(false);
    const [projectForm, setProjectForm] = useState({ name: '', informacion: '', status: 'en_curso' });

    // Estado de "Proyecto Abierto" (Para inmersión)
    const [openProjectId, setOpenProjectId] = useState(null);
    const [activeProjectTab, setActiveProjectTab] = useState('info');

    if (!company) return null;

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!projectForm.name.trim()) return;

        addProject(company.id, {
            id: `p-${Date.now()}`,
            name: projectForm.name,
            status: projectForm.status,
            informacion: projectForm.informacion,
            campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] },
            planner: '', estrategia: ''
        });
        setIsAddingProject(false);
        setProjectForm({ name: '', informacion: '', status: 'en_curso' });
    };

    const getStatusColor = (status) => {
        if (status === 'abiertos') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'en_curso') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Si hay un proyecto abierto, renderizamos su "Mini-Dashboard" interno
    if (openProjectId) {
        const project = company.projects.find(p => p.id === openProjectId);
        if (!project) return <button onClick={() => setOpenProjectId(null)}>Volver</button>;

        const tabs = [
            { id: 'info', label: 'Info Técnica', icon: '📋' },
            { id: 'ads', label: 'Meta Ads Manager', icon: '💻' },
            { id: 'crm', label: 'Board CRM', icon: '👥' }
        ];

        return (
            <div className="animate-fade-in flex flex-col h-full relative">
                <button
                    onClick={() => setOpenProjectId(null)}
                    className="absolute -top-10 left-0 text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center transition-colors"
                >
                    ← Volver a Portafolio
                </button>

                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                        <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: company.branding.primaryColor }}></span>
                        {project.name}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                    </span>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl w-max mb-6">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveProjectTab(t.id)}
                            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeProjectTab === t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span>{t.icon}</span> <span>{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden custom-scrollbar">
                    {activeProjectTab === 'info' && (
                        <div className="animate-fade-in">
                            <h3 className="text-2xl font-bold mb-4">Información y Estrategia</h3>
                            <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 mb-6 border border-gray-100 whitespace-pre-wrap">
                                {project.informacion || 'Sin sumario técnico añadido.'}
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                                    <h4 className="font-bold text-orange-900 mb-2 text-sm uppercase tracking-widest">Planner</h4>
                                    <p className="text-orange-800 whitespace-pre-wrap">{project.planner || 'Vacío'}</p>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                                    <h4 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-widest">Estrategia</h4>
                                    <p className="text-indigo-800 whitespace-pre-wrap">{project.estrategia || 'Vacío'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeProjectTab === 'ads' && <MetaAdsManager project={project} />}
                    {activeProjectTab === 'crm' && <CRMBoard project={project} />}
                </div>
            </div>
        );
    }

    // VISTA PRINCIPAL (PORTAFOLIO)
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Portafolio de Proyectos</h2>
                    <p className="text-gray-500 mt-2">Gestiona el ciclo de vida de los desarrollos inmobiliarios.</p>
                </div>
                <button
                    onClick={() => setIsAddingProject(true)}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                    + Nuevo Proyecto
                </button>
            </div>

            {company.projects.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                    <span className="text-4xl">🏗️</span>
                    <h3 className="text-lg font-bold text-gray-700 mt-4 mb-2">No tienes proyectos</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Añade tu primer proyecto inmobiliario para activar Meta Ads y el CRM.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.projects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => setOpenProjectId(project.id)}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: company.branding.primaryColor }}></div>

                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-gray-100 p-3 rounded-2xl text-2xl group-hover:bg-blue-50 transition-colors">🏢</span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">{project.informacion}</p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                                <div className="flex space-x-3 text-sm text-gray-500 font-bold">
                                    <span title="Meta Ads Activos">💻 {
                                        (project.campanasMeta?.reconocimiento?.length || 0) +
                                        (project.campanasMeta?.trafico?.length || 0) +
                                        (project.campanasMeta?.clientesPotenciales?.length || 0)
                                    }</span>
                                </div>
                                <span className="text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                    Abrir Módulo →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL: NUEVO PROYECTO */}
            {isAddingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Añadir Proyecto Inmobiliario</h3>
                            <button onClick={() => setIsAddingProject(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Comercial</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} placeholder="Ej. Altos de la Colina" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Estado de Ventas</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium" value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
                                    <option value="en_curso">En Estructuración (Próximamente)</option>
                                    <option value="abiertos">Ventas Abiertas</option>
                                    <option value="cerrados">Sold Out (Cerrado)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Concepto / Info General</label>
                                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-24 resize-none" value={projectForm.informacion} onChange={e => setProjectForm({ ...projectForm, informacion: e.target.value })} placeholder="Breve descripción del proyecto..."></textarea>
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg transition-all" style={{ backgroundColor: company.branding.primaryColor }}>Desplegar Proyecto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsView;
