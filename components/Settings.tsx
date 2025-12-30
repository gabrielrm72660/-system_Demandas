
import React, { useState } from 'react';
import { Empresa, ItemCatalogo } from '../types.ts';
import { formatarMoeda } from '../constants.ts';

interface Props {
  empresas: Empresa[];
  setEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
  catalogo: ItemCatalogo[];
  setCatalogo: React.Dispatch<React.SetStateAction<ItemCatalogo[]>>;
}

export const Settings: React.FC<Props> = ({ empresas, setEmpresas, catalogo, setCatalogo }) => {
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novoItem, setNovoItem] = useState<Partial<ItemCatalogo>>({ nome: '', valorUnitario: 0, unidade: 'Un' });

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

  const inputClass = "px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><i className="fa-solid fa-building text-indigo-500"></i> Empresas</h3>
        <div className="flex gap-2 mb-6">
          <input type="text" placeholder="Nome da empresa..." className={`${inputClass} flex-1`} value={novaEmpresa} onChange={e => setNovaEmpresa(e.target.value)} />
          <button onClick={addEmpresa} className="px-4 py-2 bg-indigo-600 text-white rounded-lg"><i className="fa-solid fa-plus"></i></button>
        </div>
        <div className="space-y-2">
          {empresas.map(emp => (
            <div key={emp.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg group">
              <span className="font-medium">{emp.nome}</span>
              <button onClick={() => setEmpresas(empresas.filter(e => e.id !== emp.id))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-trash"></i></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><i className="fa-solid fa-boxes-stacked text-indigo-500"></i> Catálogo de Itens</h3>
        <div className="space-y-4 mb-8 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
          <input type="text" placeholder="Nome do item..." className={`${inputClass} w-full`} value={novoItem.nome} onChange={e => setNovoItem({...novoItem, nome: e.target.value})} />
          <div className="flex gap-4">
            <input type="number" placeholder="Valor Unit." className={`${inputClass} flex-1`} value={novoItem.valorUnitario || ''} onChange={e => setNovoItem({...novoItem, valorUnitario: parseFloat(e.target.value)})} />
            <input type="text" placeholder="Unidade" className={`${inputClass} w-24`} value={novoItem.unidade} onChange={e => setNovoItem({...novoItem, unidade: e.target.value})} />
          </div>
          <button onClick={addItem} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg">Adicionar ao Catálogo</button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {catalogo.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg group">
              <div>
                <span className="font-bold block text-sm">{item.nome}</span>
                <span className="text-xs text-slate-500">{formatarMoeda(item.valorUnitario)} / {item.unidade}</span>
              </div>
              <button onClick={() => setCatalogo(catalogo.filter(i => i.id !== item.id))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-trash"></i></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
