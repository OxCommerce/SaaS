/**
 * Sidebar — OxCommerce
 * Design System: AgroTech B2B | Fundo Claro + Verde Institucional
 */

import React, { useState } from 'react';
import {
  ActiveMenu,
  SubMenuComercial,
  SubMenuFiscal,
  SubMenuFinanceiro,
  SubMenuLogistica,
  SubMenuConfiguracoes
} from '../types';
import {
  LayoutDashboard,
  TrendingUp,
  FileSpreadsheet,
  Coins,
  Truck,
  UserPlus,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { OxLogo } from './ui/Logo';

interface SidebarProps {
  activeMenu: ActiveMenu;
  setActiveMenu: (menu: ActiveMenu) => void;
  subMenuComercial: SubMenuComercial;
  setSubMenuComercial: (sub: SubMenuComercial) => void;
  subMenuFiscal: SubMenuFiscal;
  setSubMenuFiscal: (sub: SubMenuFiscal) => void;
  subMenuFinanceiro: SubMenuFinanceiro;
  setSubMenuFinanceiro: (sub: SubMenuFinanceiro) => void;
  subMenuLogistica: SubMenuLogistica;
  setSubMenuLogistica: (sub: SubMenuLogistica) => void;
  subMenuConfiguracoes: SubMenuConfiguracoes;
  setSubMenuConfiguracoes: (sub: SubMenuConfiguracoes) => void;
  appName: string;
  primaryColor: string;
  logoUrl?: string;
}

// ── Style helpers ──
const navItem = (active: boolean) =>
  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
    active
      ? 'bg-[#DEE1E9] text-[#071757] font-semibold border-l-4 border-[#D8B46A] pl-2.5'
      : 'text-[#475569] hover:bg-[#F8F8FA] hover:text-[#071757]'
  }`;

const navItemWithChevron = (active: boolean) =>
  `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
    active
      ? 'bg-[#DEE1E9] text-[#071757] font-semibold border-l-4 border-[#D8B46A] pl-2.5'
      : 'text-[#475569] hover:bg-[#F8F8FA] hover:text-[#071757]'
  }`;

const subItem = (active: boolean) =>
  `w-full text-left px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
    active
      ? 'text-[#071757] font-semibold bg-[#DEE1E9]'
      : 'text-[#64748B] hover:text-[#071757] hover:bg-[#F8F8FA]'
  }`;

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  subMenuComercial,
  setSubMenuComercial,
  subMenuFiscal,
  setSubMenuFiscal,
  subMenuFinanceiro,
  setSubMenuFinanceiro,
  subMenuLogistica,
  setSubMenuLogistica,
  subMenuConfiguracoes,
  setSubMenuConfiguracoes,
  appName,
  primaryColor,
  logoUrl
}: SidebarProps) {
  const [openComercial, setOpenComercial] = useState(true);
  const [openFiscal, setOpenFiscal] = useState(false);
  const [openFinanceiro, setOpenFinanceiro] = useState(false);
  const [openLogistica, setOpenLogistica] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);

  return (
    <aside className="w-68 bg-white text-[#0F172A] flex flex-col h-screen fixed top-0 left-0 z-30 border-r border-[#E2E8F0] shadow-sm overflow-y-auto">

      {/* ── Brand Header ── */}
      <div className="py-5 px-5 border-b border-[#DEE1E9] flex items-center justify-center min-h-[80px]">
        <OxLogo variant="blue" showText={true} className="h-14 w-auto" />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

        {/* Section label */}
        <p className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
          Menu Principal
        </p>

        {/* Dashboard */}
        <button
          id="sidebar-btn-dashboard"
          onClick={() => setActiveMenu('dashboard')}
          className={navItem(activeMenu === 'dashboard')}
        >
          <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* ── COMERCIAL ── */}
        <div className="space-y-0.5 pt-1">
          <button
            id="sidebar-btn-comercial-toggle"
            onClick={() => {
              setOpenComercial(!openComercial);
              setActiveMenu('comercial');
            }}
            className={navItemWithChevron(activeMenu === 'comercial')}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
              <span>Comercial</span>
            </div>
            {openComercial
              ? <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              : <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            }
          </button>
          {openComercial && (
            <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#E2E8F0] ml-5">
              <button id="submenu-vendas" onClick={() => { setActiveMenu('comercial'); setSubMenuComercial('vendas'); }}
                className={subItem(activeMenu === 'comercial' && subMenuComercial === 'vendas')}>
                Ordens de Compra
              </button>
              <button id="submenu-compras" onClick={() => { setActiveMenu('comercial'); setSubMenuComercial('compras'); }}
                className={subItem(activeMenu === 'comercial' && subMenuComercial === 'compras')}>
                Negociações
              </button>
              <button id="submenu-negociacoes" onClick={() => { setActiveMenu('comercial'); setSubMenuComercial('negociacoes'); }}
                className={subItem(activeMenu === 'comercial' && subMenuComercial === 'negociacoes')}>
                CRM / Follow-up
              </button>
            </div>
          )}
        </div>

        {/* ── FISCAL ── */}
        <div className="space-y-0.5">
          <button
            id="sidebar-btn-fiscal-toggle"
            onClick={() => { setOpenFiscal(!openFiscal); setActiveMenu('fiscal'); }}
            className={navItemWithChevron(activeMenu === 'fiscal')}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-4 w-4 flex-shrink-0" />
              <span>Fiscal</span>
            </div>
            {openFiscal
              ? <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              : <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            }
          </button>
          {openFiscal && (
            <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#E2E8F0] ml-5">
              <button id="submenu-gta" onClick={() => { setActiveMenu('fiscal'); setSubMenuFiscal('gta'); }}
                className={subItem(activeMenu === 'fiscal' && subMenuFiscal === 'gta')}>
                Guia de Trânsito (GTA)
              </button>
              <button id="submenu-cte" onClick={() => { setActiveMenu('fiscal'); setSubMenuFiscal('cte'); }}
                className={subItem(activeMenu === 'fiscal' && subMenuFiscal === 'cte')}>
                Conhecimento (CT-e)
              </button>
              <button id="submenu-nfe" onClick={() => { setActiveMenu('fiscal'); setSubMenuFiscal('nfe'); }}
                className={subItem(activeMenu === 'fiscal' && subMenuFiscal === 'nfe')}>
                Nota Fiscal (NF-e)
              </button>
            </div>
          )}
        </div>

        {/* ── FINANCEIRO ── */}
        <div className="space-y-0.5">
          <button
            id="sidebar-btn-financeiro-toggle"
            onClick={() => { setOpenFinanceiro(!openFinanceiro); setActiveMenu('financeiro'); }}
            className={navItemWithChevron(activeMenu === 'financeiro')}
          >
            <div className="flex items-center gap-3">
              <Coins className="h-4 w-4 flex-shrink-0" />
              <span>Financeiro</span>
            </div>
            {openFinanceiro
              ? <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              : <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            }
          </button>
          {openFinanceiro && (
            <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#E2E8F0] ml-5">
              <button id="submenu-receber" onClick={() => { setActiveMenu('financeiro'); setSubMenuFinanceiro('receber'); }}
                className={subItem(activeMenu === 'financeiro' && subMenuFinanceiro === 'receber')}>
                Contas a Receber
              </button>
              <button id="submenu-pagar" onClick={() => { setActiveMenu('financeiro'); setSubMenuFinanceiro('pagar'); }}
                className={subItem(activeMenu === 'financeiro' && subMenuFinanceiro === 'pagar')}>
                Contas a Pagar
              </button>
              <button id="submenu-fluxo" onClick={() => { setActiveMenu('financeiro'); setSubMenuFinanceiro('fluxo'); }}
                className={subItem(activeMenu === 'financeiro' && subMenuFinanceiro === 'fluxo')}>
                Fluxo de Caixa
              </button>
              <button id="submenu-conciliacao" onClick={() => { setActiveMenu('financeiro'); setSubMenuFinanceiro('conciliacao'); }}
                className={subItem(activeMenu === 'financeiro' && subMenuFinanceiro === 'conciliacao')}>
                Conciliação Bancária
              </button>
            </div>
          )}
        </div>

        {/* ── LOGÍSTICA ── */}
        <div className="space-y-0.5">
          <button
            id="sidebar-btn-logistica-toggle"
            onClick={() => { setOpenLogistica(!openLogistica); setActiveMenu('logistica'); }}
            className={navItemWithChevron(activeMenu === 'logistica')}
          >
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 flex-shrink-0" />
              <span>Logística</span>
            </div>
            {openLogistica
              ? <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              : <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            }
          </button>
          {openLogistica && (
            <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#E2E8F0] ml-5">
              <button id="submenu-transporte" onClick={() => { setActiveMenu('logistica'); setSubMenuLogistica('transporte'); }}
                className={subItem(activeMenu === 'logistica' && subMenuLogistica === 'transporte')}>
                Gestão de Transportes
              </button>
              <button id="submenu-viagens" onClick={() => { setActiveMenu('logistica'); setSubMenuLogistica('viagens'); }}
                className={subItem(activeMenu === 'logistica' && subMenuLogistica === 'viagens')}>
                Planejamento de Viagens
              </button>
              <button id="submenu-rastreamento" onClick={() => { setActiveMenu('logistica'); setSubMenuLogistica('rastreamento'); }}
                className={subItem(activeMenu === 'logistica' && subMenuLogistica === 'rastreamento')}>
                Rastreamento GPS
              </button>
              <button id="submenu-fretes" onClick={() => { setActiveMenu('logistica'); setSubMenuLogistica('fretes'); }}
                className={subItem(activeMenu === 'logistica' && subMenuLogistica === 'fretes')}>
                Controle de Fretes
              </button>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-[#E2E8F0] my-2" />
        <p className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
          Gestão
        </p>

        {/* Cadastros */}
        <button
          id="sidebar-btn-cadastros"
          onClick={() => setActiveMenu('cadastros')}
          className={navItem(activeMenu === 'cadastros')}
        >
          <UserPlus className="h-4 w-4 flex-shrink-0" />
          <span>Cadastro</span>
        </button>

        {/* Relatórios */}
        <button
          id="sidebar-btn-relatorios"
          onClick={() => setActiveMenu('relatorios')}
          className={navItem(activeMenu === 'relatorios')}
        >
          <BarChart3 className="h-4 w-4 flex-shrink-0" />
          <span>Relatórios Gerenciais</span>
        </button>

        {/* Configurações */}
        <button
          id="sidebar-btn-configuracoes"
          onClick={() => { setOpenConfig(!openConfig); setActiveMenu('configuracoes'); }}
          className={navItemWithChevron(activeMenu === 'configuracoes')}
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span>Configurações</span>
          </div>
          {openConfig
            ? <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            : <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          }
        </button>
        {openConfig && (
          <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#E2E8F0] ml-5">
            {(['usuarios', 'identidade', 'banco', 'integracoes', 'auditoria'] as const).map((sub) => {
              const labels: Record<string, string> = {
                usuarios: 'Usuários & Permissões',
                identidade: 'Identidade Visual',
                banco: 'Contas Bancárias',
                integracoes: 'Integrações',
                auditoria: 'Auditoria & Logs',
              };
              return (
                <button
                  key={sub}
                  id={`submenu-config-${sub}`}
                  onClick={() => { setActiveMenu('configuracoes'); setSubMenuConfiguracoes(sub); }}
                  className={subItem(activeMenu === 'configuracoes' && subMenuConfiguracoes === sub)}
                >
                  {labels[sub]}
                </button>
              );
            })}
          </div>
        )}

      </nav>

      {/* ── Footer System Status ── */}
      <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D8B46A] animate-pulse flex-shrink-0" />
          <span className="text-[10px] text-[#64748B] font-medium leading-tight">
            Sincronizado · SEFAZ & GTA
          </span>
        </div>
        <p className="text-[10px] text-[#94A3B8] mt-0.5 pl-4">v4.0.2 · Licença Premium</p>
      </div>
    </aside>
  );
}
