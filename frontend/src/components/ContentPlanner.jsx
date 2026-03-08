import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ContentPlanner = () => {
    const { data, activeCompanyId } = useContext(AppContext);

    // Filtramos para obtener solo el planner respectivo a los proyectos de la empresa activa
    const company = data.companies.find(c => c.id === activeCompanyId);
    if (!company) return null;

    const companyProjectIds = company.projects.map(p => p.id);
    const companyContent = data.content.filter(c => companyProjectIds.includes(c.projectId));

    const statusColors = {
        idea: 'bg-gray-100 text-gray-700',
        guion: 'bg-yellow-100 text-yellow-800',
        grabacion: 'bg-orange-100 text-orange-800',
        edicion: 'bg-blue-100 text-blue-800',
        programado: 'bg-purple-100 text-purple-800',
        publicado: 'bg-green-100 text-green-800'
    };

    return (
        <div className="animate-fade-in relative max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <div className="flex items-center">
                    <span className="text-4xl mr-4 bg-yellow-50 p-3 rounded-2xl">📆</span>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Content Planner (Producción)</h2>
                        <p className="text-gray-500 mt-1">Organización semanal de rodaje y Copy para Ecosistema Meta.</p>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md">
                    + Agendar Producción
                </button>
            </div>

            {companyContent.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center mt-10">
                    <span className="text-4xl">🎬</span>
                    <h3 className="text-lg font-bold text-gray-700 mt-4 mb-2">Tu calendario está vacío</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Comienza a planificar tu parrilla de contenidos en video o gráfica para los AdSets pautados.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100">
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold">Concepto / Guion</th>
                                <th className="p-4 font-bold">Proyecto Destino</th>
                                <th className="p-4 font-bold">Formato & Locación</th>
                                <th className="p-4 font-bold">Fecha Pauta</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {companyContent.map(item => {
                                const proj = company.projects.find(p => p.id === item.projectId);
                                return (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[item.estado]}`}>
                                                {item.estado}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900">{item.tipoContenido}</p>
                                            <p className="text-gray-500 truncate max-w-[200px]" title={item.guion}>{item.guion || 'Falta guion..'}</p>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">
                                            {proj ? proj.name : 'Varios'}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-700">{item.formato}</p>
                                            <p className="text-gray-400 text-xs">📍 {item.locacion || 'Sin set'}</p>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {item.fechaPublicacion ? new Date(item.fechaPublicacion).toLocaleDateString() : 'TBD'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-blue-600 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                                Editar 📝
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContentPlanner;
