/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Compra,
  OrdemCompraCliente,
  Negociacao,
  Lote,
  GTA,
  CTE,
  NFE,
  TransacaoFinanceira,
  ConciliacaoBancaria,
  ViagemLogistica,
  DatabaseStats,
  AppConfig
} from '../types';

export const INITIAL_COMPRAS: Compra[] = [
  {
    id: 'c-1',
    numeroOperacao: 'OP-2026-001',
    fornecedor: 'José Carlos Albuquerque',
    fazendaOrigem: 'Fazenda Santa Rita',
    municipio: 'Rondonópolis',
    estado: 'MT',
    categoriaAnimal: 'Boi Gordo',
    quantidade: 120,
    pesoMedio: 540,
    pesoTotal: 64800,
    valorArroba: 282.5,
    comissao: 1.5,
    frete: 4500,
    valorTotal: 614790,
    dataCriacao: '2026-06-10',
    ordemCompraClienteId: 'v-1'
  },
  {
    id: 'c-2',
    numeroOperacao: 'OP-2026-002',
    fornecedor: 'Agropecuária Vale Verde',
    fazendaOrigem: 'Estância do Sol',
    municipio: 'Rio Verde',
    estado: 'GO',
    categoriaAnimal: 'Garrote',
    quantidade: 250,
    pesoMedio: 380,
    pesoTotal: 95000,
    valorArroba: 265.0,
    comissao: 2.0,
    frete: 9200,
    valorTotal: 848530,
    dataCriacao: '2026-06-12'
  },
  {
    id: 'c-3',
    numeroOperacao: 'OP-2026-003',
    fornecedor: 'Marcos de Souza Neves',
    fazendaOrigem: 'Sítio Novo',
    municipio: 'Redenção',
    estado: 'PA',
    categoriaAnimal: 'Novilha',
    quantidade: 85,
    pesoMedio: 320,
    pesoTotal: 27200,
    valorArroba: 258.0,
    comissao: 1.0,
    frete: 3600,
    valorTotal: 237392,
    dataCriacao: '2026-06-14'
  },
  {
    id: 'c-4',
    numeroOperacao: 'OP-2026-004',
    fornecedor: 'Katia Regina Mendes',
    fazendaOrigem: 'Fazenda Palmeiras',
    municipio: 'Três Lagoas',
    estado: 'MS',
    categoriaAnimal: 'Vaca Gorda',
    quantidade: 140,
    pesoMedio: 460,
    pesoTotal: 64400,
    valorArroba: 260.0,
    comissao: 1.8,
    frete: 5100,
    valorTotal: 564106,
    dataCriacao: '2026-06-18',
    ordemCompraClienteId: 'v-2'
  }
];

export const INITIAL_ORDENS_COMPRA_CLIENTE: OrdemCompraCliente[] = [
  {
    id: 'v-1',
    numeroOC: 'OC-2026-001',
    cliente: 'JBS Alimentos S/A',
    frigorifico: 'Unidade Rondonópolis - JBS',
    categoriaAnimal: 'Boi Gordo',
    quantidade: 120,
    peso: 64800,
    valorArroba: 295.0,
    comissao: 0.5,
    resultadoOperacao: 637200,
    status: 'Entregue',
    dataCriacao: '2026-06-11'
  },
  {
    id: 'v-2',
    numeroOC: 'OC-2026-002',
    cliente: 'Marfrig Global Foods',
    frigorifico: 'Planta de Bataguassu - Marfrig',
    categoriaAnimal: 'Vaca Gorda',
    quantidade: 140,
    peso: 64400,
    valorArroba: 292.0,
    comissao: 1.0,
    resultadoOperacao: 620500,
    status: 'Faturada',
    dataCriacao: '2026-06-19'
  },
  {
    id: 'v-3',
    numeroOC: 'OC-2026-003',
    cliente: 'Minerva Foods',
    frigorifico: 'Unidade Barretos - Minerva',
    categoriaAnimal: 'Boi Gordo',
    quantidade: 90,
    peso: 44100,
    valorArroba: 298.0,
    comissao: 0.8,
    resultadoOperacao: 432500,
    status: 'Pendente',
    dataCriacao: '2026-06-20'
  }
];

