
// Import React to fix "Cannot find namespace 'React'" error when using React.FC
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend
} from 'recharts';
import { Demanda } from '../types.ts';
import { formatCurrency, TIPO_SERVICO_OPTIONS } from '../constants.ts';

interface DashboardProps {
  demandas: Demanda[];
}

export const Dashboard: React.FC<DashboardProps> = ({ demandas }) => {
  const [filterMonth, setFilterMonth] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const filteredDemands = useMemo(() => {
    return demandas.filter(d => {
      const demandMonth = d.dataSolicitacao ? d.dataSolicitacao.substring(0, 7) : '';
      const matchMonth = filterMonth ? demandMonth === filterMonth : true;
      const matchEmpresa = filterEmpresa ? d.empresa === filterEmpresa : true;
      const matchTipo = filterTipo ? d.tipoServico === filterTipo : true;
      return matchMonth && matchEmpresa && matchTipo;
    });
  }, [demandas, filterMonth, filterEmpresa, filterTipo]);

  const stats = useMemo(() => {
    const totalRequests = filteredDemands.length;
    const completed = filteredDemands.filter(d => d.status === 'Concluída' || d.status === 'Faturada').length;
    const completionRate = totalRequests > 0 ? (completed / totalRequests) * 100 : 0;
    
    const totalValue = filteredDemands.reduce((acc, d) => {
      const financialTotal = d.itensFinanceiros?.reduce((sum, item) => sum + item.total, 0) || 0;
      return acc + financialTotal;
    }, 0);

    return { totalRequests, completionRate, totalValue };
  }, [filteredDemands]);

  // Pegar os últimos 6 meses presentes nos dados
  const last6Months = useMemo(() => {
    const months = Array.from(new Set(demandas.map(d => d.dataSolicitacao?.substring(0, 7) || '')))
      .filter(m => m !== '')
      .sort()
      .slice(-6);
    return months;
  }, [demandas]);

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

  // Dados para o gráfico empilhado por tipo de serviço
  const typeDistributionData = useMemo(() => {
    return last6Months.map(month => {
      const entry: any = { name: month };
      TIPO_SERVICO_OPTIONS.forEach(tipo => {
        const count = filteredDemands.filter(d => 
          d.dataSolicitacao?.startsWith(month) && d.tipoServico === tipo
        ).length;
        if (count > 0) entry[tipo] = count;
      });
      return entry;
    });
  }, [filteredDemands, last6Months]);

  const billingTrendData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredDemands.forEach(d => {
      const month = d.mesFaturamento || 'Não Faturado';
      const total = d.itensFinanceiros?.reduce((sum, item) => sum + item.total, 0) || 0;
      map[month] = (map[month] || 0) + total;
    });
    const monthsOrder = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return Object.keys(map).sort((a, b) => {
      const idxA = monthsOrder.findIndex(m => a.includes(m));
      const idxB = monthsOrder.findIndex(m => b.includes(m));
      return idxA - idxB;
    }).map(month => ({
      name: month,
      valor: map[month]
    })).slice(-6);
  }, [filteredDemands]);

  const uniqueEmpresas = Array.from(new Set(demandas.map(d => d.empresa)));

  // Cores dinâmicas para os tipos de serviço no gráfico
  const typeColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', 
    '#10b981', '#06b6d4', '#3b82f6', '#64748b', '#78350f',
    '#059669', '#d946ef', '#fb923c', '#4ade80', '#2dd4bf'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resumo Executivo</h1>
          <p className="text-slate-500 dark:text-slate-400">Acompanhamento de performance e projeções</p>
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
          <select 
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos os Tipos</option>
            {TIPO_SERVICO_OPTIONS.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">
              <i className="fa-solid fa-coins"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Portfólio Total</p>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(stats.totalValue)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Solicitações</p>
              <h3 className="text-2xl font-bold">{stats.totalRequests}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 text-xl">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Eficiência</p>
              <h3 className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">Volume de Demandas (Mensal)</h3>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
          <h3 className="text-lg font-bold mb-6">Previsão de Faturamento</h3>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={billingTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
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

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-6">Distribuição de Tickets por Categoria</h3>
        <div className="h-96 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeDistributionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
              {TIPO_SERVICO_OPTIONS.map((tipo, index) => (
                <Bar 
                  key={tipo} 
                  dataKey={tipo} 
                  stackId="a" 
                  fill={typeColors[index % typeColors.length]} 
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <h3 className="text-lg font-bold mb-6">Detalhamento de Demandas Mensais por Item</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">Tipo de Ticket</th>
                {last6Months.map(month => (
                  <th key={month} className="px-6 py-4 text-center">{month}</th>
                ))}
                <th className="px-6 py-4 text-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {TIPO_SERVICO_OPTIONS.map(tipo => {
                const rowTotal = last6Months.reduce((sum, month) => {
                  return sum + filteredDemands.filter(d => d.dataSolicitacao?.startsWith(month) && d.tipoServico === tipo).length;
                }, 0);

                if (rowTotal === 0 && !filterTipo) return null; // Ocultar se não houver dados, a menos que filtrado
                if (filterTipo && tipo !== filterTipo) return null;

                return (
                  <tr key={tipo} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{tipo}</td>
                    {last6Months.map(month => {
                      const count = filteredDemands.filter(d => d.dataSolicitacao?.startsWith(month) && d.tipoServico === tipo).length;
                      return (
                        <td key={month} className="px-6 py-4 text-center">
                          {count > 0 ? (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-black">
                              {count}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center bg-indigo-50/50 dark:bg-indigo-900/10 font-black text-indigo-600 dark:text-indigo-400">
                      {rowTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
