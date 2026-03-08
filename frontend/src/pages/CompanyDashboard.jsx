import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const CompanyDashboard = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { data } = useContext(AppContext);

    const company = data.companies.find(c => c.id === companyId);
    const [activeTab, setActiveTab] = useState('marca'); // 'marca' or 'proyectos'
    const [projectFilter, setProjectFilter] = useState('todos'); // 'todos', 'abiertos', 'en_curso', 'cerrados'

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

    // As in the prompt, filter exactly matches statuses in context ('abiertos', 'en_curso', 'cerrados')
    const filteredProjects = projectFilter === 'todos'
        ? company.projects
        : company.projects.filter(p => p.status === projectFilter);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
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
                <div className="border-b border-gray-200 mb-8">
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
                                {branding.buyerPersonas.map((persona, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 font-bold" style={{ backgroundColor: branding.primaryColor }}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-medium text-gray-700">{persona}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Proyectos */}
                {activeTab === 'proyectos' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Filtros */}
                        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100 inline-flex">
                            {[
                                { id: 'todos', label: 'Todos' },
                                { id: 'abiertos', label: 'Abiertos' },
                                { id: 'en_curso', label: 'En Curso' },
                                { id: 'cerrados', label: 'Cerrados' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setProjectFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${projectFilter === filter.id
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
                            <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-lg">No hay proyectos en esta categoría.</p>
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
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{project.name}</h3>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${project.status === 'abiertos' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'en_curso' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {project.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                                                {project.informacion}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-gray-50">
                                                <span className="text-sm font-semibold flex items-center" style={{ color: branding.primaryColor }}>
                                                    Ver panel Meta / CRM <span className="ml-2">→</span>
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
        <p className="text-gray-600 leading-relaxed font-medium">{content || 'No hay información definida.'}</p>
    </div>
);

export default CompanyDashboard;
