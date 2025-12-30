import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Auth } from './components/Auth.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { DemandForm } from './components/DemandForm.tsx';
import { DemandTable } from './components/DemandTable.tsx';
import { FinancialModal } from './components/FinancialModal.tsx';
import { Settings } from './components/Settings.tsx';
import { Demanda, Usuario, Empresa, ItemCatalogo, StatusDemanda } from './types.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('sgf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [demandas, setDemandas] = useState<Demanda[]>(() => {
    const saved = localStorage.getItem('sgf_demandas');
    return saved ? JSON.parse(saved) : [];
  });

  const [empresas, setEmpresas] = useState<Empresa[]>(() => {
    const saved = localStorage.getItem('sgf_empresas');
    return saved ? JSON.parse(saved) : [{ id: '1', nome: 'ProClima' }];
  });

  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>(() => {
    const saved = localStorage.getItem('sgf_catalogo');
    return saved ? JSON.parse(saved) : [
      { id: 'key-01', nome: 'Cópia de Chave', valorUnitario: 32.54, unidade: 'Un', bdi: 0 }
    ];
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sgf_theme') === 'dark');
  const [currentView, setCurrentView] = useState<'dashboard' | 'table' | 'form' | 'settings'>('dashboard');
  const [selectedDemandaFin, setSelectedDemandaFin] = useState<Demanda | null>(null);

  useEffect(() => {
    localStorage.setItem('sgf_demandas', JSON.stringify(demandas));
    localStorage.setItem('sgf_empresas', JSON.stringify(empresas));
    localStorage.setItem('sgf_catalogo', JSON.stringify(catalogo));
    localStorage.setItem('sgf_theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [demandas, empresas, catalogo, darkMode]);

  const saveDemanda = (d: Demanda) => {
    setDemandas(prev => {
      const index = prev.findIndex(item => item.id === d.id);
      if (index !== -1) {
        const newArr = [...prev];
        newArr[index] = d;
        return newArr;
      }
      return [d, ...prev];
    });
    setCurrentView('table');
  };

  if (!user) return <Auth onLogin={(u) => { setUser(u); localStorage.setItem('sgf_user', JSON.stringify(u)); }} />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar currentView={currentView} setView={setCurrentView} user={user} onLogout={() => setUser(null)} darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && <Dashboard demandas={demandas} />}
          {currentView === 'table' && <DemandTable demandas={demandas} onEdit={() => setCurrentView('form')} onFinancial={setSelectedDemandaFin} onDelete={(id) => setDemandas(prev => prev.filter(d => d.id !== id))} onUpdateStatus={(id, status) => setDemandas(prev => prev.map(d => d.id === id ? { ...d, status } : d))} user={user} companies={empresas} catalog={catalogo} />}
          {currentView === 'form' && <DemandForm onSubmit={saveDemanda} empresas={empresas} onCancel={() => setCurrentView('table')} />}
          {currentView === 'settings' && <Settings empresas={empresas} setEmpresas={setEmpresas} catalogo={catalogo} setCatalogo={setCatalogo} />}
        </div>
      </main>
      {selectedDemandaFin && <FinancialModal demanda={selectedDemandaFin} catalogo={catalogo} onClose={() => setSelectedDemandaFin(null)} onSave={(updated) => { saveDemanda(updated); setSelectedDemandaFin(null); }} />}
    </div>
  );
};

export default App;
