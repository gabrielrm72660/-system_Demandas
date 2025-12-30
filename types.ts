
export type StatusDemanda = 'Aberta' | 'Em Execução' | 'Concluída' | 'Faturada';

export interface ItemFinanceiro {
  id: string;
  nome: string;
  valorUnitario: number;
  unidade: string;
  bdi: number;
  quantidade: number;
  total: number;
}

export interface ItemCatalogo {
  id: string;
  nome: string;
  valorUnitario: number;
  unidade: string;
}

export interface Anexo {
  nome: string;
  tipo: string;
  data: string; // Armazenado como Base64 string
}

export interface Demanda {
  id: string;
  empresa: string;
  nCitsmartSei: string;
  n4bisOsSei: string;
  tipoServico: string;
  descricao: string;
  solicitante: string;
  setor: string;
  local: string;
  responsavel: string;
  dataSolicitacao: string;
  dataConclusao: string;
  mesFaturamento: string;
  status: StatusDemanda;
  anexos: Anexo[];
  itensFinanceiros: ItemFinanceiro[];
  createdAt: number;
}

export interface Empresa {
  id: string;
  nome: string;
}

export interface Usuario {
  username: string;
  role: 'ADMIN' | 'USER';
  password?: string;
}
