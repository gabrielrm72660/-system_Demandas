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

  // Lógica para os Itens 9, 10 e 11
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const novoAnexo: Anexo = { 
          id: crypto.randomUUID(),
          nome: file.name, 
          tipo: file.type, 
          tamanho: (file.size / 1024).toFixed(2) + ' KB',
          base64: evt.target?.result as string,
          dataUpload: new Date().toISOString()
        };
        setFormData(prev => ({ ...prev, anexos: [...(prev.anexos || []), novoAnexo] }));
      };
      reader.readAsDataURL(file);
    });
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
          <p className="text-slate-500 text-sm italic">Fase 1: Dados básicos e itens 9, 10, 11.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData as Demanda); }} className="space-y-8">
        
        {/* ITENS 9, 10, 11 - Adicionados conforme solicitado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          {['ITEM 9', 'ITEM 10', 'ITEM 11'].map(item => (
            <div key={item}>
              <label className={labelClass}>{item}</label>
              <input type="number" placeholder="Valor R$" className={inputClass} onChange={(e) => handleUpdateItem(item, Number(e.target.value))} />
            </div>
          ))}
        </div>

        {/* LINHA 1: IDENTIFICAÇÃO (Original) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Empresa Contratante</label>
            <select required className={inputClass} value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
              <option value="">Selecione...</option>
              {empresas.map(emp => <option key={emp.id} value={emp.nome}>{emp.nome}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nº Citsmart / SEI</label>
            <input required type="text" placeholder="Ex: 23087..." className={inputClass} value={formData.citsmartSei || ''} onChange={e => setFormData({...formData, citsmartSei: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Nº 4BIS / OS</label>
            <input required type="text" className={inputClass} value={formData.os4bisSei || ''} onChange={e => setFormData({...formData, os4bisSei: e.target.value})} />
          </div>
        </div>

        {/* LINHA 2: TÉCNICO (Original) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className={labelClass}>Tipo de Serviço</label>
            <input required type="text" className={inputClass} value={formData.tipoServico || ''} onChange={e => setFormData({...formData, tipoServico: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Solic
