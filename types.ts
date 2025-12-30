export interface ItemCatalogo {
  nome: string;
  valorUnitario: number;
  unidade: string;
  bdi: number;
}

export interface Demanda {
  id: string;
  empresa: string;
  citsmartSei: string;   // Novo campo
  os4bisSei: string;     // Novo campo
  tipoServico: string;
  descricao: string;
  solicitante: string;
  setor: string;
  local: string;
  responsavel: string;
  dataSolicitacao: string;
  dataConclusao: string;
  mesFaturamento: string; // Automático
  status: 'Aberta' | 'Em Execução' | 'Concluída' | 'Faturada';
  itensFinanceiros: { nome: string; quantidade: number; valorTotal: number }[];
  anexos: { nome: string; data: string }[]; // Base64
}
