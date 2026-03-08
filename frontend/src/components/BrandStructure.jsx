import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const BrandStructure = () => {
    const { data, activeCompanyId, updateCompany } = useContext(AppContext);

    const company = data.companies.find(c => c.id === activeCompanyId);
    if (!company) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [brandForm, setBrandForm] = useState(company.branding);

    const handleSave = () => {
        let parsedPersonas = brandForm.buyerPersonas;
        if (typeof brandForm.buyerPersonas === 'string') {
            parsedPersonas = brandForm.buyerPersonas.split('\n').filter(line => line.trim() !== '');
        }

        updateCompany(company.id, {
            branding: { ...brandForm, buyerPersonas: parsedPersonas }
        });
        setIsEditing(false);
    };

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Estructura de Marca Escalar</h2>
                    <p className="text-gray-500 mt-2">Definición táctica del posicionamiento, nicho y comunicación comercial.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        <span>✍️</span> <span>Editar Estrategia</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full opacity-70" style={{ backgroundColor: company.branding.primaryColor }}></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pl-4">

                    {/* Nicho / Mercado */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="mr-2">🎯</span> Nicho
                        </h4>
                        {!isEditing ? <p className="text-gray-800 text-lg leading-relaxed">{company.branding.nicho}</p> :
                            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 h-28" value={brandForm.nicho} onChange={e => setBrandForm({ ...brandForm, nicho: e.target.value })} />
                        }
                    </div>

                    {/* Venta */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="mr-2">📦</span> Qué Vende
                        </h4>
                        {!isEditing ? <p className="text-gray-800 text-lg leading-relaxed">{company.branding.queVende}</p> :
                            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 h-28" value={brandForm.queVende} onChange={e => setBrandForm({ ...brandForm, queVende: e.target.value })} />
                        }
                    </div>

                    {/* Diferenciador */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="mr-2">⭐</span> Diferenciador
                        </h4>
                        {!isEditing ? <p className="text-gray-800 text-lg leading-relaxed">{company.branding.diferenciador}</p> :
                            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 h-28" value={brandForm.diferenciador} onChange={e => setBrandForm({ ...brandForm, diferenciador: e.target.value })} />
                        }
                    </div>

                    {/* Problemas que resuelve */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="mr-2">🛡️</span> Problemas que Resuelve
                        </h4>
                        {!isEditing ? <p className="text-gray-800 text-lg leading-relaxed">{company.branding.problemasResuelve}</p> :
                            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 h-28" value={brandForm.problemasResuelve} onChange={e => setBrandForm({ ...brandForm, problemasResuelve: e.target.value })} />
                        }
                    </div>

                    {/* Tickets */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="mr-2">💰</span> Tickets Inversión
                        </h4>
                        {!isEditing ? <p className="text-gray-800 text-lg leading-relaxed">{company.branding.ticketsInversion}</p> :
                            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500" value={brandForm.ticketsInversion} onChange={e => setBrandForm({ ...brandForm, ticketsInversion: e.target.value })} />
                        }
                    </div>

                    {/* Comunicación */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="mr-2">📣</span> Línea Comunicación
                        </h4>
                        {!isEditing ? <p className="text-gray-800 text-lg leading-relaxed">{company.branding.lineaComunicacion}</p> :
                            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 h-28" value={brandForm.lineaComunicacion} onChange={e => setBrandForm({ ...brandForm, lineaComunicacion: e.target.value })} />
                        }
                    </div>
                </div>

                {/* Buyer Personas Section */}
                <div className="mt-12 pl-4 border-t border-gray-100 pt-8">
                    <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                        <span className="mr-2">👥</span> Arquetipos Buyer Personas (Identificados)
                    </h4>

                    {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {company.branding.buyerPersonas.map((bp, i) => (
                                <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4 shrink-0">
                                        {i + 1}
                                    </div>
                                    <p className="text-gray-800 font-medium leading-relaxed">{bp}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs text-blue-600 mb-2 font-bold">Escribe cada Buyer Persona en una nueva línea:</p>
                            <textarea
                                className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 outline-none focus:border-blue-500 h-40 text-gray-800 font-medium leading-relaxed"
                                value={typeof brandForm.buyerPersonas === 'string' ? brandForm.buyerPersonas : brandForm.buyerPersonas.join('\n')}
                                onChange={e => setBrandForm({ ...brandForm, buyerPersonas: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Save Block */}
                {isEditing && (
                    <div className="mt-8 pl-4 flex gap-4 border-t border-gray-100 pt-6">
                        <button onClick={handleSave} className="px-8 py-3 bg-blue-600 border border-transparent text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group" style={{ backgroundColor: company.branding.primaryColor || '#2563EB' }}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                            <span className="relative drop-shadow-md">Guardar Cambios</span>
                        </button>
                        <button onClick={() => { setIsEditing(false); setBrandForm(company.branding); }} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandStructure;
