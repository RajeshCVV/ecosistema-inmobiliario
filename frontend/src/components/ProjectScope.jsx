import React, { useState, useEffect } from 'react';
import { getProjects, addMilestone } from '../api';
import MilestoneFormModal from './MilestoneFormModal';

export default function ProjectScope() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const handleAddMilestone = async (milestoneData) => {
        if (!projects.length) return alert("No hay proyectos activos para añadir hitos.");
        const currentProject = projects[0];

        try {
            const updatedProject = await addMilestone(currentProject._id, milestoneData);
            // Actualizar localmente
            setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
        } catch (error) {
            console.error("Error saving milestone:", error);
            alert("Hubo un error al guardar el hito.");
        }
    };

    const currentProject = projects.length > 0 ? projects[0] : null;
    const milestones = currentProject?.milestones || [];

    return (
        <div className="space-y-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-company mb-1">Alcance del Proyecto</h2>
                    <p className="text-gray-500 text-sm">Gestiona los hitos y entregables de Boulevard El Parque.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <span>+</span> Añadir Hito
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline */}
                <div className="lg:col-span-2 glass-card p-6 min-h-[500px]">
                    <h3 className="text-lg font-semibold mb-6 text-brandDark">Línea de Tiempo - Entregables</h3>
                    <div className="relative border-l border-gray-200 ml-3 space-y-8">
                        {loading && <p className="ml-6 text-gray-500">Cargando hitos...</p>}
                        {!loading && milestones.length === 0 && <p className="ml-6 text-gray-500">No hay hitos creados aún.</p>}
                        {milestones.map((item, idx) => (
                            <div key={item._id || idx} className="mb-8 ml-6 relative group">
                                <span className={`absolute -left-10 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white transition-all 
                  ${(item.status === 'Completado' || item.completed) ? 'bg-green-500 shadow-lg shadow-green-200' :
                                        item.status === 'En Proceso' ? 'bg-accent shadow-lg shadow-accent/30 scale-110' : 'bg-gray-200'}`}>
                                    {(item.status === 'Completado' || item.completed) && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                    {item.status === 'En Proceso' && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>}
                                </span>

                                <h3 className={`font-semibold text-lg hover:text-accent transition-colors ${item.status === 'En Proceso' ? 'text-brandDark' : 'text-gray-700'}`}>
                                    {item.title}
                                </h3>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                        {new Date(item.dueDate || item.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${(item.status === 'Completado' || item.completed) ? 'bg-green-100 text-green-700' :
                                        item.status === 'En Proceso' ? 'bg-yellow-100 text-accent outline outline-1 outline-accent' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {item.completed ? 'Completado' : item.status || 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold mb-4 text-brandDark">Detalles del Proyecto</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Cliente</label>
                                <p className="text-sm font-medium text-brandDark">Multivela Studio</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Ubicación</label>
                                <p className="text-sm font-medium text-brandDark">Jamundí, Valle del Cauca</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Presupuesto</label>
                                <p className="text-sm font-medium text-brandDark">-</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Progreso Global</label>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                                <p className="text-xs text-right mt-1 font-semibold text-gray-500">40% Completado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MilestoneFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddMilestone}
            />
        </div>
    );
}
