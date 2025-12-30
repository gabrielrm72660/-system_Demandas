import React, { useState } from 'react';
import { Demanda, Empresa, Anexo } from '../types.ts';
import { calcularMesFaturamento } from '../constants.ts';

interface Props {
  onSubmit: (d: Demanda) => void;
  empresas: Empresa[];
  onCancel: () => void;
}

export const DemandForm: React.FC<Props> = ({ onSubmit, empresas, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Demanda>>({
    id: crypto.randomUUID(),
    empresa: '',
    status: 'Aberta',
    responsavel: '',
    setorSala: '', 
    localAndar: '', 
    solicitante: '',
    anexos: [],
    itensFinanceiros: [],
    valorTotalGeral: 0,
    dataSolicitacao: new Date().toISOString().split('T')[0],
    dataConclusao: '',
    mesFaturamento: ''
  });

  const handleUpdateItem = (nome: string, valor: number) => {
    const outros = formData.itensFinanceiros?.filter(i => i.descricao !== nome) || [];
    const novos = [...outros, { 
      id: crypto.randomUUID(), 
      descricao: nome, 
      valorUnitario: valor, 
      valorTotal: valor, 
      quantidade: 1 
    }];
    const total = novos.reduce((acc, curr) => acc + curr.valorTotal, 0);
    setFormData({ ...formData, itensFinanceiros: novos, valorTotalGeral: total });
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900";
  const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-xl">
          <i className="fa-solid fa-file-signature"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Registro Operacional</h2>
          <p className="text-slate-500 text-sm italic">Itens Padrão: 9, 10 e 11</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData as Demanda); }} className="space-y-8">
        {/* SEÇÃO DOS ITENS FIXOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          {['ITEM 9', 'ITEM 10', 'ITEM 11'].map(item => (
            <div key={item}>
              <label className={labelClass}>{item}</label>
              <input 
                type="number" 
                placeholder="Valor R$" 
                className={inputClass}
                onChange={(e) => handleUpdateItem(item, Number(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Empresa Contratante</label>
            <select required className={inputClass} value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
              <option value="">Selecione...</option>
              {empresas.map(emp => <option key={emp.id} value={emp.nome}>{emp.nome}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Solicitante</label>
            <input required type="text" className={inputClass} value={formData.solicitante || ''} onChange={e => setFormData({...formData, solicitante: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Responsável Técnico</label>
            <input required type="text" className={inputClass} value={formData.responsavel || ''} onChange={e => setFormData({...formData, responsavel: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <span className="text-xs font-black uppercase text-indigo-400 tracking-widest">Total Geral</span>
          <span className="text-2xl font-black text-indigo-600">
            R$ {formData.valorTotalGeral?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-8 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
          <button type="submit" className="px-12 py-3 font-black uppercase tracking-widest text-xs bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
            Salvar Demanda
          </button>
        </div>
      </form>
    </div>
  );
};
