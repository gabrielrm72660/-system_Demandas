
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { DemandForm } from './components/DemandForm.tsx';
import { DemandTable } from './components/DemandTable.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Settings } from './components/Settings.tsx';
import { FinancialForm } from './components/FinancialForm.tsx';
import { Demand, User, Status, Company, CatalogItem } from './types.ts';

const INITIAL_COMPANIES: Company[] = [
  { id: '1', name: 'Citsmart' },
  { id: '2', name: 'SEI' }
];

const INITIAL_CATALOG: CatalogItem[] = [
  { id: 'i8', name: 'Item 8', unitValue: 1000, unitMeasure: 'Un' },
  { id: 'i9', name: 'Item 9', unitValue: 1000, unitMeasure: 'Un' },
  { id: 'i10', name: 'Item 10', unitValue: 1000, unitMeasure: 'Un' },
  { id: 'i11', name: 'Item 11', unitValue: 1000, unitMeasure: 'Un' }
];

const INITIAL_USERS: User[] = [
  { username: 'admin', role: 'ADMIN', password: 'admin' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sgf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sgf_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [demands, setDemands] = useState<Demand[]>(() => {
    const saved = localStorage.getItem('sgf_demands');
    return saved ? JSON.parse(saved) : [];
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('sgf_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [catalog, setCatalog] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('sgf_catalog');
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sgf_darkmode');
    return saved === 'true';
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'table' | 'form' | 'settings' | 'financial'>('dashboard');
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);

  useEffect(() => {
    localStorage.setItem('sgf_demands', JSON.stringify(demands));
  }, [demands]);

  useEffect(() => {
    localStorage.setItem('sgf_companies', JSON.stringify(companies));
    localStorage.setItem('sgf_catalog', JSON.stringify(catalog));
    localStorage.setItem('sgf_all_users', JSON.stringify(users));
    localStorage.setItem('sgf_darkmode', darkMode.toString());
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [companies, catalog, users, darkMode]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('sgf_user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sgf_user');
  };

  const addDemand = (demand: Demand) => {
    setDemands(prev => {
      const exists = prev.find(d => d.id === demand.id);
      if (exists) {
        return prev.map(d => d.id === demand.id ? demand : d);
      }
      return [...prev, demand];
    });
    setCurrentView('table');
  };

  const deleteDemand = (id: string) => {
    if (user?.role !== 'ADMIN') return;
    setDemands(prev => prev.filter(d => d.id !== id));
  };

  const updateStatus = (id: string, status: Status) => {
    setDemands(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleEdit = (demand: Demand) => {
    setEditingDemand(demand);
    setCurrentView('form');
  };

  const handleFinancial = (demand: Demand) => {
    setEditingDemand(demand);
    setCurrentView('financial');
  };

  const importJSON = (data: any) => {
    if (!data) return;
    if (data.demands) setDemands(data.demands);
    if (data.companies) setCompanies(data.companies);
    if (data.catalog) setCatalog(data.catalog);
    if (data.users) setUsers(data.users);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout} 
        user={user}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {currentView === 'dashboard' && <Dashboard demands={demands} />}
          
          {currentView === 'table' && (
            <DemandTable 
              demands={demands} 
              onDelete={deleteDemand} 
              onEdit={handleEdit} 
              onFinancial={handleFinancial}
              onUpdateStatus={updateStatus}
              onImport={importJSON}
              user={user}
              companies={companies}
              catalog={catalog}
              users={users}
            />
          )}

          {currentView === 'form' && (
            <DemandForm 
              onSubmit={addDemand} 
              editingDemand={editingDemand} 
              companies={companies}
              onCancel={() => {
                setEditingDemand(null);
                setCurrentView('table');
              }} 
            />
          )}

          {currentView === 'financial' && editingDemand && (
            <FinancialForm 
              demand={editingDemand}
              catalog={catalog}
              onSubmit={addDemand}
              onCancel={() => {
                setEditingDemand(null);
                setCurrentView('table');
              }}
            />
          )}

          {currentView === 'settings' && user.role === 'ADMIN' && (
            <Settings 
              companies={companies}
              setCompanies={setCompanies}
              catalog={catalog}
              setCatalog={setCatalog}
              users={users}
              setUsers={setUsers}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
