/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compra, OrdemCompraCliente, Negociacao, Lote, SubMenuComercial } from '../types';
import { CADASTRO_CLIENTES, CADASTRO_FORNECEDORES, CADASTRO_PARCEIROS, CADASTRO_MOTORISTAS } from '../data/mockData';
import { supabase } from '../supabaseClient';

const MOCK_CLIENT_UNITS = [
  { id: 'cl-1-1', nomeFantasia: 'JBS - Rondonópolis', razaoSocial: 'Frigorífico JBS S/A', cidade: 'Rondonópolis', uf: 'MT' },
  { id: 'cl-1-2', nomeFantasia: 'JBS - Barra do Garças', razaoSocial: 'Frigorífico JBS S/A', cidade: 'Barra do Garças', uf: 'MT' },
  { id: 'cl-1-3', nomeFantasia: 'JBS - Campo Grande', razaoSocial: 'Frigorífico JBS S/A', cidade: 'Campo Grande', uf: 'MS' },
  { id: 'cl-2-1', nomeFantasia: 'Marfrig - Bataguassu', razaoSocial: 'Frigorífico Marfrig Global Foods', cidade: 'Bataguassu', uf: 'MS' },
  { id: 'cl-2-2', nomeFantasia: 'Marfrig - Tangará da Serra', razaoSocial: 'Frigorífico Marfrig Global Foods', cidade: 'Tangará da Serra', uf: 'MT' },
  { id: 'cl-2-3', nomeFantasia: 'Marfrig - Promissão', razaoSocial: 'Frigorífico Marfrig Global Foods', cidade: 'Promissão', uf: 'SP' },
  { id: 'cl-3-1', nomeFantasia: 'Minerva - Paranatinga', razaoSocial: 'Minerva Foods S/A', cidade: 'Paranatinga', uf: 'MT' },
  { id: 'cl-3-2', nomeFantasia: 'Minerva - Barretos', razaoSocial: 'Minerva Foods S/A', cidade: 'Barretos', uf: 'SP' },
  { id: 'cl-3-3', nomeFantasia: 'Minerva - Araguaína', razaoSocial: 'Minerva Foods S/A', cidade: 'Araguaína', uf: 'TO' }
];

const formatData = (value: string) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parts = value.substring(0, 10).split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const nums = value.replace(/\D/g, '');
  if (nums.length <= 2) {
    return nums;
  }
  if (nums.length <= 4) {
    return `${nums.substring(0, 2)}/${nums.substring(2)}`;
  }
  return `${nums.substring(0, 2)}/${nums.substring(2, 4)}/${nums.substring(4, 8)}`;
};

const convertBrToIsoDate = (value: string) => {
  const clean = value.replace(/\D/g, '');
  if (clean.length === 8) {
    const day = clean.substring(0, 2);
    const month = clean.substring(2, 4);
    const year = clean.substring(4, 8);
    return `${year}-${month}-${day}`;
  }
  return value;
};

const convertIsoToBrDate = (value: string) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parts = value.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return value;
};

const formatWeightBR = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num) || num === 0) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseWeightBR = (val: string): number => {
  const cleaned = val.replace(/\D/g, '');
  if (!cleaned) return 0;
  return Number(cleaned) / 100;
};

import {
  Search,
  Plus,
  ArrowRightLeft,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  MoveRight,
  TrendingUp,
  Tag,
  MapPin,
  FileCheck,
  Edit2
} from 'lucide-react';

interface CommercialViewProps {
  compras: Compra[];
  onAddCompra: (compra: Compra) => void;
  onDeleteCompra: (id: string) => void;
  ordensCompraCliente: OrdemCompraCliente[];
  onAddOrdemCompraCliente: (venda: OrdemCompraCliente) => void;
  onDeleteOrdemCompraCliente: (id: string) => void;
  negociacoes: Negociacao[];
  onUpdateNegociacaoStage: (id: string, stage: Negociacao['fase']) => void;
  onAddNegociacao: (neg: Negociacao) => void;
  searchQuery: string;
  activeSubMenu: SubMenuComercial;
  setActiveSubMenu: (sub: SubMenuComercial) => void;
  viagens?: any[]; // ViagemLogistica[] representing active processes
  onGoToLogistica?: () => void;
}

