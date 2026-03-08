import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Home = () => {
    const { data } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                        Real Estate <span className="text-[#d4af37]">Growth OS</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Selecciona tu ecosistema inmobiliario para gestionar marcas, proyectos y campañas Meta.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {data.companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => navigate(`/${company.id}`)}
                            className="group cursor-pointer rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white flex flex-col items-center justify-center p-12 relative"
                            style={{
                                borderTop: `6px solid ${company.branding?.primaryColor || '#000'}`,
                            }}
                        >
                            {/* Decoración de fondo suave */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                style={{ backgroundColor: company.branding?.primaryColor || '#000' }}
                            ></div>

                            <h2
                                className="text-4xl font-bold mb-4 z-10"
                                style={{ color: company.branding?.primaryColor || '#000' }}
                            >
                                {company.name}
                            </h2>
                            <p className="text-gray-500 text-center z-10 max-w-sm">
                                {company.branding?.queVende}
                            </p>
                            <div className="mt-8 z-10">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 group-hover:bg-gray-200 transition-colors">
                                    Ingresar al Ecosistema →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
