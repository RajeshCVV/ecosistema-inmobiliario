const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Rutas de Leads
router.get('/leads', apiController.getLeads);
router.post('/leads', apiController.createLead);

// Rutas de Proyectos
router.get('/projects', apiController.getProjects);
router.post('/projects', apiController.createProject);
router.post('/projects/:projectId/milestones', apiController.addMilestone);

module.exports = router;
