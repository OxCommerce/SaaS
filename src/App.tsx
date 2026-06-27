/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  // Global Active Navigation state
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('dashboard');
  
  // Categorized Submenu states
  const [subMenuComercial, setSubMenuComercial] = useState<SubMenuComercial>('compras');
  const [subMenuFiscal, setSubMenuFiscal] = useState<SubMenuFiscal>('gta');
  const [subMenuFinanceiro, setSubMenuFinanceiro] = useState<SubMenuFinanceiro>('receber');
  const [subMenuLogistica, setSubMenuLogistica] = useState<SubMenuLogistica>('transporte');
  const [subMenuConfiguracoes, setSubMenuConfiguracoes] = useState<SubMenuConfiguracoes>('usuarios');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState('Diego Silveira');
  const [currentRoute, setCurrentRoute] = useState<'home' | 'login' | 'app'>('home');

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

  useEffect(() => {
    async function loadUsuarios() {
      try {
        const { data, error } = await supabase.from('usuarios').select('*');
        if (!error && data && data.length > 0) {
          setUsuariosList(data);
        }
      } catch (err) {
        console.warn('Failed to load usuarios from Supabase, using mock data:', err);
      }
    }
    loadUsuarios();
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
    setCompras([novaCompra, ...compras]);
    
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
  };

  // 3. Add client Purchase Order (OrdemCompraCliente)
  const handleAddOrdemCompraCliente = (novaOC: OrdemCompraCliente) => {
    setOrdensCompraCliente([novaOC, ...ordensCompraCliente]);
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
  };

  // 4. Update Kanban deals phases
  const handleUpdateNegociacaoStage = (id: string, stage: Negociacao['fase']) => {
    setNegociacoes(
      negociacoes.map((item) => (item.id === id ? { ...item, fase: stage, ultimaAtualizacao: 'Agora mesmo' } : item))
    );
  };

  const handleAddNegociacao = (novaNeg: Negociacao) => {
    setNegociacoes([novaNeg, ...negociacoes]);
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
    const updated = usuariosList.map((u) => (u.id === id ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u));
    setUsuariosList(updated);
    const targetUser = updated.find(u => u.id === id);
    if (targetUser) {
      try {
        await supabase.from('usuarios').upsert([targetUser]);
      } catch (err) {
        console.warn('Failed to update user status in Supabase:', err);
      }
    }
  };

  // Navigate utility helper for widgets
  const handleNavigateTo = (menu: string, submenu?: string) => {
    setActiveMenu(menu as ActiveMenu);
    if (submenu) {
      if (menu === 'comercial') setSubMenuComercial(submenu as SubMenuComercial);
      if (menu === 'fiscal') setSubMenuFiscal(submenu as SubMenuFiscal);
      if (menu === 'financeiro') setSubMenuFinanceiro(submenu as SubMenuFinanceiro);
      if (menu === 'logistica') setSubMenuLogistica(submenu as SubMenuLogistica);
      if (menu === 'configuracoes') setSubMenuConfiguracoes(submenu as SubMenuConfiguracoes);
    }
  };

  if (currentRoute === 'home') {
    return <HomeView onNavigateToLogin={() => setCurrentRoute('login')} logoUrl={config.logoUrl} />;
  }

  if (currentRoute === 'login') {
    return (
      <LoginView 
        onLoginSuccess={(username) => {
          setCurrentUser(username);
          setCurrentRoute('app');
        }} 
        onNavigateBack={() => setCurrentRoute('home')}
        logoUrl={config.logoUrl}
      />
    );
  }

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
        setActiveMenu={(m) => handleNavigateTo(m)}
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
        <Header
          activeMenu={activeMenu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          collapsed={sidebarCollapsed}
        />

        {/* 3. DYNAMIC PAGES VIEW */}
        <main className="flex-1 p-6 w-full max-w-none animate-fade-in overflow-y-auto">
          
          {activeMenu === 'dashboard' && (
            <DashboardView
              compras={compras}
              ordensCompraCliente={ordensCompraCliente}
              negociacoes={negociacoes}
              gtas={gtas}
              nfes={nfes}
              viagens={viagens}
              transacoes={transacoes}
              searchQuery={searchQuery}
              onNavigateTo={handleNavigateTo}
            />
          )}

          {activeMenu === 'comercial' && (
            <CommercialView
              compras={compras}
              onAddCompra={handleAddCompra}
              onDeleteCompra={handleDeleteCompra}
              ordensCompraCliente={ordensCompraCliente}
              onAddOrdemCompraCliente={handleAddOrdemCompraCliente}
              onDeleteOrdemCompraCliente={handleDeleteOrdemCompraCliente}
              negociacoes={negociacoes}
              onUpdateNegociacaoStage={handleUpdateNegociacaoStage}
              onAddNegociacao={handleAddNegociacao}
              searchQuery={searchQuery}
              activeSubMenu={subMenuComercial}
              setActiveSubMenu={setSubMenuComercial}
              viagens={viagens}
              onGoToLogistica={() => {
                setActiveMenu('logistica');
                setSubMenuLogistica('transporte');
              }}
            />
          )}

          {activeMenu === 'fiscal' && (
            <FiscalView
              gtas={gtas}
              onResolveGTA={handleResolveGTA}
              onAddGTA={handleAddGTA}
              ctes={ctes}
              onEmitCTE={handleEmitCTE}
              onAddCTE={handleAddCTE}
              nfes={nfes}
              onEmitNFE={handleEmitNFE}
              searchQuery={searchQuery}
              activeSubMenu={subMenuFiscal}
              setActiveSubMenu={setSubMenuFiscal}
              viagens={viagens}
              lotes={lotes}
            />
          )}

          {activeMenu === 'financeiro' && (
            <FinancialView
              transacoes={transacoes}
              onAddTransacao={(t) => setTransacoes([t, ...transacoes])}
              onLiquidateTransacao={handleLiquidateTransacao}
              conciliacoes={conciliacoes}
              onConciliarTransacao={handleConciliarTransacao}
              searchQuery={searchQuery}
              activeSubMenu={subMenuFinanceiro}
              setActiveSubMenu={setSubMenuFinanceiro}
              viagens={viagens}
            />
          )}

          {activeMenu === 'logistica' && (
            <LogisticsView
              viagens={viagens}
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
                setUsuariosList(prev => {
                  const exists = prev.some(u => u.id === novoUsuario.id);
                  if (exists) {
                    return prev.map(u => u.id === novoUsuario.id ? novoUsuario : u);
                  }
                  return [novoUsuario, ...prev];
                });
                try {
                  await supabase.from('usuarios').upsert([novoUsuario]);
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
