import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CompanyProjects from './pages/CompanyProjects';
import ProjectDashboard from './pages/ProjectDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Vista Nivel 1: Selección de Empresa (Crescendo o Fortress) */}
        <Route path="/" element={<Home />} />

        {/* Vista Nivel 2: Lista de Proyectos Activos de la Empresa Seleccionada */}
        <Route path="/companies/:companyId/projects" element={<CompanyProjects />} />

        {/* Vista Nivel 3: El Hub completo para operar Growth, CRM, Hitos, etc sobre UN proyecto */}
        <Route path="/projects/:projectId/dashboard/*" element={<ProjectDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
