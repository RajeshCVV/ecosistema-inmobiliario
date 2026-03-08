import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Home = () => {
    const { data, addCompany, deleteCompany } = useContext(AppContext);
    const navigate = useNavigate();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        primaryColor: '#3b82f6',
        nicho: ''
    });

    const handleCreateCompany = (e) => {
        e.preventDefault();
        if (!newCompany.name.trim()) return;

        const newId = newCompany.name.toLowerCase().replace(/\s+/g, '-');

        const companyPayload = {
            id: newId,
            name: newCompany.name.toUpperCase(),
            branding: {
                nicho: newCompany.nicho,
                lineaComunicacion: '',
                diferenciador: '',
                problemasResuelve: '',
                ticketsInversion: '',
                queVende: '',
                buyerPersonas: [],
                primaryColor: newCompany.primaryColor
            },
            projects: []
        };

        addCompany(companyPayload);
        setIsModalOpen(false);
        setNewCompany({ name: '', primaryColor: '#3b82f6', nicho: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                        Real Estate <span className="text-[#d4af37]">Growth OS</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                        Centro de Control Multi-Tenant. Añade o selecciona el ecosistema inmobiliario a gestionar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {/* Tarjetas Existentes */}
                    {data.companies.map((company) => (
                        <div
                            key={company.id}
                            className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white flex flex-col items-center justify-center p-12 cursor-pointer"
                            style={{ borderTop: `6px solid ${company.branding?.primaryColor || '#000'}` }}
                            onClick={() => navigate(`/${company.id}`)}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                style={{ backgroundColor: company.branding?.primaryColor || '#000' }}
                            ></div>

                            <button
                                onClick={(e) => { e.stopPropagation(); deleteCompany(company.id); }}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Eliminar Empresa"
                            >
                                ✕
                            </button>

                            <h2
                                className="text-4xl font-bold mb-4 z-10 text-center"
                                style={{ color: company.branding?.primaryColor || '#000' }}
                            >
                                {company.name}
                            </h2>
                            <p className="text-gray-500 text-center z-10 text-sm line-clamp-3">
                                {company.branding?.nicho || 'Configura la estructura de marca en el interior.'}
                            </p>
                            <div className="mt-8 z-10">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 group-hover:bg-gray-200 transition-colors">
                                    Ingresar al Panel →
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Tarjeta de Creación */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="group cursor-pointer rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-12 text-gray-400 hover:text-blue-600 hover:border-blue-500"
                    >
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                            <span className="text-3xl">+</span>
                        </div>
                        <h2 className="text-xl font-bold">Añadir Nueva Empresa</h2>
                        <p className="text-center mt-2 text-sm opacity-80">Crear un nuevo ecosistema de proyectos y CRM aislado.</p>
                    </div>
                </div>
            </div>

            {/* Modal Premium de Creación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Nuevo Ecosistema</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleCreateCompany} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Empresa Comercializadora</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 uppercase"
                                    placeholder="EJ: INMOBILIARIA XYZ"
                                    value={newCompany.name}
                                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nicho Principal (Breve)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50"
                                    placeholder="Ej: Familias jóvenes estrato 3 y 4"
                                    value={newCompany.nicho}
                                    onChange={(e) => setNewCompany({ ...newCompany, nicho: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Color Corporativo (Branding)</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="color"
                                        className="h-12 w-20 rounded-lg cursor-pointer border-0 p-0"
                                        value={newCompany.primaryColor}
                                        onChange={(e) => setNewCompany({ ...newCompany, primaryColor: e.target.value })}
                                    />
                                    <span className="text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">{newCompany.primaryColor}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">
                                    Crear Ecosistema
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
