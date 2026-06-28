/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RegistryModal } from './RegistryModal';
import { supabase } from '../supabaseClient';

const BRAZILIAN_BANKS = [
  { id: 'bk-001', code: '001', name: 'Banco do Brasil S.A.' },
  { id: 'bk-033', code: '033', name: 'Banco Santander (Brasil) S.A.' },
  { id: 'bk-104', code: '104', name: 'Caixa Econômica Federal' },
  { id: 'bk-237', code: '237', name: 'Banco Bradesco S.A.' },
  { id: 'bk-341', code: '341', name: 'Itaú Unibanco S.A.' },
  { id: 'bk-748', code: '748', name: 'Banco Cooperativo Sicredi S.A.' },
  { id: 'bk-756', code: '756', name: 'Banco Cooperativo do Brasil S.A. - BANCOOB' },
  { id: 'bk-077', code: '077', name: 'Banco Inter S.A.' },
  { id: 'bk-260', code: '260', name: 'Nu Pagamentos S.A. (Nubank)' },
  { id: 'bk-041', code: '041', name: 'Banco do Estado do Rio Grande do Sul S.A. (Banrisul)' },
  { id: 'bk-004', code: '004', name: 'Banco do Nordeste do Brasil S.A.' },
  { id: 'bk-212', code: '212', name: 'Banco Original S.A.' },
  { id: 'bk-422', code: '422', name: 'Banco Safra S.A.' },
  { id: 'bk-623', code: '623', name: 'Banco Pan S.A.' },
  { id: 'bk-655', code: '655', name: 'Banco Votorantim S.A.' },
  { id: 'bk-036', code: '036', name: 'Banco BMG S.A.' },
  { id: 'bk-070', code: '070', name: 'Banco de Brasília S.A. (BRB)' },
  { id: 'bk-021', code: '021', name: 'Banco do Estado do Espírito Santo S.A. (Banestes)' },
  { id: 'bk-121', code: '121', name: 'Banco Agibank S.A.' },
  { id: 'bk-389', code: '389', name: 'Banco Mercantil do Brasil S.A.' }
];
import {
  Users,
  Building,
  Map,
  Truck,
  Plus,
  Search,
  Filter,
  Briefcase,
  User,
  Phone,
  MapPin,
  Lock,
  CreditCard,
  ShieldAlert,
  Upload,
  Tag,
  Pencil,
  Trash2
} from 'lucide-react';
import {
  CADASTRO_CLIENTES,
  CADASTRO_FORNECEDORES,
  CADASTRO_PARCEIROS,
  CADASTRO_MOTORISTAS
} from '../data/mockData';

interface CadastrosViewProps {
  searchQuery: string;
  usuarios?: Array<{ id: string; nome: string; email: string; papel: string; status: string; matricula?: string }>;
  onAddUsuario?: (usuario: any) => void;
  onDeleteUsuario?: (userId: string) => void;
}

type CadastroTab = 'clientes_fornecedores' | 'parceiros' | 'motoristas' | 'usuarios' | 'centros_custo' | 'bancos' | 'tipos_parceiro' | 'categorias';

const DEFAULT_PARTNER_TYPES = [
  { id: 'pt-log', code: 'LOG', name: 'Logístico' },
  { id: 'pt-fis', code: 'FIS', name: 'Fiscal / Tributário' },
  { id: 'pt-exp', code: 'EXP', name: 'Exportação / Trading' },
  { id: 'pt-tec', code: 'TEC', name: 'Tecnologia / TI' },
  { id: 'pt-com', code: 'COM', name: 'Parceiro Comissionado' },
  { id: 'pt-cor', code: 'COR', name: 'Corretor' }
];

const DEFAULT_ANIMAL_CATEGORIES = [
  { id: 'cat-boi', code: 'BOI', name: 'Boi Gordo', status: 'Ativo', descricao: 'Bovino macho castrado pronto para o abate' },
  { id: 'cat-vac', code: 'VAC', name: 'Vaca Gorda', status: 'Ativo', descricao: 'Bovino fêmea pronta para o abate' },
  { id: 'cat-gar', code: 'GAR', name: 'Garrote', status: 'Ativo', descricao: 'Macho jovem em fase de recria/engorda' },
  { id: 'cat-nov', code: 'NOV', name: 'Novilha', status: 'Ativo', descricao: 'Fêmea jovem que ainda não pariu' },
  { id: 'cat-bez', code: 'BEZ', name: 'Bezerro(a)', status: 'Ativo', descricao: 'Bovino recém-desmamado' },
  { id: 'cat-tou', code: 'TOU', name: 'Touro', status: 'Ativo', descricao: 'Macho inteiro destinado à reprodução' },
  { id: 'cat-bzd', code: 'BZD', name: 'Bezerra Desmamada', status: 'Ativo', descricao: 'Fêmea jovem recém-desmamada' },
  { id: 'cat-vcc', code: 'VCC', name: 'Vaca com Cria', status: 'Ativo', descricao: 'Fêmea acompanhada de bezerro ao pé' },
  { id: 'cat-bom', code: 'BOM', name: 'Boi Magro', status: 'Ativo', descricao: 'Macho castrado magro para recria ou confinamento' },
  { id: 'cat-nvp', code: 'NVP', name: 'Novilha Prenhe', status: 'Ativo', descricao: 'Fêmea jovem prenhe confirmada' }
];

const DEFAULT_COST_CENTERS = [
  { id: 'cc-1', codigo: '01.100.001', nome: 'Matriz - Administrativo', tipo: 'Administrativo', responsavel: 'Diego Silveira', status: 'Ativo', descricao: 'Despesas gerais administrativas da sede' },
  { id: 'cc-2', codigo: '02.100.001', nome: 'Fazenda Santa Rita - Recria', tipo: 'Produtivo', responsavel: 'José Carlos Albuquerque', status: 'Ativo', descricao: 'Manejo, nutrição e pastagem de recria' },
  { id: 'cc-3', codigo: '02.200.001', nome: 'Fazenda Real MT - Confinamento', tipo: 'Produtivo', responsavel: 'Diego Silveira', status: 'Ativo', descricao: 'Operação de confinamento e engorda de machos' }
];

