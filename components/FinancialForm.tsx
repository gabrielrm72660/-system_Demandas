
import React, { useState } from 'react';
import { Demand, CatalogItem, FinancialItem } from '../types';
import { BDI_MAPPING, formatCurrency } from '../constants';

interface FinancialFormProps {
  demand: Demand;
  catalog: CatalogItem[];
  onSubmit: (demand: Demand) => void;
  onCancel: () => void;
}

export const FinancialForm: React.FC<FinancialFormProps> = ({ demand, catalog, onSubmit, onCancel }) => {
  const [financialItems, setFinancialItems] = useState<FinancialItem[]>(demand.itensFinanceiros || []);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customBdi, setCustomBdi] = useState(0);

  const addItem = () => {
    const catalogItem = catalog.find(i => i.id === selectedItemId);
    if (!catalogItem) return;

    // Automated BDI logic for items 8, 9, 10, 11
    const presetBdi = BDI_MAPPING[catalogItem.name];
    const bdi = presetBdi !== undefined ? presetBdi : customBdi;
    
    const total = (catalogItem.unitValue * quantity) * (1 + bdi / 100);

    const newRecord: FinancialItem = {
      id: crypto.randomUUID(),
      name: catalogItem.name,
      unitValue: catalogItem.unitValue,
      unitMeasure: catalogItem.unitMeasure,
      quantity,
      bdi,
      total
    };

    setFinancialItems([...financialItems, newRecord]);
    setSelectedItemId('');
    setQuantity(1);
    setCustomBdi(0);
  };

  const removeItem = (id: string) => {
    setFinancialItems(financialItems.filter(item => item.id !== id));
  };

  const grandTotal = financialItems.reduce((acc, curr) => acc + curr.total, 0);

  const handleSubmit = () => {
    onSubmit({ ...demand, itensFinanceiros: financialItems });
  };

  const inputClass = "px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none";
  const labelClass = "block text-[10px] font-bold uppercase text-indigo-400 mb-1";

  const selectedItem = catalog.find(i => i.id === selectedItemId);
  const isPresetItem = selectedItem && BDI_MAPPING[selectedItem.name] !== undefined;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold">Ajuste Financeiro</h2>
        <p className="text-slate-500">ID: <span className="font-bold">{demand.nCitsmartSei}</span> | Empresa: <span className="font-bold">{demand.empresa}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <div className="md:col-span-2">
          <label className={labelClass}>Item do Catálogo</label>
          <select className={`${inputClass} w-full`} value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}>
            <option value="">Selecione o Item...</option>
            {catalog.map(item => <option key={item.id} value={item.id}>{item.name} ({formatCurrency(item.unitValue)})</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Qtd</label>
          <input type="number" min="1" className={`${inputClass} w-full`} value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
        </div>
        <div>
          <label className={labelClass}>BDI (%)</label>
          {isPresetItem ? (
            <div className={`${inputClass} bg-slate-100 dark:bg-slate-700/50 font-bold text-slate-500`}>
              {BDI_MAPPING[selectedItem.name]}% (Auto)
            </div>
          ) : (
            <input type="number" step="0.01" className={`${inputClass} w-full`} value={customBdi} onChange={e => setCustomBdi(parseFloat(e.target.value))} />
          )}
        </div>
        <div className="flex items-end">
          <button onClick={addItem} disabled={!selectedItemId} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all shadow-lg">Adicionar</button>
        </div>
      </div>

      <div className="overflow-x-auto mb-8 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="px-6 py-4">Item / Medida</th>
              <th className="px-6 py-4">Unitário</th>
              <th className="px-6 py-4">Qtd</th>
              <th className="px-6 py-4">BDI (%)</th>
              <th className="px-6 py-4 text-right">Total c/ BDI</th>
              <th className="px-6 py-4 text-center">Remover</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {financialItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.unitMeasure}</div>
                </td>
                <td className="px-6 py-4 text-sm">{formatCurrency(item.unitValue)}</td>
                <td className="px-6 py-4 text-sm font-bold">{item.quantity}</td>
                <td className="px-6 py-4 text-sm">{item.bdi}%</td>
                <td className="px-6 py-4 text-sm font-black text-right text-indigo-600 dark:text-indigo-400">{formatCurrency(item.total)}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2"><i className="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            ))}
            {financialItems.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Nenhum detalhamento financeiro inserido.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-600 text-white">
              <td colSpan={4} className="px-6 py-6 font-black text-right uppercase tracking-widest text-xs">Total Geral Acumulado</td>
              <td className="px-6 py-6 text-xl font-black text-right">{formatCurrency(grandTotal)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6">
        <button onClick={onCancel} className="px-8 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">Voltar</button>
        <button onClick={handleSubmit} className="px-10 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">Salvar Financeiro</button>
      </div>
    </div>
  );
};
