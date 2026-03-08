import React, { useState } from 'react';
import DashboardOverview from './components/DashboardOverview';
import LeadManager from './components/LeadManager';
import ProjectScope from './components/ProjectScope';
import MarketingPlan from './components/MarketingPlan';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <div className="min-h-screen bg-brandLight flex flex-col md:flex-row animate-fade-in font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 drop-shadow-sm z-20">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center md:block">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-company flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-accent text-white flex items-center justify-center text-sm shadow-inner">RE</span>
              Boutique OS
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Boulevard El Parque</p>
          </div>
          {/* Mobile menu button could go here */}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[{ id: 'inicio', label: 'Inicio' }, { id: 'leads', label: 'CRM Leads' }, { id: 'proyectos', label: 'Proyectos' }, { id: 'marketing', label: 'Marketing' }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${activeTab === tab.id
                  ? 'bg-company text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-company'
                }`}
            >
              • <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 hidden md:block">
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-company to-gray-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              MS
            </div>
            <div>
              <p className="text-sm font-semibold text-brandDark">Multivela Studio</p>
              <p className="text-xs text-gray-500 break-words w-full">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden max-h-screen">
        <header className="h-20 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 md:px-8 z-10 shrink-0 sticky top-0 shadow-sm">
          <h2 className="text-xl font-semibold capitalize font-display text-brandDark drop-shadow-sm">
            Panel de {activeTab === 'inicio' ? 'Resumen' : activeTab}
          </h2>
          <div className="flex gap-4">
            <button className="btn-outline text-sm py-2 hidden sm:block">Ajustes Generales</button>
            {/* Contextual Action Button based on Tab */}
            <button className="btn-primary text-sm py-2">
              {activeTab === 'leads' ? '+ Nuevo Lead' :
                activeTab === 'proyectos' ? '+ Nuevo Hito' :
                  activeTab === 'marketing' ? '+ Nueva Campaña' : 'Exportar Reporte'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-brandLight">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'inicio' && <DashboardOverview />}
            {activeTab === 'leads' && <LeadManager />}
            {activeTab === 'proyectos' && <ProjectScope />}
            {activeTab === 'marketing' && <MarketingPlan />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
