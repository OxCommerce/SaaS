/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
  Beef,
  DollarSign,
  FileCheck,
  MapPin,
  Users
} from 'lucide-react';
import logoWhite from '@/assets/logo_white.png';

interface SidebarProps {
  activeMenu: ActiveMenu;
  setActiveMenu: (menu: ActiveMenu) => void;
  // Submenus
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
  // App Config Customization
  appName: string;
  primaryColor: string;
  logoUrl?: string;
}

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
  // Toggle states for sidebar collapsibles
  const [openComercial, setOpenComercial] = useState(true);
  const [openFiscal, setOpenFiscal] = useState(true);
  const [openFinanceiro, setOpenFinanceiro] = useState(true);
  const [openLogistica, setOpenLogistica] = useState(true);
  const [openConfig, setOpenConfig] = useState(true);

  const handleMenuClick = (menu: ActiveMenu) => {
    setActiveMenu(menu);
  };

  return (
    <aside className="w-68 bg-[#071757] text-white flex flex-col h-screen fixed top-0 left-0 z-30 border-r border-slate-800/30 shadow-xl overflow-y-auto">
      {/* Brand Header */}
      <div className="py-5 px-4 border-b border-slate-800/30 bg-[#05113b] flex items-center justify-center">
        <img src={logoUrl || logoWhite} alt="Ox-Commerce Logo" className="h-20 w-auto object-contain rounded-lg" />
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        
        {/* Dashboard Link */}
        <button
          id="sidebar-btn-dashboard"
          onClick={() => handleMenuClick('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeMenu === 'dashboard'
              ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
              : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
          }`}
        >
          <LayoutDashboard className="h-4.5 w-4.5 flex-shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* COMERCIAL COLLAPSIBLE */}
        <div className="space-y-1">
          <button
            id="sidebar-btn-comercial-toggle"
            onClick={() => {
              setOpenComercial(!openComercial);
              handleMenuClick('comercial');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeMenu === 'comercial'
                ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
                : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-4.5 w-4.5" />
              <span>Comercial</span>
            </div>
            {openComercial ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {openComercial && (
            <div className="pl-8 pr-2 py-1 space-y-1 border-l border-slate-700/30 ml-5">
              <button
                id="submenu-vendas"
                onClick={() => {
                  setActiveMenu('comercial');
                  setSubMenuComercial('vendas');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'comercial' && subMenuComercial === 'vendas'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Ordens de Compra
              </button>
              <button
                id="submenu-compras"
                onClick={() => {
                  setActiveMenu('comercial');
                  setSubMenuComercial('compras');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'comercial' && subMenuComercial === 'compras'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Negociações
              </button>
              <button
                id="submenu-negociacoes"
                onClick={() => {
                  setActiveMenu('comercial');
                  setSubMenuComercial('negociacoes');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'comercial' && subMenuComercial === 'negociacoes'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                CRM / Follow-up
              </button>
            </div>
          )}
        </div>

        {/* FISCAL COLLAPSIBLE */}
        <div className="space-y-1">
          <button
            id="sidebar-btn-fiscal-toggle"
            onClick={() => {
              setOpenFiscal(!openFiscal);
              handleMenuClick('fiscal');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeMenu === 'fiscal'
                ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
                : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-4.5 w-4.5" />
              <span>Fiscal</span>
            </div>
            {openFiscal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {openFiscal && (
            <div className="pl-8 pr-2 py-1 space-y-1 border-l border-slate-700/30 ml-5">
              <button
                id="submenu-gta"
                onClick={() => {
                  setActiveMenu('fiscal');
                  setSubMenuFiscal('gta');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'fiscal' && subMenuFiscal === 'gta'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Guia de Trânsito (GTA)
              </button>
              <button
                id="submenu-cte"
                onClick={() => {
                  setActiveMenu('fiscal');
                  setSubMenuFiscal('cte');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'fiscal' && subMenuFiscal === 'cte'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Conhecimento (CT-e)
              </button>
              <button
                id="submenu-nfe"
                onClick={() => {
                  setActiveMenu('fiscal');
                  setSubMenuFiscal('nfe');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'fiscal' && subMenuFiscal === 'nfe'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Nota Fiscal (NF-e)
              </button>
            </div>
          )}
        </div>

        {/* FINANCEIRO COLLAPSIBLE */}
        <div className="space-y-1">
          <button
            id="sidebar-btn-financeiro-toggle"
            onClick={() => {
              setOpenFinanceiro(!openFinanceiro);
              handleMenuClick('financeiro');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeMenu === 'financeiro'
                ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
                : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Coins className="h-4.5 w-4.5" />
              <span>Financeiro</span>
            </div>
            {openFinanceiro ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {openFinanceiro && (
            <div className="pl-8 pr-2 py-1 space-y-1 border-l border-slate-700/30 ml-5">
              <button
                id="submenu-receber"
                onClick={() => {
                  setActiveMenu('financeiro');
                  setSubMenuFinanceiro('receber');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'financeiro' && subMenuFinanceiro === 'receber'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Contas a Receber
              </button>
              <button
                id="submenu-pagar"
                onClick={() => {
                  setActiveMenu('financeiro');
                  setSubMenuFinanceiro('pagar');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'financeiro' && subMenuFinanceiro === 'pagar'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Contas a Pager
              </button>
              <button
                id="submenu-fluxo"
                onClick={() => {
                  setActiveMenu('financeiro');
                  setSubMenuFinanceiro('fluxo');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'financeiro' && subMenuFinanceiro === 'fluxo'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Fluxo de Caixa
              </button>
              <button
                id="submenu-conciliacao"
                onClick={() => {
                  setActiveMenu('financeiro');
                  setSubMenuFinanceiro('conciliacao');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'financeiro' && subMenuFinanceiro === 'conciliacao'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Conciliação Bancária
              </button>
            </div>
          )}
        </div>

        {/* LOGISTICA COLLAPSIBLE */}
        <div className="space-y-1">
          <button
            id="sidebar-btn-logistica-toggle"
            onClick={() => {
              setOpenLogistica(!openLogistica);
              handleMenuClick('logistica');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeMenu === 'logistica'
                ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
                : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Truck className="h-4.5 w-4.5" />
              <span>Logística</span>
            </div>
            {openLogistica ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {openLogistica && (
            <div className="pl-8 pr-2 py-1 space-y-1 border-l border-slate-700/30 ml-5">
              <button
                id="submenu-transporte"
                onClick={() => {
                  setActiveMenu('logistica');
                  setSubMenuLogistica('transporte');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'logistica' && subMenuLogistica === 'transporte'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Gestão de Transportes
              </button>
              <button
                id="submenu-viagens"
                onClick={() => {
                  setActiveMenu('logistica');
                  setSubMenuLogistica('viagens');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'logistica' && subMenuLogistica === 'viagens'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Planejamento de Viagens
              </button>
              <button
                id="submenu-rastreamento"
                onClick={() => {
                  setActiveMenu('logistica');
                  setSubMenuLogistica('rastreamento');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'logistica' && subMenuLogistica === 'rastreamento'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Rastreamento GPS
              </button>
              <button
                id="submenu-fretes"
                onClick={() => {
                  setActiveMenu('logistica');
                  setSubMenuLogistica('fretes');
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                  activeMenu === 'logistica' && subMenuLogistica === 'fretes'
                    ? 'text-[#D8B46A] font-semibold bg-[#182763]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#182763]/25'
                }`}
              >
                Controle de Fretes
              </button>
            </div>
          )}
        </div>

        {/* CADASTROS LINK */}
        <button
          id="sidebar-btn-cadastros"
          onClick={() => handleMenuClick('cadastros')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeMenu === 'cadastros'
              ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
              : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
          }`}
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Cadastro</span>
        </button>

        {/* RELATORIOS LINK */}
        <button
          id="sidebar-btn-relatorios"
          onClick={() => handleMenuClick('relatorios')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeMenu === 'relatorios'
              ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
              : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
          }`}
        >
          <BarChart3 className="h-4.5 w-4.5" />
          <span>Relatórios Gerenciais</span>
        </button>

        {/* CONFIGURACOES LINK */}
        <button
          id="sidebar-btn-configuracoes"
          onClick={() => handleMenuClick('configuracoes')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeMenu === 'configuracoes'
              ? 'bg-[#182763] text-[#D8B46A] border-l-4 border-[#D8B46A] shadow-md font-semibold'
              : 'text-slate-300 hover:bg-[#182763]/50 hover:text-white'
          }`}
        >
          <Settings className="h-4.5 w-4.5" />
          <span>Configurações</span>
        </button>

      </nav>

      {/* Footer System Info */}
      <div className="p-3 bg-[#05113b] border-t border-slate-800/30 text-center text-[10px] text-slate-300">
        <div className="flex items-center justify-center space-x-1">
          <span className="h-2 w-2 bg-[#D8B46A] rounded-full animate-pulse"></span>
          <span>Sincronizado SEFAZ / GTA</span>
        </div>
        <p className="mt-1 font-mono">v4.0.2 - Licença Premium</p>
      </div>
    </aside>
  );
}
