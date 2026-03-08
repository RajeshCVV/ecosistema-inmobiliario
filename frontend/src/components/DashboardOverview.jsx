import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const DashboardOverview = () => {
    const { data, activeCompanyId } = useContext(AppContext);

    // Obtenemos todos los datos pertinentes al Ecosistema seleccionado
    const company = data.companies.find(c => c.id === activeCompanyId);

    if (!company) return null;

    const projects = company.projects || [];
    const activeProjects = projects.filter(p => p.status === 'abiertos' || p.status === 'en_curso').length;

    // Cálculos de Leads asociados a proyectos de esta empresa
    const companyProjectIds = projects.map(p => p.id);
    const companyLeads = data.leads.filter(lead => companyProjectIds.includes(lead.projectId));
    const newLeads = companyLeads.filter(l => l.stage === 'nuevo').length;
    const closedLeads = companyLeads.filter(l => l.stage === 'cierre').length;

    // Calcular cuántas Campañas Activas hay en todos los proyectos de la empresa
    let activeAds = 0;
    projects.forEach(p => {
        ['reconocimiento', 'trafico', 'clientesPotenciales'].forEach(stage => {
            if (p.campanasMeta && p.campanasMeta[stage]) {
                activeAds += p.campanasMeta[stage].filter(ad => ad.status === 'activa').length;
            }
        });
    });

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Visión Estratégica</h2>

            {/* Tarjetas de Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Dashboard Card: Proyectos */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl text-2xl">🏗️</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Proyectos Activos</p>
                        <p className="text-3xl font-extrabold text-gray-900">{activeProjects}</p>
                    </div>
                </div>

                {/* Dashboard Card: Leads Nuevos */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl text-2xl">🔥</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Prospectos Nuevos</p>
                        <p className="text-3xl font-extrabold text-gray-900">{newLeads}</p>
                        <p className="text-xs text-gray-400 mt-1">Sin contactar a la fecha</p>
                    </div>
                </div>

                {/* Dashboard Card: Cierres */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl text-2xl">💰</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cierres Exitosos</p>
                        <p className="text-3xl font-extrabold text-gray-900">{closedLeads}</p>
                    </div>
                </div>

                {/* Dashboard Card: Campañas */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl text-2xl">💻</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Campañas Meta</p>
                        <p className="text-3xl font-extrabold text-gray-900">{activeAds}</p>
                        <p className="text-xs text-gray-400 mt-1">En Circulación Activa</p>
                    </div>
                </div>

            </div>

            {/* Resumen de Estructura Comercial Rápida */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8 relative overflow-hidden group">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: company.branding.primaryColor }}></div>

                <h3 className="text-xl font-bold text-gray-800 mb-6">Nicho Actual del Ecosistema</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-3">Qué Vendemos</h4>
                        <p className="text-gray-800 font-medium">{company.branding.queVende}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-3">Diferenciador</h4>
                        <p className="text-gray-800 font-medium">{company.branding.diferenciador}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardOverview;
