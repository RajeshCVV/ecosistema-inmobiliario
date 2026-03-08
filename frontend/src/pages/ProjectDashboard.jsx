import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardOverview from '../components/DashboardOverview';
import LeadManager from '../components/LeadManager';
import ProjectScope from '../components/ProjectScope';
import MarketingPlan from '../components/MarketingPlan';

export default function ProjectDashboard() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const project = location.state?.project || { name: 'Proyecto', _id: projectId };
    const company = location.state?.company || { name: 'Empresa', branding: {} };

    const [activeTab, setActiveTab] = useState('inicio');

    return (
        <div className="min-h-screen bg-brandLight flex flex-col md:flex-row animate-fade-in font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 drop-shadow-sm z-20">
                <div className="p-6 border-b border-gray-100 flex flex-col justify-center items-start">
                    <button onClick={() => navigate(-1)} className="text-xs text-gray-400 hover:text-brandDark mb-4 flex items-center gap-1">
                        <span>←</span> Volver a Proyectos
                    </button>
                    <h1 className="text-xl font-bold font-display tracking-tight text-company flex flex-col items-start gap-1">
                        <span className="w-6 h-6 rounded bg-brandDark text-white flex items-center justify-center text-[10px] shadow-inner" style={{ backgroundColor: company.branding?.primaryColor || '#000' }}>
                            {company.name.charAt(0)}
                        </span>
                        <span className="line-clamp-2 leading-tight">{project.name}</span>
                    </h1>
                    <p className="text-[10px] text-accent mt-2 uppercase tracking-wider font-bold bg-accent/10 px-2 py-0.5 rounded">Growth Hub</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { id: 'inicio', label: 'Dashboard General' },
                        { id: 'leads', label: 'CRM Leads' },
                        { id: 'marketing', label: 'Estrategia Growth' },
                        { id: 'proyectos', label: 'Hitos del Proyecto' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${activeTab === tab.id
                                ? 'bg-company text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-company'
                                }`}
                        >
                            • <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 hidden md:block">
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            GL
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-brandDark">Growth Leader</p>
                            <p className="text-xs text-gray-500 break-words w-full">{company.name}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden max-h-screen">
                <header className="h-20 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 md:px-8 z-10 shrink-0 sticky top-0 shadow-sm">
                    <h2 className="text-xl font-semibold capitalize font-display text-brandDark drop-shadow-sm flex items-center gap-2">
                        Módulo <span className="text-gray-400 font-normal">/</span> {activeTab === 'inicio' ? 'Dashboard' : activeTab}
                    </h2>
                    <div className="flex gap-4">
                        {/* Contextual Action Button based on Tab */}
                        <button className="btn-primary text-sm py-2 px-5 shadow-lg shadow-brandDark/20 hover:shadow-brandDark/40 transition-shadow">
                            {activeTab === 'leads' ? '+ Nuevo Lead' :
                                activeTab === 'proyectos' ? '+ Nuevo Hito' :
                                    activeTab === 'marketing' ? '+ Nueva Campaña' : 'Exportar Métricas'}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-brandLight">
                    <div className="max-w-7xl mx-auto">
                        {/* Se pasan los IDs del contexto actual hacia abajo para que cada componente sepa qué data jalar */}
                        {activeTab === 'inicio' && <DashboardOverview projectId={project._id} />}
                        {activeTab === 'leads' && <LeadManager projectId={project._id} />}
                        {activeTab === 'proyectos' && <ProjectScope projectId={project._id} />}
                        {activeTab === 'marketing' && <MarketingPlan projectId={project._id} />}
                    </div>
                </div>
            </main>
        </div>
    );
}
