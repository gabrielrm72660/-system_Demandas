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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target?.result as string;
        const novoAnexo: Anexo = { 
          id: crypto.randomUUID(),
          nome: file.name, 
          tipo: file.type, 
          tamanho: (file.size / 1024).toFixed(2) + ' KB',
          base64: base64,
          dataUpload: new Date().toISOString()
        };
        setFormData(prev => ({ ...prev, anexos: [...(prev.anexos || []), novoAnexo] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData } as Demanda);
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
          <h2 className="text-2xl font-black">Registro Operacional</h2>
          <p className="text-slate-500 text-sm italic">Fase 1: Dados básicos e identificação da demanda.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
            <input required type="text" placeholder="Ex: 23087.0001/2024" className={inputClass} value={formData.citsmartSei || ''} onChange={e => setFormData({...formData, citsmartSei: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Nº 4BIS / OS / SEI (Processo)</label>
            <input required type="text" placeholder="Ex: OS-2024-001" className={inputClass} value={formData.os4bisSei || ''} onChange={e => setFormData({...formData, os4bisSei: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className={labelClass}>Tipo de Serviço</label>
            <input required type="text" placeholder="Ex: Manutenção Preventiva" className={inputClass} value={formData.tipoServico || ''} onChange={e => setFormData({...formData, tipoServico: e.target.value})} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Setor / Sala</label>
            <input type="text" className={inputClass} value={formData.setorSala || ''} onChange={e => setFormData({...formData, setorSala: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Local / Andar / Bloco</label>
            <input type="text" className={inputClass} value={formData.localAndar || ''} onChange={e => setFormData({...formData, localAndar: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Descrição Detalhada</label>
          <textarea required rows={4} className={`${inputClass} resize-none`} placeholder="Detalhes técnicos..." value={formData.descricao || ''} onChange={e => setFormData({...formData, descricao: e.target.value})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <label className={labelClass}>Data da Solicitação</label>
            <input required type="date" className={inputClass} value={formData.dataSolicitacao} onChange={e => setFormData({...formData, dataSolicitacao: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Data da Conclusão</label>
            <input type="date" className={inputClass} value={formData.dataConclusao || ''} onChange={e => {
              const dataConcl = e.target.value;
              const faturamento = calcularMesFaturamento(dataConcl);
              setFormData({...formData, dataConclusao: dataConcl, mesFaturamento: faturamento});
            }} />
          </div>
          <div>
            <label className={labelClass}>Mês de Faturamento</label>
            <input readOnly type="text" className={`${inputClass} bg-slate-100 font-black text-indigo-600`} value={formData.mesFaturamento || 'Aguardando Conclusão'} />
          </div>
        </div>

        <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <label className={labelClass}>Anexos</label>
          <input type="file" multiple className="text-sm" onChange={handleFileChange} />
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.anexos?.map((anexo, i) => (
              <div key={anexo.id} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-xs border border-slate-200">
                <span className="truncate max-w-[150px]">{anexo.nome}</span>
                <button type="button" onClick={() => setFormData(prev => ({...prev, anexos: prev.anexos?.filter((_, idx) => idx !== i)}))} className="text-red-500">
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-8 py-3 font-bold text-slate-400">Cancelar</button>
          <button type="submit" className="px-12 py-3 font-black uppercase text-xs bg-indigo-600 text-white rounded-xl shadow-lg">
            Salvar e Prosseguir
          </button>
        </div>
      </form>
    </div>
  );
};
