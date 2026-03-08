import React, { createContext, useState, useEffect } from 'react';

// Estado Semilla Inicial Ajustado a la Jerarquía Pedida
const initialState = {
    companies: [
        {
            id: 'fortress',
            name: 'FORTRESS',
            branding: {
                nicho: 'Inversionistas de alto perfil',
                lineaComunicacion: 'Elegancia, exclusividad y rentabilidad',
                diferenciador: 'Diseño vanguardista y ubicaciones prime',
                problemasResuelve: 'Falta de opciones premium de inversión segura',
                ticketsInversion: 'Desde $500,000 USD',
                queVende: 'Desarrollos inmobiliarios de lujo',
                buyerPersonas: ['Buscador de estatus', 'Inversor extranjero', 'Familia consolidada', 'Retirado VIP']
            },
            projects: [
                {
                    id: 'p1-fortress',
                    name: 'The Grand Tower',
                    status: 'abiertos', // abiertos, en_curso, cerrados
                    informacion: 'Zona Financiera, 50 unidades residenciales de lujo.',
                    campanasMeta: {
                        reconocimiento: [
                            { id: 'ca1-rec', nombre: 'Conjunto de anuncio 1', formatos: ['Reel', 'Carrusel', 'Post', 'Story'] },
                            { id: 'ca2-rec', nombre: 'Conjunto de anuncio 2', formatos: [] },
                            { id: 'ca3-rec', nombre: 'Conjunto de anuncio 3', formatos: [] }
                        ],
                        trafico: [
                            { id: 'ca1-traf', nombre: 'Conjunto de anuncio 1', formatos: [] },
                            { id: 'ca2-traf', nombre: 'Conjunto de anuncio 2', formatos: [] },
                            { id: 'ca3-traf', nombre: 'Conjunto de anuncio 3', formatos: [] }
                        ],
                        clientesPotenciales: [
                            { id: 'ca1-lead', nombre: 'Conjunto de anuncio 1', formatos: [] },
                            { id: 'ca2-lead', nombre: 'Conjunto de anuncio 2', formatos: [] },
                            { id: 'ca3-lead', nombre: 'Conjunto de anuncio 3', formatos: [] }
                        ]
                    },
                    planner: 'Plan semestral P1',
                    estrategia: 'Captación directa en Instagram',
                    campanasActivas: 'Campaña fase 1 en circulación',
                    metricas: 'CPA: $15 USD',
                    crm: 'HubSpot Conectado'
                }
            ]
        },
        {
            id: 'creciendo',
            name: 'CRECIENDO', // The user requested "CRECIENDO" specifically
            branding: {
                nicho: 'Familias jóvenes y primeros compradores',
                lineaComunicacion: 'Confianza, crecimiento y comunidad',
                diferenciador: 'Acompañamiento integral',
                problemasResuelve: 'Miedo e ignorancia en el primer crédito hipotecario',
                ticketsInversion: 'Desde $50,000 USD',
                queVende: 'Vivienda de Interés Social y Media',
                buyerPersonas: ['Pareja joven', 'Padre soltero', 'Inversor novato', 'Profesional independiente']
            },
            projects: [
                {
                    id: 'p1-creciendo',
                    name: 'Parque de los Sueños',
                    status: 'en_curso',
                    informacion: 'Sur de la ciudad, 200 apartamentos VIS.',
                    campanasMeta: {
                        reconocimiento: [
                            { id: 'ca1-rec-c', nombre: 'Conjunto de anuncio 1', formatos: ['Reel', 'Carrusel', 'Post', 'Story'] }
                        ],
                        trafico: [
                            { id: 'ca1-traf-c', nombre: 'Conjunto de anuncio 1', formatos: [] }
                        ],
                        clientesPotenciales: [
                            { id: 'ca1-lead-c', nombre: 'Conjunto de anuncio 1', formatos: [] }
                        ]
                    },
                    planner: '',
                    estrategia: '',
                    campanasActivas: '',
                    metricas: '',
                    crm: ''
                }
            ]
        }
    ]
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Inicializar desde LocalStorage o usar el estado semilla
    const [data, setData] = useState(() => {
        const localData = localStorage.getItem('ecosistema_inmobiliario_data');
        return localData ? JSON.parse(localData) : initialState;
    });

    // Guardar en LocalStorage cada vez que cambie `data`
    useEffect(() => {
        localStorage.setItem('ecosistema_inmobiliario_data', JSON.stringify(data));
    }, [data]);

    // Update Company General Info (Branding)
    const updateCompany = (companyId, newCompanyData) => {
        setData(prevData => {
            const updatedCompanies = prevData.companies.map(c =>
                c.id === companyId ? { ...c, ...newCompanyData } : c
            );
            return { ...prevData, companies: updatedCompanies };
        });
    };

    // Update specific string arrays in branding (like buyerPersonas)
    const updateBrandingArray = (companyId, field, newArray) => {
        setData(prevData => {
            return {
                ...prevData,
                companies: prevData.companies.map(c => {
                    if (c.id === companyId) {
                        return {
                            ...c,
                            branding: {
                                ...c.branding,
                                [field]: newArray
                            }
                        }
                    }
                    return c;
                })
            }
        });
    }

    // Update Specific Project inside a Company
    const updateProject = (companyId, projectId, newProjectData) => {
        setData(prevData => {
            const updatedCompanies = prevData.companies.map(company => {
                if (company.id === companyId) {
                    const updatedProjects = company.projects.map(p =>
                        p.id === projectId ? { ...p, ...newProjectData } : p
                    );
                    return { ...company, projects: updatedProjects };
                }
                return company;
            });
            return { ...prevData, companies: updatedCompanies };
        });
    };

    return (
        <AppContext.Provider value={{ data, updateCompany, updateProject, updateBrandingArray }}>
            {children}
        </AppContext.Provider>
    );
};
