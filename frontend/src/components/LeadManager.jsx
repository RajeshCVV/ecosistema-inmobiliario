import React, { useState, useEffect } from 'react';
import { getLeadsByProject, createLead } from '../api';
import LeadFormModal from './LeadFormModal';

export default function LeadManager({ projectId }) {
    const [filter, setFilter] = useState('Todos');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchLeads() {
            try {
                // Pasamos el projectId al endpoint filtrado
                const data = await getLeadsByProject(projectId);
                setLeads(data);
            } catch (error) {
                console.error("Error fetching leads:", error);
            } finally {
                setLoading(false);
            }
        }
        if (projectId) fetchLeads();
    }, [projectId]);

    const handleCreateLead = async (leadData) => {
        try {
            // Inyectamos el projectId al payload antes de crear
            const payload = { ...leadData, projectId };
            const newLead = await createLead(payload);
            setLeads(prev => [...prev, newLead]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating lead:", error);
            alert("No se pudo crear el lead. Inténtalo de nuevo.");
        }
    };

    const filteredLeads = filter === 'Todos' ? leads : leads.filter(l => (l.profileType || '').includes(filter === 'Inversionista' ? 'Investor' : 'Merchant'));

    return (
        <div className="space-y-6 animate-slide-up opacity-0 relative" style={{ animationFillMode: 'forwards' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-company mb-1">CRM Especializado "Boutique"</h2>
                    <p className="text-gray-500 text-sm">Gestiona tus contactos según su perfil de inversión o comercio.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <span>+</span> Agregar Lead
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                {['Todos', 'Inversionista', 'Comerciante'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === type ? 'bg-company text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-accent'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-4 text-sm font-semibold text-gray-600">Nombre</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Contacto</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Perfil (Buyer Persona)</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Interés Principal</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Estado</th>
                            <th className="p-4 text-sm font-semibold text-gray-600text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">Cargando datos desde Base de Datos...</td></tr>
                        ) : filteredLeads.map(lead => (
                            <tr key={lead._id || lead.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-medium text-brandDark">{lead.name}</td>
                                <td className="p-4 text-sm text-gray-500">{lead.phone}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${(lead.profileType || '').includes('Investor') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {lead.profileType === 'Investor' ? 'Inversionista' : lead.profileType === 'Merchant' ? 'Comerciante' : 'Otro'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{lead.interest}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${lead.status === 'New' ? 'bg-green-100 text-green-800' :
                                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                                            (lead.status === 'En Negociación' || lead.status === 'Qualified') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {lead.status === 'New' ? 'Nuevo' : lead.status === 'Contacted' ? 'Contactado' : lead.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-accent hover:text-company text-sm font-medium transition-colors">Ver Detalles</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <LeadFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateLead}
            />
        </div>
    );
}