export const INITIAL_NEGOCIACOES: Negociacao[] = [
  {
    id: 'n-1',
    titulo: 'Lote Boi Padrão Europa',
    clienteFornecedor: 'Fazenda Nelore Real (Alberto Santos)',
    fazenda: 'Nelore Real',
    cabecas: 350,
    valorEstimado: 1150000,
    contatoTelefone: '(66) 99882-1244',
    fase: 'negociacao',
    ultimaAtualizacao: '2026-06-22 09:30',
    ordemCompraClienteId: 'v-3'
  },
  {
    id: 'n-2',
    titulo: 'Compra Garrotes Nelore',
    clienteFornecedor: 'Sandra Regina de Paula',
    fazenda: 'Primavera de Minas',
    cabecas: 180,
    valorEstimado: 480000,
    contatoTelefone: '(34) 99121-7890',
    fase: 'prospeccao',
    ultimaAtualizacao: '2026-06-21 15:45'
  },
  {
    id: 'n-3',
    titulo: 'Venda Urgente Vacas Descarte',
    clienteFornecedor: 'Frigorífico Pantanal Ltda',
    fazenda: 'Recanto do Sossego',
    cabecas: 75,
    valorEstimado: 210000,
    contatoTelefone: '(67) 98111-5432',
    fase: 'documentacao',
    ultimaAtualizacao: '2026-06-22 11:20',
    processoId: 'PRC-260612-GO-0002'
  },
  {
    id: 'n-4',
    titulo: 'Terminação Boi Confinado JBS',
    clienteFornecedor: 'JBS Unidade Barra do Garças',
    fazenda: 'Confinamento Central',
    cabecas: 500,
    valorEstimado: 1720000,
    contatoTelefone: '(66) 99222-3344',
    fase: 'aprovado',
    ultimaAtualizacao: '2026-06-15 17:00',
    ordemCompraClienteId: 'v-1',
    processoId: 'PRC-260610-MT-0001'
  },
  {
    id: 'n-5',
    titulo: 'Novilhas Cruzamento Industrial',
    clienteFornecedor: 'Arthur Bernardes Filho',
    fazenda: 'Estrela Guia',
    cabecas: 110,
    valorEstimado: 320000,
    contatoTelefone: '(62) 99655-4321',
    fase: 'cancelado',
    ultimaAtualizacao: '2026-06-18 10:00'
  }
];

export const INITIAL_LOTES: Lote[] = [
  { id: 'l-1', codigoLote: 'LOT-MT-098', proprietario: 'Carlos Eduardo Mendes', origem: 'Fazenda Vista Alegre (MT)', quantidade: 120, peso: 64800, status: 'Em Trânsito' },
  { id: 'l-2', codigoLote: 'LOT-GO-554', proprietario: 'Agropecuária Vale Verde', origem: 'Estância do Sol (GO)', quantidade: 250, peso: 95000, status: 'Em Engorda' },
  { id: 'l-3', codigoLote: 'LOT-PA-112', proprietario: 'Ox Commerce S/A', origem: 'Sítio Novo (PA)', quantidade: 85, peso: 27200, status: 'Pronto Abate' },
  { id: 'l-4', codigoLote: 'LOT-MS-740', proprietario: 'Katia Regina Mendes', origem: 'Fazenda Palmeiras (MS)', quantidade: 140, peso: 64400, status: 'Quarentena' }
];

