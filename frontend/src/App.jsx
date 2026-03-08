import React, { useContext, useState } from 'react';
import { AppProvider, AppContext } from './context/AppContext';

// Vistas Modulares
import DashboardOverview from './components/DashboardOverview';
import BrandStructure from './components/BrandStructure';
import ProjectsView from './components/ProjectsView';
import MetaAdsManager from './components/MetaAdsManager';
import CRMBoard from './components/CRMBoard';

const AppLayout = () => {
  const { data, activeCompanyId, switchCompany } = useContext(AppContext);

  // Estado de Pestaña Local
  const [activeSection, setActiveSection] = useState('inicio');

  const company = data.companies.find(c => c.id === activeCompanyId) || data.companies[0];
  const branding = company.branding;

  const sections = [
    { id: 'inicio', label: 'Dashboard', icon: '🏠' },
    { id: 'marca', label: 'Estruct. de Marca', icon: '💎' },
    { id: 'proyectos', label: 'Proyectos', icon: '🏗️' },
    { id: 'ads', label: 'Ads Manager', icon: '💻' },
    { id: 'crm', label: 'CRM Ventas', icon: '👥' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR CLÁSICO V1 */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20 shrink-0">
        {/* Selector Multi-Tenant */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Ecosistema Activo</h2>
          <select
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer transition-colors"
            value={activeCompanyId}
            onChange={(e) => switchCompany(e.target.value)}
            style={{ borderLeft: `4px solid ${branding.primaryColor}` }}
          >
            {data.companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Módulos</p>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${activeSection === section.id
                ? 'bg-gray-800 text-white shadow-inner'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
            >
              <span className={`text-xl ${activeSection === section.id ? 'opacity-100' : 'opacity-70'}`}>
                {section.icon}
              </span>
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">Real Estate Growth OS v3.0</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar Decorativa / Resumen rápido */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-8 shadow-sm justify-between shrink-0">
          <h1 className="text-xl font-bold flex items-center text-gray-800">
            <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: branding.primaryColor }}></span>
            {company.name} / <span className="text-gray-400 ml-2 capitalize font-medium">{sections.find(s => s.id === activeSection)?.label}</span>
          </h1>
        </header>

        {/* Área de Renderizado Reactivo Dinámico */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white rounded-tl-3xl shadow-inner border-t border-l border-gray-100 mt-2 ml-2">
          {activeSection === 'inicio' && <DashboardOverview />}
          {activeSection === 'marca' && <BrandStructure />}
          {activeSection === 'proyectos' && <ProjectsView />}
          {/* Al MetaAds y al CRM los instanciamos para la vista Global de Empresa */}
          {activeSection === 'ads' && <MetaAdsManager project={{ campanasMeta: { reconocimiento: [], trafico: [], clientesPotenciales: [] } }} isGlobal={true} />}
          {activeSection === 'crm' && <CRMBoard project={null} />}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
