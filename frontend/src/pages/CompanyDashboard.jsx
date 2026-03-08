import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const CompanyDashboard = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { data, updateCompany, addProject } = useContext(AppContext);

    const company = data.companies.find(c => c.id === companyId);
    const [activeTab, setActiveTab] = useState('marca'); // 'marca' or 'proyectos'
    const [projectFilter, setProjectFilter] = useState('todos');

    // Modals State
    const [isEditingBrand, setIsEditingBrand] = useState(false);
    const [brandForm, setBrandForm] = useState(company?.branding || {});

    const [isAddingProject, setIsAddingProject] = useState(false);
    const [projectForm, setProjectForm] = useState({ name: '', informacion: '', status: 'en_curso' });

    if (!company) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">Empresa no encontrada</h2>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const { branding } = company;

    const filteredProjects = projectFilter === 'todos'
        ? company.projects
        : company.projects.filter(p => p.status === projectFilter);

    // Handlers
    const handleSaveBrand = (e) => {
        e.preventDefault();

        // Parse Buyer Personas from newline separated string to array if it's a string
        let processedPersonas = brandForm.buyerPersonas;
        if (typeof brandForm.buyerPersonas === 'string') {
            processedPersonas = brandForm.buyerPersonas.split('\n').filter(p => p.trim() !== '');
        }

        updateCompany(company.id, { branding: { ...brandForm, buyerPersonas: processedPersonas } });
        setIsEditingBrand(false);
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!projectForm.name.trim()) return;

        const newProject = {
            id: `p-${Date.now()}`,
            name: projectForm.name,
            status: projectForm.status,
            informacion: projectForm.informacion,
            campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] },
            planner: '',
            estrategia: '',
            metricas: '',
            crm: 'Desconectado',
            campanasActivas: 'Sin pauta'
        };

        addProject(company.id, newProject);
        setIsAddingProject(false);
        setProjectForm({ name: '', informacion: '', status: 'en_curso' });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans relative">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 transition-colors font-medium">
                            ← Inicio
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900" style={{ color: branding.primaryColor }}>
                            {company.name} <span className="font-light text-gray-400">Dashboard</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8 flex justify-between items-end">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('marca')}
                            className={`${activeTab === 'marca'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                            style={activeTab === 'marca' ? { borderColor: branding.primaryColor, color: branding.primaryColor } : {}}
                        >
                            Estructura de Marca
                        </button>
                        <button
                            onClick={() => setActiveTab('proyectos')}
                            className={`${activeTab === 'proyectos'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                            style={activeTab === 'proyectos' ? { borderColor: branding.primaryColor, color: branding.primaryColor } : {}}
                        >
                            Proyectos
                        </button>
                    </nav>

                    {/* Action Buttons right side of tabs */}
                    {activeTab === 'marca' && (
                        <button
                            onClick={() => { setBrandForm(branding); setIsEditingBrand(true); }}
                            className="mb-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-md"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            ✍️ Editar Estrategia
                        </button>
                    )}
                    {activeTab === 'proyectos' && (
                        <button
                            onClick={() => setIsAddingProject(true)}
                            className="mb-2 px-4 py-2 text-white rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-transform flex items-center"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            <span className="text-lg mr-2 leading-none">+</span> Nuevo Proyecto
                        </button>
                    )}
                </div>

                {/* Tab Content: Estructura de Marca */}
                {activeTab === 'marca' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        <BrandCard title="A quién nos dirigimos (Nicho)" content={branding.nicho} icon="🎯" />
                        <BrandCard title="Línea de comunicación" content={branding.lineaComunicacion} icon="🗣️" />
                        <BrandCard title="Diferenciador" content={branding.diferenciador} icon="⭐" />
                        <BrandCard title="Problemas que resuelve" content={branding.problemasResuelve} icon="🛠️" />
                        <BrandCard title="Tickets de Inversión" content={branding.ticketsInversion} icon="💰" />
                        <BrandCard title="Qué Vende" content={branding.queVende} icon="🏢" />

                        {/* Buyer Personas Expandido */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">👥</span> Buyer Personas
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {branding.buyerPersonas && branding.buyerPersonas.length > 0 ? (
                                    branding.buyerPersonas.map((persona, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 font-bold flex-shrink-0" style={{ backgroundColor: branding.primaryColor }}>
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-gray-700 text-sm">{persona}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">No hay Buyer Personas definidos.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Proyectos */}
                {activeTab === 'proyectos' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Filtros */}
                        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100 inline-flex overflow-x-auto max-w-full">
                            {[
                                { id: 'todos', label: 'Todos' },
                                { id: 'abiertos', label: 'Abiertos' },
                                { id: 'en_curso', label: 'En Curso' },
                                { id: 'cerrados', label: 'Cerrados' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setProjectFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${projectFilter === filter.id
                                        ? 'text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    style={projectFilter === filter.id ? { backgroundColor: branding.primaryColor } : {}}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Grid de Proyectos */}
                        {filteredProjects.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                <span className="text-6xl mb-4 opacity-50">🏗️</span>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes proyectos aquí</h3>
                                <p className="text-gray-500 max-w-md">Anímate a crear el primer proyecto inmobiliario en este estado para iniciar su gestión visual publicitaria.</p>
                                <button
                                    onClick={() => setIsAddingProject(true)}
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                                >
                                    + Crear Proyecto
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProjects.map(project => (
                                    <div
                                        key={project.id}
                                        onClick={() => navigate(`/${companyId}/projects/${project.id}`)}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col transform hover:-translate-y-1"
                                    >
                                        <div className="h-2 w-full" style={{ backgroundColor: branding.primaryColor }}></div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 pr-2">{project.name}</h3>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${project.status === 'abiertos' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'en_curso' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {project.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                                                {project.informacion}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                                <span className="text-sm font-semibold flex items-center" style={{ color: branding.primaryColor }}>
                                                    Gestor CRM / Meta <span className="ml-2">→</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modal: Editar Estructura de Marca */}
            {isEditingBrand && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] animate-fade-in relative my-auto">
                        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center rounded-t-3xl sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <span className="mr-3 text-2xl">✍️</span> Editor de Inteligencia Estratégica
                            </h2>
                            <button onClick={() => setIsEditingBrand(false)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleSaveBrand} className="p-8 overflow-y-auto flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nicho (A quién nos dirigimos)</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 outline-none h-24 resize-none"
                                            value={brandForm.nicho} onChange={(e) => setBrandForm({ ...brandForm, nicho: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Línea de comunicación</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 outline-none h-24 resize-none"
                                            value={brandForm.lineaComunicacion} onChange={(e) => setBrandForm({ ...brandForm, lineaComunicacion: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Diferenciador</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 outline-none h-24 resize-none"
                                            value={brandForm.diferenciador} onChange={(e) => setBrandForm({ ...brandForm, diferenciador: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Problemas que Resuelve</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 outline-none h-24 resize-none"
                                            value={brandForm.problemasResuelve} onChange={(e) => setBrandForm({ ...brandForm, problemasResuelve: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tickets de Inversión</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 outline-none"
                                            value={brandForm.ticketsInversion} onChange={(e) => setBrandForm({ ...brandForm, ticketsInversion: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Qué Vende</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 outline-none"
                                            value={brandForm.queVende} onChange={(e) => setBrandForm({ ...brandForm, queVende: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Buyer Personas (Uno por línea)</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-blue-50 text-gray-800 outline-none h-32 resize-none"
                                            value={Array.isArray(brandForm.buyerPersonas) ? brandForm.buyerPersonas.join('\n') : brandForm.buyerPersonas}
                                            onChange={(e) => setBrandForm({ ...brandForm, buyerPersonas: e.target.value })}
                                            placeholder="Perfil 1...&#10;Perfil 2..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end space-x-4 border-t border-gray-100 pt-6">
                                <button type="button" onClick={() => setIsEditingBrand(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">Guardar Estrategia</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Añadir Proyecto */}
            {isAddingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-fade-in">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Nuevo Proyecto</h3>
                            <button onClick={() => setIsAddingProject(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleCreateProject} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                                    placeholder="Ej: Torre Central"
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Estado Inmobiliario</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 appearance-none font-medium text-gray-700 cursor-pointer"
                                    value={projectForm.status}
                                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                                >
                                    <option value="en_curso">En Curso / Estructuración</option>
                                    <option value="abiertos">Abierto a Ventas</option>
                                    <option value="cerrados">Cerrado (Sold Out)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción General</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 h-24 resize-none"
                                    placeholder="Descripción corta del proyecto..."
                                    value={projectForm.informacion}
                                    onChange={(e) => setProjectForm({ ...projectForm, informacion: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg transition-all" style={{ backgroundColor: branding.primaryColor }}>
                                    Crear Proyecto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

// Subcomponente de Tarjeta de Branding
const BrandCard = ({ title, content, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl bg-gray-50 p-2 rounded-xl">{icon}</span>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{content || 'No hay información definida.'}</p>
    </div>
);

export default CompanyDashboard;
