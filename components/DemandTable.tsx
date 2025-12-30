
import React, { useState, useMemo } from 'react';
import { Demand, User, Status, Company, CatalogItem } from '../types';
import { STATUS_COLORS, STATUS_OPTIONS, formatCurrency } from '../constants';

interface DemandTableProps {
  demands: Demand[];
  onDelete: (id: string) => void;
  onEdit: (demand: Demand) => void;
  onFinancial: (demand: Demand) => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onImport: (data: any) => void;
  user: User;
  companies: Company[];
  catalog: CatalogItem[];
  users: User[];
}

export const DemandTable: React.FC<DemandTableProps> = ({ demands, onDelete, onEdit, onFinancial, onUpdateStatus, onImport, user, companies, catalog, users }) => {
  const [search, setSearch] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

  const filteredDemands = useMemo(() => {
    return demands.filter(d => 
      d.empresa.toLowerCase().includes(search.toLowerCase()) ||
      d.sei.toLowerCase().includes(search.toLowerCase()) ||
      d.citsmartId.toLowerCase().includes(search.toLowerCase()) ||
      d.responsavel.toLowerCase().includes(search.toLowerCase()) ||
      d.descricao.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [demands, search]);

  const exportJSON = () => {
    const dataStr = JSON.stringify({ demands, companies, catalog, users }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'sgf_completo_export.json');
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        onImport(json);
        alert('Dados importados!');
      } catch (err) {
        alert('Erro ao importar!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" placeholder="Busque demandas..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={exportJSON} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><i className="fa-solid fa-download text-indigo-600"></i><span className="font-semibold text-sm">Exportar</span></button>
          <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all"><i className="fa-solid fa-upload text-indigo-600"></i><span className="font-semibold text-sm">Importar</span><input type="file" className="hidden" accept=".json" onChange={handleImport} /></label>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">ID / Processo</th>
                <th className="px-6 py-4">Faturamento</th>
                <th className="px-6 py-4">Financeiro</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredDemands.map((d) => {
                const totalFin = d.financialItems?.reduce((acc, curr) => acc + curr.total, 0) || 0;
                return (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors cursor-pointer" onClick={() => setSelectedDemand(d)}>
                    <td className="px-6 py-4">
                      <div className="font-bold">{d.citsmartId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{d.sei}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{d.mesFaturamento || 'Pendente'}</div>
                      <div className="text-[10px] text-slate-400">{d.empresa}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(totalFin)}</div>
                      <div className="text-[10px] text-slate-400">{d.financialItems?.length || 0} Itens</div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select value={d.status} onChange={(e) => onUpdateStatus(d.id, e.target.value as Status)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-none shadow-sm ${STATUS_COLORS[d.status]}`}>
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onFinancial(d)} className="p-2 text-indigo-400 hover:text-indigo-600" title="Financeiro"><i className="fa-solid fa-coins"></i></button>
                        <button onClick={() => onEdit(d)} className="p-2 text-slate-400 hover:text-indigo-600" title="Editar"><i className="fa-solid fa-pen-to-square"></i></button>
                        {user.role === 'ADMIN' && <button onClick={() => onDelete(d.id)} className="p-2 text-slate-400 hover:text-red-600" title="Excluir"><i className="fa-solid fa-trash-can"></i></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div><h3 className="text-xl font-bold">Resumo da Demanda</h3><p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{selectedDemand.citsmartId}</p></div>
              <button onClick={() => setSelectedDemand(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><i className="fa-solid fa-xmark text-slate-400"></i></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div><label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Empresa</label><p className="font-semibold">{selectedDemand.empresa}</p></div>
                <div><label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status</label><p className="font-semibold uppercase text-xs">{selectedDemand.status}</p></div>
                <div><label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Faturamento</label><p className="font-semibold">{selectedDemand.mesFaturamento || '---'}</p></div>
                <div><label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Conclusão</label><p className="font-semibold">{selectedDemand.dataConclusao || '---'}</p></div>
              </div>
              <div><label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Descrição</label><p className="text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">{selectedDemand.descricao}</p></div>
              <div><label className="text-[10px] uppercase font-bold text-slate-400 block mb-3">Anexos ({selectedDemand.attachments?.length || 0})</label>
                <div className="flex flex-wrap gap-2">
                  {selectedDemand.attachments?.map((file, idx) => (
                    <a key={idx} href={file.data} download={file.name} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium hover:bg-indigo-50 transition-colors">
                      <i className="fa-solid fa-file-arrow-down text-indigo-500"></i> {file.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Itens Financeiros</h4>
                <div className="space-y-2">
                  {selectedDemand.financialItems?.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                      <span><span className="font-bold">{item.name}</span> x {item.quantity}</span>
                      <span className="font-black text-indigo-600">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 text-sm font-black text-indigo-600 dark:text-indigo-400">
                    <span>TOTAL GERAL</span>
                    <span>{formatCurrency(selectedDemand.financialItems?.reduce((a,c) => a+c.total, 0) || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => window.print()} className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-colors font-bold text-xs flex items-center gap-2"><i className="fa-solid fa-print"></i> Imprimir</button>
              <button onClick={() => setSelectedDemand(null)} className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-bold text-xs">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
