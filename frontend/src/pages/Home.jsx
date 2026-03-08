import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies } from '../api';

export default function Home() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCompanies() {
            try {
                const data = await getCompanies();
                setCompanies(data);
            } catch (error) {
                console.error("Error loading companies", error);
            } finally {
                setLoading(false);
            }
        }
        loadCompanies();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-brandLight text-company">Cargando Ecosistema...</div>;

    return (
        <div className="min-h-screen bg-brandLight flex flex-col items-center py-20 px-4 animate-fade-in font-sans">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-company mb-4 drop-shadow-sm">
                    Real Estate <span className="text-accent relative inline-block">Growth OS<span className="absolute -bottom-2 left-0 w-full h-1 bg-accent/30 rounded-full"></span></span>
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto text-lg">
                    Selecciona tu empresa constructora/inmobiliaria para gestionar sus proyectos activos, leads y campañas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {companies.map(company => (
                    <div
                        key={company._id}
                        onClick={() => navigate(`/companies/${company._id}/projects`, { state: { company } })}
                        className="group cursor-pointer bg-white rounded-3xl p-10 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-brandDark/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 w-full h-2`} style={{ backgroundColor: company.branding?.primaryColor || '#0f172a' }}></div>

                        <div
                            className="w-24 h-24 rounded-2xl mb-6 shadow-inner flex items-center justify-center text-3xl font-bold text-white transition-transform group-hover:scale-110 duration-300"
                            style={{ background: `linear-gradient(135deg, ${company.branding?.primaryColor || '#1e293b'}, ${company.branding?.secondaryColor || '#64748b'})` }}
                        >
                            {company.name.charAt(0)}
                        </div>

                        <h2 className="text-3xl font-display font-bold mb-3 text-brandDark group-hover:text-company transition-colors">{company.name}</h2>
                        <p className="text-gray-500">Accede al hub central para liderar métricas de Growth y Marketing.</p>

                        <button className="mt-8 px-8 py-3 rounded-full font-semibold text-sm tracking-wide bg-gray-50 text-brandDark group-hover:bg-brandDark group-hover:text-white transition-colors">
                            Ingresar al Hub →
                        </button>
                    </div>
                ))}

                {companies.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-10">
                        No hay empresas registradas. Verifica la conexión a MongoDB.
                    </div>
                )}
            </div>
        </div>
    );
}
