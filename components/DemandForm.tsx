
import React, { useState } from 'react';
import { Demanda, Empresa, Anexo } from '../types.ts';
import { calcularMesFaturamento, TIPO_SERVICO_OPTIONS, RESPONSAVEL_TECNICO_OPTIONS } from '../constants.ts';

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
    setor: '',
    local: '',
    solicitante: '',
    anexos: [],
    itensFinanceiros: [],
    dataSolicitacao: new Date().toISOString().split('T')[0]
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target?.result as string;
        const novoAnexo: Anexo = { nome: file.name, tipo: file.type, data: base64 };
        setFormData(prev => ({ ...prev, anexos: [...(prev.anexos || []), novoAnexo] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, createdAt: Date.now() } as Demanda);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm";
  const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">
          <i className="fa-solid fa-file-signature"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black">Registro Operacional</h2>
          <p className="text-slate-500 text-sm italic">Preencha os dados básicos da demanda para iniciar o fluxo.</p>
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
            <input required type="text" placeholder="Ex: 23087.0001/2024" className={inputClass} value={formData.nCitsmartSei || ''} onChange={e => setFormData({...formData, nCitsmartSei: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Nº 4BIS / OS / SEI</label>
            <input required type="text" placeholder="Ex: OS-2024-001" className={inputClass} value={formData.n4bisOsSei || ''} onChange={e => setFormData({...formData, n4bisOsSei: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className={labelClass}>Tipo de Serviço</label>
            <select 
              required 
              className={inputClass} 
              value={formData.tipoServico || ''} 
              onChange={e => setFormData({...formData, tipoServico: e.target.value})}
            >
              <option value="">Selecione o serviço...</option>
              {TIPO_SERVICO_OPTIONS.map(opcao => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Solicitante</label>
            <input required type="text" className={inputClass} value={formData.solicitante || ''} onChange={e => setFormData({...formData, solicitante: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Responsável Técnico</label>
            <select 
              required 
              className={inputClass} 
              value={formData.responsavel || ''} 
              onChange={e => setFormData({...formData, responsavel: e.target.value})}
            >
              <option value="">Selecione o responsável...</option>
              {RESPONSAVEL_TECNICO_OPTIONS.map(opcao => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Setor / Sala</label>
            <input type="text" className={inputClass} value={formData.setor || ''} onChange={e => setFormData({...formData, setor: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Local / Andar</label>
            <input type="text" className={inputClass} value={formData.local || ''} onChange={e => setFormData({...formData, local: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Descrição Detalhada</label>
          <textarea required rows={4} className={`${inputClass} resize-none`} placeholder="Descreva os detalhes da solicitação..." value={formData.descricao || ''} onChange={e => setFormData({...formData, descricao: e.target.value})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Data da Solicitação</label>
            <input required type="date" className={inputClass} value={formData.dataSolicitacao} onChange={e => setFormData({...formData, dataSolicitacao: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Data da Conclusão</label>
            <input type="date" className={inputClass} value={formData.dataConclusao || ''} onChange={e => {
              const faturamento = calcularMesFaturamento(e.target.value);
              setFormData({...formData, dataConclusao: e.target.value, mesFaturamento: faturamento});
            }} />
          </div>
          <div>
            <label className={labelClass}>Mês de Faturamento (Auto)</label>
            <input readOnly type="text" className={`${inputClass} bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed text-indigo-600 font-black`} value={formData.mesFaturamento || 'Pendente de Conclusão'} />
          </div>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <label className={labelClass}>Anexos e Documentação (PDF, Excel, Word, Imagens)</label>
          <div className="flex flex-col items-center justify-center gap-4">
            <input 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer transition-all" 
              onChange={handleFileChange} 
            />
            <div className="flex flex-wrap gap-2 w-full">
              {formData.anexos?.map((anexo, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 shadow-sm">
                  <i className="fa-solid fa-file-lines text-indigo-500"></i>
                  <span className="truncate max-w-[150px] font-medium">{anexo.nome}</span>
                  <button type="button" onClick={() => setFormData(prev => ({...prev, anexos: prev.anexos?.filter((_, idx) => idx !== i)}))} className="ml-1 text-slate-300 hover:text-red-500">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
          <button type="button" onClick={onCancel} className="px-8 py-3 font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Cancelar</button>
          <button type="submit" className="px-12 py-3 font-black uppercase tracking-widest text-xs bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all">
            Salvar e Prosseguir
          </button>
        </div>
      </form>
    </div>
  );
};
