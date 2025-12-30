
import React, { useState, useEffect } from 'react';
import { Demand, Status, Company, Attachment } from '../types';
import { TIPO_SERVICO_OPTIONS, getNextMonthName } from '../constants';

interface DemandFormProps {
  onSubmit: (demand: Demand) => void;
  onCancel: () => void;
  editingDemand: Demand | null;
  companies: Company[];
}

export const DemandForm: React.FC<DemandFormProps> = ({ onSubmit, onCancel, editingDemand, companies }) => {
  const [formData, setFormData] = useState<Omit<Demand, 'id' | 'createdAt' | 'financialItems'>>({
    empresa: '',
    citsmartId: '',
    sei: '',
    tipoServico: '',
    descricao: '',
    solicitante: '',
    setor: '',
    local: '',
    responsavel: '',
    dataSolicitacao: '',
    dataConclusao: '',
    mesFaturamento: '',
    status: 'Aberta' as Status,
    attachments: [],
  });

  useEffect(() => {
    if (editingDemand) {
      setFormData({
        empresa: editingDemand.empresa,
        citsmartId: editingDemand.citsmartId,
        sei: editingDemand.sei,
        tipoServico: editingDemand.tipoServico,
        descricao: editingDemand.descricao,
        solicitante: editingDemand.solicitante,
        setor: editingDemand.setor,
        local: editingDemand.local,
        responsavel: editingDemand.responsavel,
        dataSolicitacao: editingDemand.dataSolicitacao,
        dataConclusao: editingDemand.dataConclusao,
        mesFaturamento: editingDemand.mesFaturamento,
        status: editingDemand.status,
        attachments: editingDemand.attachments || [],
      });
    }
  }, [editingDemand]);

  const handleDateConclusaoChange = (val: string) => {
    const mesFaturamento = getNextMonthName(val);
    setFormData(prev => ({ ...prev, dataConclusao: val, mesFaturamento }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type the file parameter to resolve 'unknown' type errors when using Array.from(files)
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Data = evt.target?.result as string;
        const newAttachment: Attachment = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        };
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demand: Demand = {
      ...formData,
      id: editingDemand?.id || crypto.randomUUID(),
      financialItems: editingDemand?.financialItems || [],
      createdAt: editingDemand?.createdAt || Date.now(),
    };
    onSubmit(demand);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{editingDemand ? 'Editar Demanda' : 'Nova Demanda'}</h2>
        <p className="text-slate-500">Preencha os dados básicos e anexe documentos pertinentes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Empresa</label>
            <select required className={inputClass} value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
              <option value="">Selecione...</option>
              {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nº Citsmart/SEI (Identificação)</label>
            <input type="text" required className={inputClass} value={formData.citsmartId} onChange={e => setFormData({...formData, citsmartId: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Nº 4BIS/OS/SEI (Processo)</label>
            <input type="text" required className={inputClass} value={formData.sei} onChange={e => setFormData({...formData, sei: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Tipo de Serviço</label>
            <select required className={inputClass} value={formData.tipoServico} onChange={e => setFormData({...formData, tipoServico: e.target.value})}>
              <option value="">Selecione...</option>
              {TIPO_SERVICO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Solicitante</label>
            <input type="text" required className={inputClass} value={formData.solicitante} onChange={e => setFormData({...formData, solicitante: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Responsável</label>
            <input type="text" required className={inputClass} value={formData.responsavel} onChange={e => setFormData({...formData, responsavel: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Setor / Sala</label>
            <input type="text" required className={inputClass} value={formData.setor} onChange={e => setFormData({...formData, setor: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Local / Andar</label>
            <input type="text" required className={inputClass} value={formData.local} onChange={e => setFormData({...formData, local: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Descrição da Demanda</label>
          <textarea required rows={3} className={inputClass} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Data da Solicitação</label>
            <input type="date" required className={inputClass} value={formData.dataSolicitacao} onChange={e => setFormData({...formData, dataSolicitacao: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Data da Conclusão</label>
            <input type="date" className={inputClass} value={formData.dataConclusao} onChange={e => handleDateConclusaoChange(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Mês de Faturamento</label>
            <input type="text" readOnly className={`${inputClass} bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed`} value={formData.mesFaturamento} />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <label className={labelClass}>Anexos (PDF, Excel, Word, Imagens)</label>
          <input type="file" multiple onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.attachments.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 truncate">
                  <i className="fa-solid fa-file text-indigo-500"></i>
                  <span className="text-xs font-medium truncate">{file.name}</span>
                </div>
                <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-all">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onCancel} className="px-8 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cancelar</button>
          <button type="submit" className="px-10 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all">
            {editingDemand ? 'Salvar Alterações' : 'Criar Demanda'}
          </button>
        </div>
      </form>
    </div>
  );
};
