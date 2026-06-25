/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Search, RefreshCw, CheckCircle2, User, HelpCircle, ArrowUpRight } from 'lucide-react';
import { ActiveMenu } from '../types';

interface HeaderProps {
  activeMenu: ActiveMenu;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: string;
}

export default function Header({
  activeMenu,
  searchQuery,
  setSearchQuery,
  currentUser
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const formatTitle = (menu: ActiveMenu) => {
    switch (menu) {
      case 'dashboard':
        return 'Dashboard Executivo';
      case 'comercial':
        return 'Módulo Comercial';
      case 'fiscal':
        return 'Módulo Fiscal';
      case 'financeiro':
        return 'Gestão Financeira & Fluxo de Caixa';
      case 'logistica':
        return 'Módulo Logístico - Viagens & Rastreamento';
      case 'cadastros':
        return 'Módulo de Cadastro';
      case 'relatorios':
        return 'Relatórios de Performance Pecuária';
      case 'configuracoes':
        return 'Centro de Configurações ERP';
      default:
        return 'Ox Commerce';
    }
  };

  // Mock corporate notifications
  const alerts = [
    { id: 1, type: 'gta', msg: 'GTA interestadual homologado com sucesso (#351403)' },
    { id: 2, type: 'financeiro', msg: 'Contas a pagar: Fatura Vale Verde vence em 8 dias' },
    { id: 3, type: 'logistica', msg: 'Bitrem OQY-8E12 em trânsito com 120 cabeças de gado' }
  ];

  return (
    <header className="h-16 bg-white border-b border-[#DEE1E9] flex items-center justify-between px-6 fixed top-0 right-0 left-68 z-20 shadow-xs">
      
      {/* Primary Context Title */}
      <div className="flex items-center space-x-6">
        <div>
          <h2 className="text-lg font-bold text-[#071757] tracking-tight font-sans">
            {formatTitle(activeMenu)}
          </h2>
        </div>
      </div>
 
      {/* Right side operational widgets */}
      <div className="flex items-center space-x-4">
        
        {/* Global Instant Search */}
        <div className="relative w-72 hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar gado, lote, nota, fornecedor, placa..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-sans text-gray-700 outline-none focus:bg-white focus:border-[#071757] focus:ring-1 focus:ring-[#071757] transition-all placeholder:text-gray-400"
          />
        </div>
 
        {/* Notification Area */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full"></span>
          </button>
 
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Alertas Operacionais de Hoje</span>
                <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full font-mono">3 Pendentes</span>
              </div>
              <div className="divide-y divide-gray-50">
                {alerts.map((al) => (
                  <div key={al.id} className="p-3 hover:bg-gray-50 flex flex-col space-y-0.5">
                    <span className="text-[10px] font-bold text-[#D8B46A] uppercase tracking-wider font-mono">
                      {al.type}
                    </span>
                    <p className="text-xs text-gray-600 leading-tight">{al.msg}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100 text-center">
                <button
                  id="btn-dismiss-alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-bold text-[#071757] hover:text-[#D8B46A] hover:underline px-2 py-1"
                >
                  Marcar todos como lidos
                </button>
              </div>
            </div>
          )}
        </div>
 
        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-gray-200">
          <div className="h-8 w-8 rounded-full bg-[#071757] text-[#D8B46A] flex items-center justify-center font-bold text-xs ring-2 ring-[#D8B46A]/50">
            {currentUser.split(' ').map(n=>n[0]).join('')}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-xs font-bold text-gray-800">{currentUser}</p>
            <p className="text-[10px] text-gray-500 font-medium">Fazenda Real MT</p>
          </div>
        </div>
 
      </div>
    </header>
  );
}
