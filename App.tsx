
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
  // --- Estados Persistentes ---
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
    return saved ? JSON.parse(saved) : [{ id: '1', nome: 'Citsmart' }, { id: '2', nome: 'SEI' }];
  });

  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>(() => {
    const saved = localStorage.getItem('sgf_catalogo');
    return saved ? JSON.parse(saved) : [
      { id: 'i8', nome: 'Item 8', valorUnitario: 150.00, unidade: 'H/H' },
      { id: 'i9', nome: 'Item 9', valorUnitario: 220.50, unidade: 'Un' },
      { id: 'i10', nome: 'Item 10', valorUnitario: 310.00, unidade: 'M2' },
      { id: 'i11', nome: 'Item 11', valorUnitario: 95.00, unidade: 'KM' }
    ];
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sgf_theme') === 'dark');
  
  // --- Estados de Navegação ---
  const [currentView, setCurrentView] = useState<'dashboard' | 'table' | 'form' | 'settings'>('dashboard');
  const [selectedDemandaFin, setSelectedDemandaFin] = useState<Demanda | null>(null);

  // --- Efeitos de Persistência ---
  useEffect(() => {
    localStorage.setItem('sgf_demandas', JSON.stringify(demandas));
    localStorage.setItem('sgf_empresas', JSON.stringify(empresas));
    localStorage.setItem('sgf_catalogo', JSON.stringify(catalogo));
    localStorage.setItem('sgf_theme', darkMode ? 'dark' : 'light');
    
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [demandas, empresas, catalogo, darkMode]);

  // --- Handlers ---
  const handleLogin = (u: Usuario) => {
    setUser(u);
    localStorage.setItem('sgf_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sgf_user');
  };

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

  const deleteDemanda = (id: string) => {
    if (user?.role !== 'ADMIN') return;
    setDemandas(prev => prev.filter(d => d.id !== id));
  };

  const updateStatus = (id: string, status: StatusDemanda) => {
    setDemandas(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  // --- Renderização Condicional de Auth ---
  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && <Dashboard demandas={demandas} />}
          
          {currentView === 'table' && (
            <DemandTable 
              demandas={demandas} 
              onEdit={(d) => {
                // Ao clicar em editar, podemos abrir o form operacional
                // mas para o fluxo de 2 etapas, geralmente usamos o onFinancial
                saveDemanda(d); 
              }} 
              onFinancial={setSelectedDemandaFin}
              onDelete={deleteDemanda}
              onUpdateStatus={updateStatus}
              user={user}
              companies={empresas}
              catalog={catalogo}
            />
          )}

          {currentView === 'form' && (
            <DemandForm 
              onSubmit={saveDemanda} 
              empresas={empresas} 
              onCancel={() => setCurrentView('table')} 
            />
          )}

          {currentView === 'settings' && user.role === 'ADMIN' && (
            <Settings 
              empresas={empresas} 
              setEmpresas={setEmpresas} 
              catalogo={catalogo} 
              setCatalogo={setCatalogo} 
            />
          )}
        </div>
      </main>

      {/* Etapa 2 do Formulário: Detalhamento Financeiro / Itens */}
      {selectedDemandaFin && (
        <FinancialModal 
          demanda={selectedDemandaFin}
          catalogo={catalogo}
          onClose={() => setSelectedDemandaFin(null)}
          onSave={(updated) => {
            saveDemanda(updated);
            setSelectedDemandaFin(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
