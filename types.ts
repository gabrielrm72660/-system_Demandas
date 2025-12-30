/**
 * Interface para o Catálogo de Itens/Materiais
 * Permite cadastrar itens com valores e unidades pré-definidos
 */
export interface ItemCatalogo {
  id: string;
  nome: string;
  valorUnitario: number;
  unidade: string; // ex: 'Un', 'Metro', 'Kit'
  bdi: number;     // Porcentagem de BDI (ex: 28.15)
}

/**
 * Interface para os Itens adicionados a uma Demanda específica
 * Usada na parte financeira (Etapa 2)
 */
export interface ItemFinanceiro {
  itemId: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  bdi: number;
  valorTotal: number; // (valorUnitario * quantidade) + BDI
}

/**
 * Interface para Anexos
 * Suporta PDF, Excel, Word e Imagens via Base64
 */
export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  base64: string; // Conteúdo do arquivo
  dataUpload: string;
}

/**
 * Interface Principal da Demanda
 * Organizada para separar o operacional do financeiro
 */
export interface Demanda {
  id: string;
  
  // Identificação e Empresa
  empresa: string;
  citsmartSei: string;   // Campo solicitado: Nº Citsmart/SEI
  os4bisSei: string;     // Campo solicitado: Nº 4BIS/OS/SEI
  
  // Informações da Solicitação
  tipoServico: string;
  descricao: string;
  solicitante: string;
  setorSala: string;
  localAndar: string;
  responsavel: string;
  
  // Controle de Datas
  dataSolicitacao: string; // Formato YYYY-MM-DD
  dataConclusao: string;   // Formato YYYY-MM-DD
  mesFaturamento: string;  // Gerado automaticamente (Mês seguinte à conclusão)
  
  // Status do Fluxo
  status: 'Aberta' | 'Em Execução' | 'Concluída' | 'Faturada';
  
  // Parte Financeira (Adicionada posteriormente)
  itensFinanceiros: ItemFinanceiro[];
  valorTotalGeral: number;
  
  // Documentação
  anexos: Anexo[];
}

/**
 * Interface para Configurações do Sistema
 */
export interface Configuracoes {
  empresas:
