import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProjectDashboard = () => {
    const { companyId, projectId } = useParams();
    const navigate = useNavigate();
    const { data } = useContext(AppContext);

    const company = data.companies.find(c => c.id === companyId);
    const project = company?.projects.find(p => p.id === projectId);

    const [activeTab, setActiveTab] = useState('info');
    // Tabs: info, campañas_meta, planner, estrategia, activas, metricas, crm

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
        { id: 'campañas_meta', label: 'Campañas Meta', icon: '💻' },
        { id: 'planner', label: 'Planner de campañas', icon: '📅' },
        { id: 'estrategia', label: 'Estrategia de campañas', icon: '♟️' },
        { id: 'activas', label: 'Campañas activas', icon: '🟢' },
        { id: 'metricas', label: 'Métricas y análisis', icon: '📊' },
        { id: 'crm', label: 'Conexión a CRM', icon: '🔗' },
    ];

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
                <div className="flex-grow bg-white p-8 rounded-3xl shadow-lg border border-gray-100 w-full animate-fade-in min-h-[60vh]">

                    {/* INFO */}
                    {activeTab === 'info' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                                <span className="text-4xl mr-4 bg-gray-50 p-3 rounded-2xl">📋</span>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Información del Proyecto</h2>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">{project.informacion || 'No hay información registrada.'}</p>
                        </div>
                    )}

                    {/* CAMPAÑAS META (ACORDEON COMPLEJO) */}
                    {activeTab === 'campañas_meta' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
                                <span className="text-4xl mr-4 bg-blue-50 p-3 rounded-2xl">💻</span>
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Campañas Meta</h2>
                                    <p className="text-gray-500 mt-1">Estructura de anuncios por embudo de conversión</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <MetaObjective title="Nivel 1: Reconocimiento" subtitle="Generación de autoridad y branding" color="blue" adSets={project.campanasMeta?.reconocimiento} />
                                <MetaObjective title="Nivel 2: Tráfico" subtitle="Redirección a landing pages y WhatsApp" color="green" adSets={project.campanasMeta?.trafico} />
                                <MetaObjective title="Nivel 3: Clientes potenciales" subtitle="Formularios nativos y conversión de leads" color="purple" adSets={project.campanasMeta?.clientesPotenciales} />
                            </div>
                        </div>
                    )}

                    {/* PLANNER */}
                    {activeTab === 'planner' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Planner de Campañas</h2>
                            <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100 shadow-inner">
                                <p className="text-gray-700 text-lg">{project.planner || 'No hay planner de calendario o parrilla definido.'}</p>
                            </div>
                        </div>
                    )}

                    {/* ESTRATEGIA */}
                    {activeTab === 'estrategia' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Estrategia de Campañas</h2>
                            <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100 shadow-inner">
                                <p className="text-gray-700 text-lg">{project.estrategia || 'No hay texto de estrategia general definido.'}</p>
                            </div>
                        </div>
                    )}

                    {/* ACTIVAS */}
                    {activeTab === 'activas' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Campañas Activas</h2>
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-emerald-50 p-8 rounded-2xl border border-emerald-200">
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="animate-ping absolute h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative h-6 w-6 rounded-full bg-emerald-500"></span>
                                </div>
                                <div>
                                    <p className="text-emerald-900 font-bold text-xl">Estado de Circulación de Anuncios</p>
                                    <p className="text-emerald-700 mt-1">{project.campanasActivas || 'Actualmente no hay pauta en circulación verificada por el planner.'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* METRICAS */}
                    {activeTab === 'metricas' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Métricas y Análisis</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Resumen General</p>
                                    <p className="text-2xl font-bold text-gray-900">{project.metricas || 'No hay data extraída del Business Manager'}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 italic">
                                    Espacio para gráficas futuras
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CRM */}
                    {activeTab === 'crm' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Integración CRM</h2>
                            <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                                {/* Decoración de fondo */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>

                                <div className="flex items-center space-x-6 z-10 mb-6 sm:mb-0">
                                    <div className="w-16 h-16 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                        <span className="text-4xl text-white">⚡</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Estado de Integración</p>
                                        <h3 className="font-bold text-2xl tracking-tight">{project.crm || 'Esperando credenciales (API)'}</h3>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto px-8 py-3 bg-white text-slate-900 rounded-xl font-extrabold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 z-10">
                                    Sincronizar Leads
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente para Objetivos de Meta y AdSets Anidados
const MetaObjective = ({ title, subtitle, color, adSets }) => {
    const colorMap = {
        blue: { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-800', bar: 'bg-indigo-500' },
        green: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500' },
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-800', bar: 'bg-purple-500' },
    };
    const c = colorMap[color];

    return (
        <div className={`p-8 rounded-3xl border ${c.bg} ${c.border} relative overflow-hidden`}>
            {/* Barra lateral de acento */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.bar} opacity-70`}></div>

            <div className="mb-6">
                <h3 className={`text-2xl font-extrabold ${c.text}`}>{title}</h3>
                <p className="text-gray-500 font-medium text-sm mt-1">{subtitle}</p>
            </div>

            {!adSets || adSets.length === 0 ? (
                <div className="bg-white bg-opacity-60 p-4 rounded-xl text-sm font-medium text-gray-500 italic">
                    Sin conjuntos de anuncios en este nivel del embudo.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adSets.map((adSet, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col transform hover:-translate-y-1 transition-transform">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${c.bar}`}></span>
                                {adSet.nombre}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {adSet.formatos && adSet.formatos.length > 0 ? (
                                    adSet.formatos.map((fmt, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-200">
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

export default ProjectDashboard;
