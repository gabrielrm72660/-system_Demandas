
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  onLogout: () => void;
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, user, darkMode, toggleDarkMode }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'table', icon: 'fa-list-check', label: 'Demandas' },
    { id: 'form', icon: 'fa-plus-circle', label: 'Nova Demanda' },
  ];

  if (user.role === 'ADMIN') {
    menuItems.push({ id: 'settings', icon: 'fa-screwdriver-wrench', label: 'Gerenciamento' });
  }

  return (
    <aside className="w-20 md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col no-print transition-all duration-300">
      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
          G
        </div>
        <span className="hidden md:block font-black text-xl tracking-tighter text-indigo-600 dark:text-indigo-400">GDM Manager</span>
      </div>

      <nav className="flex-1 mt-6 px-2 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-500'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6`}></i>
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between md:px-4">
           <span className="hidden md:block text-[10px] uppercase font-bold text-slate-400">{darkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
           <button 
             onClick={toggleDarkMode}
             className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform shadow-sm"
             title="Alternar Tema"
           >
             <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'}`}></i>
           </button>
        </div>

        <div className="md:px-4 pb-4">
          <div className="hidden md:flex flex-col mb-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold truncate">{user.username}</span>
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{user.role}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 font-bold text-sm"
          >
            <i className="fa-solid fa-power-off text-lg"></i>
            <span className="hidden md:block">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
