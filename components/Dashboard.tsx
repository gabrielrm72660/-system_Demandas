
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { Demand } from '../types';
import { formatCurrency } from '../constants';

interface DashboardProps {
  demands: Demand[];
}

export const Dashboard: React.FC<DashboardProps> = ({ demands }) => {
  const [filterMonth, setFilterMonth] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('');
  const [filterResponsavel, setFilterResponsavel] = useState('');

  const filteredDemands = useMemo(() => {
    return demands.filter(d => {
      // Filtro de mês baseado na data de solicitação (YYYY-MM)
      const demandMonth = d.dataSolicitacao ? d.dataSolicitacao.substring(0, 7) : '';
      const matchMonth = filterMonth ? demandMonth === filterMonth : true;
      const matchEmpresa = filterEmpresa ? d.empresa === filterEmpresa : true;
      const matchResponsavel = filterResponsavel ? d.responsavel.toLowerCase().includes(filterResponsavel.toLowerCase()) : true;
      return matchMonth && matchEmpresa && matchResponsavel;
    });
  }, [demands, filterMonth, filterEmpresa, filterResponsavel]);

  const stats = useMemo(() => {
    const totalRequests = filteredDemands.length;
    const completed = filteredDemands.filter(d => d.status === 'Concluída' || d.status === 'Faturada').length;
    const completionRate = totalRequests > 0 ? (completed / totalRequests) * 100 : 0;
    
    // Valor total calculado pela soma dos itens financeiros
    const totalValue = filteredDemands.reduce((acc, d) => {
      const financialTotal = d.financialItems?.reduce((sum, item) => sum + item.total, 0) || 0;
      return acc + financialTotal;
    }, 0);

    const statusCounts = filteredDemands.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalRequests, completionRate, totalValue, statusCounts };
  }, [filteredDemands]);

  const volumeData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredDemands.forEach(d => {
      const month = d.dataSolicitacao ? d.dataSolicitacao.substring(0, 7) : 'Sem Data';
      map[month] = (map[month] || 0) + 1;
    });
    return Object.keys(map).sort().map(month => ({
      name: month,
      demandas: map[month]
    })).slice(-6);
  }, [filteredDemands]);

  const billingTrendData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredDemands.forEach(d => {
      const month = d.mesFaturamento || 'Não Faturado';
      const total = d.financialItems?.reduce((sum, item) => sum + item.total, 0) || 0;
      map[month] = (map[month] || 0) + total;
    });
    // Ordenação simplificada por nome do mês (ex: Janeiro, Fevereiro...)
    const monthsOrder = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return Object.keys(map).sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b)).map(month => ({
      name: month,
      valor: map[month]
    })).slice(-6);
  }, [filteredDemands]);

  const uniqueEmpresas = Array.from(new Set(demands.map(d => d.empresa)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Gestão</h1>
          <p className="text-slate-500 dark:text-slate-400">Visão consolidada de demandas e faturamento</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <input 
            type="month" 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select 
            value={filterEmpresa}
            onChange={(e) => setFilterEmpresa(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas Empresas</option>
            {uniqueEmpresas.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input 
            type="text"
            placeholder="Responsável..."
            value={filterResponsavel}
            onChange={(e) => setFilterResponsavel(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">
              <i className="fa-solid fa-wallet"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Valor Total (c/ BDI)</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</h3>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[100%]"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total de Demandas</p>
              <h3 className="text-2xl font-bold">{stats.totalRequests}</h3>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[100%]"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 text-xl">
              <i className="fa-solid fa-check-double"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Taxa de Conclusão</p>
              <h3 className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</h3>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-500" 
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">Volume Mensal de Solicitações</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="demandas" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">Projeção de Faturamento (p/ Mês)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={billingTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
