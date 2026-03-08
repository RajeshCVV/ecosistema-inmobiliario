import axios from 'axios';

// Apuntando el frontend al servidor backend alojado en Render
const API_URL = 'https://ecosistema-inmobiliario.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
});

export const getCompanies = async () => {
    const response = await api.get('/companies');
    return response.data;
};

export const getProjectsByCompany = async (companyId) => {
    const response = await api.get(`/companies/${companyId}/projects`);
    return response.data;
};

export const getProjectById = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export const getLeadsByProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/leads`);
    return response.data;
};

export const createLead = async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
};

export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

export const addMilestone = async (projectId, milestoneData) => {
    const response = await api.post(`/projects/${projectId}/milestones`, milestoneData);
    return response.data;
};

export default api;
