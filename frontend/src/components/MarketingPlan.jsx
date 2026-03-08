import React from 'react';

export default function MarketingPlan({ projectId }) {
    const pillars = [
        { id: 1, title: 'Urbanismo', desc: 'Desarrollo de las vías y áreas comerciales', icon: '🏙️' },
        { id: 2, title: 'Crecimiento de Zonas', desc: 'Jamundí como foco de inversión local', icon: '📈' },
        { id: 3, title: 'Storytelling de Marca', desc: 'La visión de la Inmobiliaria Boutique', icon: '📖' },
        { id: 4, title: 'Credibilidad', desc: 'Videos del CEO y avance de obra', icon: '✅' },
    ];

    return (
        <div className="space-y-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-company mb-1">Plan de Marketing</h2>
                    <p className="text-gray-500 text-sm">Organiza las campañas y los pilares de contenido según tu ecosistema.</p>
                </div>
                <button className="btn-accent flex items-center gap-2">
                    <span>+</span> Nueva Campaña
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta Ads Campaign */}
                <div className="glass-card p-6 min-h-[300px] border-t-4 border-t-company">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-bold font-display text-brandDark">Campañas Meta Ads</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Activo</span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-brandDark">Fase 1: Reconocimiento</h4>
                                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">En marcha</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">3 conjuntos de anuncios, 4-5 anuncios por conjunto.</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '80%' }}></div></div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-brandDark">Fase 2: Tráfico Instagram</h4>
                                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Preparación</span>
                            </div>
                            <p className="text-sm text-gray-500">Dirigir tráfico al perfil para aumentar seguidores de calidad.</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-brandDark">Fase 3: Clientes Potenciales</h4>
                                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600">Planificado</span>
                            </div>
                            <p className="text-sm text-gray-500">Generación de leads (Inversionistas y Comerciantes).</p>
                        </div>
                    </div>
                </div>

                {/* Content Pillars */}
                <div className="glass-card p-6 min-h-[300px]">
                    <h3 className="text-lg font-bold font-display text-brandDark mb-6">Pilares de Contenido</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pillars.map(pillar => (
                            <div key={pillar.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover-lift cursor-pointer text-center flex flex-col items-center justify-center gap-2">
                                <span className="text-3xl mb-1">{pillar.icon}</span>
                                <h4 className="font-semibold text-sm text-brandDark">{pillar.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed px-2">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-company text-white rounded-xl text-center shadow-lg relative overflow-hidden group hover-lift cursor-pointer">
                        <div className="absolute inset-0 bg-accent transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-lg mb-1">Calendario de Contenidos</h4>
                            <p className="text-sm text-gray-300 group-hover:text-white transition-colors">Programar publicaciones de la semana</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
