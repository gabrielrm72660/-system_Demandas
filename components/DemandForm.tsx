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
    setorSala: '', // Campo atualizado para bater com types.ts
    localAndar: '', // Campo atualizado para bater com types.ts
    solicitante: '',
    anexos: [],
    itensFinanceiros: [],
    valorTotalGeral: 0,
    dataSolicitacao: new Date().toISOString().split('T')[0],
    dataConclusao: '',
    mesFaturamento: ''
  });

  // --- LÓGICA DE UPLOAD DE ARQUIVOS (Base64) ---
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
    // Garante que campos obrigatórios e IDs estejam presentes
    onSubmit({ ...formData } as Demanda);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900 dark:text-white";
  const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">
          <i className="fa-solid fa-file-signature"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black">Registro Operacional</h2>
          <p className="text-slate-500 text-sm italic">Fase 1: Dados básicos e identificação da demanda.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* LINHA 1: IDENTIFICAÇÃO */}
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

        {/* LINHA 2: TÉCNICO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className={labelClass}>Tipo de Serviço</label>
            <input required type="text" placeholder="Ex: Manutenção Preventiva Ar Condicionado" className={inputClass} value={formData.tipoServico || ''} onChange={e => setFormData({...formData, tipoServico: e.target.value})} />
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

        {/* LINHA 3: LOCALIZAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Setor / Sala</label>
            <input type="text" placeholder="Ex: Financeiro - Sala 102" className={inputClass} value={formData.setorSala || ''} onChange={e => setFormData({...formData, setorSala: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Local / Andar / Bloco</label>
            <input type="text" placeholder="Ex: Bloco A - 3º Andar" className={inputClass} value={formData.localAndar || ''} onChange={e => setFormData({...formData, localAndar: e.target.value})} />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className={labelClass}>Descrição Detalhada</label>
          <textarea required rows={4} className={`${inputClass} resize-none`} placeholder="Descreva os detalhes técnicos do serviço realizado..." value={formData.descricao || ''} onChange={e => setFormData({...formData, descricao: e.target.value})} />
        </div>

        {/* LINHA 4: DATAS E AUTOMAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
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
            <label className={labelClass}>Mês de Faturamento (Mês Seguinte)</label>
            <input readOnly type="text" className={`${inputClass} bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-indigo-600 dark:text-indigo-400 font-black`} value={formData.mesFaturamento || 'Aguardando Conclusão'} />
          </div>
        </div>

        {/* ANEXOS */}
        <div className="p-8 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <label className={labelClass}>Documentação e Evidências (Fotos, OS assinada, etc)</label>
          <div className="flex flex-col items-center justify-center gap-4">
            <input 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer transition-all" 
              onChange={handleFileChange} 
            />
            
            {/* LISTA DE ARQUIVOS CARREGADOS */}
            <div className="flex flex-wrap gap-2 w-full mt-4">
              {formData.anexos?.map((anexo, i) => (
                <div key={anexo.id} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 shadow-sm">
                  <i className="fa-solid fa-file-lines text-indigo-500"></i>
                  <span className="truncate max-w-[150px] font-medium">{anexo.nome}</span>
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({...prev, anexos: prev.anexos?.filter((_, idx) => idx !== i)}))} 
                    className="ml-1 text-slate-300 hover:text-red-500"
                  >
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AÇÕES */}
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
