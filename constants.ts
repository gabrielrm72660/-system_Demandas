
export const TIPO_SERVICO_OPTIONS = [
  'Desenvolvimento',
  'Suporte Técnico',
  'Consultoria',
  'Manutenção Corretiva',
  'Manutenção Evolutiva',
  'Treinamento',
  'Outros'
];

export const BDI_MAPPING: Record<string, number> = {
  'Item 8': 28.15,
  'Item 9': 21.15,
  'Item 10': 14.38,
  'Item 11': 18.07,
};

export const STATUS_OPTIONS: string[] = ['Aberta', 'Em Execução', 'Concluída', 'Faturada'];

export const STATUS_COLORS: Record<string, string> = {
  'Aberta': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Em Execução': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Concluída': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Faturada': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export const getNextMonthName = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00'); // Prevent timezone issues
  date.setMonth(date.getMonth() + 1);
  const monthName = date.toLocaleString('pt-BR', { month: 'long' });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};
