import React, { useState, useEffect } from 'react';
import { getLeads, getProjects } from '../api';

export default function DashboardOverview() {
    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getLeads().then(setLeads).catch(console.error);
        getProjects().then(setProjects).catch(console.error);
    }, []);

    return (
        <div className="space-y-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total de Leads" value={leads.length || '...'} trend="Dato en vivo DB" />
                <StatCard title="Proyectos Activos" value={projects.length || '...'} subtitle="Boulevard El Parque" />
                <StatCard title="Tasa de Conversión" value="4.2%" trend="+0.5% (Inv.)" />
            </div>

            {/* Recent Activity & Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-4 text-brandDark">Hitos del Proyecto</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-accent transition-colors">
                            <div className="w-3 h-3 rounded-full bg-accent"></div>
                            <div className="flex-1">
                                <p className="font-medium text-brandDark">Lanzamiento Campaña Meta Ads</p>
                                <p className="text-sm text-gray-500">Boulevard - Reconocimiento</p>
                            </div>
                            <span className="text-sm font-semibold text-accent">En Proceso</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-accent transition-colors opacity-60">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="flex-1">
                                <p className="font-medium text-brandDark line-through">Definición de Público Objetivo</p>
                                <p className="text-sm text-gray-500">Boulevard - Planeación</p>
                            </div>
                            <span className="text-sm font-semibold text-green-600">Completado</span>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-brandDark">Nuevos Leads</h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center bg-gray-50 p-3 rounded hover-lift cursor-pointer border border-transparent hover:border-accent/30">
                            <div>
                                <p className="font-medium text-sm text-brandDark">Carlos Inversor</p>
                                <p className="text-xs text-gray-500">Perfil: Inversionista</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Nuevo</span>
                        </li>
                        <li className="flex justify-between items-center bg-gray-50 p-3 rounded hover-lift cursor-pointer border border-transparent hover:border-accent/30">
                            <div>
                                <p className="font-medium text-sm text-brandDark">María Comerciante</p>
                                <p className="text-xs text-gray-500">Perfil: Comerciante</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Contactado</span>
                        </li>
                        <li className="flex justify-between items-center bg-gray-50 p-3 rounded hover-lift cursor-pointer border border-transparent hover:border-accent/30">
                            <div>
                                <p className="font-medium text-sm text-brandDark">Andrés Franquicia</p>
                                <p className="text-xs text-gray-500">Perfil: Comerciante</p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">En Negociación</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, subtitle }) {
    return (
        <div className="glass-card p-6 flex flex-col justify-between hover-lift border-b-4 border-b-transparent hover:border-b-accent transition-all duration-300">
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-4xl font-display font-bold mt-2 text-company">{value}</h3>
            </div>
            <div className="mt-4">
                {trend && <p className="text-sm text-green-600 font-medium flex items-center gap-1">↑ {trend}</p>}
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
        </div>
    );
}
