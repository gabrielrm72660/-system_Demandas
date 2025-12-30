import React, { useState, useEffect } from 'react';
import { Demanda, Empresa, Anexo, ItemFinanceiro } from '../types.ts';
import { calcularMesFaturamento } from '../constants.ts';

interface Props {
  onSubmit: (d: Demanda) => void;
  empresas: Empresa[];
  onCancel: () => void;
}

// DEFINIÇÃO DOS 3 ITENS PADRÕES
const ITENS_PADRAO = ['ITEM 9', 'ITEM 10', 'ITEM 11'];

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
    itensFinanceiros: [], // Aqui ficarão o ITEM 9, 10 ou 11
    valorTotalGeral: 0,
    dataSolicitacao: new Date().toISOString().split('T')[0],
    dataConclusao: '',
    mesFaturamento: ''
  });

  // Atualiza o valor total sempre que os itens financeiros mudarem
  useEffect(() => {
    const total = (formData.itensFinanceiros || []).reduce((acc, item) => acc + (item.valorTotal || 0), 0);
    setFormData(prev => ({ ...prev, valorTotalGeral: total }));
  }, [formData.itensFinanceiros]);

  // Lógica para marcar/desmarcar item e definir valor
  const handleToggleItem = (nomeItem: string) => {
    const existe = formData.itensFinanceiros?.find(i => i.descricao === nomeItem);
    
    if (existe) {
      // Remove se já existir
      setFormData(prev => ({
        ...prev,
        itensFinanceiros: prev.itensFinanceiros?.filter(i => i.descricao !== nomeItem)
      }));
    } else {
      // Adiciona novo item com valor 0
      const novoItem: ItemFinanceiro = {
        id: crypto.randomUUID(),
        descricao: nomeItem,
        quantidade: 1,
        valorUnitario: 0,
        valorTotal: 0
      };
      setFormData(prev => ({
        ...prev,
        itensFinanceiros: [...(prev.itensFinanceiros || []), novoItem]
      }));
    }
  };

  const handleUpdatePrice = (nomeItem: string, preco: number) => {
    setFormData(prev => ({
      ...prev,
      itensFinanceiros: prev.itensFinanceiros?.map(item => 
        item.descricao === nomeItem 
          ? { ...item, valorUnitario: preco, valorTotal: preco } 
          : item
      )
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData } as Demanda);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900";
  const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-bold">
          9-11
        </div>
        <div>
          <h2 className="text-2xl font-black">Registro de Demanda</h2>
          <p className="text-slate-500 text-sm italic">Selecione os itens e defina os valores.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEÇÃO DE ITENS PADRÃO (ITEM 9, 10, 11) */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <label className={labelClass}>Itens da Demanda (ITEM 9, 10, 11)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ITENS_PADRAO.map(itemNome => {
              const itemVinculado = formData.itensFinanceiros?.find(i => i.descricao === itemNome);
              return (
                <div key={itemNome} className={`p-4 rounded-xl border-2 transition-all ${itemVinculado ? 'border-indigo-500 bg-white' : 'border-transparent bg-slate-100'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <input 
                      type="checkbox" 
                      checked={!!itemVinculado} 
                      onChange={() => handleToggleItem(itemNome)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="font-bold text-sm">{itemNome}</span>
                  </div>
                  {itemVinculado && (
                    <input 
                      type="number" 
                      placeholder="Valor R$" 
                      className={inputClass}
                      value={itemVinculado.valorUnitario || ''}
                      onChange={(e) => handleUpdatePrice(itemNome, Number(e.target.value))}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor Total: </span>
            <span className="text-xl font-black text-indigo-600">R$ {formData.valorTotalGeral?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* DADOS DA EMPRESA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Empresa Contratante</label>
            <select required className={inputClass} value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
              <option value="">Selecione...</option>
              {empresas.map(emp => <option key={emp.id} value={emp.nome
