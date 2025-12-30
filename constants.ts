
export const BDI_FIXO: Record<string, number> = {
  'Item 8': 28.15,
  'Item 9': 21.15,
  'Item 10': 14.38,
  'Item 11': 18.07,
};

export const BDI_MAPPING = BDI_FIXO;

export const STATUS_OPTIONS: string[] = ['Aberta', 'Em Execução', 'Concluída', 'Faturada'];

export const STATUS_COLORS: Record<string, string> = {
  'Aberta': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  'Em Execução': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  'Concluída': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  'Faturada': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
};

/**
 * Calcula o mês de faturamento baseado na data de conclusão.
 * Regra: Mês subsequente à conclusão.
 */
export const calcularMesFaturamento = (dataConclusao: string): string => {
  if (!dataConclusao) return '';
  const data = new Date(dataConclusao + 'T12:00:00');
  data.setMonth(data.getMonth() + 1);
  const mes = data.toLocaleString('pt-BR', { month: 'long' });
  const ano = data.getFullYear();
  return `${mes.charAt(0).toUpperCase() + mes.slice(1)} / ${ano}`;
};

export const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export const formatCurrency = formatarMoeda;
