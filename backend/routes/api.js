const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Rutas de Compañías
router.get('/companies', apiController.getCompanies);

// Rutas de Proyectos
router.get('/projects/:projectId', apiController.getProjectById);
router.post('/projects', apiController.createProject); // Mantengo directo por simplicidad si se envía el companyId en el body
router.post('/projects/:projectId/milestones', apiController.addMilestone);

// Rutas de Leads por Compañía o Proyecto
router.get('/companies/:companyId/leads', apiController.getLeadsByCompany);
router.get('/projects/:projectId/leads', apiController.getLeadsByProject);
router.post('/leads', apiController.createLead); // Directo enviando companyId/projectId en el body

module.exports = router;
