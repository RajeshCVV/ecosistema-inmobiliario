import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProjectsByCompany } from '../api';

export default function CompanyProjects() {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const company = location.state?.company || { name: 'Empresa', branding: {} };

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getProjectsByCompany(companyId);
                setProjects(data);
            } catch (error) {
                console.error("Error loading projects", error);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, [companyId]);

    return (
        <div className="min-h-screen bg-brandLight flex flex-col font-sans animate-fade-in">
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-brandDark transition-colors p-2 rounded-full hover:bg-gray-50">
                        ← Volver
                    </button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <h1 className="text-xl font-display font-bold flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs shadow-inner" style={{ backgroundColor: company.branding?.primaryColor || '#0f172a' }}>
                            {company.name.charAt(0)}
                        </span>
                        {company.name}
                    </h1>
                </div>
                <button className="btn-primary text-sm py-2 px-5">
                    + Nuevo Proyecto
                </button>
            </header>

            <main className="flex-1 p-6 md:p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-brandDark mb-2">Proyectos Activos</h2>
                        <p className="text-gray-500">Selecciona un proyecto específico para gestionar su alcance, leads y embudo de marketing.</p>
                    </div>

                    {loading ? (
                        <div className="text-gray-500 py-10">Cargando proyectos...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div
                                    key={project._id}
                                    onClick={() => navigate(`/projects/${project._id}/dashboard`, { state: { project, company } })}
                                    className="glass-card p-6 cursor-pointer hover:-translate-y-1 transition-transform group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                            {project.status === 'Active' ? 'Activo' : project.status}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-brandDark mb-2 group-hover:text-company transition-colors">{project.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-6">
                                        {project.description || 'Proyecto de desarrollo inmobiliario en gestión activa.'}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                                            <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-white flex items-center justify-center text-[10px] font-bold text-accent">+3</div>
                                        </div>
                                        <span className="text-sm font-semibold text-company group-hover:translate-x-1 transition-transform">Administrar →</span>
                                    </div>
                                </div>
                            ))}

                            {projects.length === 0 && (
                                <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🏢</div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-1">Sin Proyectos</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">Esta empresa no tiene desarrollos inmobiliarios activos en este momento.</p>
                                    <button className="btn-outline text-sm">Crear Primer Proyecto</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