export const INITIAL_GTAS: GTA[] = [
  {
    id: 'gta-1',
    numeroGTA: '351403212876612',
    origem: 'Rondonópolis - MT (Fazenda Santa Rita)',
    destino: 'Barretos - SP (Planta Frigorífico Minerva)',
    quantidadeAnimais: 120,
    dataEmissao: '2026-06-10',
    status: 'Homologado',
    codigoRastreabilidade: 'RAS-MT-351403',
    observações: 'Gado Nelore para abate imediato. Vacinação anti-aftosa em dia.',
    processoId: 'PRC-260610-MT-0001'
  },
  {
    id: 'gta-2',
    numeroGTA: '521809054321455',
    origem: 'Rio Verde - GO (Estância do Sol)',
    destino: 'Rondonópolis - MT (Fazenda Santa Rita)',
    quantidadeAnimais: 250,
    dataEmissao: '2026-06-12',
    status: 'Emitido',
    codigoRastreabilidade: 'RAS-GO-521809',
    observações: 'Garrotes para recria e engorda. Trânsito interestadual autorizado.',
    processoId: 'PRC-260612-GO-0002'
  },
  {
    id: 'gta-3',
    numeroGTA: '150493821034441',
    origem: 'Redenção - PA (Sítio Novo)',
    destino: 'Marabá - PA (Frigorífico Prime)',
    quantidadeAnimais: 85,
    dataEmissao: '2026-06-14',
    status: 'Pendente',
    codigoRastreabilidade: 'RAS-PA-150493',
    observações: 'Novilhas. Aguardando liberação do IDAF/SDA-PA.',
    processoId: 'PRC-260614-PA-0003'
  }
];

export const INITIAL_CTES: CTE[] = [
  { id: 'cte-1', numeroCTE: 'CTE-352210', transportadora: 'TransGado Matogrosso', motorista: 'Valdecir Rodrigues Alves', veiculo: 'Bitrem Scania R440', placa: 'OQY-8E12', valorFrete: 4500.00, situacao: 'Autorizado', dataEmissao: '2026-06-10', processoId: 'PRC-260610-MT-0001' },
  { id: 'cte-2', numeroCTE: 'CTE-523190', transportadora: 'Expresso Boiadeiro', motorista: 'Ailton Senna de Souza', veiculo: 'Carreta Simples Volvo FH540', placa: 'GVT-2A44', valorFrete: 9200.00, situacao: 'Autorizado', dataEmissao: '2026-06-12', processoId: 'PRC-260612-GO-0002' },
  { id: 'cte-3', numeroCTE: 'CTE-150998', transportadora: 'LogPesados Agronegócio', motorista: 'Roberto Carlos Santos', veiculo: 'Bi-trem Mercedes Actros', placa: 'KAP-9988', valorFrete: 3600.00, situacao: 'Pendente', dataEmissao: '2026-06-14', processoId: 'PRC-260614-PA-0003' }
];

