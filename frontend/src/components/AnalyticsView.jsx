import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const AnalyticsView = () => {
    const { data, activeCompanyId } = useContext(AppContext);

    // Mock analytics dashboard based on standard Performance Growth Logic.
    const company = data.companies.find(c => c.id === activeCompanyId);
    if (!company) return null;

    const companyProjectIds = company.projects.map(p => p.id);
    const leadsCount = data.leads.filter(c => companyProjectIds.includes(c.projectId)).length;

    // Count total Ads currently running across all projects in the company
    let totalActivas = 0;
    company.projects.forEach(p => {
        const met = p.campanasMeta;
        if (met) {
            totalActivas += met.reconocimiento?.filter(a => a.status === 'activa').length || 0;
            totalActivas += met.trafico?.filter(a => a.status === 'activa').length || 0;
            totalActivas += met.clientesPotenciales?.filter(a => a.status === 'activa').length || 0;
        }
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <div className="flex items-center">
                    <span className="text-4xl mr-4 bg-green-50 p-3 rounded-2xl">📈</span>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Growth Data Center</h2>
                        <p className="text-gray-500 mt-1">Cálculo en vivo del embudo de ventas, ROI y costos por canal.</p>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm flex items-center">
                    📥 Generar Reporte Mensual
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🔗</div>
                    <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Costo por Lead (CPL)</p>
                    <p className="text-4xl font-extrabold text-blue-600 mb-2">$0.00 <span className="text-sm font-medium text-gray-400">USD Promedio</span></p>
                    <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block">Óptimo ↓</div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Volumen de Tráfico</p>
                    <p className="text-4xl font-extrabold text-gray-900 mb-2">0 <span className="text-sm font-medium text-gray-400">Visitas/Semana</span></p>
                    <div className="text-xs font-bold text-gray-400">Desde Meta Ads ({totalActivas} Anuncios)</div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
                    <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Tasa Cierre Prospectos</p>
                    <p className="text-4xl font-extrabold text-green-600 mb-2">0.0% <span className="text-sm font-medium text-gray-400">Historico</span></p>
                    <div className="text-xs font-bold text-gray-400">Leads en base actual: {leadsCount}</div>
                </div>
            </div>

            {/* Simulated Chart Area */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-96 flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">📊</span>
                <h3 className="text-xl font-bold text-gray-700">Conectando a API de Meta...</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm text-center">La simulación gráfica se encenderá cuando los anuncios registren más de 100 impresiones en la integración planificada.</p>
            </div>
        </div>
    );
};

export default AnalyticsView;
