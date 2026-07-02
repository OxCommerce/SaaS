/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global navigation menus
export type ActiveMenu =
  | 'dashboard'
  | 'comercial'
  | 'fiscal'
  | 'financeiro'
  | 'logistica'
  | 'cadastros'
  | 'relatorios'
  | 'configuracoes';

export type SubMenuComercial = 'compras' | 'ordens-compra' | 'negociacoes';
export type SubMenuFiscal = 'gta' | 'cte' | 'nfe';
export type SubMenuFinanceiro = 'receber' | 'pagar' | 'fluxo' | 'conciliacao';
export type SubMenuLogistica = 'transporte' | 'viagens' | 'rastreamento' | 'fretes';
export type SubMenuCadastros = 'clientes' | 'fornecedores' | 'parceiros' | 'motoristas' | 'usuarios' | 'centros_custo' | 'bancos' | 'tipos_parceiro' | 'categorias';
export type SubMenuConfiguracoes = 'usuarios' | 'identidade' | 'integracoes' | 'auditoria';

// Commercial module structures
export interface Compra {
  id: string;
  numeroOperacao: string;
  fornecedor: string;
  fazendaOrigem: string;
  municipio: string;
  estado: string;
  categoriaAnimal: string;
  quantidade: number;
  pesoMedio: number; // in kg
  pesoTotal: number; // in kg
  valorArroba: number; // in BRL
  comissao: number; // percentage
  frete: number; // standard transport cost
  valorTotal: number; // calculated
  dataCriacao: string;
  dataEntrega?: string;
  ordemCompraClienteId?: string; // Link to client purchase order
  prazoPagamento?: string;
  formaPagamento?: string;
  observacoes?: string;
  status?: string;
  pais?: string;
  corretor?: string;
  codigoCorretor?: string;
  motorista?: string;
  codigoMotorista?: string;
  veiculo?: string;
  placa?: string;
  destinoFrigorifico?: string;
  destinoCidade?: string;
  destinoEstado?: string;
  destinoPais?: string;
  destinoCodigo?: string;
  destinoFazenda?: string;
  codigoFornecedor?: string;
  codigoOrdemCompraCliente?: string;
  tipoCompra?: string;
  emissorGTA?: string;
  valorGTA?: number;
}

export interface OrdemCompraCliente {
  id: string;
  numeroOC: string;
  cliente: string;
  frigorifico: string;
  categoriaAnimal: string;
  quantidade: number;
  peso: number; // weight in kg
  valorArroba: number; // BRL per @
  comissao: number; // percentage
  resultadoOperacao: number; // total calculated profit/loss
  status: 'Pendente' | 'Programada' | 'Em Transito' | 'Faturada' | 'Entregue';
  dataCriacao: string;
  codigoCliente?: string;
  codigoOrdemCompraCliente?: string;
}

export interface Negociacao {
  id: string;
  titulo: string;
  clienteFornecedor: string;
  fazenda: string;
  cabecas: number;
  valorEstimado: number;
  contatoTelefone: string;
  fase: 'prospeccao' | 'negociacao' | 'documentacao' | 'aprovado' | 'cancelado';
  ultimaAtualizacao: string;
  ordemCompraClienteId?: string; // Link to client purchase order
  processoId?: string;
  pais?: string;
  estado?: string;
  cidade?: string;
  codigoClienteFornecedor?: string;
  destinoCodigo?: string;
  destinoFrigorifico?: string;
  destinoFazenda?: string;
  destinoCidade?: string;
  destinoEstado?: string;
  destinoPais?: string;
  tipoCompra?: string;
}

export interface Lote {
  id: string;
  codigoLote: string;
  proprietario: string;
  origem: string;
  quantidade: number;
  peso: number; // in kg
  status: 'Em Engorda' | 'Pronto Abate' | 'Quarentena' | 'Em Trânsito';
}

// Fiscal module structures
export interface GTA {
  id: string;
  numeroGTA: string;
  origem: string;
  destino: string;
  quantidadeAnimais: number;
  dataEmissao: string;
  status: 'Emitido' | 'Homologado' | 'Vencido' | 'Pendente';
  codigoRastreabilidade: string;
  observações: string;
  processoId?: string;
}

export interface CTE {
  id: string;
  numeroCTE: string;
  transportadora: string;
  motorista: string;
  veiculo: string;
  placa: string;
  valorFrete: number;
  situacao: 'Autorizado' | 'Cancelado' | 'Pendente';
  dataEmissao: string;
  processoId?: string;
}

export interface NFE {
  id: string;
  numeroNFE: string;
  emissao: string;
  remetente: string;
  destinatario: string;
  xmlContent: string;
  danfeSimulado: string;
  assinaturaDigital: string;
  situacaoSefaz: 'Autorizada' | 'Rejeitada' | 'Denegada';
  valorTotal: number;
  processoId?: string;
}

// Financeiro module structures
export interface TransacaoFinanceira {
  id: string;
  descricao: string;
  tipo: 'receita' | 'despesa';
  subcategoria: 'Venda de Bovinos' | 'Compra de Gado' | 'Transporte' | 'Impostos' | 'Mão de Obra' | 'Outros';
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'Pago' | 'Pendente' | 'Vencido';
  conta: string;
  processoId?: string;
}

export interface ConciliacaoBancaria {
  id: string;
  data: string;
  descricaoExtrato: string;
  valorExtrato: number;
  transacaoCorrespondente?: string;
  status: 'Conciliado' | 'Pendente' | 'Divergente';
}

// Logística module structures
export interface ViagemLogistica {
  id: string;
  placa: string;
  motorista: string;
  veiculo: string;
  origem: string;
  destino: string;
  quantidadeCabecas: number;
  freteContratado: number;
  status: 'Embarque' | 'Transporte' | 'Chegada' | 'Descarga' | 'Concluída';
  coordenadasAtuais: { x: number; y: number }; // Simulated positioning 0 to 100 on canvas grid
  bateriaRastreador: number;
  velocidadeKmH: number;
  atualizadoHa: string;
  eventoLog: Array<{ status: string; dataHora: string; descricao: string }>;
}

// Configuration & global settings
export interface DatabaseStats {
  statusOnline: boolean;
  usoCPU: number;
  usoMemoria: number;
  latenciaMs: number;
  ultimoBackup: string;
}

export interface AppConfig {
  logoUrl: string;
  sistemaNome: string;
  corPrincipal: string; // Hex representation
  corSecundaria: string;
  temaPreset: 'agronomia-dark' | 'pecuaria-light';
  integracoes: {
    sefaz: boolean;
    gtaEstadual: boolean;
    bancos: boolean;
    whatsapp: boolean;
    email: boolean;
  };
}