export const INITIAL_NFES: NFE[] = [
  {
    id: 'nfe-1',
    numeroNFE: 'NFE-0001098273',
    emissao: '2026-06-10',
    remetente: 'José Carlos Albuquerque (Fazenda Santa Rita)',
    destinatario: 'JBS Alimentos S/A',
    xmlContent: '<?xml version="1.0" encoding="UTF-8"?><infNfe Versao="4.00"><emit><CNPJ>01.234.567/0001-89</CNPJ><xNome>José Carlos Albuquerque</xNome></emit><dest><CNPJ>02.444.111/0001-22</CNPJ><xNome>JBS Alimentos S/A</xNome></dest><total><ICMS><vProd>614790.00</vProd></ICMS></total></infNfe>',
    danfeSimulado: 'NOTA FISCAL ELETRÔNICA DE PRODUTOR RURAL - SERVIÇO ATIVO SEFAZ MT',
    assinaturaDigital: 'SHA256: 8F092AD319BCED2298FBEFEAEE112C784ABCEEF09312EF',
    situacaoSefaz: 'Autorizada',
    valorTotal: 614790,
    processoId: 'PRC-260610-MT-0001'
  },
  {
    id: 'nfe-2',
    numeroNFE: 'NFE-0001098274',
    emissao: '2026-06-12',
    remetente: 'Agropecuária Vale Verde',
    destinatario: 'Ox Commerce S/A',
    xmlContent: '<?xml version="1.0" encoding="UTF-8"?><infNfe Versao="4.00"><emit><CNPJ>10.987.654/0001-32</CNPJ><xNome>Agropecuaria Vale Verde</xNome></emit><dest><CNPJ>33.444.555/0001-99</CNPJ><xNome>Ox Commerce S/A</xNome></dest><total><ICMS><vProd>848530.00</vProd></ICMS></total></infNfe>',
    danfeSimulado: 'NOTA FISCAL ELETRÔNICA - EMISSÃO ELETRÔNICA SEFAZ GO',
    assinaturaDigital: 'SHA256: AF90123512BCD77890AAFFCDDE11234790BBCCDD221299',
    situacaoSefaz: 'Autorizada',
    valorTotal: 848530,
    processoId: 'PRC-260612-GO-0002'
  },
  {
    id: 'nfe-3',
    numeroNFE: 'NFE-0001098275',
    emissao: '2026-06-14',
    remetente: 'Ox Commerce S/A (Sítio Novo)',
    destinatario: 'Frigorífico Prime',
    xmlContent: '<?xml version="1.0" encoding="UTF-8"?><infNfe Versao="4.00"><emit><CNPJ>33.444.555/0001-99</CNPJ><xNome>Ox Commerce S/A</xNome></emit><dest><CNPJ>03.555.222/0001-33</CNPJ><xNome>Frigorifico Prime</xNome></dest><total><ICMS><vProd>297500.00</vProd></ICMS></total></infNfe>',
    danfeSimulado: 'NOTA FISCAL ELETRÔNICA DE REMESSA DE GADO - SEFAZ PA',
    assinaturaDigital: 'SHA256: E893412A8FDEE9911CBBCC33DDEE55FF0012A3B498990',
    situacaoSefaz: 'Autorizada',
    valorTotal: 297500,
    processoId: 'PRC-260614-PA-0003'
  }
];

export const INITIAL_TRANSACÕES: TransacaoFinanceira[] = [
  { id: 't-1', descricao: 'Venda Lote 120 Bois JBS', tipo: 'receita', subcategoria: 'Venda de Bovinos', valor: 637200, dataVencimento: '2026-06-15', dataPagamento: '2026-06-15', status: 'Pago', conta: 'Banco do Brasil - Ag: 1244-X', processoId: 'PRC-260610-MT-0001' },
  { id: 't-2', descricao: 'Fatura Boleto Compra 250 Garrotes Vale Verde', tipo: 'despesa', subcategoria: 'Compra de Gado', valor: 848530, dataVencimento: '2026-06-30', status: 'Pendente', conta: 'Bradesco - Ag: 0910', processoId: 'PRC-260612-GO-0002' },
  { id: 't-3', descricao: 'Frete Bitrem TransGado Valdecir', tipo: 'despesa', subcategoria: 'Transporte', valor: 4500, dataVencimento: '2026-06-11', dataPagamento: '2026-06-11', status: 'Pago', conta: 'Banco do Brasil - Ag: 1244-X', processoId: 'PRC-260610-MT-0001' },
  { id: 't-4', descricao: 'Comissão Corretagem Nelore Real', tipo: 'despesa', subcategoria: 'Mão de Obra', valor: 9217.5, dataVencimento: '2026-06-18', dataPagamento: '2026-06-20', status: 'Pago', conta: 'Banco do Brasil - Ag: 1244-X' },
  { id: 't-5', descricao: 'Taxa Expedição GTA Estadual', tipo: 'despesa', subcategoria: 'Impostos', valor: 1240, dataVencimento: '2026-06-14', status: 'Vencido', conta: 'Bradesco - Ag: 0910', processoId: 'PRC-260614-PA-0003' },
  { id: 't-6', descricao: 'Faturamento Estimado Venda Marfrig', tipo: 'receita', subcategoria: 'Venda de Bovinos', valor: 620500, dataVencimento: '2026-06-28', status: 'Pendente', conta: 'Banco do Brasil - Ag: 1244-X', processoId: 'PRC-260612-GO-0002' }
];

