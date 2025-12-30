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

  // Empresas agora vêm do localStorage ou começam com lista personalizada
  const [empresas, setEmpresas] = useState<Empresa[]>(() => {
    const saved = localStorage.getItem('sgf_empresas');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'ProClima' }
    ];
  });

  // Catálogo atualizado com exemplo de item com valor fixo e unidade
  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>(() => {
    const saved = localStorage.getItem('sgf_catalogo');
    return saved ? JSON.parse(saved) : [
      { id: 'i8', nome: 'Item 8', valorUnitario: 0, unidade: 'Un', bdi: 28.15 },
      { id: 'i9', nome: 'Item 9', valorUnitario: 0, unidade: 'Un', bdi: 21.15 },
      { id: 'i10', nome: 'Item 10', valorUnitario: 0, unidade: 'Un', bdi: 14.38 },
      { id: 'i11', nome: 'Item 11', valorUnitario: 0, unidade: 'Un', bdi: 18.07 },
      { id: 'key-01', nome: 'Cópia de Chave', valorUnitario: 32.54, unidade: 'Un', bdi: 0 }
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
      const index = prev.findIndex(item =>
