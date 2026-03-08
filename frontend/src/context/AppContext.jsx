import React, { createContext, useState, useEffect } from 'react';

const initialState = {
    companies: [
        {
            id: 'fortress',
            name: 'FORTRESS',
            branding: {
                nicho: 'Inversionistas patrimoniales, empresarios que buscan diversificación, profesionales con excedentes de capital e inversionistas internacionales.',
                lineaComunicacion: 'Autoridad y Confianza, Inversión Inteligente, "Tu dinero trabajando seguro".',
                diferenciador: 'Seguridad en la inversión, patrimonio blindado, crecimiento garantizado y visión de largo plazo.',
                problemasResuelve: 'Miedo a la inflación o perder poder adquisitivo. Riesgo de gestionar inmuebles directamente.',
                ticketsInversion: 'Altos (Inversión patrimonial fuerte)',
                queVende: 'Desarrollos orientados a Inversiones Patrimoniales y Protección de Capital',
                buyerPersonas: [
                    'Empresario Diversificador (42-58 años, ingresos $25M-$80M COP)',
                    'Inversionista Patrimonial (Enfocado en legado y seguridad familiar)'
                ]
            },
            projects: [
                {
                    id: 'p1-fortress',
                    name: 'Fortress I',
                    status: 'abiertos',
                    informacion: 'Proyecto de inversión patrimonial de la línea Fortress.',
                    campanasMeta: {
                        reconocimiento: [
                            { id: 'ca1-rec', nombre: 'Branding y Posicionamiento', formatos: ['Reel', 'Carrusel', 'Post', 'Story'] }
                        ],
                        trafico: [
                            { id: 'ca1-traf', nombre: 'Redirección IG/Landing', formatos: ['Videos del CEO', 'Storytelling de marca'] }
                        ],
                        clientesPotenciales: [
                            { id: 'ca1-lead', nombre: 'Conversión Directa (Leads)', formatos: ['Testimonios', 'Credibilidad técnica'] }
                        ]
                    },
                    planner: 'Planeación enfocada a posicionamiento de autoridad.',
                    estrategia: 'Fase 1: Reconocimiento (Top of Funnel) -> Fase 2: Tráfico (Middle of Funnel) -> Fase 3: Leads (Bottom of Funnel)',
                    campanasActivas: 'A la espera de activación de parrilla comercial.',
                    metricas: 'Sin data actual',
                    crm: 'Desconectado'
                },
                {
                    id: 'p2-fortress',
                    name: 'Fortress II',
                    status: 'abiertos',
                    informacion: 'Segunda etapa del modelo de protección patrimonial.',
                    campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] },
                    planner: '', estrategia: '', campanasActivas: '', metricas: '', crm: ''
                },
                {
                    id: 'p3-fortress',
                    name: 'Fortress III',
                    status: 'en_curso',
                    informacion: 'Tercera etapa en estructuración formal.',
                    campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] },
                    planner: '', estrategia: '', campanasActivas: '', metricas: '', crm: ''
                }
            ]
        },
        {
            id: 'creciendo',
            name: 'CRECIENDO',
            branding: {
                nicho: 'Inversionistas de locales, comerciantes y comunidad residente.',
                lineaComunicacion: 'Crecimiento, "Ciudad Viva", Nuevo eje comercial, La ventaja de entrar temprano, Sentido de Comunidad.',
                diferenciador: 'Primer centro comercial cerrado de la zona. Conectado directamente a un parque lineal. Sin competencia directa. Mercado potencial cautivo.',
                problemasResuelve: 'Falta de comercio estructurado en Jamundí Sur debido a explosión de crecimiento residencial.',
                ticketsInversion: 'Desde $200M COP (Inversionistas) / Franquicias de $12M-$40M COP/mes',
                queVende: 'Desarrollo Comercial (Centro comercial del sur de Jamundí)',
                buyerPersonas: [
                    'Inversionista de Locales (35-60 años, busca renta pasiva y valorización)',
                    'Comerciante Expansivo (Dueños de marcas/franquicias que buscan ubicaciones estratégicas)'
                ]
            },
            projects: [
                {
                    id: 'p1-creciendo',
                    name: 'Boulevard El Parque',
                    status: 'abiertos',
                    informacion: 'Centro comercial del sur de Jamundí conectado a parque lineal. Sin competencia en el entorno.',
                    campanasMeta: {
                        reconocimiento: [
                            { id: 'ca1-rec-c', nombre: 'Awareness del Boulevard', formatos: ['Reel "Ciudad Viva"', 'Carrusel Proyecto', 'Post', 'Story'] }
                        ],
                        trafico: [
                            { id: 'ca1-traf-c', nombre: 'Redirección a Comunidad', formatos: ['Avances de Obra', 'Lifestyle del sector'] }
                        ],
                        clientesPotenciales: [
                            { id: 'ca1-lead-c', nombre: 'Venta de Locales', formatos: ['Valorización m2', 'Formulario nativo'] }
                        ]
                    },
                    planner: 'Elaborar línea gráfica "Ciudad Viva".',
                    estrategia: 'Fase 1: Reconocimiento (Top of Funnel) -> Fase 2: Tráfico (Middle of Funnel) -> Fase 3: Leads (Bottom of Funnel)',
                    campanasActivas: 'Estructurando pauta publicitaria.',
                    metricas: 'Sin data actual',
                    crm: 'Desconectado'
                }
            ]
        }
    ]
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Inicializar desde LocalStorage o usar el estado semilla
    const [data, setData] = useState(() => {
        // En esta actualización forzamos cargar la SIEMPRE data nueva porque el JSON semilla acaba de mutar
        // Para que en el equipo del usuario resplandezca la información de Miro de inmediato, sobreescribimos.
        return initialState;
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