export const INITIAL_CONCILIACOES: ConciliacaoBancaria[] = [
  { id: 'cb-1', data: '2026-06-15', descricaoExtrato: 'TED REB - JBS ALIM S/A RONDONOPOLIS', valorExtrato: 637200.00, transacaoCorrespondente: 't-1', status: 'Conciliado' },
  { id: 'cb-2', data: '2026-06-11', descricaoExtrato: 'PAGTO ELETRONICO TRANSGADO MATOGROSSO', valorExtrato: -4500.00, transacaoCorrespondente: 't-3', status: 'Conciliado' },
  { id: 'cb-3', data: '2026-06-20', descricaoExtrato: 'TRANSF C/C COMISSAO CORRETAGEM MT', valorExtrato: -9217.50, transacaoCorrespondente: 't-4', status: 'Conciliado' },
  { id: 'cb-4', data: '2026-06-22', descricaoExtrato: 'DEPO DINH BOI EXTRA INDEFINIDO', valorExtrato: 125000.00, status: 'Pendente' }
];

export const INITIAL_VIAGENS: ViagemLogistica[] = [
  {
    id: 'PRC-260610-MT-0001',
    placa: 'OQY-8E12',
    motorista: 'Valdecir Rodrigues Alves',
    veiculo: 'Bitrem Scania R440',
    origem: 'Rondonópolis - MT',
    destino: 'Barretos - SP',
    quantidadeCabecas: 120,
    freteContratado: 4500,
    status: 'Transporte',
    coordenadasAtuais: { x: 42, y: 55 },
    bateriaRastreador: 92,
    velocidadeKmH: 78,
    atualizadoHa: 'Há 4 min',
    eventoLog: [
      { status: 'Embarque', dataHora: '10/06/2026 08:30', descricao: 'Animais carregados e pesados na balança rodoviária da Fazenda Santa Rita.' },
      { status: 'Transporte', dataHora: '10/06/2026 10:15', descricao: 'Início do trajeto via BR-364 sentido divisa MT-MS.' },
      { status: 'Transporte', dataHora: '11/06/2026 14:00', descricao: 'Parada regulamentar para alimentação e hidratação dos animais.' }
    ]
  },
  {
    id: 'PRC-260612-GO-0002',
    placa: 'GVT-2A44',
    motorista: 'Ailton Senna de Souza',
    veiculo: 'Carreta Simples Volvo FH540',
    origem: 'Rio Verde - GO',
    destino: 'Rondonópolis - MT',
    quantidadeCabecas: 250,
    freteContratado: 9200,
    status: 'Chegada',
    coordenadasAtuais: { x: 75, y: 35 },
    bateriaRastreador: 88,
    velocidadeKmH: 15,
    atualizadoHa: 'Há 1 min',
    eventoLog: [
      { status: 'Embarque', dataHora: '12/06/2026 14:00', descricao: 'Embarque concluído em Rio Verde com liberação da guia GTA.' },
      { status: 'Transporte', dataHora: '13/06/2026 07:00', descricao: 'Veículo em rota interestadual sem irregularidades.' },
      { status: 'Chegada', dataHora: '14/06/2026 11:30', descricao: 'Veículo estacionado na portaria da Fazenda Santa Rita. Aguardando conferência.' }
    ]
  },
  {
    id: 'PRC-260614-PA-0003',
    placa: 'KAP-9988',
    motorista: 'Roberto Carlos Santos',
    veiculo: 'Bi-trem Mercedes Actros',
    origem: 'Redenção - PA',
    destino: 'Marabá - PA',
    quantidadeCabecas: 85,
    freteContratado: 3600,
    status: 'Embarque',
    coordenadasAtuais: { x: 15, y: 18 },
    bateriaRastreador: 100,
    velocidadeKmH: 0,
    atualizadoHa: 'Há 10 min',
    eventoLog: [
      { status: 'Embarque', dataHora: '14/06/2026 10:00', descricao: 'Aguardando encosto da rampa boiadeira para início do embarque.' }
    ]
  }
];

