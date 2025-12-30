
import React, { useState, useMemo } from 'react';
import { Demanda, ItemCatalogo, ItemFinanceiro } from '../types.ts';
import { BDI_FIXO, formatarMoeda } from '../constants.ts';

interface Props {
  demanda: Demanda;
  catalogo: ItemCatalogo[];
  onClose: () => void;
  onSave: (d: Demanda) => void;
}

export const FinancialModal: React.FC<Props> = ({ demanda, catalogo, onClose, onSave }) => {
  const [itens, setItens] = useState<ItemFinanceiro[]>(demanda.itensFinanceiros || []);
  const [selectedId, setSelectedId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [manualBdi, setManualBdi] = useState<number | null>(null);

  // Busca o item no catálogo para exibição/automação
  const currentCatalogItem = useMemo(() => 
    catalogo.find(i => i.id === selectedId), [selectedId, catalogo]);

  // Lógica de BDI Automático baseada no nome do item
  const autoBdi = useMemo(() => {
    if (!currentCatalogItem) return 0;
    return BDI_FIXO[currentCatalogItem.nome] ?? 0;
  }, [currentCatalogItem]);

  const adicionarItem = () => {
    if (!currentCatalogItem) return;

    const bdi = manualBdi !== null ? manualBdi : autoBdi;
    const subtotal = currentCatalogItem.valorUnitario * quantidade;
    const totalComBdi = subtotal * (1 + bdi / 100);

    const novo: ItemFinanceiro = {
      id: crypto.randomUUID(),
      nome: currentCatalogItem.nome,
      valorUnitario: currentCatalogItem.valorUnitario,
      unidade: currentCatalogItem.unidade,
      bdi,
      quantidade,
      total: totalComBdi
    };

    setItens([...itens, novo]);
    setSelectedId('');
    setQuantidade(1);
    setManualBdi(null);
  };

  const totalGeral = itens.reduce((acc, curr) => acc + curr.total, 0);

  const inputClass = "px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
          <div>
            <h3 className="text-xl font-bold">Detalhamento Financeiro (Etapa 2)</h3>
            <p className="text-sm text-slate-500">{demanda.nCitsmartSei} • {demanda.empresa}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Interface de Adição de Item */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="md:col-span-5">
              <label className="block text-[10px] font-black uppercase text-indigo-400 mb-1.5 ml-1">Item do Catálogo</label>
              <select className={`${inputClass} w-full`} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">Selecione um item...</option>
                {catalogo.map(i => <option key={i.id} value={i.id}>{i.nome} - {formatarMoeda(i.valorUnitario)} / {i.unidade}</option>)}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-indigo-400 mb-1.5 ml-1">Quantidade</label>
              <input type="number" min="1" className={`${inputClass} w-full`} value={quantidade} onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value) || 0))} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-indigo-400 mb-1.5 ml-1">BDI (%)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder={autoBdi.toString()} 
                className={`${inputClass} w-full ${autoBdi > 0 && manualBdi === null ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}
                value={manualBdi ?? ''} 
                onChange={e => setManualBdi(e.target.value === '' ? null : parseFloat(e.target.value))} 
              />
            </div>

            <div className="md:col-span-3">
              <button 
                onClick={adicionarItem} 
                disabled={!selectedId} 
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98]"
              >
                <i className="fa-solid fa-plus mr-2"></i> Adicionar
              </button>
            </div>
          </div>

          {/* Tabela de Itens Adicionados */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="py-4 px-6">Item / Descrição</th>
                  <th className="py-4 px-6">Unitário</th>
                  <th className="py-4 px-6">BDI (%)</th>
                  <th className="py-4 px-6">Qtd</th>
                  <th className="py-4 px-6 text-right">Total c/ BDI</th>
                  <th className="py-4 px-6 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {itens.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-6 font-semibold">{item.nome}</td>
                    <td className="py-4 px-6">{formatarMoeda(item.valorUnitario)}</td>
                    <td className="py-4 px-6 text-indigo-500 font-bold">{item.bdi}%</td>
                    <td className="py-4 px-6">{item.quantidade} <span className="text-[10px] text-slate-400 uppercase ml-1">{item.unidade}</span></td>
                    <td className="py-4 px-6 text-right font-black text-indigo-600 dark:text-indigo-400">{formatarMoeda(item.total)}</td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => setItens(itens.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {itens.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 italic">Nenhum item adicionado a esta demanda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="mb-4 md:mb-0">
              <span className="font-bold uppercase text-slate-400 tracking-widest text-xs">Valor Total Consolidado</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 drop-shadow-sm">{formatarMoeda(totalGeral)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">Descartar</button>
          <button 
            onClick={() => onSave({ ...demanda, itensFinanceiros: itens })} 
            className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Confirmar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
