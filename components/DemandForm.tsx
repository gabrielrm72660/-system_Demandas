import React, { useState } from 'react';
import { Demanda, Empresa, Anexo, ItemFinanceiro } from '../types.ts';
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
    const outrosItens = formData.itensFinanceiros?.filter(i => i.descricao !== nome) || [];
    const novosItens = [...outrosItens, { 
      id: crypto.randomUUID(), 
      descricao: nome, 
      valorUnitario: valor, 
      valorTotal: valor, 
      quantidade: 1 
    }];
    
    const novoTotal = novosItens.reduce((acc, curr) => acc + curr.valorTotal, 0);
    setFormData({ ...formData, itensFinanceiros: novosItens, valorTotalGeral: novoTotal });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData } as Demanda);
  };

  const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Nova Demanda</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ITENS PADRÃO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-100 rounded-lg">
          {['ITEM 9', 'ITEM 10', 'ITEM 11'].map(itemNome => (
            <div key={itemNome} className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">{itemNome}</label>
              <input 
                type="number" 
                placeholder="Valor R$" 
                className={inputClass}
                onChange={(e) => handleUpdateItem(itemNome, Number(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Empresa</label>
            <select required className={inputClass} value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
              <option value="">Selecione...</option>
              {empresas.map(emp => <option key={emp.id} value={emp.nome}>{emp.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Solicitante</label>
            <input required type="text" className={inputClass} value={formData.solicitante || ''} onChange={e => setFormData({...formData, solicitante: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-bold text-blue-600">
            Total: R$ {formData.valorTotalGeral?.toFixed(2)}
          </div>
          <div className="space-x-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-500 font-medium">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Salvar</button>
          </div>
        </div>
      </form>
    </div>
  );
};