export const INITIAL_DB_STATS: DatabaseStats = {
  statusOnline: true,
  usoCPU: 18,
  usoMemoria: 42,
  latenciaMs: 14,
  ultimoBackup: 'Hoje, 04:00'
};

export const INITIAL_CONFIG: AppConfig = {
  logoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=200&auto=format&fit=crop',
  sistemaNome: 'Ox Commerce',
  corPrincipal: '#071757',
  corSecundaria: '#182763',
  temaPreset: 'pecuaria-light',
  integracoes: {
    sefaz: true,
    gtaEstadual: true,
    bancos: true,
    whatsapp: false,
    email: true
  }
};

export const CHANNELS_AUDITORIA = [
  { id: 'aud-1', usuario: 'Diego Silveira (Diretor)', acao: 'Aprovação de Negociação - OP-2026-NELORE', horario: 'Hoje, 11:45', ip: '191.185.12.90' },
  { id: 'aud-2', usuario: 'Amanda Costa (Fiscal)', acao: 'Emissão de GTA de trânsito #3514032', horario: 'Hoje, 10:14', ip: '191.185.12.92' },
  { id: 'aud-3', usuario: 'Carlos Souza (Financeiro)', acao: 'Liquidou Transação TED JBS #t-1', horario: 'Ontem, 16:32', ip: '200.143.120.3' }
];

export const CADASTRO_CLIENTES = [
  { id: 'cl-1', codigo: 'C-1006260001', nome: 'Frigorífico JBS S/A', documento: '01.234.567/0001-89', telefone: '(66) 3411-9000', estado: 'MT', tipo: 'Cliente', relacionamento: 'CLI', clientType: 'PJ' },
  { id: 'cl-2', codigo: 'C-1206260002', nome: 'Frigorífico Marfrig Global Foods', documento: '02.444.111/0001-22', telefone: '(67) 3541-1122', estado: 'MS', tipo: 'Cliente', relacionamento: 'CLI', clientType: 'PJ' },
  { id: 'cl-3', codigo: 'C-1406260003', nome: 'Minerva Foods S/A', documento: '05.555.777/0003-44', telefone: '(17) 3321-1500', estado: 'SP', tipo: 'Cliente', relacionamento: 'CLI', clientType: 'PJ' },
  { id: 'cl-4', codigo: 'C-1606260004', nome: 'Frigorífico Plena Alimentos S/A', documento: '07.888.999/0001-33', telefone: '(31) 3222-4400', estado: 'MG', tipo: 'Cliente', relacionamento: 'CLI', clientType: 'PJ' },
  { id: 'cl-5', codigo: 'C-1806260005', nome: 'Frigorífico JBS Unidade Barra do Garças', documento: '01.234.567/0005-00', telefone: '(66) 3401-2200', estado: 'MT', tipo: 'Cliente', relacionamento: 'CLI', clientType: 'PJ' }
];

