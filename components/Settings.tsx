
import React, { useState } from 'react';
import { Company, CatalogItem, User } from '../types';

interface SettingsProps {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  catalog: CatalogItem[];
  setCatalog: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const Settings: React.FC<SettingsProps> = ({ companies, setCompanies, catalog, setCatalog, users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'companies' | 'users'>('catalog');
  
  const [newItem, setNewItem] = useState({ name: '', unitValue: 0, unitMeasure: 'Un' });
  const [newCompany, setNewCompany] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'USER' as const });

  const addCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    setCatalog([...catalog, { id: crypto.randomUUID(), ...newItem }]);
    setNewItem({ name: '', unitValue: 0, unitMeasure: 'Un' });
  };

  const removeCatalogItem = (id: string) => {
    setCatalog(catalog.filter(i => i.id !== id));
  };

  const addCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany) return;
    setCompanies([...companies, { id: crypto.randomUUID(), name: newCompany }]);
    setNewCompany('');
  };

  const removeCompany = (id: string) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    setUsers([...users, { ...newUser }]);
    setNewUser({ username: '', password: '', role: 'USER' });
  };

  const removeUser = (username: string) => {
    if (username === 'admin') return;
    setUsers(users.filter(u => u.username !== username));
  };

  const cardClass = "bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-300";
  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all";
  const btnClass = "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md text-sm active:scale-95";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
          <p className="text-slate-500">Gestão de catálogos de itens, empresas e usuários.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          {(['catalog', 'companies', 'users'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'catalog' ? 'Banco de Itens' : tab === 'companies' ? 'Empresas' : 'Usuários'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl">
        {activeTab === 'catalog' && (
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shadow-inner"><i className="fa-solid fa-boxes-stacked"></i></div>
              <h2 className="text-lg font-bold">Gerenciador de Itens</h2>
            </div>
            <form onSubmit={addCatalogItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="md:col-span-1">
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Nome do Item</label>
                <input type="text" placeholder="Ex: Monitor Dell" className={inputClass} value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}/>
              </div>
              <div>
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Valor Unit. (R$)</label>
                <input type="number" step="0.01" className={inputClass} value={newItem.unitValue || ''} onChange={e => setNewItem({...newItem, unitValue: parseFloat(e.target.value)})}/>
              </div>
              <div>
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Unidade</label>
                <input type="text" placeholder="Un, M, Kit..." className={inputClass} value={newItem.unitMeasure} onChange={e => setNewItem({...newItem, unitMeasure: e.target.value})}/>
              </div>
              <div className="flex items-end">
                <button type="submit" className={`${btnClass} w-full`}>Adicionar ao Banco</button>
              </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalog.map(i => (
                <div key={i.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-indigo-200 transition-all shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{i.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.unitValue)} / {i.unitMeasure}</span>
                  </div>
                  <button onClick={() => removeCatalogItem(i.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-inner"><i className="fa-solid fa-building"></i></div>
              <h2 className="text-lg font-bold">Catálogo de Empresas</h2>
            </div>
            <form onSubmit={addCompany} className="flex gap-4 mb-8 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex-1">
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Nova Empresa</label>
                <input type="text" placeholder="Nome da empresa..." className={inputClass} value={newCompany} onChange={e => setNewCompany(e.target.value)}/>
              </div>
              <div className="flex items-end">
                <button type="submit" className={btnClass}>Cadastrar</button>
              </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companies.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-blue-200 transition-all shadow-sm">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{c.name}</span>
                  <button onClick={() => removeCompany(c.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shadow-inner"><i className="fa-solid fa-users-gear"></i></div>
              <h2 className="text-lg font-bold">Gestão de Usuários</h2>
            </div>
            <form onSubmit={addUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Usuário</label>
                <input type="text" placeholder="Login..." className={inputClass} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})}/>
              </div>
              <div>
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Senha</label>
                <input type="password" placeholder="Senha..." className={inputClass} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}/>
              </div>
              <div>
                <label className="text-[9px] uppercase font-black text-slate-400 block mb-1 ml-1">Perfil</label>
                <select className={inputClass} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as 'ADMIN' | 'USER'})}>
                  <option value="USER">Padrão</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className={`${btnClass} w-full`}>Criar Perfil</button>
              </div>
            </form>
            <div className="space-y-3">
              {users.map(u => (
                <div key={u.username} className="flex items-center justify-between p-4 bg-white dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 group shadow-sm transition-all hover:border-amber-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                      {u.role[0]}
                    </div>
                    <div>
                      <span className="font-bold text-sm block">{u.username}</span>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">{u.role === 'ADMIN' ? 'Acesso Total' : 'Operador'}</span>
                    </div>
                  </div>
                  {u.username !== 'admin' && (
                    <button onClick={() => removeUser(u.username)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fa-solid fa-user-minus"></i></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
