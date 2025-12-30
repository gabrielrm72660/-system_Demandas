
export type Status = 'Aberta' | 'Em Execução' | 'Concluída' | 'Faturada';

export interface CatalogItem {
  id: string;
  name: string;
  unitValue: number;
  unitMeasure: string;
}

export interface Attachment {
  name: string;
  type: string;
  size: number;
  data: string; // Base64
}

export interface FinancialRecord {
  id: string;
  itemId: string;
  name: string;
  unitValue: number;
  unitMeasure: string;
  quantity: number;
  bdi: number;
  total: number;
}

export interface Company {
  id: string;
  name: string;
}

export interface Demand {
  id: string;
  empresa: string;
  citsmartId: string;
  sei: string;
  tipoServico: string;
  descricao: string;
  solicitante: string;
  setor: string;
  local: string;
  responsavel: string;
  dataSolicitacao: string;
  dataConclusao: string;
  mesFaturamento: string;
  status: Status;
  attachments: Attachment[];
  financialItems: FinancialRecord[];
  createdAt: number;
}

export type Role = 'ADMIN' | 'USER';

export interface User {
  username: string;
  role: Role;
  password?: string;
}