export default function CommercialView({
  compras,
  onAddCompra,
  onDeleteCompra,
  ordensCompraCliente,
  onAddOrdemCompraCliente,
  onDeleteOrdemCompraCliente,
  negociacoes,
  onUpdateNegociacaoStage,
  onAddNegociacao,
  searchQuery,
  activeSubMenu,
  setActiveSubMenu,
  viagens = [],
  onGoToLogistica
}: CommercialViewProps) {
  
  // Clientes and Fornecedores states loaded from Supabase
  const [clientes, setClientes] = useState<any[]>(MOCK_CLIENT_UNITS);
  const [fornecedores, setFornecedores] = useState<any[]>([]);

  useEffect(() => {
    async function loadRelations() {
      try {
        const { data, error } = await supabase
          .from('clientes_fornecedores')
          .select('*');

        if (!error && data && data.length > 0) {
          const allRelations = data.map(item => {
            const raw = item.raw_data || {};
            const rSocial = raw.razaoSocial || item.nome || 'Sem Razão Social';
            const nFantasia = raw.nomeFantasia || item.nome || rSocial;
            const cid = raw.cidade || item.fazenda || 'Não Informada';
            const estadoUf = raw.uf || item.estado || 'SP';
            let rel = item.relacionamento;
            if (rel === 'Cliente') rel = 'CLI';
            if (rel === 'Fornecedor') rel = 'FOR';
            if (rel === 'Ambos') rel = 'AMB';
            return {
              id: item.id,
              codigo: item.codigo || raw.codigo || '',
              nome: item.nome,
              nomeFantasia: nFantasia,
              razaoSocial: rSocial,
              cidade: cid,
              uf: estadoUf,
              documento: item.documento || '',
              telefone: item.telefone || '',
              relacionamento: rel || 'CLI',
              fazenda: item.fazenda || ''
            };
          });

          const clientList = allRelations.filter(item => item.relacionamento === 'CLI' || item.relacionamento === 'AMB');
          const supplierList = allRelations.filter(item => item.relacionamento === 'FOR' || item.relacionamento === 'AMB');

          if (clientList.length > 0) {
            setClientes(clientList);
          }
          if (supplierList.length > 0) {
            setFornecedores(supplierList);
          }
        }
      } catch (err) {
        console.warn('Failed to load relations from Supabase in CommercialView:', err);
      }
    }
    loadRelations();

    const channel = supabase
      .channel('commercial-relations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clientes_fornecedores'
        },
        () => {
          loadRelations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Categorias state loaded from Supabase
  const [categorias, setCategorias] = useState<any[]>([
    { code: 'BOI', name: 'Boi Gordo' },
    { code: 'VAC', name: 'Vaca Gorda' },
    { code: 'GAR', name: 'Garrote' },
    { code: 'NOV', name: 'Novilha' },
    { code: 'BEZ', name: 'Bezerro(a)' }
  ]);

  useEffect(() => {
    async function loadCategorias() {
      try {
        const { data, error } = await supabase
          .from('categorias')
          .select('*');

        if (!error && data && data.length > 0) {
          const activeCats = data
            .filter(item => item.status === 'Ativo')
            .map(item => ({
              code: item.codigo,
              name: item.nome
            }));
          if (activeCats.length > 0) {
            setCategorias(activeCats);
          }
        }
      } catch (err) {
        console.warn('Failed to load categorias from Supabase in CommercialView:', err);
      }
    }
    loadCategorias();
  }, []);

  // Modals status
  const [showAddCompraModal, setShowAddCompraModal] = useState(false);
  const [showAddVendaModal, setShowAddVendaModal] = useState(false);
  const [showAddNegModal, setShowAddNegModal] = useState(false);

  const [isEditCompraMode, setIsEditCompraMode] = useState(false);
  const [editCompraId, setEditCompraId] = useState<string | null>(null);

  // Form State for Compra
  const [compraForm, setCompraForm] = useState({
    numeroOperacao: '',
    codigoFornecedor: '',
    fornecedor: '',
    fazendaOrigem: '',
    municipio: '',
    estado: '',
    categoriaAnimal: '' as any,
    quantidade: '' as any,
    pesoMedio: '' as any,
    valorArroba: '' as any,
    comissao: '' as any,
    frete: '' as any,
    ordemCompraClienteId: '',
    prazoPagamento: '',
    formaPagamento: '',
    observacoes: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    dataEntrega: new Date().toISOString().split('T')[0],
    status: 'Aberta',
    pais: '',
    corretor: '',
    motorista: '',
    veiculo: '',
    placa: '',
    destinoFrigorifico: '',
    destinoCidade: '',
    destinoEstado: '',
    destinoPais: '',
    destinoCodigo: '',
    destinoFazenda: '',
    codigoOrdemCompraCliente: '',
    tipoCompra: 'Compra Direta'
  });

  // Form State for OrdemCompraCliente
  const [vendaForm, setVendaForm] = useState({
    numeroOC: '',
    codigoCliente: '',
    cliente: '',
    frigorifico: '',
    categoriaAnimal: '' as any,
    quantidade: '' as any,
    peso: '' as any,
    valorArroba: '' as any,
    comissao: '' as any,
    status: 'Pendente' as OrdemCompraCliente['status'],
    dataEmissao: new Date().toISOString().split('T')[0],
    codigoOrdemCompraCliente: ''
  });

  // Form State for Negociacao
  const [negForm, setNegForm] = useState({
    titulo: '',
    codigoClienteFornecedor: '',
    clienteFornecedor: '',
    fazenda: '',
    cabecas: '' as any,
    valorEstimado: '' as any,
    contatoTelefone: '',
    fase: 'prospeccao' as Negociacao['fase'],
    ordemCompraClienteId: '',
    processoId: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    destinoCodigo: '',
    destinoFrigorifico: '',
    destinoFazenda: '',
    destinoCidade: '',
    destinoEstado: '',
    destinoPais: 'Brasil',
    tipoCompra: 'Compra Direta'
  });

  // Live calculations for Add Compra Modal
  const livePesoTotal = (Number(compraForm.quantidade) || 0) * (Number(compraForm.pesoMedio) || 0);
  const liveArrobas = livePesoTotal / 30;
  const liveValorGado = liveArrobas * (Number(compraForm.valorArroba) || 0);
  const liveComissao = liveValorGado * ((Number(compraForm.comissao) || 0) / 100);
  const liveFrete = Number(compraForm.quantidade) > 50 ? 0 : (Number(compraForm.frete) || 0);
  const liveTotalEstimado = Math.round(liveValorGado + liveComissao + liveFrete);

  useEffect(() => {
    if (showAddVendaModal) {
      setVendaForm(prev => ({
        ...prev,
        numeroOC: 'OC-2026-' + Math.floor(Math.random() * 9000 + 1000),
        cliente: '',
        frigorifico: '',
        dataEmissao: new Date().toISOString().split('T')[0],
        status: 'Pendente'
      }));
    }
  }, [showAddVendaModal]);

  useEffect(() => {
    if (showAddCompraModal && !isEditCompraMode) {
      setCompraForm(prev => ({
        ...prev,
        numeroOperacao: 'PO-2026-' + Math.floor(Math.random() * 900 + 100),
        dataEmissao: new Date().toISOString().split('T')[0]
      }));
    }
  }, [showAddCompraModal, isEditCompraMode]);

  useEffect(() => {
    if (!showAddCompraModal) {
      setIsEditCompraMode(false);
      setEditCompraId(null);
    }
  }, [showAddCompraModal]);

  const getSupplierCity = (nome: string) => {
    if (nome === 'José Carlos Albuquerque') return 'Rondonópolis';
    if (nome === 'Agropecuária Vale Verde S/A') return 'Rio Verde';
    if (nome === 'Marcos de Souza Neves') return 'Redenção';
    if (nome === 'Alfa Transportes LTDA') return 'Redenção';
    if (nome === 'Norte Pegaso Serviços LTDA') return 'Redenção';
    if (nome === 'Armazéns Estações & Comércio LTDA') return 'Belém';
    if (nome === 'Carlos Henrique Abreu') return 'Tucumã';
    if (nome === 'Expresso Pará Logística LTDA') return 'Castanhal';
    if (nome === 'TechNorte Sistemas LTDA') return 'Belém';
    return '';
  };

  const getClientCity = (nome: string) => {
    if (nome === 'Frigorífico JBS S/A') return 'Rondonópolis';
    if (nome === 'Frigorífico Marfrig Global Foods') return 'Bataguassu';
    if (nome === 'Minerva Foods S/A') return 'Barretos';
    if (nome === 'João Marcelo Santos') return 'Redenção';
    if (nome === 'Norte Pegaso Serviços LTDA') return 'Redenção';
    if (nome === 'Maria Eduarda Lima') return 'Belém';
    if (nome === 'Carlos Henrique Abreu') return 'Tucumã';
    if (nome === 'Fernanda Rocha Martins') return 'Castanhal';
    if (nome === 'TechNorte Sistemas LTDA') return 'Belém';
    if (nome === 'Rafael Augusto Pereira') return 'Belém';
    return '';
  };

  const triggerClienteCodigoLookup = (code: string) => {
    const foundMock = CADASTRO_CLIENTES.find(c => c.codigo === code || c.id === code);
    if (foundMock) {
      setVendaForm(prev => ({
        ...prev,
        cliente: foundMock.nome,
        frigorifico: foundMock.nome
      }));
    } else {
      const foundDb = clientes.find(c => c.id === code || c.codigo === code);
      if (foundDb) {
        setVendaForm(prev => ({
          ...prev,
          cliente: foundDb.nomeFantasia,
          frigorifico: foundDb.nomeFantasia
        }));
      }
    }
  };

  const triggerClienteNameLookup = (name: string) => {
    const foundMock = CADASTRO_CLIENTES.find(c => c.nome === name);
    if (foundMock) {
      setVendaForm(prev => ({
        ...prev,
        codigoCliente: foundMock.codigo,
        frigorifico: foundMock.nome
      }));
    } else {
      const foundDb = clientes.find(c => c.nomeFantasia === name);
      if (foundDb) {
        setVendaForm(prev => ({
          ...prev,
          codigoCliente: foundDb.id,
          frigorifico: foundDb.nomeFantasia
        }));
      }
    }
  };

  const triggerFornecedorCodigoLookup = (code: string) => {
    if (!code) return;
    const cleanVal = code.trim();
    const foundDb = fornecedores.find(f => 
      (f.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (f.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setCompraForm(prev => ({
        ...prev,
        codigoFornecedor: code,
        fornecedor: foundDb.nomeFantasia || foundDb.nome || '',
        fazendaOrigem: foundDb.fazenda || '',
        estado: foundDb.uf || '',
        pais: 'Brasil',
        municipio: foundDb.cidade || ''
      }));
      return;
    }
    const found = CADASTRO_FORNECEDORES.find(f => 
      (f.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (f.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (found) {
      setCompraForm(prev => ({
        ...prev,
        codigoFornecedor: code,
        fornecedor: found.nome || '',
        fazendaOrigem: found.fazenda || '',
        estado: found.estado || '',
        pais: 'Brasil',
        municipio: getSupplierCity(found.nome) || ''
      }));
    }
  };

  const triggerFornecedorNameLookup = (name: string) => {
    if (!name) return;
    const cleanVal = name.trim();
    const foundDb = fornecedores.find(f => 
      (f.nomeFantasia || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (f.razaoSocial || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (f.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setCompraForm(prev => ({
        ...prev,
        fornecedor: name,
        codigoFornecedor: foundDb.codigo || foundDb.id || '',
        fazendaOrigem: foundDb.fazenda || '',
        estado: foundDb.uf || '',
        pais: 'Brasil',
        municipio: foundDb.cidade || ''
      }));
      return;
    }
    const found = CADASTRO_FORNECEDORES.find(f => 
      (f.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (found) {
      setCompraForm(prev => ({
        ...prev,
        fornecedor: name,
        codigoFornecedor: found.codigo || '',
        fazendaOrigem: found.fazenda || '',
        estado: found.estado || '',
        pais: 'Brasil',
        municipio: getSupplierCity(found.nome) || ''
      }));
    }
  };

  const triggerDestinoCodigoLookup = (code: string) => {
    if (!code) return;
    const cleanVal = code.trim();
    const foundDb = clientes.find(c => 
      (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase() ||
      (c.cnpj || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setCompraForm(prev => ({
        ...prev,
        destinoCodigo: code,
        destinoFrigorifico: foundDb.nomeFantasia || foundDb.nome || '',
        destinoEstado: foundDb.uf || '',
        destinoPais: foundDb.pais || 'Brasil',
        destinoCidade: foundDb.cidade || ''
      }));
      return;
    }
    const foundMock = CADASTRO_CLIENTES.find(c => 
      (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundMock) {
      setCompraForm(prev => ({
        ...prev,
        destinoCodigo: code,
        destinoFrigorifico: foundMock.nome || '',
        destinoEstado: foundMock.estado || '',
        destinoPais: 'Brasil',
        destinoCidade: getClientCity(foundMock.nome) || ''
      }));
    }
  };

  const triggerDestinoNameLookup = (name: string) => {
    if (!name) return;
    const cleanVal = name.trim();
    const foundDb = clientes.find(c => 
      (c.nomeFantasia || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (c.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setCompraForm(prev => ({
        ...prev,
        destinoFrigorifico: name,
        destinoCodigo: foundDb.codigo || foundDb.id || '',
        destinoEstado: foundDb.uf || '',
        destinoPais: foundDb.pais || 'Brasil',
        destinoCidade: foundDb.cidade || ''
      }));
      return;
    }
    const foundMock = CADASTRO_CLIENTES.find(c => 
      (c.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundMock) {
      setCompraForm(prev => ({
        ...prev,
        destinoFrigorifico: name,
        destinoCodigo: foundMock.codigo || '',
        destinoEstado: foundMock.estado || '',
        destinoPais: 'Brasil',
        destinoCidade: getClientCity(foundMock.nome) || ''
      }));
    }
  };

  const triggerClienteFornecedorCodigoLookup = (code: string) => {
    if (!code) return;
    const cleanVal = code.trim();
    const foundDb = [...clientes, ...fornecedores].find(x => 
      (x.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (x.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setNegForm(prev => ({
        ...prev,
        codigoClienteFornecedor: code,
        clienteFornecedor: foundDb.nomeFantasia || foundDb.nome || '',
        fazenda: foundDb.fazenda || '',
        estado: foundDb.uf || foundDb.estado || '',
        cidade: foundDb.cidade || '',
        contatoTelefone: foundDb.telefone || '',
        pais: 'Brasil'
      }));
      return;
    }
    const found = [...CADASTRO_CLIENTES, ...CADASTRO_FORNECEDORES].find(x => 
      (x.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (x.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (found) {
      setNegForm(prev => ({
        ...prev,
        codigoClienteFornecedor: code,
        clienteFornecedor: found.nome || '',
        fazenda: 'fazenda' in found ? (found as any).fazenda : '',
        estado: found.estado || '',
        cidade: 'fazenda' in found ? getSupplierCity(found.nome) : '',
        contatoTelefone: 'telefone' in found ? (found as any).telefone : '',
        pais: 'Brasil'
      }));
    }
  };

  const triggerClienteFornecedorNameLookup = (name: string) => {
    if (!name) return;
    const cleanVal = name.trim();
    const foundDb = [...clientes, ...fornecedores].find(x => 
      (x.nomeFantasia || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (x.razaoSocial || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (x.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setNegForm(prev => ({
        ...prev,
        clienteFornecedor: name,
        codigoClienteFornecedor: foundDb.codigo || foundDb.id || '',
        fazenda: foundDb.fazenda || '',
        estado: foundDb.uf || foundDb.estado || '',
        cidade: foundDb.cidade || '',
        contatoTelefone: foundDb.telefone || '',
        pais: 'Brasil'
      }));
      return;
    }
    const found = [...CADASTRO_CLIENTES, ...CADASTRO_FORNECEDORES].find(x => 
      (x.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (found) {
      setNegForm(prev => ({
        ...prev,
        clienteFornecedor: name,
        codigoClienteFornecedor: found.codigo || '',
        fazenda: 'fazenda' in found ? (found as any).fazenda : '',
        estado: found.estado || '',
        cidade: 'fazenda' in found ? getSupplierCity(found.nome) : '',
        contatoTelefone: 'telefone' in found ? (found as any).telefone : '',
        pais: 'Brasil'
      }));
    }
  };

  const triggerNegDestinoCodigoLookup = (code: string) => {
    if (!code) return;
    const cleanVal = code.trim();
    const foundDb = clientes.find(c => 
      (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setNegForm(prev => ({
        ...prev,
        destinoCodigo: code,
        destinoFrigorifico: foundDb.nomeFantasia || foundDb.nome || '',
        destinoFazenda: foundDb.fazenda || '',
        destinoEstado: foundDb.uf || '',
        destinoCidade: foundDb.cidade || '',
        destinoPais: 'Brasil'
      }));
      return;
    }
    const foundMock = CADASTRO_CLIENTES.find(c => 
      (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundMock) {
      setNegForm(prev => ({
        ...prev,
        destinoCodigo: code,
        destinoFrigorifico: foundMock.nome || '',
        destinoFazenda: '',
        destinoEstado: foundMock.estado || '',
        destinoCidade: getClientCity(foundMock.nome) || '',
        destinoPais: 'Brasil'
      }));
    }
  };

  const triggerNegDestinoNameLookup = (name: string) => {
    if (!name) return;
    const cleanVal = name.trim();
    const foundDb = clientes.find(c => 
      (c.nomeFantasia || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
      (c.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundDb) {
      setNegForm(prev => ({
        ...prev,
        destinoFrigorifico: name,
        destinoCodigo: foundDb.codigo || foundDb.id || '',
        destinoFazenda: foundDb.fazenda || '',
        destinoEstado: foundDb.uf || '',
        destinoCidade: foundDb.cidade || '',
        destinoPais: 'Brasil'
      }));
      return;
    }
    const foundMock = CADASTRO_CLIENTES.find(c => 
      (c.nome || '').trim().toLowerCase() === cleanVal.toLowerCase()
    );
    if (foundMock) {
      setNegForm(prev => ({
        ...prev,
        destinoFrigorifico: name,
        destinoCodigo: foundMock.codigo || '',
        destinoFazenda: '',
        destinoEstado: foundMock.estado || '',
        destinoCidade: getClientCity(foundMock.nome) || '',
        destinoPais: 'Brasil'
      }));
    }
  };

  // Submódulo calculations & filters
  const handleAddCompraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields to prevent saving empty forms
    if (!compraForm.codigoFornecedor || !compraForm.fornecedor || !compraForm.fazendaOrigem || !compraForm.categoriaAnimal || !compraForm.quantidade || !compraForm.pesoMedio || !compraForm.valorArroba) {
      alert("Por favor, preencha todos os campos obrigatórios (Código do Fornecedor, Fornecedor, Fazenda, Categoria, Quantidade, Peso Médio e Valor da Arroba).");
      return;
    }
    const pesoTotal = Number(compraForm.quantidade) * Number(compraForm.pesoMedio);
    const arrobas = pesoTotal / 30;
    const valorGado = arrobas * Number(compraForm.valorArroba);
    const comissaoValor = valorGado * (Number(compraForm.comissao) / 100);
    const freteValor = Number(compraForm.quantidade) > 50 ? 0 : Number(compraForm.frete);
    const valorTotal = Math.round(valorGado + comissaoValor + freteValor);

    const novaCompra: Compra = {
      id: isEditCompraMode && editCompraId ? editCompraId : 'c-' + Math.random().toString(36).substr(2, 9),
      numeroOperacao: compraForm.numeroOperacao || 'PO-2026-' + Math.floor(Math.random() * 900 + 100),
      codigoFornecedor: compraForm.codigoFornecedor,
      codigoOrdemCompraCliente: compraForm.codigoOrdemCompraCliente,
      fornecedor: compraForm.fornecedor,
      fazendaOrigem: compraForm.fazendaOrigem,
      municipio: compraForm.municipio,
      estado: compraForm.estado,
      categoriaAnimal: compraForm.categoriaAnimal,
      quantidade: Number(compraForm.quantidade),
      pesoMedio: Number(compraForm.pesoMedio),
      pesoTotal: pesoTotal,
      valorArroba: Number(compraForm.valorArroba),
      comissao: Number(compraForm.comissao),
      frete: freteValor,
      valorTotal: valorTotal,
      dataCriacao: compraForm.dataEmissao || new Date().toISOString().split('T')[0],
      dataEntrega: compraForm.dataEntrega || new Date().toISOString().split('T')[0],
      ordemCompraClienteId: compraForm.ordemCompraClienteId || undefined,
      prazoPagamento: compraForm.prazoPagamento,
      formaPagamento: compraForm.formaPagamento,
      observacoes: compraForm.observacoes,
      status: compraForm.status,
      pais: compraForm.pais,
      corretor: compraForm.corretor,
      motorista: Number(compraForm.quantidade) > 50 ? '' : compraForm.motorista,
      veiculo: Number(compraForm.quantidade) > 50 ? '' : compraForm.veiculo,
      placa: Number(compraForm.quantidade) > 50 ? '' : compraForm.placa,
      destinoFrigorifico: compraForm.destinoFrigorifico,
      destinoCidade: compraForm.destinoCidade,
      destinoState: compraForm.destinoEstado,
      destinoPais: compraForm.destinoPais,
      destinoCodigo: compraForm.destinoCodigo || '',
      destinoFazenda: compraForm.destinoFazenda || '',
      tipoCompra: compraForm.tipoCompra
    } as any;

    onAddCompra(novaCompra);
    setShowAddCompraModal(false);
    setIsEditCompraMode(false);
    setEditCompraId(null);
    // Reset keys
    setCompraForm({
      numeroOperacao: '',
      codigoFornecedor: '',
      fornecedor: '',
      fazendaOrigem: '',
      municipio: '',
      estado: '',
      categoriaAnimal: '' as any,
      quantidade: '' as any,
      pesoMedio: '' as any,
      valorArroba: '' as any,
      comissao: '' as any,
      frete: '' as any,
      ordemCompraClienteId: '',
      prazoPagamento: '',
      formaPagamento: '',
      observacoes: '',
      dataEmissao: new Date().toISOString().split('T')[0],
      dataEntrega: new Date().toISOString().split('T')[0],
      status: 'Aberta',
      pais: '',
      corretor: '',
      motorista: '',
      veiculo: '',
      placa: '',
      destinoFrigorifico: '',
      destinoCidade: '',
      destinoEstado: '',
      destinoPais: '',
      destinoCodigo: '',
      destinoFazenda: '',
      codigoOrdemCompraCliente: '',
      tipoCompra: 'Compra Direta'
    });
  };

  const handleAddVendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!vendaForm.codigoCliente || !vendaForm.cliente || !vendaForm.frigorifico || !vendaForm.categoriaAnimal || !vendaForm.quantidade || !vendaForm.peso || !vendaForm.valorArroba) {
      alert("Por favor, preencha todos os campos obrigatórios (Código do Cliente, Cliente, Destino, Categoria, Quantidade, Peso Total e Preço Unitário).");
      return;
    }
    const pesoTotal = Number(vendaForm.peso);
    const arrobas = pesoTotal / 30;
    const valorBruto = arrobas * Number(vendaForm.valorArroba);
    const comissaoDedução = valorBruto * (Number(vendaForm.comissao || 0) / 100);
    const resultado = Math.round(valorBruto - comissaoDedução);

    const novaVenda: OrdemCompraCliente = {
      id: 'v-' + Math.random().toString(36).substr(2, 9),
      numeroOC: vendaForm.numeroOC || 'OC-2026-' + Math.floor(Math.random() * 900 + 100),
      codigoCliente: vendaForm.codigoCliente,
      cliente: vendaForm.cliente,
      frigorifico: vendaForm.frigorifico,
      categoriaAnimal: vendaForm.categoriaAnimal,
      quantidade: Number(vendaForm.quantidade),
      peso: pesoTotal,
      valorArroba: Number(vendaForm.valorArroba),
      comissao: Number(vendaForm.comissao),
      resultadoOperacao: resultado,
      status: vendaForm.status,
      dataCriacao: vendaForm.dataEmissao || new Date().toISOString().split('T')[0],
      codigoOrdemCompraCliente: vendaForm.codigoOrdemCompraCliente
    };

    onAddOrdemCompraCliente(novaVenda);
    setShowAddVendaModal(false);
    setVendaForm({
      numeroOC: '',
      codigoCliente: '',
      cliente: '',
      frigorifico: '',
      categoriaAnimal: '' as any,
      quantidade: '' as any,
      peso: '' as any,
      valorArroba: '' as any,
      comissao: '' as any,
      status: 'Pendente',
      dataEmissao: new Date().toISOString().split('T')[0],
      codigoOrdemCompraCliente: ''
    });
  };

  const handleAddNegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!negForm.titulo || !negForm.codigoClienteFornecedor || !negForm.clienteFornecedor || !negForm.fazenda || !negForm.cabecas || !negForm.valorEstimado) {
      alert("Por favor, preencha todos os campos obrigatórios (Título, Código do Parceiro, Parceiro Comercial, Fazenda, Cabeças e Valor Estimado).");
      return;
    }
    const novaNeg: Negociacao = {
      id: 'n-' + Math.random().toString(36).substr(2, 9),
      titulo: negForm.titulo,
      codigoClienteFornecedor: negForm.codigoClienteFornecedor,
      clienteFornecedor: negForm.clienteFornecedor,
      fazenda: negForm.fazenda,
      cabecas: Number(negForm.cabecas),
      valorEstimado: Number(negForm.valorEstimado),
      contatoTelefone: negForm.contatoTelefone,
      fase: negForm.fase,
      ultimaAtualizacao: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
      ordemCompraClienteId: negForm.ordemCompraClienteId || undefined,
      processoId: negForm.processoId || undefined,
      pais: negForm.pais,
      estado: negForm.estado,
      cidade: negForm.cidade,
      destinoCodigo: negForm.destinoCodigo,
      destinoFrigorifico: negForm.destinoFrigorifico,
      destinoFazenda: negForm.destinoFazenda,
      destinoCidade: negForm.destinoCidade,
      destinoEstado: negForm.destinoEstado,
      destinoPais: negForm.destinoPais,
      tipoCompra: negForm.tipoCompra
    };
    onAddNegociacao(novaNeg);
    setShowAddNegModal(false);
    setNegForm({
      titulo: '',
      codigoClienteFornecedor: '',
      clienteFornecedor: '',
      fazenda: '',
      cabecas: '' as any,
      valorEstimado: '' as any,
      contatoTelefone: '',
      fase: 'prospeccao',
      ordemCompraClienteId: '',
      processoId: '',
      pais: 'Brasil',
      estado: '',
      cidade: '',
      destinoCodigo: '',
      destinoFrigorifico: '',
      destinoFazenda: '',
      destinoCidade: '',
      destinoEstado: '',
      destinoPais: 'Brasil',
      tipoCompra: 'Compra Direta'
    });
  };

  // Grid Filters
  // Automatic reconciliation of Client Purchase Order status based on linked purchases
  const reconciledVendas = ordensCompraCliente.map(v => {
    const linkedPurchases = compras.filter(c => c.ordemCompraClienteId === v.id);
    const totalPurchased = linkedPurchases.reduce((acc, curr) => acc + Number(curr.quantidade), 0);
    let status: OrdemCompraCliente['status'] = 'Pendente';
    if (totalPurchased > 0) {
      if (totalPurchased >= v.quantidade) {
        status = 'Entregue';
      } else {
        status = 'Faturada';
      }
    }
    return { ...v, status };
  });

  // Grid Filters
  const filteredCompras = compras.filter((c) =>
    c.fornecedor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.fazendaOrigem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.numeroOperacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.municipio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendas = reconciledVendas.filter((v) =>
    v.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.frigorifico.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.numeroOC.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kanban Columns
  const kanbanColumns: Array<{ key: Negociacao['fase']; label: string; bg: string; text: string }> = [
    { key: 'prospeccao', label: 'Prospecção / Visitas', bg: 'bg-[#F8F8FA] border-[#DEE1E9]', text: 'text-[#071757]' },
    { key: 'negociacao', label: 'Em Negociação', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
    { key: 'documentacao', label: 'Análise Documental', bg: 'bg-[#FDF6E3] border-[#D8B46A]/30', text: 'text-[#8A6D2E]' },
    { key: 'aprovado', label: 'Aprovado / Fechado', bg: 'bg-green-50 border-green-200', text: 'text-green-800' },
    { key: 'cancelado', label: 'Cancelado', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800' }
  ];

  return (
    <div id="commercial-module-view" className="space-y-6">
      
      {/* Tab Navigation header */}
      <div className="flex border-b border-gray-250 bg-white p-2 rounded-xl shadow-xs space-x-1">
        <button
          id="tab-vendas"
          onClick={() => setActiveSubMenu('vendas')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'vendas'
              ? 'bg-[#071757] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          Ordens de Compra
        </button>
        <button
          id="tab-compras"
          onClick={() => setActiveSubMenu('compras')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'compras'
              ? 'bg-[#071757] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          Negociações
        </button>
        <button
          id="tab-negociacoes"
          onClick={() => setActiveSubMenu('negociacoes')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'negociacoes'
              ? 'bg-[#071757] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          CRM / Follow-up
        </button>
      </div>

      {/* -------------------- GESTÃO DE COMPRAS -------------------- */}
      {activeSubMenu === 'compras' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-white/80 backdrop-blur-lg border border-white/20 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Negociação de Compra Bovina</h3>
              <p className="text-xs text-gray-400 font-medium">Controle de entrada de gado, cálculo de arrobas e fretes</p>
            </div>
            <button
              id="btn-add-compra"
              onClick={() => {
                setCompraForm({
                  numeroOperacao: 'PO-2026-' + Math.floor(Math.random() * 900 + 100),
                  fornecedor: '',
                  fazendaOrigem: '',
                  municipio: '',
                  estado: '',
                  categoriaAnimal: '' as any,
                  quantidade: '' as any,
                  pesoMedio: '' as any,
                  valorArroba: '' as any,
                  comissao: '' as any,
                  frete: '' as any,
                  ordemCompraClienteId: '',
                  prazoPagamento: '',
                  formaPagamento: '',
                  observacoes: '',
                  dataEmissao: new Date().toISOString().split('T')[0],
                  dataEntrega: new Date().toISOString().split('T')[0],
                  status: 'Aberta',
                  pais: '',
                  corretor: '',
                  motorista: '',
                  veiculo: '',
                  placa: '',
                  destinoFrigorifico: '',
                  destinoCidade: '',
                  destinoEstado: '',
                  destinoPais: '',
                  destinoCodigo: '',
                  destinoFazenda: '',
                  codigoOrdemCompraCliente: ''
                });
                setShowAddCompraModal(true);
              }}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Negociação</span>
            </button>
          </div>

          {/* TABLE GRID */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)]">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">ID Op.</th>
                  <th className="p-3">Fornecedor</th>
                  <th className="p-3">Origem</th>
                  <th className="p-3">Pais</th>
                  <th className="p-3">UP</th>
                  <th className="p-3">Cidade</th>
                  <th className="p-3 text-center">ID OC</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3 text-right">Qtd</th>
                  <th className="p-3 text-right">Peso Méd.</th>
                  <th className="p-3 text-right">Valor @</th>
                  <th className="p-3 text-right">Comiss. (%)</th>
                  <th className="p-3 text-right">Vlr Frete</th>
                  <th className="p-3 text-right">Valor Líquido</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredCompras.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-gray-800">{c.numeroOperacao}</td>
                    <td className="p-3 font-semibold text-gray-800">{c.fornecedor}</td>
                    <td className="p-3 text-xs text-gray-500">{c.fazendaOrigem}</td>
                    <td className="p-3 text-gray-500">Brasil</td>
                    <td className="p-3 font-mono text-gray-500">{c.estado}</td>
                    <td className="p-3 text-gray-500">{c.municipio}</td>
                    <td className="p-3 text-center">
                      {c.ordemCompraClienteId ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#071757]/10 text-[#071757] font-mono border border-[#071757]/20" title={ordensCompraCliente.find(o => o.id === c.ordemCompraClienteId)?.cliente}>
                          {ordensCompraCliente.find(o => o.id === c.ordemCompraClienteId)?.numeroOC || 'Conectada'}
                        </span>
                      ) : c.codigoOrdemCompraCliente ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 font-mono border border-amber-200" title="Inserido manualmente">
                          {c.codigoOrdemCompraCliente}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Disponível / Recria</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF6E3] text-[#8A6D2E] border border-[#D8B46A]/30">
                        {c.categoriaAnimal}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">{c.quantidade}</td>
                    <td className="p-3 text-right text-gray-500 font-mono">{c.pesoMedio} kg</td>
                    <td className="p-3 text-right text-[#D8B46A] font-mono font-semibold">
                      {c.valorArroba.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-right font-mono text-gray-500">{c.comissao}%</td>
                    <td className="p-3 text-right font-mono text-gray-500">
                      {c.frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-gray-900 bg-[#FDF6E3]/20">
                      {c.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center flex items-center justify-center space-x-1.5">
                      <button
                        id={`edit-compra-${c.id}`}
                        onClick={() => {
                          setCompraForm({
                            numeroOperacao: c.numeroOperacao,
                            codigoFornecedor: c.codigoFornecedor || '',
                            codigoOrdemCompraCliente: c.codigoOrdemCompraCliente || '',
                            fornecedor: c.fornecedor,
                            fazendaOrigem: c.fazendaOrigem,
                            municipio: c.municipio,
                            estado: c.estado,
                            categoriaAnimal: c.categoriaAnimal,
                            quantidade: c.quantidade as any,
                            pesoMedio: c.pesoMedio as any,
                            valorArroba: c.valorArroba as any,
                            comissao: c.comissao as any,
                            frete: c.frete as any,
                            ordemCompraClienteId: c.ordemCompraClienteId || '',
                            prazoPagamento: c.prazoPagamento || '',
                            formaPagamento: c.formaPagamento || '',
                            observacoes: c.observacoes || '',
                            dataEmissao: c.dataCriacao,
                            dataEntrega: c.dataEntrega || c.dataCriacao,
                            status: c.status || 'Aberta',
                            pais: c.pais || '',
                            corretor: c.corretor || '',
                            motorista: c.motorista || '',
                            veiculo: c.veiculo || '',
                            placa: c.placa || '',
                            destinoFrigorifico: c.destinoFrigorifico || '',
                            destinoCidade: c.destinoCidade || '',
                            destinoEstado: c.destinoEstado || '',
                            destinoPais: c.destinoPais || '',
                            destinoCodigo: c.destinoCodigo || '',
                            destinoFazenda: c.destinoFazenda || ''
                          });
                          setIsEditCompraMode(true);
                          setEditCompraId(c.id);
                          setShowAddCompraModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-all cursor-pointer"
                        title="Editar Registro"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        id={`del-compra-${c.id}`}
                        onClick={() => onDeleteCompra(c.id)}
                        className="p-1 text-gray-400 hover:text-rose-500 rounded transition-all cursor-pointer"
                        title="Deletar Registro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                 {filteredCompras.length === 0 && (
                  <tr>
                    <td colSpan={15} className="p-6 text-center text-gray-400 italic">
                      Nenhuma compra encontrada no banco de dados ativo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- GESTÃO DE VENDAS (ORDENS DE COMPRA CLIENTE) -------------------- */}
      {activeSubMenu === 'vendas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-white/80 backdrop-blur-lg border border-white/20 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Ordem de Compra (Demandas)</h3>
              <p className="text-xs text-gray-400 font-medium">Controle de pedidos de compras enviados para clientes</p>
            </div>
            <button
              id="btn-add-venda"
              onClick={() => {
                setVendaForm({
                  numeroOC: 'OC-2026-' + Math.floor(Math.random() * 900 + 100),
                  codigoCliente: '',
                  cliente: '',
                  frigorifico: '',
                  categoriaAnimal: '' as any,
                  quantidade: '' as any,
                  peso: '' as any,
                  valorArroba: '' as any,
                  comissao: '' as any,
                  status: 'Pendente',
                  dataEmissao: new Date().toISOString().split('T')[0],
                  codigoOrdemCompraCliente: ''
                });
                setShowAddVendaModal(true);
              }}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Ordem de Compra</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-auto shadow-xs max-h-[calc(100vh-360px)]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono sticky top-0 z-10">
                  <th className="p-3 pl-4">ID OC</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Destino</th>
                  <th className="p-3">País</th>
                  <th className="p-3">UF</th>
                  <th className="p-3">Cidade</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3 text-right">Quantidade</th>
                  <th className="p-3 text-right">Peso</th>
                  <th className="p-3 text-right">Preço</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredVendas.map((v) => {
                  const cliInfo = clientes.find(c => c.nomeFantasia === v.cliente);
                  const pais = cliInfo ? (cliInfo.pais || 'Brasil') : 'Brasil';
                  const uf = cliInfo ? cliInfo.uf : (v.frigorifico.includes('(') ? v.frigorifico.split('(')[1].replace(')', '') : (v.frigorifico.includes('-') ? v.frigorifico.split('-')[1].trim() : 'MT'));
                  const cidade = cliInfo ? cliInfo.cidade : (v.frigorifico.includes('(') ? v.frigorifico.split('(')[0].trim() : (v.frigorifico.includes('-') ? v.frigorifico.split('-')[0].trim() : v.frigorifico.replace('Planta ', '').replace('Unidade ', '').trim()));
                  
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 pl-4 font-mono font-bold text-gray-800">{v.numeroOC}</td>
                      <td className="p-3 font-semibold text-gray-800">{v.cliente}</td>
                      <td className="p-3 text-gray-500">{v.frigorifico}</td>
                      <td className="p-3 text-gray-500">{pais}</td>
                      <td className="p-3 font-mono text-gray-500">{uf}</td>
                      <td className="p-3 text-gray-500">{cidade}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF6E3] text-[#8A6D2E] border border-[#D8B46A]/30">
                          {v.categoriaAnimal || 'Boi Gordo'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">{v.quantidade}</td>
                      <td className="p-3 text-right font-mono">
                        <div>{v.peso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} kg</div>
                        <div className="text-[10px] text-gray-400">{(v.peso / 30).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} @</div>
                      </td>
                      <td className="p-3 text-right text-[#D8B46A] font-mono font-semibold">
                        {v.valorArroba.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-green-700">
                        {v.resultadoOperacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          v.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                          v.status === 'Faturada' ? 'bg-slate-100 text-[#071757] border border-[#DEE1E9]' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          id={`del-venda-${v.id}`}
                          onClick={() => onDeleteOrdemCompraCliente(v.id)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded transition-all cursor-pointer"
                          title="Deletar Ordem de Compra"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                 {filteredVendas.length === 0 && (
                  <tr>
                    <td colSpan={13} className="p-6 text-center text-gray-400 italic">
                      Nenhuma ordem de compra cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- CRM KANBAN -------------------- */}
      {activeSubMenu === 'negociacoes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-white/80 backdrop-blur-lg border border-white/20 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Funil de Negociação & Captação</h3>
              <p className="text-xs text-gray-400 font-medium">Pipeline visual do CRM Pecuário. Avance cartões para fechamento de contratos</p>
            </div>
          </div>

          {/* KANBAN BOARD WRAPPER */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((col) => {
              const cardsInCol = negociacoes.filter((n) => n.fase === col.key);
              return (
                <div key={col.key} className="bg-slate-50 rounded-xl p-3 border border-gray-200 min-w-[220px] flex flex-col h-[520px]">
                  <div className={`p-2 rounded-lg mb-3 border ${col.bg} flex justify-between items-center`}>
                    <span className={`text-[11px] font-bold ${col.text} uppercase`}>{col.label}</span>
                    <span className="text-xs font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-700">
                      {cardsInCol.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {cardsInCol.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all hover:border-gray-350 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="text-[10px] font-mono text-gray-400">ID: {card.id.toUpperCase()}</span>
                            <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded font-mono font-semibold">
                              {card.cabecas} cab
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-800 leading-tight mb-1">{card.titulo}</h4>
                          <p className="text-[10px] text-gray-500">{card.clienteFornecedor}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-1 flex items-center space-x-1">
                            <MapPin className="h-3 w-3 inline text-[#D8B46A]" />
                            <span>{card.fazenda}</span>
                          </p>
                          {(card.ordemCompraClienteId || card.processoId) && (
                            <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                              {card.ordemCompraClienteId && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#071757]/10 text-[#071757] border border-[#071757]/20 uppercase">
                                  OC: {ordensCompraCliente.find(o => o.id === card.ordemCompraClienteId)?.numeroOC || 'Conectada'}
                                </span>
                              )}
                              {card.processoId && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D8B46A]/10 text-[#7C6329] border border-[#D8B46A]/30 font-mono">
                                  Proc: {card.processoId}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-[#D8B46A]">
                            {card.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                          </span>
                          
                          {/* Flow movement simulator */}
                          <div className="flex space-x-1">
                            {col.key !== 'aprovado' && col.key !== 'cancelado' && (
                              <button
                                id={`move-next-${card.id}`}
                                onClick={() => {
                                  const nextStages: Record<string, Negociacao['fase']> = {
                                    prospeccao: 'negociacao',
                                    negociacao: 'documentacao',
                                    documentacao: 'aprovado'
                                  };
                                  onUpdateNegociacaoStage(card.id, nextStages[col.key]);
                                }}
                                className="p-1 bg-[#FDF6E3] hover:bg-[#D8B46A]/20 text-[#8A6D2E] rounded-sm font-bold text-[9px] cursor-pointer"
                                title="Avançar Fila"
                              >
                                {col.key === 'documentacao' ? 'Homologar' : 'Avançar'}
                              </button>
                            )}
                            {col.key !== 'cancelado' && col.key !== 'aprovado' && (
                              <button
                                id={`move-cancel-${card.id}`}
                                onClick={() => onUpdateNegociacaoStage(card.id, 'cancelado')}
                                className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-sm font-bold text-[9px] cursor-pointer"
                                title="Declinar Proposta"
                              >
                                X
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {cardsInCol.length === 0 && (
                      <p className="text-[11px] text-gray-400 italic text-center py-8">Nenhum gado nesta fase.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* ==================== COMPRA MODAL ==================== */}
      {showAddCompraModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-start justify-center pt-20 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 animate-in fade-in zoom-in-95 max-h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <h3 className="text-sm font-bold text-gray-800">
                {isEditCompraMode ? 'Editar Compra de Bovinos (Entrada)' : 'Lançar Compra de Bovinos (Entrada)'}
              </h3>
              <button id="close-compra-modal" onClick={() => setShowAddCompraModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddCompraSubmit} className="mt-4 space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin">
              {/* Seção 1: Dados da Ordem */}
              <div className="border-b border-gray-200 pb-1.5">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">1. Dados da Ordem</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">ID Op.</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={compraForm.numeroOperacao}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-gray-50 font-mono text-gray-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">ID OC</label>
                  <select
                    value={compraForm.ordemCompraClienteId}
                    onChange={(e) => setCompraForm({ ...compraForm, ordemCompraClienteId: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-gray-855 font-bold bg-[#D8B46A]/5"
                  >
                    <option value="">-- Sem vínculo --</option>
                    {reconciledVendas.filter(o => o.status !== 'Entregue').map(oc => (
                      <option key={oc.id} value={oc.id}>
                        {oc.numeroOC}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Data da Compra</label>
                  <input
                    type="text"
                    required
                    placeholder="DD/MM/AAAA"
                    value={convertIsoToBrDate(compraForm.dataEmissao)}
                    onChange={(e) => {
                      const formatted = formatData(e.target.value);
                      const iso = convertBrToIsoDate(formatted);
                      setCompraForm({ ...compraForm, dataEmissao: iso, dataEntrega: iso });
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Status</label>
                  <div className="w-full mt-1 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-lg text-xs font-bold text-emerald-700 flex items-center h-[34px]">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    {compraForm.status}
                  </div>
                </div>
              </div>

              {/* Seção 2: Origem / Destino */}
              <div className="border-b border-gray-200 pb-1.5 pt-2">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider font-mono">2. Origem / Destino</span>
              </div>
              
              {/* ORIGEM SUBSECTION */}
              <div className="mt-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">A. Procedência (Origem)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cód. Fornecedor</label>
                  <input
                    type="text"
                    required
                    value={compraForm.codigoFornecedor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm(prev => {
                        const cleanVal = val.trim();
                        if (!cleanVal) {
                          return {
                            ...prev,
                            codigoFornecedor: '',
                            fornecedor: '',
                            fazendaOrigem: '',
                            estado: '',
                            pais: 'Brasil',
                            municipio: ''
                          };
                        }
                        const foundDb = fornecedores.find(f => 
                          (f.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (f.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (foundDb) {
                          return {
                            ...prev,
                            codigoFornecedor: val,
                            fornecedor: foundDb.nomeFantasia || foundDb.nome || '',
                            fazendaOrigem: foundDb.fazenda || '',
                            estado: foundDb.uf || '',
                            pais: 'Brasil',
                            municipio: foundDb.cidade || ''
                          };
                        }
                        const found = CADASTRO_FORNECEDORES.find(f => 
                          (f.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (f.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (found) {
                          return {
                            ...prev,
                            codigoFornecedor: val,
                            fornecedor: found.nome || '',
                            fazendaOrigem: found.fazenda || '',
                            estado: found.estado || '',
                            pais: 'Brasil',
                            municipio: getSupplierCity(found.nome) || ''
                          };
                        }
                        return {
                          ...prev,
                          codigoFornecedor: val
                        };
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Ex: F-2706260004"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Fornecedor</label>
                  <input
                    type="text"
                    required
                    value={compraForm.fornecedor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm(prev => ({ ...prev, fornecedor: val }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Nome do produtor rural"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Origem (Fazenda)</label>
                  <input
                    type="text"
                    required
                    value={compraForm.fazendaOrigem}
                    onChange={(e) => setCompraForm({ ...compraForm, fazendaOrigem: e.target.value })}
                    placeholder="Nome da propriedade"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">País (Origem)</label>
                  <input
                    type="text"
                    value={compraForm.pais}
                    onChange={(e) => setCompraForm({ ...compraForm, pais: e.target.value })}
                    placeholder="Brasil"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Estado (Origem - UF)</label>
                  <select
                    value={compraForm.estado}
                    onChange={(e) => setCompraForm({ ...compraForm, estado: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  >
                    <option value="">-- UF --</option>
                    <option value="MT">MT</option>
                    <option value="GO">GO</option>
                    <option value="MS">MS</option>
                    <option value="PA">PA</option>
                    <option value="MG">MG</option>
                    <option value="SP">SP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cidade (Origem)</label>
                  <input
                    type="text"
                    value={compraForm.municipio}
                    onChange={(e) => setCompraForm({ ...compraForm, municipio: e.target.value })}
                    placeholder="Cidade de origem"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* DESTINO SUBSECTION */}
              <div className="mt-2 border-t border-gray-100 pt-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">B. Destinação (Destino)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cód. Destino</label>
                  <input
                    type="text"
                    required
                    value={compraForm.destinoCodigo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm(prev => {
                        const cleanVal = val.trim();
                        if (!cleanVal) {
                          return {
                            ...prev,
                            destinoCodigo: '',
                            destinoFrigorifico: '',
                            destinoFazenda: '',
                            destinoEstado: '',
                            destinoPais: 'Brasil',
                            destinoCidade: ''
                          };
                        }
                        const foundDb = clientes.find(c => 
                          (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (foundDb) {
                          return {
                            ...prev,
                            destinoCodigo: val,
                            destinoFrigorifico: foundDb.nomeFantasia || foundDb.nome || '',
                            destinoFazenda: foundDb.fazenda || '',
                            destinoEstado: foundDb.uf || '',
                            destinoPais: 'Brasil',
                            destinoCidade: foundDb.cidade || ''
                          };
                        }
                        const foundMock = CADASTRO_CLIENTES.find(c => 
                          (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (foundMock) {
                          return {
                            ...prev,
                            destinoCodigo: val,
                            destinoFrigorifico: foundMock.nome || '',
                            destinoFazenda: '',
                            destinoEstado: foundMock.estado || '',
                            destinoPais: 'Brasil',
                            destinoCidade: getClientCity(foundMock.nome) || ''
                          };
                        }
                        return {
                          ...prev,
                          destinoCodigo: val
                        };
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Ex: C-2706260005"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Destino (Frigorífico / Unidade)</label>
                  <input
                    type="text"
                    required
                    value={compraForm.destinoFrigorifico}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm(prev => ({ ...prev, destinoFrigorifico: val }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Nome da unidade compradora"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Unidade / Fazenda Destino</label>
                  <input
                    type="text"
                    required
                    value={compraForm.destinoFazenda}
                    onChange={(e) => setCompraForm({ ...compraForm, destinoFazenda: e.target.value })}
                    placeholder="Nome do destino / filial"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">País (Destino)</label>
                  <input
                    type="text"
                    value={compraForm.destinoPais}
                    onChange={(e) => setCompraForm({ ...compraForm, destinoPais: e.target.value })}
                    placeholder="Brasil"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Estado (Destino - UF)</label>
                  <select
                    value={compraForm.destinoEstado}
                    onChange={(e) => setCompraForm({ ...compraForm, destinoEstado: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  >
                    <option value="">-- UF --</option>
                    <option value="MT">MT</option>
                    <option value="GO">GO</option>
                    <option value="MS">MS</option>
                    <option value="PA">PA</option>
                    <option value="MG">MG</option>
                    <option value="SP">SP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cidade (Destino)</label>
                  <input
                    type="text"
                    value={compraForm.destinoCidade}
                    onChange={(e) => setCompraForm({ ...compraForm, destinoCidade: e.target.value })}
                    placeholder="Cidade de destino"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Seção 3: Detalhes da Compra */}
              <div className="border-b border-gray-200 pb-1.5 pt-2">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">3. Detalhes da Compra</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Categoria</label>
                  <select
                    value={compraForm.categoriaAnimal}
                    onChange={(e) => setCompraForm({ ...compraForm, categoriaAnimal: e.target.value as any })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                    required
                  >
                    <option value="">-- Selecione --</option>
                    {categorias.map((cat) => (
                      <option key={cat.code} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Quantidade</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={compraForm.quantidade}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm({ ...compraForm, quantidade: val === '' ? '' : Number(val) });
                    }}
                    onBlur={() => {
                      if (compraForm.quantidade === '') {
                        setCompraForm({ ...compraForm, quantidade: 0 });
                      }
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Peso Médio (kg)</label>
                  <input
                    type="number"
                    required
                    value={compraForm.pesoMedio}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm({ ...compraForm, pesoMedio: val === '' ? '' : Number(val) });
                    }}
                    onBlur={() => {
                      if (compraForm.pesoMedio === '') {
                        setCompraForm({ ...compraForm, pesoMedio: 0 });
                      }
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Valor Arroba (BRL)</label>
                  <input
                    type="number"
                    required
                    value={compraForm.valorArroba}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm({ ...compraForm, valorArroba: val === '' ? '' : Number(val) });
                    }}
                    onBlur={() => {
                      if (compraForm.valorArroba === '') {
                        setCompraForm({ ...compraForm, valorArroba: 0 });
                      }
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Seção 4: Custos e Comissões */}
              <div className="border-b border-gray-200 pb-1.5 pt-2">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">4. Custos e Comissões</span>
              </div>
              
              {/* Row 1: Comissão */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Corretor / Parceiro</label>
                  <input
                    type="text"
                    list="parceiros-list"
                    value={compraForm.corretor}
                    onChange={(e) => setCompraForm({ ...compraForm, corretor: e.target.value })}
                    placeholder="Nome do parceiro/corretor"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Comissão (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={compraForm.comissao}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm({ ...compraForm, comissao: val === '' ? '' : Number(val) });
                    }}
                    onBlur={() => {
                      if (compraForm.comissao === '') {
                        setCompraForm({ ...compraForm, comissao: 0 });
                      }
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Valor Comissão (R$)</label>
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={`R$ ${liveComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-200 bg-gray-50 rounded-lg text-xs text-gray-500 font-medium"
                  />
                </div>
                <div className="hidden md:block"></div>
              </div>

              {/* Row 2: Frete */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                {Number(compraForm.quantidade) > 50 ? (
                  <div className="col-span-1 md:col-span-4 bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start justify-between space-x-3 text-amber-900 shadow-sm">
                    <div className="flex items-start space-x-2.5">
                      <span className="text-base mt-0.5">⚠️</span>
                      <div className="text-[11px]">
                        <strong className="font-bold text-amber-950 block mb-0.5">Operação acima de 50 cabeças detectada ({compraForm.quantidade} animais)</strong>
                        O preenchimento direto de transporte está bloqueado por motivos de compliance e segurança operacional. 
                        Por favor, acesse o módulo de <strong>Logística</strong> para cadastrar, programar e detalhar cada viagem, motorista, veículo e as condições específicas deste lote.
                      </div>
                    </div>
                    {onGoToLogistica && (
                      <button
                        type="button"
                        onClick={onGoToLogistica}
                        className="flex-shrink-0 flex items-center space-x-1.5 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span>🚛</span>
                        <span>Ir para Logística</span>
                      </button>
                    )}
                  </div>
                ) : null}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Motorista</label>
                  <input
                    type="text"
                    list="motoristas-list"
                    value={Number(compraForm.quantidade) > 50 ? '' : compraForm.motorista}
                    disabled={Number(compraForm.quantidade) > 50}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm(prev => {
                        const updated = { ...prev, motorista: val };
                        const found = CADASTRO_MOTORISTAS.find(m => m.nome === val);
                        if (found) {
                          updated.placa = found.placa;
                          if (found.nome === 'Valdecir Rodrigues Alves') {
                            updated.veiculo = 'Bitrem Scania R440';
                          } else if (found.nome === 'Ailton Senna de Souza') {
                            updated.veiculo = 'Carreta Simples Volvo FH540';
                          } else if (found.nome === 'Roberto Carlos Santos') {
                            updated.veiculo = 'Bi-trem Mercedes Actros';
                          }
                        }
                        return updated;
                      });
                    }}
                    placeholder={Number(compraForm.quantidade) > 50 ? "Detalhamento via Logística" : "Nome do motorista"}
                    className={`w-full mt-1 px-3 py-1.5 border rounded-lg text-xs ${
                      Number(compraForm.quantidade) > 50 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Caminhão / Veículo</label>
                  <input
                    type="text"
                    value={Number(compraForm.quantidade) > 50 ? '' : compraForm.veiculo}
                    disabled={Number(compraForm.quantidade) > 50}
                    onChange={(e) => setCompraForm({ ...compraForm, veiculo: e.target.value })}
                    placeholder={Number(compraForm.quantidade) > 50 ? "Bloqueado" : "Ex: Bitrem Scania"}
                    className={`w-full mt-1 px-3 py-1.5 border rounded-lg text-xs ${
                      Number(compraForm.quantidade) > 50 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Placa</label>
                  <input
                    type="text"
                    value={Number(compraForm.quantidade) > 50 ? '' : compraForm.placa}
                    disabled={Number(compraForm.quantidade) > 50}
                    onChange={(e) => setCompraForm({ ...compraForm, placa: e.target.value })}
                    placeholder={Number(compraForm.quantidade) > 50 ? "Bloqueado" : "Placa do veículo"}
                    className={`w-full mt-1 px-3 py-1.5 border rounded-lg text-xs ${
                      Number(compraForm.quantidade) > 50 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Valor do Frete (R$)</label>
                  <input
                    type="number"
                    value={Number(compraForm.quantidade) > 50 ? 0 : compraForm.frete}
                    disabled={Number(compraForm.quantidade) > 50}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompraForm({ ...compraForm, frete: val === '' ? '' : Number(val) });
                    }}
                    onBlur={() => {
                      if (compraForm.frete === '') {
                        setCompraForm({ ...compraForm, frete: 0 });
                      }
                    }}
                    className={`w-full mt-1 px-3 py-1.5 border rounded-lg text-xs ${
                      Number(compraForm.quantidade) > 50 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed font-mono' 
                        : 'border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>

              {/* Dynamic Value Banner */}
              <div className="bg-[#D0EBFC] text-blue-900 px-4 py-3 rounded-xl flex justify-between items-center font-sans border border-blue-200/50 shadow-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-blue-800">Resultado Estimado da Operação</span>
                  <p className="text-[10.5px] text-blue-700 mt-1 font-medium">
                    Peso Total: <strong className="text-blue-900">{livePesoTotal.toLocaleString('pt-BR')} kg</strong> ({liveArrobas.toFixed(1)} @) | Gado: <strong className="text-blue-900">R$ {Math.round(liveValorGado).toLocaleString('pt-BR')}</strong> | Comissão: <strong className="text-blue-900">R$ {Math.round(liveComissao).toLocaleString('pt-BR')}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-blue-800 block tracking-wider">Valor Total Estimado</span>
                  <p className="text-lg font-black font-mono text-blue-950 mt-0.5">
                    R$ {liveTotalEstimado.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Seção 5: Condições e Observações */}
              <div className="border-b border-gray-200 pb-1.5 pt-2">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">5. Condições e Observações</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Prazo de Pagamento</label>
                  <select
                    value={compraForm.prazoPagamento}
                    onChange={(e) => setCompraForm({ ...compraForm, prazoPagamento: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                    required
                  >
                    <option value="">-- Selecione o Prazo --</option>
                    <option value="À Vista">À Vista</option>
                    <option value="30 dias">30 dias</option>
                    <option value="60 dias">60 dias</option>
                    <option value="90 dias">90 dias</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Forma de Pagamento</label>
                  <select
                    value={compraForm.formaPagamento}
                    onChange={(e) => setCompraForm({ ...compraForm, formaPagamento: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                    required
                  >
                    <option value="">-- Selecione a Forma --</option>
                    <option value="Transferência Bancária">Transferência Bancária</option>
                    <option value="PIX">PIX</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Depósito">Depósito</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Observações Gerais</label>
                <textarea
                  value={compraForm.observacoes}
                  onChange={(e) => setCompraForm({ ...compraForm, observacoes: e.target.value })}
                  placeholder="Instruções logísticas, observações sanitárias, restrições ou termos contratuais adicionais..."
                  rows={2}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 resize-none animate-in fade-in"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  type="button"
                  id="cancel-compra"
                  onClick={() => setShowAddCompraModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-compra"
                  className="px-4 py-2 bg-[#071757] hover:bg-[#182763] rounded-lg text-xs text-white font-bold cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== REGISTRAR ORDEM DE COMPRA CLIENTE (DEMANDA) ==================== */}
      {showAddVendaModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-start justify-center pt-20 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 animate-in fade-in zoom-in-95 max-h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <h3 className="text-sm font-bold text-gray-800">Receber Ordem de Compra (Demanda)</h3>
              <button onClick={() => setShowAddVendaModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddVendaSubmit} className="mt-4 space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin">
              {/* Seção 1: Dados do Sistema */}
              <div className="border-b border-gray-200 pb-1.5">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">1. Dados do Sistema</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">ID OC</label>
                  <input
                    type="text"
                    required
                    readOnly
                    disabled
                    value={vendaForm.numeroOC}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Data de Emissão</label>
                  <input
                    type="text"
                    required
                    placeholder="DD/MM/AAAA"
                    value={convertIsoToBrDate(vendaForm.dataEmissao)}
                    onChange={(e) => {
                      const formatted = formatData(e.target.value);
                      const iso = convertBrToIsoDate(formatted);
                      setVendaForm({ ...vendaForm, dataEmissao: iso });
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Status</label>
                  <div className="w-full mt-1 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-lg text-xs font-bold text-amber-700 flex items-center h-[34px]" title="Conciliação automática baseada em entregas físicas">
                    <span className="h-2 w-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                    Pendente (Automático)
                  </div>
                </div>
                <div></div> {/* Espaço vazio para manter grid de 4 colunas */}
              </div>

              {/* Seção 2: Identificação do Cliente */}
              <div className="border-b border-gray-200 pb-1.5 pt-2">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">2. Identificação do Cliente</span>
              </div>

              {/* Row 1: Cód. Cliente, Ordem de Compra do Cliente (4 colunas) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cód. Cliente</label>
                  <input
                    type="text"
                    required
                    value={vendaForm.codigoCliente}
                    onChange={(e) => setVendaForm({ ...vendaForm, codigoCliente: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        triggerClienteCodigoLookup(vendaForm.codigoCliente);
                      }
                    }}
                    onBlur={() => triggerClienteCodigoLookup(vendaForm.codigoCliente)}
                    placeholder="Ex: C-2706260004"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Ordem de Compra do Cliente</label>
                  <input
                    type="text"
                    value={vendaForm.codigoOrdemCompraCliente}
                    onChange={(e) => setVendaForm({ ...vendaForm, codigoOrdemCompraCliente: e.target.value })}
                    placeholder="Opcional (preenchimento manual)"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800"
                  />
                </div>
                <div></div>
                <div></div>
              </div>

              {/* Row 2: Cliente, Destino, Categoria (3 colunas) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cliente</label>
                  <input
                    type="text"
                    required
                    value={vendaForm.cliente}
                    onChange={(e) => setVendaForm({ ...vendaForm, cliente: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        triggerClienteNameLookup(vendaForm.cliente);
                      }
                    }}
                    onBlur={() => triggerClienteNameLookup(vendaForm.cliente)}
                    placeholder="Nome do cliente"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Destino (Frigorífico / Unidade)</label>
                  <input
                    type="text"
                    required
                    list="destino-list"
                    value={vendaForm.frigorifico}
                    onChange={(e) => setVendaForm({ ...vendaForm, frigorifico: e.target.value })}
                    placeholder="Selecione o destino"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Categoria</label>
                  <select
                    value={vendaForm.categoriaAnimal}
                    onChange={(e) => setVendaForm({ ...vendaForm, categoriaAnimal: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 bg-white"
                    required
                  >
                    <option value="">-- Selecione --</option>
                    {categorias.map((cat) => (
                      <option key={cat.code} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Endereço do Destino (3 colunas) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  const selectedUnit = clientes.find(c => c.nomeFantasia === vendaForm.frigorifico);
                  const foundMock = CADASTRO_CLIENTES.find(c => c.nome === vendaForm.frigorifico);
                  const modalPais = selectedUnit ? (selectedUnit.pais || 'Brasil') : 'Brasil';
                  const modalUf = selectedUnit ? selectedUnit.uf : (foundMock ? foundMock.estado : '');
                  const modalCidade = selectedUnit ? selectedUnit.cidade : (foundMock ? getClientCity(foundMock.nome) : '');
                  
                  return (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">País (Destino)</label>
                        <input
                          type="text"
                          readOnly
                          value={modalPais}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">UF (Destino)</label>
                        <input
                          type="text"
                          readOnly
                          value={modalUf}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Cidade (Destino)</label>
                        <input
                          type="text"
                          readOnly
                          value={modalCidade}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                        />
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Seção 3: Detalhamento da Ordem de Compra */}
              {(() => {
                const liveVendaPesoTotal = Number(vendaForm.peso) || 0;
                const liveVendaPesoMedio = (liveVendaPesoTotal && Number(vendaForm.quantidade)) ? (liveVendaPesoTotal / Number(vendaForm.quantidade)) : 0;
                const liveVendaArrobas = liveVendaPesoTotal / 30;
                const liveVendaValorBruto = liveVendaArrobas * (Number(vendaForm.valorArroba) || 0);
                const liveVendaComissao = liveVendaValorBruto * ((Number(vendaForm.comissao) || 0) / 100);
                const liveVendaResultadoLiquido = Math.round(liveVendaValorBruto - liveVendaComissao);
                
                return (
                  <>
                    <div className="border-b border-gray-200 pb-1.5 pt-2">
                      <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">3. Detalhamento da Ordem de Compra</span>
                    </div>

                    {/* Grid Unificado de 4 colunas (sendo 2 linhas de 4 colunas cada) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Linha 1: Editáveis */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Peso Total (kg)</label>
                        <input
                          type="text"
                          required
                          value={formatWeightBR(vendaForm.peso)}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const parsed = parseWeightBR(e.target.value);
                            setVendaForm({ ...vendaForm, peso: parsed });
                          }}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Quantidade (Cabeças)</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={vendaForm.quantidade}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setVendaForm({ ...vendaForm, quantidade: e.target.value === '' ? '' : Number(e.target.value) })}
                          onBlur={() => {
                            if (vendaForm.quantidade === '') setVendaForm({ ...vendaForm, quantidade: 0 });
                          }}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Preço Unitário (por @)</label>
                        <input
                          type="number"
                          required
                          value={vendaForm.valorArroba}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setVendaForm({ ...vendaForm, valorArroba: e.target.value === '' ? '' : Number(e.target.value) })}
                          onBlur={() => {
                            if (vendaForm.valorArroba === '') setVendaForm({ ...vendaForm, valorArroba: 0 });
                          }}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Descontos / Retenções (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={vendaForm.comissao}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setVendaForm({ ...vendaForm, comissao: e.target.value === '' ? '' : Number(e.target.value) })}
                          onBlur={() => {
                            if (vendaForm.comissao === '') setVendaForm({ ...vendaForm, comissao: 0 });
                          }}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                        />
                      </div>

                      {/* Linha 2: Calculados */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Peso Médio (kg)</label>
                        <div className="w-full mt-1 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-lg text-xs font-mono font-bold text-slate-800 flex items-center h-[34px]" title="Calculado automaticamente: Peso Total / Quantidade">
                          {liveVendaPesoMedio ? `${liveVendaPesoMedio.toFixed(2)} kg` : '-'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Total Arrobas (@)</label>
                        <div className="w-full mt-1 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-lg text-xs font-mono font-bold text-slate-800 flex items-center h-[34px]" title="Calculado automaticamente: Peso Total / 30">
                          {liveVendaArrobas ? `${liveVendaArrobas.toFixed(2)} @` : '-'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Valor Total (R$)</label>
                        <div className="w-full mt-1 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-lg text-xs font-mono font-bold text-slate-800 flex items-center h-[34px]" title="Calculado automaticamente: Total Arrobas x Preço Unitário">
                          {liveVendaValorBruto ? liveVendaValorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Resultado Líquido (R$)</label>
                        <div className="w-full mt-1 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-lg text-xs font-mono font-bold text-green-700 flex items-center h-[34px]" title="Valor Total menos descontos/comissões">
                          {liveVendaResultadoLiquido ? liveVendaResultadoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddVendaModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#071757] hover:bg-[#182763] rounded-lg text-xs text-white font-bold cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== NEGOCIAÇÃO MODAL ==================== */}
      {showAddNegModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <h3 className="text-sm font-bold text-gray-800">Planejar Negociação de Bovinos</h3>
              <button onClick={() => setShowAddNegModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddNegSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Título da Oportunidade</label>
                  <input
                    type="text"
                    required
                    value={negForm.titulo}
                    onChange={(e) => setNegForm({ ...negForm, titulo: e.target.value })}
                    placeholder="Ex: Lote Boi Nelore Pecuária Real"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Tipo de Compra</label>
                  <select
                    value={negForm.tipoCompra}
                    onChange={(e) => setNegForm({ ...negForm, tipoCompra: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-[#071757]"
                  >
                    <option value="Compra Direta">Compra Direta</option>
                    <option value="Compra Futura">Compra Futura</option>
                    <option value="Compra por Comissão">Compra por Comissão</option>
                    <option value="Parceria / Outro">Parceria / Outro</option>
                  </select>
                </div>
              </div>

              <div className="border-b border-gray-150 pt-1 pb-1">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">Procedência (Origem)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cód. Parceiro</label>
                  <input
                    type="text"
                    required
                    value={negForm.codigoClienteFornecedor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNegForm(prev => {
                        const cleanVal = val.trim();
                        if (!cleanVal) {
                          return {
                            ...prev,
                            codigoClienteFornecedor: '',
                            clienteFornecedor: '',
                            fazenda: '',
                            estado: '',
                            cidade: '',
                            contatoTelefone: '',
                            pais: 'Brasil'
                          };
                        }
                        const foundDb = [...clientes, ...fornecedores].find(x => 
                          (x.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (x.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (foundDb) {
                          return {
                            ...prev,
                            codigoClienteFornecedor: val,
                            clienteFornecedor: foundDb.nomeFantasia || foundDb.nome || '',
                            fazenda: foundDb.fazenda || '',
                            estado: foundDb.uf || foundDb.estado || '',
                            cidade: foundDb.cidade || '',
                            contatoTelefone: foundDb.telefone || '',
                            pais: 'Brasil'
                          };
                        }
                        const found = [...CADASTRO_CLIENTES, ...CADASTRO_FORNECEDORES].find(x => 
                          (x.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (x.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (found) {
                          return {
                            ...prev,
                            codigoClienteFornecedor: val,
                            clienteFornecedor: found.nome || '',
                            fazenda: 'fazenda' in found ? (found as any).fazenda : '',
                            estado: found.estado || '',
                            cidade: 'fazenda' in found ? getSupplierCity(found.nome) : getClientCity(found.nome),
                            contatoTelefone: 'telefone' in found ? (found as any).telefone : '',
                            pais: 'Brasil'
                          };
                        }
                        return {
                          ...prev,
                          codigoClienteFornecedor: val
                        };
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Ex: F-2706260005"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Parceiro Comercial</label>
                  <input
                    type="text"
                    required
                    value={negForm.clienteFornecedor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNegForm(prev => ({ ...prev, clienteFornecedor: val }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Nome"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Fazenda Origem</label>
                  <input
                    type="text"
                    required
                    value={negForm.fazenda}
                    onChange={(e) => setNegForm({ ...negForm, fazenda: e.target.value })}
                    placeholder="Nome Propriedade"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cabeças gado</label>
                  <input
                    type="number"
                    value={negForm.cabecas}
                    onChange={(e) => setNegForm({ ...negForm, cabecas: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={negForm.valorEstimado}
                    onChange={(e) => setNegForm({ ...negForm, valorEstimado: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Localização da Origem */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">País (Origem)</label>
                  <input
                    type="text"
                    value={negForm.pais}
                    onChange={(e) => setNegForm({ ...negForm, pais: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cidade (Origem)</label>
                  <input
                    type="text"
                    value={negForm.cidade}
                    onChange={(e) => setNegForm({ ...negForm, cidade: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Estado (Origem - UF)</label>
                  <select
                    value={negForm.estado}
                    onChange={(e) => setNegForm({ ...negForm, estado: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="">-- UF --</option>
                    <option value="MT">MT</option>
                    <option value="GO">GO</option>
                    <option value="MS">MS</option>
                    <option value="PA">PA</option>
                    <option value="MG">MG</option>
                    <option value="SP">SP</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>

              {/* DESTINAÇÃO SUBSECTION */}
              <div className="mt-2 border-t border-gray-150 pt-2">
                <span className="text-[10px] font-bold text-[#071757] uppercase tracking-wider">Destinação (Destino)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cód. Destino</label>
                  <input
                    type="text"
                    value={negForm.destinoCodigo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNegForm(prev => {
                        const cleanVal = val.trim();
                        if (!cleanVal) {
                          return {
                            ...prev,
                            destinoCodigo: '',
                            destinoFrigorifico: '',
                            destinoFazenda: '',
                            destinoEstado: '',
                            destinoCidade: '',
                            destinoPais: 'Brasil'
                          };
                        }
                        const foundDb = clientes.find(c => 
                          (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (foundDb) {
                          return {
                            ...prev,
                            destinoCodigo: val,
                            destinoFrigorifico: foundDb.nomeFantasia || foundDb.nome || '',
                            destinoFazenda: foundDb.fazenda || '',
                            destinoEstado: foundDb.uf || '',
                            destinoCidade: foundDb.cidade || '',
                            destinoPais: 'Brasil'
                          };
                        }
                        const foundMock = CADASTRO_CLIENTES.find(c => 
                          (c.codigo || '').trim().toLowerCase() === cleanVal.toLowerCase() || 
                          (c.id || '').trim().toLowerCase() === cleanVal.toLowerCase()
                        );
                        if (foundMock) {
                          return {
                            ...prev,
                            destinoCodigo: val,
                            destinoFrigorifico: foundMock.nome || '',
                            destinoFazenda: '',
                            destinoEstado: foundMock.estado || '',
                            destinoCidade: getClientCity(foundMock.nome) || '',
                            destinoPais: 'Brasil'
                          };
                        }
                        return {
                          ...prev,
                          destinoCodigo: val
                        };
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Ex: C-2706260005"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Destino (Unidade)</label>
                  <input
                    type="text"
                    value={negForm.destinoFrigorifico}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNegForm(prev => ({ ...prev, destinoFrigorifico: val }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Nome da unidade"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Fazenda Destino</label>
                  <input
                    type="text"
                    value={negForm.destinoFazenda}
                    onChange={(e) => setNegForm({ ...negForm, destinoFazenda: e.target.value })}
                    placeholder="Filial / Destino"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">País (Destino)</label>
                  <input
                    type="text"
                    value={negForm.destinoPais}
                    onChange={(e) => setNegForm({ ...negForm, destinoPais: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Cidade (Destino)</label>
                  <input
                    type="text"
                    value={negForm.destinoCidade}
                    onChange={(e) => setNegForm({ ...negForm, destinoCidade: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Estado (Destino - UF)</label>
                  <select
                    value={negForm.destinoEstado}
                    onChange={(e) => setNegForm({ ...negForm, destinoEstado: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="">-- UF --</option>
                    <option value="MT">MT</option>
                    <option value="GO">GO</option>
                    <option value="MS">MS</option>
                    <option value="PA">PA</option>
                    <option value="MG">MG</option>
                    <option value="SP">SP</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Telefone de Contato</label>
                <input
                  type="text"
                  value={negForm.contatoTelefone}
                  onChange={(e) => setNegForm({ ...negForm, contatoTelefone: e.target.value })}
                  placeholder="(00) 90000-0000"
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Atender à Ordem de Compra</label>
                  <select
                    value={negForm.ordemCompraClienteId}
                    onChange={(e) => setNegForm({ ...negForm, ordemCompraClienteId: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono"
                  >
                    <option value="">-- Não vincular (Avulsa) --</option>
                    {reconciledVendas.filter(o => o.status !== 'Entregue').map(oc => (
                      <option key={oc.id} value={oc.id}>
                        {oc.numeroOC}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Vincular Processo de Rastreamento</label>
                  <select
                    value={negForm.processoId}
                    onChange={(e) => setNegForm({ ...negForm, processoId: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono"
                  >
                    <option value="">-- Não vincular (Avulso) --</option>
                    {viagens?.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddNegModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#071757] hover:bg-[#182763] rounded-lg text-xs text-white font-bold cursor-pointer"
                >
                  Adicionar ao Funil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <datalist id="fornecedores-list">
        {fornecedores.map(f => (
          <option key={`live-for-${f.id}`} value={f.nomeFantasia || f.nome} />
        ))}
        {CADASTRO_FORNECEDORES.map(f => (
          <option key={`mock-for-${f.id}`} value={f.nome} />
        ))}
      </datalist>

      <datalist id="parceiros-list">
        {[...CADASTRO_CLIENTES, ...CADASTRO_FORNECEDORES, ...CADASTRO_PARCEIROS].map(p => (
          <option key={p.id} value={p.nome} />
        ))}
      </datalist>

      <datalist id="motoristas-list">
        {CADASTRO_MOTORISTAS.map(m => (
          <option key={m.id} value={m.nome} />
        ))}
      </datalist>

      <datalist id="destino-list">
        {clientes.map(c => (
          <option key={`live-cli-${c.id}`} value={c.nomeFantasia || c.nome} />
        ))}
        {CADASTRO_CLIENTES.map(c => (
          <option key={`mock-cli-${c.id}`} value={c.nome} />
        ))}
      </datalist>

      <datalist id="fornecedores-codigo-list">
        {fornecedores.map(f => (
          <option key={`live-for-cod-${f.id}`} value={f.codigo} />
        ))}
        {CADASTRO_FORNECEDORES.map(f => (
          <option key={`mock-for-cod-${f.id}`} value={f.codigo} />
        ))}
      </datalist>

      <datalist id="clientes-codigo-list">
        {clientes.map(c => (
          <option key={`live-cli-cod-${c.id}`} value={c.codigo} />
        ))}
        {CADASTRO_CLIENTES.map(c => (
          <option key={`mock-cli-cod-${c.id}`} value={c.codigo} />
        ))}
      </datalist>

      <datalist id="parceiros-codigo-list">
        {[...CADASTRO_CLIENTES, ...CADASTRO_FORNECEDORES, ...CADASTRO_PARCEIROS].map(p => (
          <option key={p.id} value={p.codigo} />
        ))}
      </datalist>

    </div>
  );
}
