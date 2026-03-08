import React, { createContext, useState, useEffect } from 'react';

// URL Dinámica (Vite proxy o relativa en Vercel)
const API_URL = '/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [data, setData] = useState({ companies: [], leads: [], content: [] });
    const [loading, setLoading] = useState(true);
    const [activeCompanyId, setActiveCompanyId] = useState(null);

    // Función auxiliar para parseo seguro de JSON (previene caídas por Vercel SSO u otros HTML de error)
    const fetchJsonSafe = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) return { data: [] };

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return { data: [] }; // Si Vercel devuelve un portal HTML (SSO), evitamos el 'Unexpected token <'
        } catch (error) {
            console.warn(`Error de red al consultar ${url}:`, error);
            return { data: [] };
        }
    };

    // ==========================================
    // 1. CARGA INICIAL DESDE MONGODB
    // ==========================================
    const loadDatabase = async () => {
        setLoading(true);
        try {
            const [compRes, projRes, adsRes, leadsRes, plannerRes] = await Promise.all([
                fetchJsonSafe(`${API_URL}/companies`),
                fetchJsonSafe(`${API_URL}/projects`),
                fetchJsonSafe(`${API_URL}/meta-ads`),
                fetchJsonSafe(`${API_URL}/crm`),
                fetchJsonSafe(`${API_URL}/planner`)
            ]);

            const dbCompanies = compRes.data || [];
            const dbProjects = projRes.data || [];
            const dbCampaigns = adsRes.data || [];
            const dbLeads = leadsRes.data || [];
            const dbPlanner = plannerRes.data || [];

            // Ensamblar la Jerarquía Relacional para consumir fácilmente en UI (Tree Assembly)
            const assembledCompanies = dbCompanies.map(company => {

                // Mapear el "branding" que viene como "brandIdentity" en MongoDB
                const mappedBranding = company.brandIdentity ? {
                    ...company.brandIdentity,
                    primaryColor: company.primaryColor
                } : {};

                // Proyectos de la empresa
                let companyProjects = dbProjects.filter(p => p.companyId === company._id);
                companyProjects = companyProjects.map(project => {
                    // Campañas del proyecto
                    const projectCampaigns = dbCampaigns.filter(c => c.projectId === project._id);

                    // Ordenar MetaAds en la estructura legacy de 3 niveles V3
                    const campanasMetaTree = { reconocimiento: [], trafico: [], clientesPotenciales: [], fidelizacion: [] };
                    projectCampaigns.forEach(camp => {
                        const targetLvl = camp.objetivo === 'atracción' ? 'reconocimiento' :
                            camp.objetivo === 'interacción' ? 'trafico' :
                                camp.objetivo === 'conversión' ? 'clientesPotenciales' : 'fidelizacion';

                        if (campanasMetaTree[targetLvl]) {
                            // En V3 asumiamos "AdSets" dentro del nivel, inyectamos la campaña global ahí por transición
                            campanasMetaTree[targetLvl] = campanasMetaTree[targetLvl].concat(
                                camp.adSets.map(set => ({
                                    ...set,
                                    campaignId: camp._id, // para saber a quién pertenece al actualizar
                                    formatos: set.anuncios.map(a => a.formato || a.tipoContenido)
                                }))
                            );
                        }
                    });

                    return {
                        id: project._id,
                        name: project.nombre,
                        status: project.estado,
                        informacion: project.objetivo,
                        ticket: project.ticket,
                        campanasMeta: campanasMetaTree
                    };
                });

                return {
                    id: company._id,
                    name: company.name,
                    branding: mappedBranding,
                    buyerPersonas: company.buyerPersonas.map(bp => bp.nombre + (bp.ocupacion ? ` - ${bp.ocupacion}` : '')),
                    projects: companyProjects
                };
            });

            const assembledLeads = dbLeads.map(l => ({
                id: l._id,
                projectId: l.projectId,
                companyId: l.companyId,
                name: l.nombre,
                phone: l.telefono,
                email: l.email,
                stage: l.etapa,
                notes: l.notas,
                date: l.createdAt
            }));

            setData({ companies: assembledCompanies, leads: assembledLeads, content: dbPlanner });

            if (assembledCompanies.length > 0 && !activeCompanyId) {
                setActiveCompanyId(assembledCompanies[0].id);
            }

        } catch (error) {
            console.error("Fallo al conectar con MongoDB:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDatabase();
    }, []);

    const switchCompany = (companyId) => {
        setActiveCompanyId(companyId);
    };

    // ==========================================
    // CRUD: COMPANIES (MONGODB)
    // ==========================================
    const addCompany = async (companyInput) => {
        try {
            const reqData = {
                name: companyInput.name,
                primaryColor: companyInput.branding?.primaryColor || '#000',
                brandIdentity: { nicho: companyInput.branding?.nicho || '' }
            };
            await fetch(`${API_URL}/companies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqData)
            });
            await loadDatabase(); // Refresh
        } catch (e) { }
    };

    const updateCompany = async (companyId, newCompanyData) => {
        try {
            let updatePayload = {};
            if (newCompanyData.branding) {
                updatePayload.brandIdentity = newCompanyData.branding;
                if (newCompanyData.branding.buyerPersonas) {
                    updatePayload.buyerPersonas = newCompanyData.branding.buyerPersonas.map(bp => ({ nombre: bp }));
                }
            }
            await fetch(`${API_URL}/companies?id=${companyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });
            await loadDatabase();
        } catch (e) { }
    };

    const deleteCompany = (id) => { }; // Por implementar en V4

    // ==========================================
    // CRUD: PROJECTS (MONGODB)
    // ==========================================
    const addProject = async (companyId, project) => {
        try {
            const reqData = {
                companyId: companyId,
                nombre: project.name,
                estado: project.status,
                objetivo: project.informacion
            };
            await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqData)
            });
            await loadDatabase();
        } catch (e) { }
    };

    const updateProject = (companyId, projectId, newProjectData) => { };
    const deleteProject = (companyId, projectId) => { };

    // ==========================================
    // CRUD: ADS & CRM (MONGODB)
    // ==========================================
    const addAdSet = async (companyId, projectId, funnelStage, adSetInput) => {
        // En V4 un AdSet es parte de un MetaCampaign. Si no hay campaña para este funnel, se crea.
        // Simplificado: llamamos al endpoint
        try {
            const objMap = {
                reconocimiento: 'atracción',
                trafico: 'interacción',
                clientesPotenciales: 'conversión'
            };
            const reqData = {
                projectId,
                nombre: `Campaña de ${objMap[funnelStage] || 'General'}`,
                objetivo: objMap[funnelStage],
                adSets: [{
                    nombre: adSetInput.nombre,
                    status: adSetInput.status,
                    anuncios: adSetInput.formatos ? adSetInput.formatos.map(f => ({ nombre: 'Ad1', formato: f })) : []
                }]
            };
            await fetch(`${API_URL}/meta-ads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqData)
            });
            await loadDatabase();
        } catch (e) { }
    };

    const toggleAdSetStatus = (companyId, projectId, funnelStage, adSetId) => { }; // TODO API
    const deleteAdSet = (companyId, projectId, funnelStage, adSetId) => { }; // TODO API

    const addLead = async (lead) => {
        try {
            const company = data.companies.find(c => c.projects.some(p => p.id === lead.projectId));
            const realCompanyId = company ? company.id : activeCompanyId;

            const reqData = {
                projectId: lead.projectId,
                companyId: realCompanyId,
                nombre: lead.name,
                telefono: lead.phone,
                email: lead.email,
                notas: lead.notes,
                etapa: lead.stage
            };
            await fetch(`${API_URL}/crm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqData)
            });
            await loadDatabase();
        } catch (e) { }
    };

    const updateLead = (leadId, newData) => { };
    const deleteLead = (leadId) => { };

    const moveLeadStage = async (leadId, newStage) => {
        try {
            // Optimistic UI Update Fake (por fluidez)
            setData(prev => ({
                ...prev,
                leads: prev.leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l)
            }));

            await fetch(`${API_URL}/crm?id=${leadId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ etapa: newStage })
            });
            // no forzar reload para mantener drop rapido
        } catch (e) { }
    };

    return (
        <AppContext.Provider value={{
            data,
            loading, // Exported to show a spinner in AppLayout
            activeCompanyId, switchCompany,
            addCompany, updateCompany, deleteCompany,
            addProject, updateProject, deleteProject,
            addAdSet, toggleAdSetStatus, deleteAdSet,
            addLead, updateLead, deleteLead, moveLeadStage
        }}>
            {children}
        </AppContext.Provider>
    );
};