export const CADASTRO_FORNECEDORES = [
  { id: 'fo-1', codigo: 'F-1006260001', nome: 'José Carlos Albuquerque', documento: '003.444.921-22', fazenda: 'Fazenda Santa Rita', estado: 'MT', tipo: 'Fornecedor', relacionamento: 'FOR', clientType: 'PF' },
  { id: 'fo-2', codigo: 'F-1206260002', nome: 'Agropecuária Vale Verde S/A', documento: '10.987.654/0001-32', fazenda: 'Estância do Sol', estado: 'GO', tipo: 'Fornecedor', relacionamento: 'FOR', clientType: 'PJ' },
  { id: 'fo-3', codigo: 'F-1406260003', nome: 'Marcos de Souza Neves', documento: '544.111.900-53', fazenda: 'Sítio Novo', estado: 'PA', tipo: 'Fornecedor', relacionamento: 'FOR', clientType: 'PF' },
  { id: 'fo-4', codigo: 'F-1606260004', nome: 'Sandra Regina de Paula', documento: '211.555.666-77', fazenda: 'Fazenda Primavera', estado: 'MG', tipo: 'Fornecedor', relacionamento: 'FOR', clientType: 'PF' },
  { id: 'fo-5', codigo: 'F-1806260005', nome: 'Alberto Santos Dumont', documento: '322.666.777-88', fazenda: 'Fazenda Nelore Real', estado: 'MT', tipo: 'Fornecedor', relacionamento: 'FOR', clientType: 'PF' }
];

export const CADASTRO_PARCEIROS = [
  { id: 'pa-1', codigo: 'P-1006260001', nome: 'Boi Gordo Corretagem Ltda', contato: 'Nelso Corretor', telefone: '(66) 99882-9988', regiao: 'Vale do Araguaia', tipo: 'Parceiro Comissionado', parceiroTipo: 'COM' },
  { id: 'pa-2', codigo: 'P-1206260002', nome: 'Leilões Agro-Oeste', contato: 'Arnaldo Rezende', telefone: '(62) 3211-5050', regiao: 'Centro-Oeste', tipo: 'Parceiro Comissionado', parceiroTipo: 'COM' },
  { id: 'pa-3', codigo: 'P-1406260003', nome: 'Souza & Silva Comissões', contato: 'Souza Santos', telefone: '(91) 98111-2222', regiao: 'Norte', tipo: 'Parceiro Comissionado', parceiroTipo: 'COM' },
  { id: 'pa-4', codigo: 'P-1606260004', nome: 'Rondon Pecuária Comissões', contato: 'Rondon Silva', telefone: '(66) 99321-4567', regiao: 'Sul', tipo: 'Parceiro Comissionado', parceiroTipo: 'COM' },
  { id: 'pa-5', codigo: 'P-1806260005', nome: 'AgroLeilão Pantanal', contato: 'Pantanal Rezende', telefone: '(67) 3222-8989', regiao: 'Centro-Oeste', tipo: 'Parceiro Comissionado', parceiroTipo: 'COM' },
  { id: 'pa-6', codigo: 'P-2006260006', nome: 'Carlos Eduardo Corretora', contato: 'Carlos Eduardo', telefone: '(11) 99555-1234', regiao: 'Sudeste', tipo: 'Corretor', parceiroTipo: 'COR' },
  { id: 'pa-7', codigo: 'P-2206260007', nome: 'Sandra Regina Corretores', contato: 'Sandra Regina', telefone: '(34) 99121-7890', regiao: 'Centro-Oeste', tipo: 'Corretor', parceiroTipo: 'COR' },
  { id: 'pa-8', codigo: 'P-2406260008', nome: 'Alberto Santos Corretagem', contato: 'Alberto Santos', telefone: '(66) 99655-4321', regiao: 'Norte', tipo: 'Corretor', parceiroTipo: 'COR' },
  { id: 'pa-9', codigo: 'P-2606260009', nome: 'Marília Pecuária', contato: 'Marília Mendes', telefone: '(81) 99777-6666', regiao: 'Nordeste', tipo: 'Corretor', parceiroTipo: 'COR' },
  { id: 'pa-10', codigo: 'P-2806260010', nome: 'Vale do Guaporé Corretora', contato: 'Guaporé Rezende', telefone: '(69) 3421-9000', regiao: 'Vale do Guaporé', tipo: 'Corretor', parceiroTipo: 'COR' }
];

