
import React, { useState, useMemo } from 'react';
import { Demanda, Usuario, StatusDemanda, Empresa, ItemCatalogo } from '../types.ts';
import { STATUS_COLORS, STATUS_OPTIONS, formatCurrency } from '../constants.ts';

interface DemandTableProps {
  demandas: Demanda[];
  onDelete: (id: string) => void;
  onEdit: (demand: Demanda) => void;
  onFinancial: (demand: Demanda) => void;
  onUpdateStatus?: (id: string, status: StatusDemanda) => void;
  onImport?: (data: any) => void;
  user?: Usuario;
  companies?: Empresa[];
  catalog?: ItemCatalogo[];
  users?: Usuario[];
}

export const DemandTable: React.FC<DemandTableProps> = ({ 
  demandas, onDelete, onEdit, onFinancial, onUpdateStatus, onImport, user, companies, catalog, users 
}) => {
  const [search, setSearch] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demanda | null>(null);

  const filteredDemands = useMemo(() => {
    return demandas.filter(d => 
      (d.empresa || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.n4bisOsSei || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.nCitsmartSei || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.responsavel || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.descricao || '').toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [demandas, search]);

  const exportJSON = () => {
    const dataStr = JSON.stringify({ demandas, companies, catalog, users }, null, 2);
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
        onImport?.(json);
        alert('Dados importados com sucesso!');
      } catch (err) {
        alert('Erro ao importar arquivo JSON!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" placeholder="Pesquisar demandas..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={exportJSON} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm"><i className="fa-solid fa-download text-indigo-600"></i> Exportar</button>
          <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all font-bold text-sm"><i className="fa-solid fa-upload text-indigo-600"></i> Importar<input type="file" className="hidden" accept=".json" onChange={handleImport} /></label>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-8 py-5">ID / Processo</th>
                <th className="px-8 py-5">Faturamento</th>
                <th className="px-8 py-5">Financeiro</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredDemands.map((d) => {
                const totalFin = d.itensFinanceiros?.reduce((acc, curr) => acc + curr.total, 0) || 0;
                return (
                  <tr key={d.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors cursor-pointer" onClick={() => setSelectedDemand(d)}>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-700 dark:text-slate-200">{d.nCitsmartSei}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{d.n4bisOsSei}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-black text-indigo-600 dark:text-indigo-400">{d.mesFaturamento || 'Pendente'}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-tighter mt-0.5">{d.empresa}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-700 dark:text-slate-100">{formatCurrency(totalFin)}</div>
                      <div className="text-[10px] text-slate-400">{d.itensFinanceiros?.length || 0} Itens Registrados</div>
                    </td>
                    <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={d.status} 
                        onChange={(e) => onUpdateStatus?.(d.id, e.target.value as StatusDemanda)} 
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm transition-all hover:scale-105 ${STATUS_COLORS[d.status]}`}
                      >
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-8 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onFinancial(d)} className="w-9 h-9 flex items-center justify-center rounded-xl text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all" title="Itens e BDI"><i className="fa-solid fa-coins"></i></button>
                        <button onClick={() => onEdit(d)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" title="Editar Operacional"><i className="fa-solid fa-pen-to-square"></i></button>
                        {user?.role === 'ADMIN' && <button onClick={() => onDelete(d.id)} className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all" title="Excluir"><i className="fa-solid fa-trash-can"></i></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDemands.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">Nenhuma demanda encontrada para os critérios de busca.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ORDEM DE SERVIÇO (OS) - PRONTO PARA IMPRESSÃO */}
      {selectedDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200 my-auto">
            
            {/* Cabeçalho Modal */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">OS</div>
                <div>
                  <h3 className="text-lg font-black">Ordem de Serviço Detalhada</h3>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{selectedDemand.nCitsmartSei}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDemand(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><i className="fa-solid fa-xmark text-slate-400"></i></button>
            </div>

            {/* Conteúdo da OS (Formatado para Impressão) */}
            <div id="printable-os" className="p-10 max-h-[75vh] overflow-y-auto space-y-10 print:p-0 print:max-h-none print:overflow-visible bg-white dark:bg-transparent">
              
              {/* Header OS */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 print:flex">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">RELATÓRIO DE SERVIÇO</h2>
                  <p className="text-sm font-bold text-slate-600">SGF Manager - Sistema de Gestão e Faturamento</p>
                  <p className="text-xs text-slate-500">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase font-black text-slate-400">Documento Nº</p>
                  <p className="text-xl font-mono font-bold text-indigo-600">{selectedDemand.nCitsmartSei}</p>
                </div>
              </div>

              {/* Grid de Informações Básicas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Empresa Contratante</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1">{selectedDemand.empresa}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Status Atual</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1 uppercase">{selectedDemand.status}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Responsável Técnico</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1">{selectedDemand.responsavel}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Mês Faturamento</label>
                  <p className="text-sm font-black text-indigo-600 border-b border-slate-100 pb-1">{selectedDemand.mesFaturamento || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Setor / Sala</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1">{selectedDemand.setor || '---'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Local / Andar</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1">{selectedDemand.local || '---'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Data Solicitação</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1">{selectedDemand.dataSolicitacao ? new Date(selectedDemand.dataSolicitacao + 'T12:00:00').toLocaleDateString('pt-BR') : '---'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Data Conclusão</label>
                  <p className="text-sm font-bold border-b border-slate-100 pb-1">{selectedDemand.dataConclusao ? new Date(selectedDemand.dataConclusao + 'T12:00:00').toLocaleDateString('pt-BR') : 'Aguardando'}</p>
                </div>
              </div>

              {/* Descrição OS */}
              <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-3 tracking-widest">Descrição dos Serviços Executados</label>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedDemand.descricao}</p>
              </div>

              {/* Itens Financeiros OS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">Composição de Custos e BDI</h4>
                  <span className="text-[10px] text-slate-400">{selectedDemand.itensFinanceiros?.length || 0} Itens</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-400 font-black uppercase text-[9px] tracking-tighter">
                      <th className="py-2">Item / Descrição</th>
                      <th className="py-2 text-center">Unidade</th>
                      <th className="py-2 text-center">Qtd</th>
                      <th className="py-2 text-right">Unitário</th>
                      <th className="py-2 text-center">BDI (%)</th>
                      <th className="py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedDemand.itensFinanceiros?.map(item => (
                      <tr key={item.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3 font-bold">{item.nome}</td>
                        <td className="py-3 text-center">{item.unidade}</td>
                        <td className="py-3 text-center">{item.quantidade}</td>
                        <td className="py-3 text-right">{formatCurrency(item.valorUnitario)}</td>
                        <td className="py-3 text-center font-bold text-indigo-600">{item.bdi}%</td>
                        <td className="py-3 text-right font-black">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                    {(!selectedDemand.itensFinanceiros || selectedDemand.itensFinanceiros.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center italic text-slate-400">Nenhum detalhamento financeiro vinculado a esta OS.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900">
                      <td colSpan={5} className="py-4 text-right font-black uppercase text-[10px] tracking-widest">Valor Total Consolidado</td>
                      <td className="py-4 text-right text-base font-black text-indigo-600">
                        {formatCurrency(selectedDemand.itensFinanceiros?.reduce((a,c) => a+c.total, 0) || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Assinaturas (Apenas Impressão) */}
              <div className="hidden print:grid grid-cols-2 gap-20 pt-20">
                <div className="border-t border-slate-900 text-center pt-2">
                  <p className="text-[10px] font-black uppercase">Responsável Técnico</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedDemand.responsavel}</p>
                </div>
                <div className="border-t border-slate-900 text-center pt-2">
                  <p className="text-[10px] font-black uppercase">Solicitante / Cliente</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedDemand.solicitante}</p>
                </div>
              </div>
            </div>

            {/* Rodapé Modal (Botões) */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 no-print">
              <button onClick={() => window.print()} className="px-8 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><i className="fa-solid fa-print"></i> Imprimir Ordem de Serviço</button>
              <button onClick={() => setSelectedDemand(null)} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">Fechar Visualização</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS customizado para impressão da OS */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          #printable-os { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            margin: 0; 
            padding: 2cm; 
            z-index: 1000;
            background: white !important;
            color: black !important;
          }
          #printable-os * { color: black !important; border-color: #eee !important; }
          .print-border-black { border-color: black !important; }
        }
      `}</style>
    </div>
  );
};
