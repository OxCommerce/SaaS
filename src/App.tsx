/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import CommercialView from './components/CommercialView';
import FiscalView from './components/FiscalView';
import FinancialView from './components/FinancialView';
import LogisticsView from './components/LogisticsView';
import CadastrosView from './components/CadastrosView';
import RelatoriosView from './components/RelatoriosView';
import SettingsView from './components/SettingsView';
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import neloreRebanho2 from '@/assets/nelore_rebanho_2.png';

import {
  ActiveMenu,
  SubMenuComercial,
  SubMenuFiscal,
  SubMenuFinanceiro,
  SubMenuLogistica,
  SubMenuConfiguracoes,
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
} from './types';

import {
  INITIAL_COMPRAS,
  INITIAL_ORDENS_COMPRA_CLIENTE,
  INITIAL_NEGOCIACOES,
  INITIAL_LOTES,
  INITIAL_GTAS,
  INITIAL_CTES,
  INITIAL_NFES,
  INITIAL_TRANSACÕES,
  INITIAL_CONCILIACOES,
  INITIAL_VIAGENS,
  INITIAL_DB_STATS,
  INITIAL_CONFIG,
  CHANNELS_AUDITORIA,
  CADASTRO_USUARIOS
} from './data/mockData';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sync URL Path -> React States
  useEffect(() => {
    const path = location.pathname;
    
    // Auth Check
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('ox_current_user') : null;
    const user = storedUser || currentUser;

    if (path.startsWith('/app')) {
      if (!user) {
        navigate('/login');
        return;
      }
      if (currentRoute !== 'app') {
        setCurrentRoute('app');
      }
      
      const parts = path.split('/').filter(Boolean); // ['app', 'comercial', 'ordens-compra']
      const menu = parts[1] as ActiveMenu;
      const submenu = parts[2];
      
      if (menu && menu !== activeMenu) {
        setActiveMenu(menu);
      }
      
      if (submenu) {
        if (menu === 'comercial' && submenu !== subMenuComercial) setSubMenuComercial(submenu as SubMenuComercial);
        if (menu === 'fiscal' && submenu !== subMenuFiscal) setSubMenuFiscal(submenu as SubMenuFiscal);
        if (menu === 'financeiro' && submenu !== subMenuFinanceiro) setSubMenuFinanceiro(submenu as SubMenuFinanceiro);
        if (menu === 'logistica' && submenu !== subMenuLogistica) setSubMenuLogistica(submenu as SubMenuLogistica);
        if (menu === 'configuracoes' && submenu !== subMenuConfiguracoes) setSubMenuConfiguracoes(submenu as SubMenuConfiguracoes);
      }
    } else if (path === '/login') {
      if (user) {
        navigate('/app/dashboard');
      } else {
        if (currentRoute !== 'login') setCurrentRoute('login');
      }
    } else if (path === '/' || path === '/home') {
      if (currentRoute !== 'home') setCurrentRoute('home');
    } else {
      // Catch-all redirect
      navigate('/');
    }
  }, [location.pathname]);
  // Global Active Navigation state
  // Global Active Navigation state
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_active_menu') as ActiveMenu : null) || 'dashboard';
  });
  
  // Categorized Submenu states
  const [subMenuComercial, setSubMenuComercial] = useState<SubMenuComercial>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_submenu_comercial') as SubMenuComercial : null) || 'ordens-compra';
  });
  const [subMenuFiscal, setSubMenuFiscal] = useState<SubMenuFiscal>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_submenu_fiscal') as SubMenuFiscal : null) || 'gta';
  });
  const [subMenuFinanceiro, setSubMenuFinanceiro] = useState<SubMenuFinanceiro>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_submenu_financeiro') as SubMenuFinanceiro : null) || 'receber';
  });
  const [subMenuLogistica, setSubMenuLogistica] = useState<SubMenuLogistica>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_submenu_logistica') as SubMenuLogistica : null) || 'transporte';
  });
  const [subMenuConfiguracoes, setSubMenuConfiguracoes] = useState<SubMenuConfiguracoes>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_submenu_configuracoes') as SubMenuConfiguracoes : null) || 'usuarios';
  });

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState('Diego Silveira');
  const [currentRoute, setCurrentRoute] = useState<'home' | 'login' | 'app'>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('ox_current_route') as any : null) || 'home';
  });

  // In-Memory Mutatable States
  const [compras, setCompras] = useState<Compra[]>(INITIAL_COMPRAS);
  const [ordensCompraCliente, setOrdensCompraCliente] = useState<OrdemCompraCliente[]>(INITIAL_ORDENS_COMPRA_CLIENTE);
  const [negociacoes, setNegociacoes] = useState<Negociacao[]>(INITIAL_NEGOCIACOES);
  const [lotes, setLotes] = useState<Lote[]>(INITIAL_LOTES);
  const [gtas, setGtas] = useState<GTA[]>(INITIAL_GTAS);
  const [ctes, setCtes] = useState<CTE[]>(INITIAL_CTES);
  const [nfes, setNfes] = useState<NFE[]>(INITIAL_NFES);
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>(INITIAL_TRANSACÕES);
  const [conciliacoes, setConciliacoes] = useState<ConciliacaoBancaria[]>(INITIAL_CONCILIACOES);
  const [viagens, setViagens] = useState<ViagemLogistica[]>(INITIAL_VIAGENS);
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats>(INITIAL_DB_STATS);
  const [auditoriaLogs, setAuditoriaLogs] = useState(CHANNELS_AUDITORIA);
  const [usuariosList, setUsuariosList] = useState(CADASTRO_USUARIOS);

  // Synchronize navigation selections to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_current_route', currentRoute);
    }
  }, [currentRoute]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_active_menu', activeMenu);
    }
  }, [activeMenu]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_submenu_comercial', subMenuComercial);
    }
  }, [subMenuComercial]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_submenu_fiscal', subMenuFiscal);
    }
  }, [subMenuFiscal]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_submenu_financeiro', subMenuFinanceiro);
    }
  }, [subMenuFinanceiro]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_submenu_logistica', subMenuLogistica);
    }
  }, [subMenuLogistica]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ox_submenu_configuracoes', subMenuConfiguracoes);
    }
  }, [subMenuConfiguracoes]);

  useEffect(() => {
    async function tempClearDb() {
      const tables = [
        'compras',
        'vendas',
        'negociacoes',
        'clientes_fornecedores',
        'parceiros',
        'motoristas',
        'centros_custo',
        'tipos_parceiro',
        'categorias',
        'viagens',
        'transacoes',
        'lotes',
        'gtas',
        'ctes',
        'nfes'
      ];
      console.log("TEMPORARY DATABASE CLEANUP STARTING...");
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      for (const t of tables) {
        try {
          await supabase.from(t).delete().neq('id', 'placeholder-does-not-exist');
        } catch (e) {
          console.error("Failed to clear", t, e);
        }
      }
      console.log("TEMPORARY DATABASE CLEANUP COMPLETE!");
    }
    tempClearDb();
  }, []);

  useEffect(() => {
    async function loadUsuarios() {
      try {
        const { data, error } = await supabase.from('usuarios').select('*');
        if (!error && data) {
          // Verify if any default mock user is missing from the database
          const missingUsers = CADASTRO_USUARIOS.filter(mu => !data.some(u => u.email === mu.email));
          if (missingUsers.length > 0) {
            const toUpsert = missingUsers.map(u => {
              const raw = {
                ...u,
                segurancaLogin: u.email,
                segurancaStatus: 'A',
                segurancaSenha: u.email === 'anderson.everton@oxcommerce.com' ? 'Ox@020685' : '123456',
                segurancaConfirmarSenha: u.email === 'anderson.everton@oxcommerce.com' ? 'Ox@020685' : '123456',
                segurancaPerfil: 'ADM',
                segurancaPapel: u.papel === 'Administrador ERP' ? 'ADM' : 'FIS'
              };
              return {
                id: u.id,
                nome: u.nome,
                email: u.email,
                papel: u.papel,
                status: u.status,
                matricula: u.matricula,
                raw_data: raw
              };
            });
            await supabase.from('usuarios').upsert(toUpsert);
            
            // Re-fetch users to get full list
            const { data: updatedData } = await supabase.from('usuarios').select('*');
            if (updatedData) {
              const mapped = updatedData.map(u => {
                let raw = u.raw_data || {};
                if (typeof window !== 'undefined') {
                  const cached = localStorage.getItem('ox_raw_data_' + u.id);
                  if (cached) {
                    try { raw = { ...raw, ...JSON.parse(cached) }; } catch (e) {}
                  }
                }
                return {
                  ...raw,
                  id: u.id,
                  nome: u.nome,
                  email: u.email,
                  papel: u.papel,
                  status: u.status,
                  matricula: u.matricula,
                  raw_data: raw
                };
              });
              setUsuariosList(mapped);
              return;
            }
          }

          if (data.length > 0) {
            const mapped = data.map(u => {
              let raw = u.raw_data || {};
              if (typeof window !== 'undefined') {
                const cached = localStorage.getItem('ox_raw_data_' + u.id);
                if (cached) {
                  try { raw = { ...raw, ...JSON.parse(cached) }; } catch (e) {}
                }
              }
              return {
                ...raw,
                id: u.id,
                nome: u.nome,
                email: u.email,
                papel: u.papel,
                status: u.status,
                matricula: u.matricula,
                raw_data: raw
              };
            });
            setUsuariosList(mapped);
          } else {
            // Fallback Seed
            const toSeed = CADASTRO_USUARIOS.map(u => {
              const raw = {
                ...u,
                segurancaLogin: u.email,
                segurancaStatus: 'A',
                segurancaSenha: u.email === 'anderson.everton@oxcommerce.com' ? 'Ox@020685' : '123456',
                segurancaConfirmarSenha: u.email === 'anderson.everton@oxcommerce.com' ? 'Ox@020685' : '123456',
                segurancaPerfil: 'ADM',
                segurancaPapel: u.papel === 'Administrador ERP' ? 'ADM' : 'FIS'
              };
              return {
                id: u.id,
                nome: u.nome,
                email: u.email,
                papel: u.papel,
                status: u.status,
                matricula: u.matricula,
                raw_data: raw
              };
            });
            await supabase.from('usuarios').insert(toSeed);
            setUsuariosList(CADASTRO_USUARIOS.map((u, i) => ({
              ...u,
              raw_data: toSeed[i].raw_data
            })));
          }
        }
      } catch (err) {
        console.warn('Failed to load usuarios from Supabase, using mock data:', err);
      }
    }
    loadUsuarios();
  }, []);

  useEffect(() => {
    async function loadCommercialData() {
      try {
        // 1. Compras
        const { data: compData, error: compErr } = await supabase.from('compras').select('*');
        if (!compErr && compData) {
          if (compData.length > 0) {
            const list = compData.map(d => {
              if (!d.raw_data) return null;
              return {
                id: d.id,
                ...d.raw_data
              };
            }).filter(Boolean) as Compra[];
            setCompras(list);
          } else {
            const toInsert = INITIAL_COMPRAS.map(c => ({
              id: c.id,
              numero_operacao: c.numeroOperacao,
              status: c.status,
              raw_data: c
            }));
            await supabase.from('compras').upsert(toInsert);
            setCompras(INITIAL_COMPRAS);
          }
        }

        // 2. Vendas
        const { data: vendData, error: vendErr } = await supabase.from('vendas').select('*');
        if (!vendErr && vendData) {
          if (vendData.length > 0) {
            const list = vendData.map(d => {
              if (!d.raw_data) return null;
              return {
                id: d.id,
                ...d.raw_data
              };
            }).filter(Boolean) as OrdemCompraCliente[];
            setOrdensCompraCliente(list);
          } else {
            const toInsert = INITIAL_ORDENS_COMPRA_CLIENTE.map(v => ({
              id: v.id,
              numero_oc: v.numeroOC,
              status: v.status,
              raw_data: v
            }));
            await supabase.from('vendas').upsert(toInsert);
            setOrdensCompraCliente(INITIAL_ORDENS_COMPRA_CLIENTE);
          }
        }

        // 3. Negociacoes
        const { data: negData, error: negErr } = await supabase.from('negociacoes').select('*');
        if (!negErr && negData) {
          if (negData.length > 0) {
            const list = negData.map(d => {
              if (!d.raw_data) return null;
              return {
                id: d.id,
                ...d.raw_data
              };
            }).filter(Boolean) as Negociacao[];
            setNegociacoes(list);
          } else {
            const toInsert = INITIAL_NEGOCIACOES.map(n => ({
              id: n.id,
              titulo: n.titulo,
              fase: n.fase,
              raw_data: n
            }));
            await supabase.from('negociacoes').upsert(toInsert);
            setNegociacoes(INITIAL_NEGOCIACOES);
          }
        }
      } catch (err) {
        console.warn('Failed to load commercial data from Supabase:', err);
      }
    }

    loadCommercialData();

    // Subscribe to Postgres realtime changes for all three tables
    const compChannel = supabase
      .channel('compras-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'compras' }, () => {
        loadCommercialData();
      })
      .subscribe();

    const vendChannel = supabase
      .channel('vendas-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendas' }, () => {
        loadCommercialData();
      })
      .subscribe();

    const negChannel = supabase
      .channel('negociacoes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'negociacoes' }, () => {
        loadCommercialData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(compChannel);
      supabase.removeChannel(vendChannel);
      supabase.removeChannel(negChannel);
    };
  }, []);

  // --- ACTIONS ---

  // 1. Simulates global sync database
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate slightly updated stats
      setDbStats({
        ...dbStats,
        latenciaMs: Math.floor(Math.random() * 8 + 4),
        ultimoBackup: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
      });
      // Append a security sync audit log
      const newAuditLog = {
        id: 'aud-' + Math.random().toString(36).substr(2, 5),
        usuario: currentUser + ' (Operador)',
        acao: 'Sincronização forçada com SEFAZ - DFe',
        horario: 'Agora mesmo',
        ip: '191.185.12.90'
      };
      setAuditoriaLogs([newAuditLog, ...auditoriaLogs]);
    }, 1200);
  };

  // 2. Add cattle entry operation (Compra)
  const handleAddCompra = (novaCompra: Compra) => {
    setCompras(prev => {
      const exists = prev.some(c => c.id === novaCompra.id);
      if (exists) {
        return prev.map(c => c.id === novaCompra.id ? novaCompra : c);
      }
      return [novaCompra, ...prev];
    });
    
    // Save to Supabase
    supabase.from('compras').upsert([{
      id: novaCompra.id,
      numero_operacao: novaCompra.numeroOperacao,
      status: novaCompra.status,
      raw_data: novaCompra
    }]).then(({ error }) => {
      if (error) console.warn('Failed to save Compra to Supabase:', error);
    });
    
    // Resolve destinations dynamically if linked to a client purchase order
    let destinoFinal = 'Barretos - SP (Planta Frigorífico Minerva)';
    let destinoLogistica = 'Barretos - SP';
    if (novaCompra.ordemCompraClienteId) {
      const oc = ordensCompraCliente.find(o => o.id === novaCompra.ordemCompraClienteId);
      if (oc) {
        destinoFinal = `${oc.frigorifico} (${oc.cliente})`;
        destinoLogistica = oc.frigorifico;
        // Auto update client order status to 'Faturada'
        setOrdensCompraCliente(prev => prev.map(o => o.id === oc.id ? { ...o, status: 'Faturada' } : o));
        // Save status update to Supabase
        const updatedOC = { ...oc, status: 'Faturada' as const };
        supabase.from('vendas').upsert([{
          id: oc.id,
          numero_oc: oc.numeroOC,
          status: 'Faturada',
          raw_data: updatedOC
        }]).then(({ error }) => {
          if (error) console.warn('Failed to auto-update Client OC status to Supabase:', error);
        });
      }
    }

    // Generates a companion accounts payable (Conta a Pagar) in State Financeiro
    const novaDespesa: TransacaoFinanceira = {
      id: 't-' + Math.random().toString(36).substr(2, 5),
      descricao: `Compra Gado Lote - Ref: ${novaCompra.numeroOperacao}`,
      tipo: 'despesa',
      subcategoria: 'Compra de Gado',
      valor: novaCompra.valorTotal,
      dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days term
      status: 'Pendente',
      conta: 'Banco do Brasil - Ag: 1244-X'
    };
    setTransacoes([novaDespesa, ...transacoes]);

    // Generates a companion GTA document in State Fiscal
    const novaGTA: GTA = {
      id: 'gta-' + Math.random().toString(36).substr(2, 5),
      numeroGTA: '351' + Math.floor(Math.random() * 900000 + 100000) + '287',
      origem: `${novaCompra.municipio} - ${novaCompra.estado} (${novaCompra.fazendaOrigem})`,
      destino: destinoFinal,
      quantidadeAnimais: novaCompra.quantidade,
      dataEmissao: novaCompra.dataCriacao,
      status: 'Pendente',
      codigoRastreabilidade: 'RAS-' + novaCompra.estado + '-' + Math.floor(Math.random() * 900000),
      observações: `Animais (${novaCompra.categoriaAnimal}) para abate e recria.`
    };
    setGtas([novaGTA, ...gtas]);

    // Generates a logistics voyage in State Logistica
    const novaViagem: ViagemLogistica = {
      id: 'v-' + Math.random().toString(36).substr(2, 5),
      placa: novaCompra.estado === 'MT' ? 'OQY-8E12' : 'GVT-2A44',
      motorista: novaCompra.estado === 'MT' ? 'Valdecir Rodrigues Alves' : 'Ailton Senna de Souza',
      veiculo: 'Bitrem Scania R440',
      origem: `${novaCompra.municipio} - ${novaCompra.estado}`,
      destino: destinoLogistica,
      quantidadeCabecas: novaCompra.quantidade,
      freteContratado: novaCompra.frete,
      status: 'Embarque',
      coordenadasAtuais: { x: 30, y: 40 },
      bateriaRastreador: 100,
      velocidadeKmH: 0,
      atualizadoHa: 'Agora',
      eventoLog: [
        { status: 'Embarque', dataHora: 'Hoje', descricao: 'Aguardando encosto da rampa boiadeira para início do embarque.' }
      ]
    };
    setViagens([novaViagem, ...viagens]);
  };

  const handleDeleteCompra = (id: string) => {
    setCompras(compras.filter((c) => c.id !== id));
    supabase.from('compras').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Failed to delete Compra from Supabase:', error);
    });
  };

  // 3. Add client Purchase Order (OrdemCompraCliente)
  const handleAddOrdemCompraCliente = (novaOC: OrdemCompraCliente) => {
    setOrdensCompraCliente(prev => {
      const exists = prev.some(oc => oc.id === novaOC.id);
      if (exists) {
        return prev.map(oc => oc.id === novaOC.id ? novaOC : oc);
      }
      return [novaOC, ...prev];
    });
    // Save to Supabase
    supabase.from('vendas').upsert([{
      id: novaOC.id,
      numero_oc: novaOC.numeroOC,
      status: novaOC.status,
      raw_data: novaOC
    }]).then(({ error }) => {
      if (error) console.warn('Failed to save Sales OC to Supabase:', error);
    });

    // Generates a companion accounts receivable (Conta a Receber)
    const novaReceita: TransacaoFinanceira = {
      id: 't-' + Math.random().toString(36).substr(2, 5),
      descricao: `Recebível OC Cliente - Ref: ${novaOC.numeroOC} - ${novaOC.cliente}`,
      tipo: 'receita',
      subcategoria: 'Venda de Bovinos',
      valor: novaOC.resultadoOperacao,
      dataVencimento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pendente',
      conta: 'Banco do Brasil - Ag: 1244-X'
    };
    setTransacoes([novaReceita, ...transacoes]);
  };

  const handleDeleteOrdemCompraCliente = (id: string) => {
    setOrdensCompraCliente(ordensCompraCliente.filter((v) => v.id !== id));
    supabase.from('vendas').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Failed to delete Sales OC from Supabase:', error);
    });
  };

  // 4. Update Kanban deals phases
  const handleUpdateNegociacaoStage = (id: string, stage: Negociacao['fase']) => {
    setNegociacoes(
      negociacoes.map((item) => {
        if (item.id === id) {
          const updated = { ...item, fase: stage, ultimaAtualizacao: 'Agora mesmo' };
          supabase.from('negociacoes').upsert([{
            id: item.id,
            titulo: item.titulo,
            fase: stage,
            raw_data: updated
          }]).then(({ error }) => {
            if (error) console.warn('Failed to update Negociacao stage to Supabase:', error);
          });
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddNegociacao = (novaNeg: Negociacao) => {
    setNegociacoes(prev => {
      const exists = prev.some(n => n.id === novaNeg.id);
      if (exists) {
        return prev.map(n => n.id === novaNeg.id ? novaNeg : n);
      }
      return [novaNeg, ...prev];
    });
    supabase.from('negociacoes').upsert([{
      id: novaNeg.id,
      titulo: novaNeg.titulo,
      fase: novaNeg.fase,
      raw_data: novaNeg
    }]).then(({ error }) => {
      if (error) console.warn('Failed to save Negociacao to Supabase:', error);
    });
  };

  // 5. Create new cattle transport lot
  const handleAddLote = (novoLote: Lote) => {
    setLotes([novoLote, ...lotes]);
  };

  // 6. Resolve pending GTA sanitation
  const handleResolveGTA = (id: string) => {
    setGtas(
      gtas.map((g) => (g.id === id ? { ...g, status: 'Homologado' } : g))
    );
  };

  // Add manual GTA entry
  const handleAddGTA = (novaGTA: GTA) => {
    setGtas([novaGTA, ...gtas]);
  };

  // 7. Emit active freight bill (CT-e)
  const handleEmitCTE = (id: string) => {
    setCtes(
      ctes.map((c) => (c.id === id ? { ...c, situacao: 'Autorizado' } : c))
    );
  };

  // Add manual CT-e entry
  const handleAddCTE = (novoCTE: CTE) => {
    setCtes([novoCTE, ...ctes]);
  };

  // Add manual NF-e entry
  const handleEmitNFE = (nfe: NFE) => {
    setNfes([nfe, ...nfes]);
  };


  // 9. Accounts Liquidator (Pago/Pendente)
  const handleLiquidateTransacao = (id: string) => {
    setTransacoes(
      transacoes.map((t) => (t.id === id ? { ...t, status: 'Pago', dataPagamento: new Date().toISOString().split('T')[0] } : t))
    );
  };

  // 10. Reconcile OFX entry to active ledger
  const handleConciliarTransacao = (id: string, transId: string) => {
    setConciliacoes(
      conciliacoes.map((c) => (c.id === id ? { ...c, status: 'Conciliado', transacaoCorrespondente: transId } : c))
    );
    // Mark companion ledger invoice as complete
    handleLiquidateTransacao(transId);
  };

  // 11. Logistics shipment status updates
  const handleUpdateViagemStatus = (id: string, status: ViagemLogistica['status']) => {
    setViagens(
      viagens.map((v) => {
        if (v.id === id) {
          const newLogs = [...v.eventoLog, { status, dataHora: new Date().toLocaleTimeString('pt-BR'), descricao: `Status da viagem alterado para: ${status}.` }];
          return { ...v, status, eventoLog: newLogs };
        }
        return v;
      })
    );
  };

  // 12. Simulate Live GPS tracking path displacements
  const handleSimulateLocations = () => {
    setViagens(
      viagens.map((v) => {
        if (v.status === 'Transporte') {
          // Creep coordinates forward by 5% delta towards dest (70, 75)
          const newX = Math.min(v.coordenadasAtuais.x + 3, 70);
          const newY = Math.min(v.coordenadasAtuais.y + 4, 75);
          return {
            ...v,
            coordenadasAtuais: { x: newX, y: newY },
            velocidadeKmH: Math.floor(Math.random() * 15 + 70),
            bateriaRastreador: Math.max(v.bateriaRastreador - 1, 12),
            atualizadoHa: 'Há 1 min'
          };
        }
        return v;
      })
    );
  };

  // 13. Backups Database manual actions
  const handleRunBackup = () => {
    setDbStats({
      ...dbStats,
      ultimoBackup: 'Agora Mesmo'
    });
  };

  // 14. Toggle employee active credentials
  const handleToggleUserStatus = async (id: string) => {
    const updated = usuariosList.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === 'Ativo' ? 'Inativo' : 'Ativo';
        const nextSecStatus = nextStatus === 'Ativo' ? 'A' : 'I';
        const raw = u.raw_data || u;
        const updatedRaw = {
          ...raw,
          status: nextStatus,
          segurancaStatus: nextSecStatus
        };
        return {
          ...u,
          status: nextStatus,
          raw_data: updatedRaw
        };
      }
      return u;
    });
    setUsuariosList(updated);
    const targetUser = updated.find(u => u.id === id);
    if (targetUser) {
      try {
        const toUpsert = {
          id: targetUser.id,
          nome: targetUser.nome,
          email: targetUser.email,
          papel: targetUser.papel,
          status: targetUser.status,
          matricula: targetUser.matricula,
          raw_data: targetUser.raw_data
        };
        const { error } = await supabase.from('usuarios').upsert([toUpsert]);
        if (error) {
          console.warn('Upsert with raw_data failed in toggle, trying standard columns only:', error.message);
          const standardOnly = {
            id: targetUser.id,
            nome: targetUser.nome,
            email: targetUser.email,
            papel: targetUser.papel,
            status: targetUser.status,
            matricula: targetUser.matricula
          };
          await supabase.from('usuarios').upsert([standardOnly]);
        }
      } catch (err) {
        console.warn('Failed to update user status in Supabase:', err);
      }
    }
  };

  // Navigate utility helper for widgets
  const handleNavigateTo = (menu: string, submenu?: string) => {
    let targetPath = `/app/${menu}`;
    if (submenu) {
      targetPath += `/${submenu}`;
    } else {
      // Get submenus default
      if (menu === 'comercial') targetPath += `/${subMenuComercial}`;
      if (menu === 'fiscal') targetPath += `/${subMenuFiscal}`;
      if (menu === 'financeiro') targetPath += `/${subMenuFinanceiro}`;
      if (menu === 'logistica') targetPath += `/${subMenuLogistica}`;
      if (menu === 'configuracoes') targetPath += `/${subMenuConfiguracoes}`;
    }
    navigate(targetPath);
  };

  if (currentRoute === 'home') {
    return <HomeView onNavigateToLogin={() => setCurrentRoute('login')} logoUrl={config.logoUrl} />;
  }

  if (currentRoute === 'login') {
    return (
      <LoginView 
        onLoginSuccess={(username) => {
          setCurrentUser(username);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ox_current_user', username);
          }
          navigate('/app/dashboard');
        }} 
        onNavigateBack={() => setCurrentRoute('home')}
        logoUrl={config.logoUrl}
      />
    );
  }

  // Alphanumeric ascending sort helper
  const sortList = (list: any[], key: string) => {
    return [...list].sort((a, b) => {
      const valA = String(a[key] || '');
      const valB = String(b[key] || '');
      return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
    });
  };

  const sortedCompras = sortList(compras, 'numeroOperacao');
  const sortedVendas = sortList(ordensCompraCliente, 'numeroOC');
  const sortedNegociacoes = sortList(negociacoes, 'id');
  const sortedGtas = sortList(gtas, 'numeroGTA');
  const sortedCtes = sortList(ctes, 'numeroCTE');
  const sortedNfes = sortList(nfes, 'numeroNFE');
  const sortedTransacoes = sortList(transacoes, 'id');
  const sortedViagens = sortList(viagens, 'id');

  return (
    <div className="h-screen flex font-sans antialiased relative glass-panel-mode overflow-hidden">
      {/* Global Background Image for Glassmorphism ERP theme */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none select-none filter brightness-[0.93]"
        style={{ backgroundImage: `url(${neloreRebanho2})` }}
      />
      
      {/* 1. FIXED LEFT SIDEBAR */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={(m, sub) => handleNavigateTo(m, sub)}
        // Submenu state
        subMenuComercial={subMenuComercial}
        setSubMenuComercial={setSubMenuComercial}
        subMenuFiscal={subMenuFiscal}
        setSubMenuFiscal={setSubMenuFiscal}
        subMenuFinanceiro={subMenuFinanceiro}
        setSubMenuFinanceiro={setSubMenuFinanceiro}
        subMenuLogistica={subMenuLogistica}
        setSubMenuLogistica={setSubMenuLogistica}
        subMenuConfiguracoes={subMenuConfiguracoes}
        setSubMenuConfiguracoes={setSubMenuConfiguracoes}
        // Configs
        appName={config.sistemaNome}
        primaryColor={config.corPrincipal}
        logoUrl={config.logoUrl}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Layout area */}
      <div className={`flex-1 pt-16 h-screen flex flex-col transition-all duration-300 relative z-10 overflow-hidden ${sidebarCollapsed ? 'pl-20' : 'pl-68'}`}>
        
        {/* 2. TOP ACTIONS TASKBAR */}
        {/* 2. TOP ACTIONS TASKBAR */}
        {(() => {
          const matchedUser = usuariosList.find(u => u.nome.toLowerCase() === currentUser.toLowerCase());
          return (
            <Header
              activeMenu={activeMenu}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentUser={currentUser}
              currentUserMatricula={matchedUser?.matricula}
              currentUserPapel={matchedUser?.papel}
              collapsed={sidebarCollapsed}
              onLogout={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('ox_current_route');
                  localStorage.removeItem('ox_active_menu');
                  localStorage.removeItem('ox_current_user');
                }
                setCurrentUser('');
                navigate('/home');
              }}
            />
          );
        })()}

        {/* 3. DYNAMIC PAGES VIEW */}
        <main className={`flex-1 p-6 w-full max-w-none animate-fade-in ${activeMenu === 'cadastros' || activeMenu === 'comercial' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          
          {activeMenu === 'dashboard' && (
            <DashboardView
              compras={sortedCompras}
              ordensCompraCliente={sortedVendas}
              negociacoes={sortedNegociacoes}
              gtas={sortedGtas}
              nfes={sortedNfes}
              viagens={sortedViagens}
              transacoes={sortedTransacoes}
              searchQuery={searchQuery}
              onNavigateTo={handleNavigateTo}
            />
          )}

          {activeMenu === 'comercial' && (
            <CommercialView
              compras={sortedCompras}
              onAddCompra={handleAddCompra}
              onDeleteCompra={handleDeleteCompra}
              ordensCompraCliente={sortedVendas}
              onAddOrdemCompraCliente={handleAddOrdemCompraCliente}
              onDeleteOrdemCompraCliente={handleDeleteOrdemCompraCliente}
              negociacoes={sortedNegociacoes}
              onUpdateNegociacaoStage={handleUpdateNegociacaoStage}
              onAddNegociacao={handleAddNegociacao}
              searchQuery={searchQuery}
              activeSubMenu={subMenuComercial}
              setActiveSubMenu={setSubMenuComercial}
              viagens={sortedViagens}
              onGoToLogistica={() => {
                setActiveMenu('logistica');
                setSubMenuLogistica('transporte');
              }}
            />
          )}

          {activeMenu === 'fiscal' && (
            <FiscalView
              gtas={sortedGtas}
              onResolveGTA={handleResolveGTA}
              onAddGTA={handleAddGTA}
              ctes={sortedCtes}
              onEmitCTE={handleEmitCTE}
              onAddCTE={handleAddCTE}
              nfes={sortedNfes}
              onEmitNFE={handleEmitNFE}
              searchQuery={searchQuery}
              activeSubMenu={subMenuFiscal}
              setActiveSubMenu={setSubMenuFiscal}
              negociacoes={sortedNegociacoes}
              lotes={lotes}
            />
          )}

          {activeMenu === 'financeiro' && (
            <FinancialView
              transacoes={sortedTransacoes}
              onAddTransacao={(t) => setTransacoes([t, ...transacoes])}
              onLiquidateTransacao={handleLiquidateTransacao}
              conciliacoes={conciliacoes}
              onConciliarTransacao={handleConciliarTransacao}
              searchQuery={searchQuery}
              activeSubMenu={subMenuFinanceiro}
              setActiveSubMenu={setSubMenuFinanceiro}
              viagens={sortedViagens}
            />
          )}

          {activeMenu === 'logistica' && (
            <LogisticsView
              viagens={sortedViagens}
              onUpdateViagemStatus={handleUpdateViagemStatus}
              onSimulateLocations={handleSimulateLocations}
              activeSubMenu={subMenuLogistica}
              setActiveSubMenu={setSubMenuLogistica}
              searchQuery={searchQuery}
            />
          )}

          {activeMenu === 'cadastros' && (
            <CadastrosView
              searchQuery={searchQuery}
              usuarios={usuariosList}
              onAddUsuario={async (novoUsuario) => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('ox_raw_data_' + novoUsuario.id, JSON.stringify(novoUsuario.raw_data || novoUsuario));
                }
                const localUser = {
                  ...novoUsuario,
                  raw_data: novoUsuario.raw_data || novoUsuario
                };
                setUsuariosList(prev => {
                  const exists = prev.some(u => u.id === novoUsuario.id);
                  if (exists) {
                    return prev.map(u => u.id === novoUsuario.id ? localUser : u);
                  }
                  return [localUser, ...prev];
                });
                try {
                  const toUpsert = {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                    papel: novoUsuario.papel,
                    status: novoUsuario.status,
                    matricula: novoUsuario.matricula,
                    raw_data: localUser.raw_data
                  };
                  const { error } = await supabase.from('usuarios').upsert([toUpsert]);
                  if (error) {
                    console.warn('Upsert with raw_data failed, trying standard columns only:', error.message);
                    const standardOnly = {
                      id: novoUsuario.id,
                      nome: novoUsuario.nome,
                      email: novoUsuario.email,
                      papel: novoUsuario.papel,
                      status: novoUsuario.status,
                      matricula: novoUsuario.matricula
                    };
                    await supabase.from('usuarios').upsert([standardOnly]);
                  }
                } catch (err) {
                  console.warn('Failed to save usuario to Supabase:', err);
                }
              }}
              onDeleteUsuario={async (userId) => {
                setUsuariosList(prev => prev.filter(u => u.id !== userId));
                try {
                  await supabase.from('usuarios').delete().eq('id', userId);
                } catch (err) {
                  console.warn('Failed to delete usuario from Supabase:', err);
                }
              }}
            />
          )}

          {activeMenu === 'relatorios' && (
            <RelatoriosView />
          )}

          {activeMenu === 'configuracoes' && (
            <SettingsView
              config={config}
              onUpdateConfig={setConfig}
              dbStats={dbStats}
              onRunBackup={handleRunBackup}
              activeSubMenu={subMenuConfiguracoes}
              setActiveSubMenu={setSubMenuConfiguracoes}
              auditoriaLogs={auditoriaLogs}
              usuarios={usuariosList}
              onToggleUserStatus={handleToggleUserStatus}
              onRefreshAll={handleRefreshAll}
              isRefreshing={isRefreshing}
            />
          )}

        </main>

        {/* Outer bottom-bar credits in premium glassmorphic style */}
        <footer className="py-4 px-6 border-t border-[#E2E8F0]/40 bg-white/60 backdrop-blur-md mt-auto text-center text-[11px] text-[#57628D] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 {config.sistemaNome} S/A — Todos os direitos reservados.</p>
          <p className="font-semibold text-[#071757]">Agropecuária de Rastreabilidade Integrada.</p>
        </footer>

      </div>
    </div>
  );
}