const sanitizeName = (val: string): string => {
  if (!val) return '';
  const connectives = ['de', 'di', 'do', 'da', 'dos', 'das', 'e', 'em'];
  return val
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (word.length === 0) return '';
      if (idx === 0 || !connectives.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

const sanitizeEmail = (val: string): string => {
  if (!val) return '';
  return val.trim().toLowerCase();
};

const sanitizeText = (val: string): string => {
  if (!val) return '';
  if (val === val.toUpperCase() && val !== val.toLowerCase()) {
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  }
  return val;
};

export default function CadastrosView({ searchQuery, usuarios = [], onAddUsuario, onDeleteUsuario }: CadastrosViewProps) {
  const [activeTab, setActiveTab] = useState<CadastroTab>('clientes_fornecedores');
  
  // Persistent list of deleted mock item IDs to prevent them from reappearing on reload
  const [deletedMockIds, setDeletedMockIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [clientesFornecedores, setClientesFornecedores] = useState<any[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);

  const [parceiros, setParceiros] = useState(() => {
    const deleted = (() => {
      try { return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]'); } catch { return []; }
    })();
    return CADASTRO_PARCEIROS.filter(item => !deleted.includes(item.id));
  });

  const [motoristas, setMotoristas] = useState(() => {
    const deleted = (() => {
      try { return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]'); } catch { return []; }
    })();
    return CADASTRO_MOTORISTAS.filter(item => !deleted.includes(item.id));
  });

  const [bancos, setBancos] = useState<any[]>(() => {
    const deleted = (() => {
      try { return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]'); } catch { return []; }
    })();
    return BRAZILIAN_BANKS.filter(item => !deleted.includes(item.id));
  });

  const [tiposParceiro, setTiposParceiro] = useState<any[]>(() => {
    const deleted = (() => {
      try { return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]'); } catch { return []; }
    })();
    return DEFAULT_PARTNER_TYPES.filter(item => !deleted.includes(item.id));
  });

  const [categorias, setCategorias] = useState<any[]>(() => {
    const deleted = (() => {
      try { return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]'); } catch { return []; }
    })();
    return DEFAULT_ANIMAL_CATEGORIES.filter(item => !deleted.includes(item.id));
  });

  const [centrosCusto, setCentrosCusto] = useState<any[]>(() => {
    const deleted = (() => {
      try { return JSON.parse(localStorage.getItem('deleted_mock_ids') || '[]'); } catch { return []; }
    })();
    return DEFAULT_COST_CENTERS.filter(item => !deleted.includes(item.id));
  });

  useEffect(() => {
    async function loadData() {
      // 1. Clientes / Fornecedores
      try {
        const { data, error } = await supabase.from('clientes_fornecedores').select('*');
        if (error) {
          console.warn('Failed to load clientes_fornecedores from Supabase:', error.message);
          setDbError(`Falha ao conectar com o Supabase: "${error.message}". Verifique se a tabela 'clientes_fornecedores' foi criada no painel SQL Editor do Supabase.`);
        } else if (data) {
          setDbError(null);
          const hasNewData = data.some(item => item.id === 'cl-5');
          if (data.length === 0 || !hasNewData) {
            // Seed database with mock data
            const initialList = [
              ...CADASTRO_CLIENTES.map(c => ({ ...c, relacionamento: 'CLI' })),
              ...CADASTRO_FORNECEDORES.map(f => ({ ...f, relacionamento: 'FOR', telefone: '(66) 9999-9999' }))
            ];
            const toUpsert = initialList.map(item => {
              let rel = item.relacionamento;
              if (rel === 'Cliente') rel = 'CLI';
              if (rel === 'Fornecedor') rel = 'FOR';
              if (rel === 'Ambos') rel = 'AMB';
              const anyItem = item as any;
              return {
                id: item.id,
                nome: anyItem.razaoSocial || anyItem.nome || 'Sem Nome',
                documento: anyItem.cnpjCpf || anyItem.documento || '',
                telefone: anyItem.contatoTelefone || anyItem.telefone || '',
                estado: anyItem.uf || anyItem.estado || 'SP',
                relacionamento: rel,
                tipo: (anyItem.clientType === 'PJ' || anyItem.tipoPessoa === 'Jurídica' || anyItem.tipo === 'Pessoa Jurídica') ? 'Pessoa Jurídica' : 'Pessoa Física',
                fazenda: anyItem.logradouro || anyItem.fazenda || 'Não Informada',
                raw_data: { ...item, relacionamento: rel }
              };
            });
            await supabase.from('clientes_fornecedores').upsert(toUpsert);
            // Re-fetch seeded data
            const refetched = await supabase.from('clientes_fornecedores').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => {
                let rel = item.relacionamento;
                if (rel === 'Cliente') rel = 'CLI';
                if (rel === 'Fornecedor') rel = 'FOR';
                if (rel === 'Ambos') rel = 'AMB';
                
                const raw = item.raw_data || {};
                const cType = item.tipo === 'Pessoa Física' ? 'PF' : 'PJ';
                return {
                  ...raw,
                  id: item.id,
                  nome: item.nome,
                  documento: item.documento,
                  telefone: item.telefone,
                  estado: item.estado,
                  relacionamento: rel,
                  tipo: item.tipo || (raw.tipoPessoa === 'Física' ? 'Pessoa Física' : 'Pessoa Jurídica'),
                  fazenda: item.fazenda,
                  clientType: cType,
                  raw_data: { ...raw, clientType: cType }
                };
              });
              setClientesFornecedores(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => {
              let rel = item.relacionamento;
              if (rel === 'Cliente') rel = 'CLI';
              if (rel === 'Fornecedor') rel = 'FOR';
              if (rel === 'Ambos') rel = 'AMB';
              
              const raw = item.raw_data || {};
              const cType = item.tipo === 'Pessoa Física' ? 'PF' : 'PJ';
              return {
                ...raw,
                id: item.id,
                nome: item.razaoSocial || item.nome,
                documento: item.documento,
                telefone: item.telefone,
                estado: item.estado,
                relacionamento: rel,
                tipo: item.tipo || (raw.tipoPessoa === 'Física' ? 'Pessoa Física' : 'Pessoa Jurídica'),
                fazenda: item.fazenda,
                clientType: cType,
                raw_data: { ...raw, clientType: cType }
              };
            });
            setClientesFornecedores(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load clientes_fornecedores from Supabase:', err);
      }

      // 2. Parceiros
      try {
        const { data, error } = await supabase.from('parceiros').select('*');
        if (!error && data) {
          const hasNewData = data.some(item => item.id === 'pa-10');
          if ((data.length === 0 || !hasNewData) && CADASTRO_PARCEIROS.length > 0) {
            const toUpsert = CADASTRO_PARCEIROS.map(item => ({
              id: item.id,
              nome: item.nome,
              contato: item.contato,
              telefone: item.telefone,
              regiao: item.regiao,
              tipo: item.tipo,
              raw_data: item
            }));
            await supabase.from('parceiros').upsert(toUpsert);
            const refetched = await supabase.from('parceiros').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => ({
                ...(item.raw_data || {}),
                id: item.id,
                nome: item.nome,
                contato: item.contato,
                telefone: item.telefone,
                regiao: item.regiao,
                tipo: item.tipo
              }));
              setParceiros(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => ({
              ...(item.raw_data || {}),
              id: item.id,
              nome: item.nome,
              contato: item.contato,
              telefone: item.telefone,
              regiao: item.regiao,
              tipo: item.tipo
            }));
            setParceiros(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load parceiros from Supabase:', err);
      }

      // 3. Motoristas
      try {
        const { data, error } = await supabase.from('motoristas').select('*');
        if (!error && data) {
          const hasNewData = data.some(item => item.id === 'mo-10');
          if ((data.length === 0 || !hasNewData) && CADASTRO_MOTORISTAS.length > 0) {
            const toUpsert = CADASTRO_MOTORISTAS.map(item => ({
              id: item.id,
              nome: item.nome,
              cnh: item.cnh,
              placa: item.placa,
              transportadora: item.transportadora,
              status: item.status,
              raw_data: item
            }));
            await supabase.from('motoristas').upsert(toUpsert);
            const refetched = await supabase.from('motoristas').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => ({
                ...(item.raw_data || {}),
                id: item.id,
                nome: item.nome,
                cnh: item.cnh,
                placa: item.placa,
                transportadora: item.transportadora,
                status: item.status
              }));
              setMotoristas(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => ({
              ...(item.raw_data || {}),
              id: item.id,
              nome: item.nome,
              cnh: item.cnh,
              placa: item.placa,
              transportadora: item.transportadora,
              status: item.status
            }));
            setMotoristas(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load motoristas from Supabase:', err);
      }

      // 4. Centros de Custo
      try {
        const { data, error } = await supabase.from('centros_custo').select('*');
        if (!error && data) {
          if (data.length === 0 && DEFAULT_COST_CENTERS.length > 0) {
            const toUpsert = DEFAULT_COST_CENTERS.map(item => ({
              id: item.id,
              nome: item.nome,
              codigo: item.codigo,
              tipo: item.tipo,
              status: item.status,
              responsavel: item.responsavel,
              raw_data: item
            }));
            await supabase.from('centros_custo').upsert(toUpsert);
            const refetched = await supabase.from('centros_custo').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => ({
                ...(item.raw_data || {}),
                id: item.id,
                nome: item.nome,
                codigo: item.codigo,
                tipo: item.tipo,
                status: item.status,
                responsavel: item.responsavel
              }));
              setCentrosCusto(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => ({
              ...(item.raw_data || {}),
              id: item.id,
              nome: item.nome,
              codigo: item.codigo,
              tipo: item.tipo,
              status: item.status,
              responsavel: item.responsavel
            }));
            setCentrosCusto(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load centros_custo from Supabase:', err);
      }

      // 5. Bancos
      try {
        const { data, error } = await supabase.from('bancos').select('*');
        if (!error && data) {
          const hasNewBanks = data.some(item => item.id === 'bk-260');
          if ((data.length === 0 || !hasNewBanks) && BRAZILIAN_BANKS.length > 0) {
            const toUpsert = BRAZILIAN_BANKS.map(item => ({
              id: item.id,
              codigo: item.code,
              nome: item.name,
              status: (item as any).status || 'Ativo',
              raw_data: item
            }));
            await supabase.from('bancos').upsert(toUpsert);
            const refetched = await supabase.from('bancos').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => ({
                ...(item.raw_data || {}),
                id: item.id,
                code: item.codigo,
                name: item.nome,
                status: item.status
              }));
              setBancos(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => ({
              ...(item.raw_data || {}),
              id: item.id,
              code: item.codigo,
              name: item.nome,
              status: item.status
            }));
            setBancos(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load bancos from Supabase:', err);
      }

      // 6. Tipos de Parceiro
      try {
        const { data, error } = await supabase.from('tipos_parceiro').select('*');
        if (!error && data) {
          const hasNewData = data.some(item => item.id === 'pt-cor');
          if ((data.length === 0 || !hasNewData) && DEFAULT_PARTNER_TYPES.length > 0) {
            const toUpsert = DEFAULT_PARTNER_TYPES.map(item => ({
              id: item.id,
              codigo: item.code,
              nome: item.name,
              descricao: (item as any).descricao || '',
              status: (item as any).status || 'Ativo',
              raw_data: item
            }));
            await supabase.from('tipos_parceiro').upsert(toUpsert);
            const refetched = await supabase.from('tipos_parceiro').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => ({
                ...(item.raw_data || {}),
                id: item.id,
                code: item.codigo,
                name: item.nome,
                descricao: item.descricao,
                status: item.status
              }));
              setTiposParceiro(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => ({
              ...(item.raw_data || {}),
              id: item.id,
              code: item.codigo,
              name: item.nome,
              descricao: item.descricao,
              status: item.status
            }));
            setTiposParceiro(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load tipos_parceiro from Supabase:', err);
      }

      // 7. Categorias
      try {
        const { data, error } = await supabase.from('categorias').select('*');
        if (!error && data) {
          const hasNewData = data.some(item => item.id === 'cat-nvp');
          if ((data.length === 0 || !hasNewData) && DEFAULT_ANIMAL_CATEGORIES.length > 0) {
            const toUpsert = DEFAULT_ANIMAL_CATEGORIES.map(item => ({
              id: item.id,
              codigo: item.code,
              nome: item.name,
              descricao: item.descricao,
              status: item.status,
              raw_data: item
            }));
            await supabase.from('categorias').upsert(toUpsert);
            const refetched = await supabase.from('categorias').select('*');
            if (refetched.data) {
              const mapped = refetched.data.map(item => ({
                ...(item.raw_data || {}),
                id: item.id,
                code: item.codigo,
                name: item.nome,
                descricao: item.descricao,
                status: item.status
              }));
              setCategorias(mapped.filter(item => !deletedMockIds.includes(item.id)));
            }
          } else {
            const mapped = data.map(item => ({
              ...(item.raw_data || {}),
              id: item.id,
              code: item.codigo,
              name: item.nome,
              descricao: item.descricao,
              status: item.status
            }));
            setCategorias(mapped.filter(item => !deletedMockIds.includes(item.id)));
          }
        }
      } catch (err) {
        console.warn('Failed to load categorias from Supabase:', err);
      }
    }
    loadData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clientes_fornecedores'
        },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parceiros'
        },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'motoristas'
        },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'usuarios'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deletedMockIds]);

  const [showAddCliForModal, setShowAddCliForModal] = useState(false);
  const [modalType, setModalType] = useState<'TEAM' | 'CLIENT' | 'DRIVER' | 'VEHICLE' | 'BROKER' | 'PARTNER' | 'COST_CENTER' | 'BANK' | 'PARTNER_TYPE' | 'CATEGORY'>('CLIENT');
  const [modalTitle, setModalTitle] = useState('Cadastro');
  const [activeCliForModalTab, setActiveCliForModalTab] = useState<'geral' | 'contato' | 'endereco' | 'seguranca' | 'financeiro'>('geral');

  const initialCliForForm = {
    // Geral
    cnpjCpf: '',
    razaoSocial: '',
    nomeFantasia: '',
    relacionamento: 'CLI' as 'CLI' | 'FOR' | 'AMB',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    tipoPessoa: 'Jurídica' as 'Física' | 'Jurídica',
    clientType: 'PJ' as 'PJ' | 'PF',
    fazendaPrincipal: '',

    // Contato
    contatoNome: '',
    contatoSobrenome: '',
    contatoNomeContato: '',
    contatoTelefone: '',
    contatoWhatsapp: '',
    contatoEmail: '',
    contatoObservacoes: '',

    // Endereço
    enderecoCep: '',
    enderecoLogradouro: '',
    enderecoNumero: '',
    enderecoBairro: '',
    enderecoPais: 'Brasil',
    enderecoEstado: '',
    enderecoCidade: '',
    enderecoUf: '',
    enderecoComplemento: '',

    // Segurança
    segurancaPerfil: 'Usuário Padrão',
    segurancaPapel: 'Analista Fiscal',
    segurancaStatus: 'Ativo',
    segurancaLogin: '',
    segurancaUltimoLogin: '12/10/2023 14:30',
    segurancaIpAcesso: '192.168.0.1',

    // Financeiro
    financeiroCodBanco: '',
    financeiroNomeBanco: '',
    financeiroAgencia: '',
    financeiroConta: '',
    financeiroTipoConta: 'Conta Corrente',
    financeiroChavePix: '',
    financeiroCondicaoPagamento: '30 Dias Líquido',
    financeiroLimiteCredito: '0,00',
    financeiroMoedaPadrao: 'BRL - Real'
  };

  const [cliForForm, setCliForForm] = useState(initialCliForForm);

  const handleOpenRegistryModal = (type: 'TEAM' | 'CLIENT' | 'DRIVER' | 'PARTNER' | 'COST_CENTER' | 'BANK' | 'PARTNER_TYPE' | 'CATEGORY', rel?: 'CLI' | 'FOR') => {
    setModalType(type);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const dateStr = `${dd}${mm}${yy}`;

    if (type === 'CLIENT') {
      const isFornecedor = (rel || 'CLI') === 'FOR';
      const charPrefix = isFornecedor ? 'F' : 'C';
      const relevantList = clientesFornecedores.filter(c => c.relacionamento === (rel || 'CLI'));
      const count = relevantList.length + 1;
      const autoCode = `${charPrefix}-${dateStr}${String(count).padStart(4, '0')}`;
      
      setModalTitle('Cadastro de Cliente e Fornecedor');
      setCliForForm({
        ...initialCliForForm,
        relacionamento: rel || 'CLI',
        codigo: autoCode
      });
    } else if (type === 'TEAM') {
      const count = (usuarios || []).length + 1;
      const baseMatricula = 156488;
      const autoMatricula = `A${baseMatricula + count - 1}`;
      
      setModalTitle('Equipe e Usuário');
      setCliForForm({
        firstName: '',
        lastName: '',
        nickname: '',
        cpf: '',
        rg: '',
        gender: 'M',
        birthDate: '',
        cargo: '',
        departamento: 'COM',
        unidade: 'MT',
        gestor: '',
        centroCusto: '',
        segurancaPerfil: 'ADM',
        segurancaPapel: 'ADM',
        segurancaStatus: 'A',
        segurancaLogin: '',
        matricula: autoMatricula
      });
    } else if (type === 'DRIVER') {
      const count = motoristas.length + 1;
      const autoCode = `M-${dateStr}${String(count).padStart(4, '0')}`;
      
      setModalTitle('Cadastro de Motorista');
      setCliForForm({
        firstName: '',
        lastName: '',
        nickname: '',
        cpf: '',
        rg: '',
        gender: 'M',
        birthDate: '',
        cnh: '',
        cnhCategoria: 'AE',
        cnhValidade: '',
        veiculoModelo: '',
        veiculoPlaca: '',
        cargo: 'Motorista',
        departamento: 'LOG',
        unidade: 'MT',
        gestor: '',
        centroCusto: '',
        segurancaPerfil: 'VIEW',
        segurancaPapel: 'LOG',
        segurancaStatus: 'A',
        segurancaLogin: '',
        codigo: autoCode
      });
    } else if (type === 'PARTNER') {
      const count = parceiros.length + 1;
      const autoCode = `P-${dateStr}${String(count).padStart(4, '0')}`;
      
      setModalTitle('Cadastro de Parceiro / Corretor');
      setCliForForm({
        firstName: '',
        lastName: '',
        nickname: '',
        cpf: '',
        rg: '',
        gender: 'M',
        birthDate: '',
        parceiroTipo: 'LOG',
        cargo: 'Parceiro',
        departamento: 'COM',
        unidade: 'MT',
        gestor: '',
        centroCusto: '',
        segurancaPerfil: 'VIEW',
        segurancaPapel: 'SUP',
        segurancaStatus: 'A',
        segurancaLogin: '',
        codigo: autoCode
      });
    } else if (type === 'COST_CENTER') {
      const count = centrosCusto.length + 1;
      const autoCode = `CC-${String(count).padStart(3, '0')}`;
      setModalTitle('Cadastro de Centro de Custo');
      setCliForForm({
        codigo: autoCode,
        col1: '',
        tipo: 'Operacional',
        responsavel: '',
        status: 'Ativo',
        descricao: ''
      });
    } else if (type === 'BANK') {
      const count = bancos.length + 1;
      const autoCode = `BK-${String(count).padStart(3, '0')}`;
      setModalTitle('Cadastro de Instituição Bancária');
      setCliForForm({
        codigo: autoCode,
        col1: '',
        status: 'Ativo'
      });
    } else if (type === 'PARTNER_TYPE') {
      const count = tiposParceiro.length + 1;
      const autoCode = `T-${dateStr}${String(count).padStart(4, '0')}`;
      setModalTitle('Cadastro de Tipo de Parceiro');
      setCliForForm({
        codigo: autoCode,
        col1: '',
        status: 'Ativo',
        descricao: ''
      });
    } else if (type === 'CATEGORY') {
      const count = categorias.length + 1;
      const autoCode = `K-${dateStr}${String(count).padStart(4, '0')}`;
      setModalTitle('Cadastro de Categoria de Animal');
      setCliForForm({
        codigo: autoCode,
        col1: '',
        status: 'Ativo',
        descricao: ''
      });
    }
    setShowAddCliForModal(true);
  };

  const handleCliForSave = (rawFormData: any) => {
    const formData = { ...rawFormData };

    const nameFields = [
      'razaoSocial', 'nomeFantasia', 'apelido', 'nickname', 'contato',
      'contatoNome', 'contatoSobrenome', 'firstName', 'lastName',
      'responsavel', 'logradouro', 'bairro', 'cidade', 'col1'
    ];
    nameFields.forEach(field => {
      if (typeof formData[field] === 'string') {
        formData[field] = sanitizeName(formData[field]);
      }
    });

    const emailFields = ['email', 'contatoEmail', 'segurancaLogin'];
    emailFields.forEach(field => {
      if (typeof formData[field] === 'string') {
        formData[field] = sanitizeEmail(formData[field]);
      }
    });

    const textFields = ['descricao', 'observacao'];
    textFields.forEach(field => {
      if (typeof formData[field] === 'string') {
        formData[field] = sanitizeText(formData[field]);
      }
    });

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const dateStr = `${dd}${mm}${yy}`;

    if (modalType === 'BANK') {
      const count = bancos.length + 1;
      const fallbackCode = `BK-${String(count).padStart(3, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newBank = {
        ...formData,
        id: formData.id || ('bk-' + Math.random().toString(36).substr(2, 9)),
        codigo: codeVal,
        code: codeVal,
        nome: formData.col1 || 'Sem Nome',
        name: formData.col1 || 'Sem Nome',
        status: formData.status || 'Ativo'
      };
      setBancos(prev => {
        const exists = prev.some(b => b.id === newBank.id);
        if (exists) {
          return prev.map(b => b.id === newBank.id ? newBank : b);
        }
        const filtered = prev.filter(b => b.code !== newBank.codigo);
        return [...filtered, newBank];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('bancos').upsert([{
            id: newBank.id,
            codigo: newBank.codigo,
            nome: newBank.nome,
            status: newBank.status,
            raw_data: { ...formData, codigo: newBank.codigo, code: newBank.code }
          }]);
          if (error) console.warn('Failed to save banco to Supabase:', error.message);
        } catch (err) {
          console.warn('Failed to save banco to Supabase:', err);
        }
      })();

      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'PARTNER_TYPE') {
      const count = tiposParceiro.length + 1;
      const fallbackCode = `T-${dateStr}${String(count).padStart(4, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newPT = {
        ...formData,
        id: formData.id || ('pt-' + Math.random().toString(36).substr(2, 9)),
        codigo: codeVal,
        code: codeVal,
        nome: formData.col1 || 'Sem Nome',
        name: formData.col1 || 'Sem Nome',
        status: formData.status || 'Ativo',
        descricao: formData.descricao || ''
      };
      setTiposParceiro(prev => {
        const exists = prev.some(p => p.id === newPT.id);
        if (exists) {
          return prev.map(p => p.id === newPT.id ? newPT : p);
        }
        const filtered = prev.filter(p => p.code !== newPT.codigo);
        return [...filtered, newPT];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('tipos_parceiro').upsert([{
            id: newPT.id,
            codigo: newPT.codigo,
            nome: newPT.nome,
            status: newPT.status,
            descricao: newPT.descricao,
            raw_data: { ...formData, codigo: newPT.codigo, code: newPT.code }
          }]);
          if (error) console.warn('Failed to save tipo_parceiro to Supabase:', error.message);
        } catch (err) {
          console.warn('Failed to save tipo_parceiro to Supabase:', err);
        }
      })();

      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'CATEGORY') {
      const count = categorias.length + 1;
      const fallbackCode = `K-${dateStr}${String(count).padStart(4, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newCategory = {
        ...formData,
        id: formData.id || ('cat-' + Math.random().toString(36).substr(2, 9)),
        code: codeVal,
        codigo: codeVal,
        name: formData.col1 || 'Sem Nome',
        status: formData.status || 'Ativo',
        descricao: formData.descricao || ''
      };
      setCategorias(prev => {
        const exists = prev.some(c => c.id === newCategory.id);
        if (exists) {
          return prev.map(c => c.id === newCategory.id ? newCategory : c);
        }
        const filtered = prev.filter(c => c.code !== newCategory.code);
        return [...filtered, newCategory];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('categorias').upsert([{
            id: newCategory.id,
            codigo: newCategory.code,
            nome: newCategory.name,
            status: newCategory.status,
            descricao: newCategory.descricao,
            raw_data: { ...formData, codigo: newCategory.code, code: newCategory.code }
          }]);
          if (error) console.warn('Failed to save categoria to Supabase:', error.message);
        } catch (err) {
          console.warn('Failed to save categoria to Supabase:', err);
        }
      })();

      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'COST_CENTER') {
      const count = centrosCusto.length + 1;
      const fallbackCode = `CC-${String(count).padStart(3, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newCC = {
        ...formData,
        id: formData.id || ('cc-' + Math.random().toString(36).substr(2, 9)),
        codigo: codeVal,
        nome: formData.col1 || 'Sem Nome',
        tipo: formData.tipo || 'Operacional',
        responsavel: formData.responsavel || 'Não Informado',
        status: formData.status || 'Ativo',
        descricao: formData.descricao || ''
      };
      setCentrosCusto(prev => {
        const exists = prev.some(c => c.id === newCC.id);
        if (exists) {
          return prev.map(c => c.id === newCC.id ? newCC : c);
        }
        return [...prev, newCC];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('centros_custo').upsert([{
            id: newCC.id,
            codigo: newCC.codigo,
            nome: newCC.nome,
            tipo: newCC.tipo,
            status: newCC.status,
            responsavel: newCC.responsavel,
            raw_data: { ...formData, codigo: newCC.codigo }
          }]);
          if (error) console.warn('Failed to save centro_custo to Supabase:', error.message);
        } catch (err) {
          console.warn('Failed to save centro_custo to Supabase:', err);
        }
      })();

      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'TEAM') {
      const count = (usuarios || []).length + 1;
      const baseMatricula = 156488;
      const fallbackMatricula = `A${baseMatricula + count - 1}`;
      const matriculaVal = formData.matricula || fallbackMatricula;
      const novoUsuario = {
        ...formData,
        id: formData.id || ('us-' + Math.random().toString(36).substr(2, 9)),
        nome: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Sem Nome',
        email: formData.segurancaLogin || '',
        papel: formData.segurancaPapel || 'Analista Fiscal',
        status: formData.segurancaStatus === 'A' || formData.segurancaStatus === 'Ativo' ? 'Ativo' : 'Inativo',
        matricula: matriculaVal
      };
      if (onAddUsuario) {
        onAddUsuario(novoUsuario);
      }
      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'DRIVER') {
      const count = motoristas.length + 1;
      const fallbackCode = `M-${dateStr}${String(count).padStart(4, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newDriver = {
        ...formData,
        id: formData.id || ('mo-' + Math.random().toString(36).substr(2, 9)),
        nome: formData.col1 || formData.razaoSocial || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Sem Nome',
        cnh: formData.cnh || 'Não Informado',
        placa: formData.veiculoPlaca || 'Não Informada',
        transportadora: formData.relacionamento === 'TRA' ? 'Própria (Transportadora)' : (formData.transportadora || (formData.unidade === 'FIL' ? 'Filial - MT' : 'TransGado Matogrosso')),
        status: formData.status || 'Disponível',
        codigo: codeVal
      };
      setMotoristas(prev => {
        const exists = prev.some(m => m.id === newDriver.id);
        if (exists) {
          return prev.map(m => m.id === newDriver.id ? newDriver : m);
        }
        return [...prev, newDriver];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('motoristas').upsert([{
            id: newDriver.id,
            nome: newDriver.nome,
            cnh: newDriver.cnh,
            placa: newDriver.placa,
            transportadora: newDriver.transportadora,
            status: newDriver.status,
            raw_data: { ...formData, codigo: newDriver.codigo }
          }]);
          if (error) console.warn('Failed to save motorista to Supabase:', error.message);
        } catch (err) {
          console.warn('Failed to save motorista to Supabase:', err);
        }
      })();

      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'PARTNER') {
      const count = parceiros.length + 1;
      const fallbackCode = `P-${dateStr}${String(count).padStart(4, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newPartner = {
        ...formData,
        id: formData.id || ('pa-' + Math.random().toString(36).substr(2, 9)),
        nome: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Sem Nome',
        contato: formData.nickname || 'Sem Apelido',
        telefone: formData.contatoTelefone || 'Não Informado',
        regiao: formData.cidade || 'Não Informada',
        tipo: formData.parceiroTipo === 'LOG' ? 'Parceiro/Corretor' : 'Parceiro Comercial',
        codigo: codeVal,
        raw_data: { ...formData, codigo: codeVal }
      };
      setParceiros(prev => {
        const exists = prev.some(p => p.id === newPartner.id);
        if (exists) {
          return prev.map(p => p.id === newPartner.id ? newPartner : p);
        }
        return [...prev, newPartner];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('parceiros').upsert([{
            id: newPartner.id,
            nome: newPartner.nome,
            contato: newPartner.contato,
            telefone: newPartner.telefone,
            regiao: newPartner.regiao,
            tipo: newPartner.tipo,
            raw_data: { ...formData, codigo: newPartner.codigo }
          }]);
          if (error) console.warn('Failed to save parceiro to Supabase:', error.message);
        } catch (err) {
          console.warn('Failed to save parceiro to Supabase:', err);
        }
      })();

      setShowAddCliForModal(false);
      return;
    }

    if (modalType === 'CLIENT') {
      let rel = formData.relacionamento || 'CLI';
      if (rel === 'Cliente') rel = 'CLI';
      if (rel === 'Fornecedor') rel = 'FOR';
      if (rel === 'Ambos') rel = 'AMB';

      const isFornecedor = rel === 'FOR';
      const charPrefix = isFornecedor ? 'F' : 'C';
      const relevantList = clientesFornecedores.filter(c => c.relacionamento === rel);
      const count = relevantList.length + 1;
      const fallbackCode = `${charPrefix}-${dateStr}${String(count).padStart(4, '0')}`;
      const codeVal = formData.codigo || formData.code || fallbackCode;
      const newCliFor = {
        ...formData,
        id: formData.id || ('cf-' + Math.random().toString(36).substr(2, 9)),
        nome: formData.col1 || formData.razaoSocial || 'Sem Razão Social',
        documento: formData.cnpjCpf || '',
        telefone: formData.contatoTelefone || '',
        estado: formData.uf || 'SP',
        relacionamento: rel,
        tipo: (formData.clientType === 'PJ' || formData.tipoPessoa === 'Jurídica') ? 'Pessoa Jurídica' : 'Pessoa Física',
        fazenda: formData.logradouro || 'Não Informada',
        codigo: codeVal,
        raw_data: { ...formData, codigo: codeVal }
      };
      setClientesFornecedores(prev => {
        const exists = prev.some(c => c.id === newCliFor.id);
        if (exists) {
          return prev.map(c => c.id === newCliFor.id ? newCliFor : c);
        }
        return [...prev, newCliFor];
      });

      // Persist to Supabase
      (async () => {
        try {
          const { error } = await supabase.from('clientes_fornecedores').upsert([{
            id: newCliFor.id,
            nome: newCliFor.nome,
            documento: newCliFor.documento,
            telefone: newCliFor.telefone,
            estado: newCliFor.estado,
            relacionamento: newCliFor.relacionamento,
            tipo: newCliFor.tipo,
            fazenda: newCliFor.fazenda,
            raw_data: { ...formData, codigo: newCliFor.codigo }
          }]);
          if (error) {
            console.warn('Failed to save clientes_fornecedores to Supabase:', error.message);
            alert(`Erro ao salvar no Supabase: ${error.message}\n\nO cadastro foi salvo temporariamente apenas na memória local do navegador.`);
          }
        } catch (err: any) {
          console.warn('Failed to save clientes_fornecedores to Supabase:', err);
          alert(`Erro ao salvar no Supabase: ${err.message || err}`);
        }
      })();
    }

    setShowAddCliForModal(false);
  };

  const handleEditRegistry = (type: 'TEAM' | 'CLIENT' | 'DRIVER' | 'PARTNER' | 'COST_CENTER' | 'BANK' | 'PARTNER_TYPE' | 'CATEGORY', item: any) => {
    setModalType(type);
    
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const dateStr = `${dd}${mm}${yy}`;
    
    // Map item back to cliForForm structure
    if (type === 'CLIENT') {
      const rel = item.relacionamento || 'CLI';
      const isFornecedor = rel === 'FOR';
      const charPrefix = isFornecedor ? 'F' : 'C';
      const relevantList = clientesFornecedores.filter(c => c.relacionamento === rel);
      const count = relevantList.length + 1;
      const fallbackCode = `${charPrefix}-${dateStr}${String(count).padStart(4, '0')}`;

      setModalTitle(rel === 'CLI' ? 'Editar Cliente' : rel === 'FOR' ? 'Editar Fornecedor' : 'Editar Cliente/Fornecedor');
      setCliForForm({
        ...initialCliForForm,
        ...(item.raw_data || {}),
        id: item.id,
        codigo: item.codigo || item.code || fallbackCode,
        col1: item.nome,
        razaoSocial: item.nome,
        nomeFantasia: item.nomeFantasia || item.nome,
        cnpjCpf: item.documento,
        contatoTelefone: item.telefone,
        uf: item.estado,
        relacionamento: rel,
        clientType: item.tipo === 'Pessoa Física' ? 'PF' : 'PJ',
        logradouro: item.fazenda,
        status: item.status || 'Ativo'
      });
    } else if (type === 'TEAM') {
      setModalTitle('Editar Equipe e Usuário');
      const nameParts = (item.nome || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const count = (usuarios || []).length + 1;
      const baseMatricula = 156488;
      const fallbackMatricula = `A${baseMatricula + count - 1}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        firstName,
        lastName,
        nickname: item.nickname || '',
        cpf: item.cpf || '',
        rg: item.rg || '',
        gender: item.gender || 'M',
        birthDate: item.birthDate || '',
        cargo: item.papel || '',
        departamento: item.departamento || 'COM',
        unidade: item.unidade || 'MT',
        gestor: item.gestor || '',
        centroCusto: item.centroCusto || '',
        segurancaPerfil: item.segurancaPerfil || 'ADM',
        segurancaPapel: item.papel || 'ADM',
        segurancaStatus: item.status === 'Ativo' ? 'A' : 'I',
        segurancaLogin: item.email || '',
        matricula: item.matricula || fallbackMatricula
      });
    } else if (type === 'DRIVER') {
      setModalTitle('Editar Motorista');
      const nameParts = (item.nome || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const count = motoristas.length + 1;
      const fallbackCode = `M-${dateStr}${String(count).padStart(4, '0')}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        firstName,
        lastName,
        nickname: item.nickname || '',
        cpf: item.cpf || '',
        rg: item.rg || '',
        gender: item.gender || 'M',
        birthDate: item.birthDate || '',
        cnh: item.cnh || '',
        cnhCategoria: item.cnhCategoria || 'AE',
        cnhValidade: item.cnhValidade || '',
        veiculoModelo: item.veiculoModelo || '',
        veiculoPlaca: item.placa || '',
        cargo: 'Motorista',
        departamento: 'LOG',
        unidade: item.unidade || 'MT',
        gestor: item.gestor || '',
        centroCusto: item.centroCusto || '',
        segurancaPerfil: 'VIEW',
        segurancaPapel: 'LOG',
        segurancaStatus: 'A',
        segurancaLogin: item.email || '',
        codigo: item.codigo || item.code || fallbackCode
      });
    } else if (type === 'PARTNER') {
      setModalTitle('Editar Parceiro / Corretor');
      const nameParts = (item.nome || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const count = parceiros.length + 1;
      const fallbackCode = `P-${dateStr}${String(count).padStart(4, '0')}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        firstName,
        lastName,
        nickname: item.contato || '',
        cpf: item.cpf || '',
        rg: item.rg || '',
        gender: item.gender || 'M',
        birthDate: item.birthDate || '',
        parceiroTipo: item.parceiroTipo || 'LOG',
        cargo: 'Parceiro',
        departamento: 'COM',
        unidade: item.unidade || 'MT',
        gestor: item.gestor || '',
        centroCusto: item.centroCusto || '',
        segurancaPerfil: 'VIEW',
        segurancaPapel: 'SUP',
        segurancaStatus: 'A',
        segurancaLogin: item.email || '',
        codigo: item.codigo || item.code || fallbackCode,
        contatoTelefone: item.telefone || '',
        cidade: item.regiao || ''
      });
    } else if (type === 'COST_CENTER') {
      setModalTitle('Editar Centro de Custo');
      const count = centrosCusto.length + 1;
      const fallbackCode = `CC-${String(count).padStart(3, '0')}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        codigo: item.codigo || item.code || fallbackCode,
        col1: item.nome,
        tipo: item.tipo || 'Operacional',
        responsavel: item.responsavel || '',
        status: item.status || 'Ativo',
        descricao: item.descricao || ''
      });
    } else if (type === 'BANK') {
      setModalTitle('Editar Instituição Bancária');
      const count = bancos.length + 1;
      const fallbackCode = `BK-${String(count).padStart(3, '0')}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        codigo: item.code || item.codigo || fallbackCode,
        col1: item.name || item.nome || '',
        status: item.status || 'Ativo'
      });
    } else if (type === 'PARTNER_TYPE') {
      setModalTitle('Editar Tipo de Parceiro');
      const count = tiposParceiro.length + 1;
      const fallbackCode = `T-${dateStr}${String(count).padStart(4, '0')}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        codigo: item.code || item.codigo || fallbackCode,
        col1: item.name || item.nome || '',
        status: item.status || 'Ativo',
        descricao: item.descricao || ''
      });
    } else if (type === 'CATEGORY') {
      setModalTitle('Editar Categoria de Animal');
      const count = categorias.length + 1;
      const fallbackCode = `K-${dateStr}${String(count).padStart(4, '0')}`;

      setCliForForm({
        ...(item.raw_data || {}),
        id: item.id,
        codigo: item.code || item.codigo || fallbackCode,
        col1: item.name || item.nome || '',
        status: item.status || 'Ativo',
        descricao: item.descricao || ''
      });
    }
    
    setShowAddCliForModal(true);
  };

  const handleDeleteRegistry = async (type: string, item: any) => {
    const label = item.nome || item.name || item.col1 || item.codigo || item.code || 'este registro';
    if (!window.confirm(`Deseja realmente excluir o registro "${label}"?`)) {
      return;
    }

    if (item.id) {
      setDeletedMockIds(prev => {
        const next = [...prev, item.id];
        localStorage.setItem('deleted_mock_ids', JSON.stringify(next));
        return next;
      });
    }

    try {
      if (type === 'CLIENT') {
        setClientesFornecedores(prev => prev.filter(c => c.id !== item.id));
        await supabase.from('clientes_fornecedores').delete().eq('id', item.id);
      } else if (type === 'TEAM') {
        if (onDeleteUsuario) {
          onDeleteUsuario(item.id);
        }
      } else if (type === 'DRIVER') {
        setMotoristas(prev => prev.filter(m => m.id !== item.id));
        await supabase.from('motoristas').delete().eq('id', item.id);
      } else if (type === 'PARTNER') {
        setParceiros(prev => prev.filter(p => p.id !== item.id));
        await supabase.from('parceiros').delete().eq('id', item.id);
      } else if (type === 'COST_CENTER') {
        setCentrosCusto(prev => prev.filter(c => c.id !== item.id));
        await supabase.from('centros_custo').delete().eq('id', item.id);
      } else if (type === 'BANK') {
        setBancos(prev => prev.filter(b => b.id !== item.id));
        await supabase.from('bancos').delete().eq('id', item.id);
      } else if (type === 'PARTNER_TYPE') {
        setTiposParceiro(prev => prev.filter(p => p.id !== item.id));
        await supabase.from('tipos_parceiro').delete().eq('id', item.id);
      } else if (type === 'CATEGORY') {
        setCategorias(prev => prev.filter(c => c.id !== item.id));
        await supabase.from('categorias').delete().eq('id', item.id);
      }
    } catch (err) {
      console.warn(`Failed to delete ${type} from Supabase:`, err);
    }
  };

  // Category filters
  const filterBySearch = (list: any[], keys: string[]) => {
    return list.filter((item) =>
      keys.some((key) =>
        String(item[key] || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredClientesFornecedores = filterBySearch(clientesFornecedores, ['codigo', 'nome', 'documento', 'estado']);
  const filteredParceiros = filterBySearch(parceiros, ['codigo', 'nome', 'contato', 'regiao']);
  const filteredMotoristas = filterBySearch(motoristas, ['codigo', 'nome', 'placa', 'transportadora']);
  const filteredCentrosCusto = filterBySearch(centrosCusto, ['nome', 'codigo', 'responsavel']);
  const filteredBancos = filterBySearch(bancos, ['code', 'name']);
  const filteredTiposParceiro = filterBySearch(tiposParceiro, ['code', 'name']);
  const filteredCategorias = filterBySearch(categorias, ['code', 'name']);

  return (
    <div id="cadastros-module" className="space-y-6">
      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex flex-col space-y-1 text-xs shadow-xs">
          <div className="flex items-center space-x-2 font-bold">
            <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
            <span>Atenção: Instabilidade ou Falha na Conexão com o Supabase</span>
          </div>
          <p>{dbError}</p>
        </div>
      )}
      
      {/* Sub tabs list */}
      <div className="flex border-b border-gray-255 bg-white p-2 rounded-xl shadow-xs space-x-1 overflow-x-auto">
        <button
          id="cad-tab-clientes-fornecedores"
          onClick={() => setActiveTab('clientes_fornecedores')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'clientes_fornecedores' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Clientes / Fornecedores</span>
        </button>

        <button
          id="cad-tab-parceiros"
          onClick={() => setActiveTab('parceiros')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'parceiros' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Parceiros / Corretores</span>
        </button>
        <button
          id="cad-tab-motoristas"
          onClick={() => setActiveTab('motoristas')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'motoristas' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Motoristas & Transportadoras</span>
        </button>
        <button
          id="cad-tab-usuarios"
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'usuarios' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Equipe e Usuários</span>
        </button>
        <button
          id="cad-tab-centros-custo"
          onClick={() => setActiveTab('centros_custo')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'centros_custo' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Centros de Custo</span>
        </button>
        <button
          id="cad-tab-bancos"
          onClick={() => setActiveTab('bancos')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'bancos' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Bancos</span>
        </button>
        <button
          id="cad-tab-tipos-parceiro"
          onClick={() => setActiveTab('tipos_parceiro')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'tipos_parceiro' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Tipos de Parceiro</span>
        </button>
        <button
          id="cad-tab-categorias"
          onClick={() => setActiveTab('categorias')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
            activeTab === 'categorias' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Categorias</span>
        </button>
      </div>

      {/* ==================== TAB: CLIENTES / FORNECEDORES ==================== */}
      {activeTab === 'clientes_fornecedores' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Clientes & Fornecedores Credenciados</h4>
              <p className="text-xs text-gray-500">Frigoríficos corporativos, compradores e pecuaristas parceiros produtores</p>
            </div>
            <button
              id="btn-add-client-supplier"
              onClick={() => handleOpenRegistryModal('CLIENT')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Cadastro</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código</th>
                  <th className="p-3">Nome / Razão Social</th>
                  <th className="p-3">CNPJ / CPF</th>
                  <th className="p-3">Telefone / Detalhe</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Relacionamento</th>
                  <th className="p-3 text-center">Segmento</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredClientesFornecedores.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{item.codigo || '-'}</td>
                    <td className="p-3 font-bold text-gray-800">{item.nome}</td>
                    <td className="p-3 font-mono text-gray-500">{item.documento}</td>
                    <td className="p-3 font-mono text-gray-500">
                      {item.relacionamento === 'FOR' ? (item.fazenda || 'Sem Fazenda') : (item.telefone || '-')}
                    </td>
                    <td className="p-3 text-center font-bold text-gray-600">{item.estado}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.relacionamento === 'CLI' ? 'bg-[#F8F8FA] text-[#071757]' :
                        item.relacionamento === 'FOR' ? 'bg-green-50 text-green-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {item.relacionamento === 'CLI' ? 'Cliente' :
                         item.relacionamento === 'FOR' ? 'Fornecedor' : 'Ambos'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[9px] uppercase font-bold">
                        {item.tipo || 'Pessoa Jurídica'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('CLIENT', item)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('CLIENT', item)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ==================== TAB: MOTORISTAS ==================== */}
      {activeTab === 'motoristas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Fichas de Motoristas e Transportadoras</h4>
              <p className="text-xs text-gray-500">Condutores autorizados com licença profissional para trânsito de carga viva</p>
            </div>
            <button
              id="btn-add-motorista"
              onClick={() => handleOpenRegistryModal('DRIVER')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Cadastro</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código</th>
                  <th className="p-3">Nome do Motorista</th>
                  <th className="p-3">Num. CNH</th>
                  <th className="p-3">Placa Atribuída</th>
                  <th className="p-3">Transportadora</th>
                  <th className="p-3 text-center">Situação</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredMotoristas.map((mo) => (
                  <tr key={mo.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{mo.codigo || '-'}</td>
                    <td className="p-3 font-bold text-gray-800">{mo.nome}</td>
                    <td className="p-3 font-mono text-gray-500">{mo.cnh}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 font-mono text-xs font-bold text-white bg-slate-900 rounded-sm">
                        {mo.placa}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{mo.transportadora}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        mo.status === 'Disponível' ? 'bg-green-100 text-green-800' : 'bg-[#F8F8FA] text-[#071757]'
                      }`}>
                        {mo.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('DRIVER', mo)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('DRIVER', mo)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: PARCEIROS ==================== */}
      {activeTab === 'parceiros' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Parceiros de Negócio, Leilões & Corretores</h4>
              <p className="text-xs text-gray-500">Agentes logísticos secundários de fomento para a compra de gado</p>
            </div>
            <button
              id="btn-add-parceiro"
              onClick={() => handleOpenRegistryModal('PARTNER')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Parceiro</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código</th>
                  <th className="p-3">Parceiro Comercial</th>
                  <th className="p-3">Contato / Corretor Responsável</th>
                  <th className="p-3">Telefone Direto</th>
                  <th className="p-3">Giro / Região de Atuação</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredParceiros.map((pa) => (
                  <tr key={pa.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{pa.codigo || '-'}</td>
                    <td className="p-3 font-bold text-gray-800">{pa.nome}</td>
                    <td className="p-3 font-semibold text-slate-800">{pa.contato}</td>
                    <td className="p-3 font-mono text-gray-500">{pa.telefone}</td>
                    <td className="p-3 text-gray-650">{pa.regiao}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 bg-[#F8F8FA] border border-[#DEE1E9] rounded-full text-[9px] font-bold text-[#071757]">
                        {pa.tipo}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('PARTNER', pa)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('PARTNER', pa)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: USUARIOS / EQUIPE ==================== */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Equipe e Usuários Internos</h4>
              <p className="text-xs text-gray-500">Credenciais de funcionários e níveis hierárquicos de acesso do sistema</p>
            </div>
            <button
              id="btn-add-usuario"
              onClick={() => handleOpenRegistryModal('TEAM')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Membro</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Matrícula</th>
                  <th className="p-3">Nome do Funcionário</th>
                  <th className="p-3">E-mail Corporativo</th>
                  <th className="p-3">Papel e Permissões</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filterBySearch(usuarios, ['matricula', 'nome', 'email', 'papel']).map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{u.matricula || '-'}</td>
                    <td className="p-3 pl-4 font-bold text-gray-800 flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-[#182763] text-[#D8B46A] flex items-center justify-center font-bold font-mono text-[10px]">
                        {u.nome.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span>{u.nome}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-[#182763] font-bold rounded text-[10px]">
                        {u.papel}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        u.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('TEAM', u)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('TEAM', u)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: CENTROS DE CUSTO ==================== */}
      {activeTab === 'centros_custo' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Estrutura de Centros de Custo</h4>
              <p className="text-xs text-gray-500">Unidades de negócio, fazendas e setores para rastreabilidade de custos</p>
            </div>
            <button
              id="btn-add-centro-custo"
              onClick={() => handleOpenRegistryModal('COST_CENTER')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Centro</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código</th>
                  <th className="p-3">Nome / Identificador</th>
                  <th className="p-3">Tipo de Centro</th>
                  <th className="p-3">Gestor Responsável</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredCentrosCusto.map((cc) => (
                  <tr key={cc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{cc.codigo}</td>
                    <td className="p-3 font-bold text-gray-800">{cc.nome}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        cc.tipo === 'Produtivo' ? 'bg-green-50 text-green-700 border border-green-200' :
                        cc.tipo === 'Administrativo' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-55 text-slate-700 border border-slate-200'
                      }`}>
                        {cc.tipo}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{cc.responsavel}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        cc.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cc.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('COST_CENTER', cc)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('COST_CENTER', cc)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: BANCOS ==================== */}
      {activeTab === 'bancos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Instituições Bancárias</h4>
              <p className="text-xs text-gray-500">Bancos cadastrados para vinculação financeira nas contas e cadastros</p>
            </div>
            <button
              id="btn-add-banco"
              onClick={() => handleOpenRegistryModal('BANK')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Banco</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código do Banco</th>
                  <th className="p-3">Nome da Instituição</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredBancos.map((b) => (
                  <tr key={b.id || b.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{b.code}</td>
                    <td className="p-3 font-bold text-gray-800">{b.name}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        b.status === 'Inativo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {b.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('BANK', b)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('BANK', b)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBancos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-400 italic">
                      Nenhuma instituição bancária cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: TIPOS DE PARCEIRO ==================== */}
      {activeTab === 'tipos_parceiro' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Tipos de Parceiro & Canais</h4>
              <p className="text-xs text-gray-500">Classificações operacionais para qualificação e segmentação de corretores e parceiros</p>
            </div>
            <button
              id="btn-add-tipo-parceiro"
              onClick={() => handleOpenRegistryModal('PARTNER_TYPE')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Tipo</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código</th>
                  <th className="p-3">Nome / Segmento</th>
                  <th className="p-3">Descrição</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredTiposParceiro.map((tp) => (
                  <tr key={tp.id || tp.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{tp.code}</td>
                    <td className="p-3 font-bold text-gray-800">{tp.name}</td>
                    <td className="p-3 text-gray-600">{tp.descricao || 'Nenhuma descrição informada'}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        tp.status === 'Inativo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {tp.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('PARTNER_TYPE', tp)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('PARTNER_TYPE', tp)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTiposParceiro.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                      Nenhum tipo de parceiro cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: CATEGORIAS ==================== */}
      {activeTab === 'categorias' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Categorias de Animais</h4>
              <p className="text-xs text-gray-500">Classificações e categorias de bovinos para controle comercial e pesagem</p>
            </div>
            <button
              id="btn-add-categoria"
              onClick={() => handleOpenRegistryModal('CATEGORY')}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Categoria</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">Código</th>
                  <th className="p-3">Nome da Categoria</th>
                  <th className="p-3">Descrição</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredCategorias.map((cat) => (
                  <tr key={cat.id || cat.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{cat.code}</td>
                    <td className="p-3 font-bold text-gray-800">{cat.name}</td>
                    <td className="p-3 text-gray-600">{cat.descricao || 'Nenhuma descrição informada'}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        cat.status === 'Inativo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {cat.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEditRegistry('CATEGORY', cat)}
                          className="p-1 text-slate-400 hover:text-[#071757] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistry('CATEGORY', cat)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategorias.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                      Nenhuma categoria cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== DYNAMIC REGISTRY MODAL ==================== */}
      {showAddCliForModal && (
        <RegistryModal
          isOpen={showAddCliForModal}
          onClose={() => setShowAddCliForModal(false)}
          onSave={handleCliForSave}
          type={modalType}
          title={modalTitle}
          banks={bancos}
          partnerTypes={tiposParceiro}
          initialData={cliForForm}
        />
      )}

    </div>
  );
}
