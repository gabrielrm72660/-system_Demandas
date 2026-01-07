
import React, { useState } from 'react';
import { Empresa, ItemCatalogo, Usuario } from '../types.ts';
import { formatarMoeda } from '../constants.ts';

interface Props {
  empresas: Empresa[];
  setEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
  catalogo: ItemCatalogo[];
  setCatalogo: React.Dispatch<React.SetStateAction<ItemCatalogo[]>>;
  users: Usuario[];
  setUsers: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

export const Settings: React.FC<Props> = ({ empresas, setEmpresas, catalogo, setCatalogo, users, setUsers }) => {
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novoItem, setNovoItem] = useState<Partial<ItemCatalogo>>({ nome: '', valorUnitario: 0, unidade: 'Un' });
  
  // Estados para Gestão de Usuários
  const [novoUser, setNovoUser] = useState<Usuario>({ username: '', password: '', role: 'USER' });

  const addEmpresa = () => {
    if (!novaEmpresa) return;
    setEmpresas([...empresas, { id: crypto.randomUUID(), nome: novaEmpresa }]);
    setNovaEmpresa('');
  };

  const addItem = () => {
    if (!novoItem.nome) return;
    setCatalogo([...catalogo, { ...novoItem, id: crypto.randomUUID() } as ItemCatalogo]);
    setNovoItem({ nome: '', valorUnitario: 0, unidade: 'Un' });
  };

  const addUser = () => {
    if (!novoUser.username || !novoUser.password) return;
    if (users.find(u => u.username === novoUser.username)) {
      alert('Este usuário já existe!');
      return;
    }
    setUsers([...users, novoUser]);
    setNovoUser({ username: '', password: '', role: 'USER' });
  };

  const removeUser = (username: string) => {
    if (users.length <= 1) {
      alert('Não é possível remover o único usuário do sistema.');
      return;
    }
    setUsers(users.filter(u => u.username !== username));
  };

  const inputClass = "px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm";
  const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* GESTÃO DE USUÁRIOS */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <i className="fa-solid fa-users-gear"></i>
          </div>
          Gestão de Usuários e Acesso
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="md:col-span-1">
            <label className={labelClass}>Nome de Usuário</label>
            <input type="text" placeholder="Ex: joao.silva" className={`${inputClass} w-full`} value={novoUser.username} onChange={e => setNovoUser({...novoUser, username: e.target.value})} />
          </div>
          <div className="md:col-span-1">
            <label className={labelClass}>Senha de Acesso</label>
            <input type="password" placeholder="••••••••" className={`${inputClass} w-full`} value={novoUser.password} onChange={e => setNovoUser({...novoUser, password: e.target.value})} />
          </div>
          <div className="md:col-span-1">
            <label className={labelClass}>Perfil de Acesso</label>
            <select className={`${inputClass} w-full`} value={novoUser.role} onChange={e => setNovoUser({...novoUser, role: e.target.value as any})}>
              <option value="USER">Usuário Padrão</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={addUser} className="w-full py-2.5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
              Cadastrar Usuário
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u.username} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                  {u.role[0]}
                </div>
                <div>
                  <span className="font-bold text-sm block">{u.username}</span>
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">{u.role}</span>
                </div>
              </div>
              <button onClick={() => removeUser(u.username)} className="text-slate-300 hover:text-red-500 transition-colors">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EMPRESAS */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-building"></i>
            </div>
            Empresas Contratantes
          </h3>
          <div className="flex gap-2 mb-6">
            <input type="text" placeholder="Nome da empresa..." className={`${inputClass} flex-1`} value={novaEmpresa} onChange={e => setNovaEmpresa(e.target.value)} />
            <button onClick={addEmpresa} className="px-5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none"><i className="fa-solid fa-plus"></i></button>
          </div>
          <div className="space-y-2">
            {empresas.map(emp => (
              <div key={emp.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <span className="font-bold text-sm">{emp.nome}</span>
                <button onClick={() => setEmpresas(empresas.filter(e => e.id !== emp.id))} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            ))}
          </div>
        </div>

        {/* CATÁLOGO */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            Catálogo de Serviços
          </h3>
          <div className="space-y-4 mb-8 p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <label className={labelClass}>Nome do Item / Serviço</label>
              <input type="text" placeholder="Ex: Manutenção de Ar" className={`${inputClass} w-full`} value={novoItem.nome} onChange={e => setNovoItem({...novoItem, nome: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>Valor Unitário (R$)</label>
                <input type="number" placeholder="0.00" className={`${inputClass} w-full`} value={novoItem.valorUnitario || ''} onChange={e => setNovoItem({...novoItem, valorUnitario: parseFloat(e.target.value)})} />
              </div>
              <div className="w-24">
                <label className={labelClass}>UN</label>
                <input type="text" placeholder="Un" className={`${inputClass} w-full uppercase font-bold`} value={novoItem.unidade} onChange={e => setNovoItem({...novoItem, unidade: e.target.value})} />
              </div>
            </div>
            <button onClick={addItem} className="w-full py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">
              Adicionar ao Catálogo
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {catalogo.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div>
                  <span className="font-bold block text-sm">{item.nome}</span>
                  <span className="text-[10px] font-black text-indigo-500 uppercase">{formatarMoeda(item.valorUnitario)} / {item.unidade}</span>
                </div>
                <button onClick={() => setCatalogo(catalogo.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