export const CADASTRO_MOTORISTAS = [
  { id: 'mo-1', codigo: 'M-1006260001', nome: 'Valdecir Rodrigues Alves', cnh: '023456789-22', placa: 'OQY-8E12', transportadora: 'Autônomo', status: 'Disponível', relacionamento: 'MOT' },
  { id: 'mo-2', codigo: 'M-1206260002', nome: 'Ailton Senna de Souza', cnh: '098765432-11', placa: 'GVT-2A44', transportadora: 'Autônomo', status: 'Disponível', relacionamento: 'MOT' },
  { id: 'mo-3', codigo: 'M-1406260003', nome: 'Roberto Carlos Santos', cnh: '045555666-88', placa: 'KAP-9988', transportadora: 'Autônomo', status: 'Disponível', relacionamento: 'MOT' },
  { id: 'mo-4', codigo: 'M-1606260004', nome: 'Sebastião Rodrigues Silva', cnh: '034444555-99', placa: 'DEF-5678', transportadora: 'Autônomo', status: 'Disponível', relacionamento: 'MOT' },
  { id: 'mo-5', codigo: 'M-1806260005', nome: 'Marcos de Paula Guedes', cnh: '056666777-11', placa: 'XYZ-9090', transportadora: 'Autônomo', status: 'Disponível', relacionamento: 'MOT' },
  { id: 'mo-6', codigo: 'M-2006260006', nome: 'TransGado Matogrosso LTDA', cnh: 'Não Aplicável', placa: 'Não Aplicável', transportadora: 'Própria (Transportadora)', status: 'Disponível', relacionamento: 'TRA' },
  { id: 'mo-7', codigo: 'M-2206260007', nome: 'Expresso Boiadeiro S/A', cnh: 'Não Aplicável', placa: 'Não Aplicável', transportadora: 'Própria (Transportadora)', status: 'Disponível', relacionamento: 'TRA' },
  { id: 'mo-8', codigo: 'M-2406260008', nome: 'LogPesados Agronegócio LTDA', cnh: 'Não Aplicável', placa: 'Não Aplicável', transportadora: 'Própria (Transportadora)', status: 'Disponível', relacionamento: 'TRA' },
  { id: 'mo-9', codigo: 'M-2606260009', nome: 'Transportadora Rápido Nelore', cnh: 'Não Aplicável', placa: 'Não Aplicável', transportadora: 'Própria (Transportadora)', status: 'Disponível', relacionamento: 'TRA' },
  { id: 'mo-10', codigo: 'M-2806260010', nome: 'GadoFácil Logística S/A', cnh: 'Não Aplicável', placa: 'Não Aplicável', transportadora: 'Própria (Transportadora)', status: 'Disponível', relacionamento: 'TRA' }
];

export const CADASTRO_FAZENDAS = [
  { id: 'fa-1', nome: 'Fazenda Santa Rita', proprietario: 'José Carlos Albuquerque', areaTotal: '12.450 Ha', rebanhoEstimado: 4500, municipio: 'Rondonópolis - MT' },
  { id: 'fa-2', nome: 'Estância do Sol', proprietario: 'Vale Verde S/A', areaTotal: '8.200 Ha', rebanhoEstimado: 3100, municipio: 'Rio Verde - GO' },
  { id: 'fa-3', nome: 'Sítio Novo', proprietario: 'Marcos de Souza', areaTotal: '1.800 Ha', rebanhoEstimado: 950, municipio: 'Redenção - PA' }
];

export const CADASTRO_USUARIOS = [
  { id: 'us-5', matricula: 'A156492', nome: 'Anderson Everton', email: 'anderson.everton@oxcommerce.com', papel: 'Administrador ERP', status: 'Ativo' }
];
