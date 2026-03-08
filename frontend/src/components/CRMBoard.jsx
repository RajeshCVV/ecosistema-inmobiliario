import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const CRMBoard = ({ project = null }) => {
    // Si viene un 'project' por prop (desde ProjectsView), filtramos por ese proyecto. 
    // Si no viene (desde el menú global CRM), mostramos todos los leads de la empresa activa.
    const { data, activeCompanyId, moveLeadStage, addLead } = useContext(AppContext);

    const company = data.companies.find(c => c.id === activeCompanyId);
    if (!company) return null;

    const companyProjectIds = company.projects.map(p => p.id);
    const leads = data.leads.filter(l =>
        project ? l.projectId === project.id : companyProjectIds.includes(l.projectId)
    );

    const [isAddingLead, setIsAddingLead] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', notes: '', projectId: project ? project.id : '' });

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
        e.preventDefault();
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId) {
            moveLeadStage(leadId, columnId);
        }
    };

    const handleCreateLead = (e) => {
        e.preventDefault();
        if (!leadForm.name.trim() || !leadForm.projectId) return;

        addLead({
            id: `lead-${Date.now()}`,
            projectId: leadForm.projectId,
            name: leadForm.name,
            phone: leadForm.phone,
            email: leadForm.email,
            notes: leadForm.notes,
            stage: 'nuevo',
            date: new Date().toISOString().split('T')[0]
        });
        setIsAddingLead(false);
        setLeadForm({ name: '', phone: '', email: '', notes: '', projectId: project ? project.id : '' });
    };

    return (
        <div className="animate-fade-in flex flex-col h-full">
            {/* Header del CRM (Sólo si se entra desde el menú global) */}
            {!project && (
                <div className="flex items-center mb-8 border-b border-gray-100 pb-4 justify-between">
                    <div className="flex items-center">
                        <span className="text-4xl mr-4 bg-orange-50 p-3 rounded-2xl">👥</span>
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Board de Ventas Inmobiliario</h2>
                            <p className="text-gray-500 mt-1">Kanban Global de Prospectos. Arrastra tarjetas para avanzar en el embudo comercial.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddingLead(true)}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md"
                    >
                        + Añadir Prospecto
                    </button>
                </div>
            )}

            {/* Render Kanban */}
            <div className={`flex-grow flex gap-4 overflow-x-auto pb-4 custom-scrollbar ${project ? 'mt-4' : ''}`}>
                {columns.map(col => {
                    const columnLeads = leads.filter(l => l.stage === col.id);

                    return (
                        <div
                            key={col.id}
                            className={`min-w-[300px] max-w-[350px] w-full flex flex-col rounded-2xl border ${col.border} bg-gray-50/50`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div className={`p-4 rounded-t-2xl border-b ${col.border} ${col.color}`}>
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-bold ${col.text}`}>{col.title}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded bg-white bg-opacity-50 ${col.text}`}>
                                        {columnLeads.length}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 flex-grow overflow-y-auto space-y-3 min-h-[50vh]">
                                {columnLeads.map(lead => {
                                    const leadProject = company.projects.find(p => p.id === lead.projectId);

                                    return (
                                        <div
                                            key={lead.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, lead.id)}
                                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                                            style={{ borderLeft: `4px solid ${company.branding.primaryColor}` }}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-800">{lead.name}</h4>
                                                {!project && leadProject && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                                        {leadProject.name.substring(0, 12)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 space-y-1 mb-3">
                                                <p>📞 {lead.phone}</p>
                                                <p>✉️ {lead.email}</p>
                                            </div>
                                            <p className="text-sm border-t border-gray-50 pt-2 text-gray-600 line-clamp-2 italic">
                                                "{lead.notes || 'Sin anotaciones'}"
                                            </p>
                                        </div>
                                    );
                                })}

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

            {/* Modal: Añadir Prospecto (Lead) */}
            {isAddingLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-fade-in">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Nuevo Prospecto (CRM)</h3>
                            <button onClick={() => setIsAddingLead(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleCreateLead} className="p-8 space-y-4">
                            {!project && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Proyecto de Interés</label>
                                    <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={leadForm.projectId} onChange={e => setLeadForm({ ...leadForm, projectId: e.target.value })}>
                                        <option value="">Seleccione un proyecto...</option>
                                        {company.projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="Ej: Maria Gonzalez" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono / WP</label>
                                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="+57 XXX..." />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="correo@..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notas / Requerimientos</label>
                                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-20 resize-none" value={leadForm.notes} onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })} placeholder="Presupuesto, m2 buscados..."></textarea>
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button type="button" onClick={() => setIsAddingLead(false)} className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 relative overflow-hidden group" style={{ backgroundColor: company.branding.primaryColor || '#2563EB' }}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                                    <span className="relative drop-shadow-md">Añadir al Embudo</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMBoard;
