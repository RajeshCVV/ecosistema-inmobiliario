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
                ],
                primaryColor: '#000000'
            },
            projects: [
                {
                    id: 'p1-fortress',
                    name: 'Fortress I',
                    status: 'abiertos',
                    informacion: 'Proyecto de inversión patrimonial de la línea Fortress.',
                    campanasMeta: {
                        reconocimiento: [
                            { id: 'ca1-rec', nombre: 'Branding y Posicionamiento', formatos: ['Reel', 'Carrusel', 'Post', 'Story'], status: 'activa' }
                        ],
                        trafico: [
                            { id: 'ca1-traf', nombre: 'Redirección IG/Landing', formatos: ['Videos del CEO', 'Storytelling de marca'], status: 'pausada' }
                        ],
                        clientesPotenciales: [
                            { id: 'ca1-lead', nombre: 'Conversión Directa (Leads)', formatos: ['Testimonios', 'Credibilidad técnica'], status: 'activa' }
                        ]
                    },
                    planner: 'Planeación enfocada a posicionamiento de autoridad.',
                    estrategia: 'Fase 1: Reconocimiento (Top of Funnel) -> Fase 2: Tráfico (Middle of Funnel) -> Fase 3: Leads (Bottom of Funnel)'
                },
                {
                    id: 'p2-fortress',
                    name: 'Fortress II',
                    status: 'abiertos',
                    informacion: 'Segunda etapa del modelo de protección patrimonial.',
                    campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] },
                    planner: '', estrategia: ''
                },
                {
                    id: 'p3-fortress',
                    name: 'Fortress III',
                    status: 'en_curso',
                    informacion: 'Tercera etapa en estructuración formal.',
                    campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] },
                    planner: '', estrategia: ''
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
                ],
                primaryColor: '#e11d48'
            },
            projects: [
                {
                    id: 'p1-creciendo',
                    name: 'Boulevard El Parque',
                    status: 'abiertos',
                    informacion: 'Centro comercial del sur de Jamundí conectado a parque lineal. Sin competencia en el entorno.',
                    campanasMeta: {
                        reconocimiento: [
                            { id: 'ca1-rec-c', nombre: 'Awareness del Boulevard', formatos: ['Reel "Ciudad Viva"', 'Carrusel Proyecto', 'Post', 'Story'], status: 'activa' }
                        ],
                        trafico: [
                            { id: 'ca1-traf-c', nombre: 'Redirección a Comunidad', formatos: ['Avances de Obra', 'Lifestyle del sector'], status: 'activa' }
                        ],
                        clientesPotenciales: [
                            { id: 'ca1-lead-c', nombre: 'Venta de Locales', formatos: ['Valorización m2', 'Formulario nativo'], status: 'pausada' }
                        ]
                    },
                    planner: 'Elaborar línea gráfica "Ciudad Viva".',
                    estrategia: 'Fase 1: Reconocimiento (Top of Funnel) -> Fase 2: Tráfico (Middle of Funnel) -> Fase 3: Leads (Bottom of Funnel)'
                }
            ]
        }
    ],
    leads: [
        { id: 'lead-1', projectId: 'p1-creciendo', name: 'Carlos Rendón', phone: '+57 300 123 4567', email: 'carlos@ejemplo.com', stage: 'nuevo', notes: 'Interesado en local comercial esquinero de 40m2.', date: '2023-10-01' },
        { id: 'lead-2', projectId: 'p1-creciendo', name: 'Laura Gómez', phone: '+57 310 987 6543', email: 'laura@ejemplo.com', stage: 'contactado', notes: 'Desea poner una sucursal de su franquicia.', date: '2023-10-02' },
        { id: 'lead-3', projectId: 'p1-fortress', name: 'Dr. Arturo Vélez', phone: '+57 315 444 5555', email: 'arturo@ejemplo.com', stage: 'cita', notes: 'Busca protección patrimonial, inversión de $500M COP iniciales.', date: '2023-10-03' }
    ]
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Inicializar desde LocalStorage o usar el estado semilla (Para asimilar BD V2 y V3)
    const [data, setData] = useState(() => {
        const localData = localStorage.getItem('v2_growth_os_data');
        return localData ? JSON.parse(localData) : initialState;
    });

    // Nuevo Estado Global para el Dashboard Layout V3 (Qué empresa se está visualizando ahora)
    const [activeCompanyId, setActiveCompanyId] = useState(() => {
        const localData = localStorage.getItem('v2_growth_os_data');
        // Por defecto, carga Creciendo (o la primera empresa si no está)
        if (localData) {
            const parsed = JSON.parse(localData);
            return parsed.companies.find(c => c.id === 'creciendo')?.id || parsed.companies[0]?.id;
        }
        return 'creciendo';
    });

    useEffect(() => {
        localStorage.setItem('v2_growth_os_data', JSON.stringify(data));
    }, [data]);

    // Función para intercambiar el entorno del Dashboard desde el Menú Lateral
    const switchCompany = (companyId) => {
        setActiveCompanyId(companyId);
    };

    // ==========================================
    // CRUD: COMPANIES
    // ==========================================
    const addCompany = (company) => {
        setData(prev => ({ ...prev, companies: [...prev.companies, company] }));
    };

    const updateCompany = (companyId, newCompanyData) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => c.id === companyId ? { ...c, ...newCompanyData } : c)
        }));
    };

    const deleteCompany = (companyId) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.filter(c => c.id !== companyId)
        }));
    };

    const updateBrandingArray = (companyId, field, newArray) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    return { ...c, branding: { ...c.branding, [field]: newArray } };
                }
                return c;
            })
        }));
    };

    // ==========================================
    // CRUD: PROJECTS
    // ==========================================
    const addProject = (companyId, project) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    return { ...c, projects: [...c.projects, project] };
                }
                return c;
            })
        }));
    };

    const updateProject = (companyId, projectId, newProjectData) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    const updatedProjects = c.projects.map(p =>
                        p.id === projectId ? { ...p, ...newProjectData } : p
                    );
                    return { ...c, projects: updatedProjects };
                }
                return c;
            })
        }));
    };

    const deleteProject = (companyId, projectId) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    return { ...c, projects: c.projects.filter(p => p.id !== projectId) };
                }
                return c;
            })
        }));
    };

    // ==========================================
    // CRUD: META ADS
    // ==========================================
    const addAdSet = (companyId, projectId, funnelStage, adSet) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    const upProj = c.projects.map(p => {
                        if (p.id === projectId) {
                            return {
                                ...p,
                                campanasMeta: {
                                    ...p.campanasMeta,
                                    [funnelStage]: [...p.campanasMeta[funnelStage], adSet]
                                }
                            };
                        }
                        return p;
                    });
                    return { ...c, projects: upProj };
                }
                return c;
            })
        }));
    };

    const toggleAdSetStatus = (companyId, projectId, funnelStage, adSetId) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    const upProj = c.projects.map(p => {
                        if (p.id === projectId) {
                            const updatedAdSets = p.campanasMeta[funnelStage].map(ad =>
                                ad.id === adSetId ? { ...ad, status: ad.status === 'activa' ? 'pausada' : 'activa' } : ad
                            );
                            return {
                                ...p,
                                campanasMeta: {
                                    ...p.campanasMeta,
                                    [funnelStage]: updatedAdSets
                                }
                            };
                        }
                        return p;
                    });
                    return { ...c, projects: upProj };
                }
                return c;
            })
        }));
    };

    const deleteAdSet = (companyId, projectId, funnelStage, adSetId) => {
        setData(prev => ({
            ...prev,
            companies: prev.companies.map(c => {
                if (c.id === companyId) {
                    const upProj = c.projects.map(p => {
                        if (p.id === projectId) {
                            return {
                                ...p,
                                campanasMeta: {
                                    ...p.campanasMeta,
                                    [funnelStage]: p.campanasMeta[funnelStage].filter(ad => ad.id !== adSetId)
                                }
                            };
                        }
                        return p;
                    });
                    return { ...c, projects: upProj };
                }
                return c;
            })
        }));
    };

    // ==========================================
    // CRUD: LEADS (CRM)
    // ==========================================
    const addLead = (lead) => {
        setData(prev => ({ ...prev, leads: [...prev.leads, lead] }));
    };

    const updateLead = (leadId, newLeadData) => {
        setData(prev => ({
            ...prev,
            leads: prev.leads.map(l => l.id === leadId ? { ...l, ...newLeadData } : l)
        }));
    };

    const deleteLead = (leadId) => {
        setData(prev => ({
            ...prev,
            leads: prev.leads.filter(l => l.id !== leadId)
        }));
    };

    const moveLeadStage = (leadId, newStage) => {
        setData(prev => ({
            ...prev,
            leads: prev.leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l)
        }));
    };

    return (
        <AppContext.Provider value={{
            data,
            activeCompanyId, switchCompany, // Nuevos Exportados V3
            addCompany, updateCompany, deleteCompany, updateBrandingArray,
            addProject, updateProject, deleteProject,
            addAdSet, toggleAdSetStatus, deleteAdSet,
            addLead, updateLead, deleteLead, moveLeadStage
        }}>
            {children}
        </AppContext.Provider>
    );
};
