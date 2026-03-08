import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CompanyDashboard from './pages/CompanyDashboard';
import ProjectDashboard from './pages/ProjectDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Nivel 1: Selección de Empresa */}
        <Route path="/" element={<Home />} />

        {/* Nivel 2: Dashboard de Empresa (Marca y Lista de Proyectos) */}
        <Route path="/:companyId" element={<CompanyDashboard />} />

        {/* Nivel 3: El Hub completo para operar sobre UN proyecto */}
        <Route path="/:companyId/projects/:projectId/*" element={<ProjectDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
