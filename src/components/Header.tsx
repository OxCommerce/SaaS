/**
 * Header — OxCommerce
 * Design System: AgroTech B2B | Verde Institucional
 */

import React, { useState } from 'react';
import { Bell, Search, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { ActiveMenu } from '../types';

interface HeaderProps {
  activeMenu: ActiveMenu;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: string;
  collapsed?: boolean;
}

export default function Header({
  activeMenu,
  searchQuery,
  setSearchQuery,
  currentUser,
  collapsed = false
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const formatTitle = (menu: ActiveMenu) => {
    switch (menu) {
      case 'dashboard':    return 'Dashboard Executivo';
      case 'comercial':    return 'Módulo Comercial';
      case 'fiscal':       return 'Módulo Fiscal';
      case 'financeiro':   return 'Gestão Financeira & Fluxo de Caixa';
      case 'logistica':    return 'Logística · Viagens & Rastreamento';
      case 'cadastros':    return 'Módulo de Cadastro';
      case 'relatorios':   return 'Relatórios de Performance Pecuária';
      case 'configuracoes': return 'Centro de Configurações ERP';
      default:             return 'OxCommerce';
    }
  };

  const alerts = [
    { id: 1, type: 'fiscal',    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />, msg: 'GTA interestadual homologado com sucesso (#351403)' },
    { id: 2, type: 'financeiro', icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />, msg: 'Contas a pagar: Fatura Vale Verde vence in 8 dias' },
    { id: 3, type: 'logistica', icon: <Clock className="h-3.5 w-3.5 text-blue-500" />, msg: 'Bitrem OQY-8E12 em trânsito com 120 cabeças de gado' },
  ];

  const initials = currentUser.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className={`h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 fixed top-0 right-0 z-20 shadow-xs transition-all duration-300 ${collapsed ? 'left-20' : 'left-68'}`}>

      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-[#0F172A] tracking-tight font-display">
          {formatTitle(activeMenu)}
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative w-72 hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-[#94A3B8]" />
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar gado, lote, nota, fornecedor..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8F8FA] border border-[#DEE1E9] rounded-lg text-xs text-[#475569] outline-none focus:bg-white focus:border-[#D8B46A] focus:ring-2 focus:ring-[#D8B46A]/20 transition-all placeholder:text-[#CBD5E1] font-sans"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Alertas Operacionais</span>
                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold">3 Pendentes</span>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {alerts.map((al) => (
                  <div key={al.id} className="p-3.5 hover:bg-[#F8FAFC] flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{al.icon}</div>
                    <div>
                      <span className="text-[10px] font-bold text-[#D8B46A] uppercase tracking-wide block mb-0.5">{al.type}</span>
                      <p className="text-xs text-[#475569] leading-snug">{al.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 pb-1 border-t border-[#E2E8F0] text-center">
                <button
                  id="btn-dismiss-alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#071757] hover:text-[#D8B46A] transition-colors cursor-pointer"
                >
                  Marcar todos como lidos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-7 w-px bg-[#E2E8F0]" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#071757] text-[#D8B46A] flex items-center justify-center font-bold text-xs ring-2 ring-[#D8B46A]/30">
            {initials}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-xs font-bold text-[#0F172A]">{currentUser}</p>
            <p className="text-[10px] text-[#94A3B8] font-medium">Fazenda Real MT</p>
          </div>
        </div>

      </div>
    </header>
  );
}
