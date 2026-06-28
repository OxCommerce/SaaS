import React, { useState, useEffect } from 'react';
import { Bell, Search, CheckCircle2, AlertTriangle, Clock, LogOut } from 'lucide-react';
import { ActiveMenu } from '../types';
import { supabase } from '../supabaseClient';

interface HeaderProps {
  activeMenu: ActiveMenu;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: string;
  currentUserMatricula?: string;
  currentUserPapel?: string;
  collapsed?: boolean;
  onLogout?: () => void;
}

export default function Header({
  activeMenu,
  searchQuery,
  setSearchQuery,
  currentUser,
  currentUserMatricula,
  currentUserPapel,
  collapsed = false,
  onLogout
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [dbConnected, setDbConnected] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('clientes_fornecedores').select('id').limit(1);
        if (error) {
          setDbConnected('offline');
        } else {
          setDbConnected('online');
        }
      } catch {
        setDbConnected('offline');
      }
    }
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

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
    { id: 2, type: 'financeiro', icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />, msg: 'Contas a pagar: Fatura Vale Verde vence em 8 dias' },
    { id: 3, type: 'logistica', icon: <Clock className="h-3.5 w-3.5 text-blue-500" />, msg: 'Bitrem OQY-8E12 em trânsito com 120 cabeças de gado' },
  ];

  const initials = currentUser.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getUserDepartment = (papel: string) => {
    const p = (papel || '').toLowerCase();
    if (p.includes('admin') || p.includes('tecnologia') || p.includes('erp')) return 'Tecnologia';
    if (p.includes('fiscal') || p.includes('gta')) return 'Fiscal';
    if (p.includes('financeiro') || p.includes('operador')) return 'Financeiro';
    if (p.includes('logística') || p.includes('supervisora') || p.includes('log')) return 'Logística';
    if (p.includes('diretor') || p.includes('gerente') || p.includes('diretoria')) return 'Diretoria';
    return 'Comercial';
  };

  return (
    <header className={`h-16 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0]/40 flex items-center justify-between px-6 fixed top-0 right-0 z-20 shadow-xs transition-all duration-300 ${collapsed ? 'left-20' : 'left-68'}`}>

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

        {/* Supabase Database Connection Status */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full cursor-help hover:bg-slate-100/70 transition-all select-none"
          title={
            dbConnected === 'online' ? 'Banco de Dados Supabase Conectado com sucesso' : 
            dbConnected === 'offline' ? 'Erro de conexão com o Supabase (Tabela ou permissão ausente)' : 
            'Verificando conexão com o banco de dados...'
          }
        >
          <div className="relative flex">
            {dbConnected === 'online' && (
              <>
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            )}
            {dbConnected === 'offline' && (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 animate-pulse" />
            )}
            {dbConnected === 'checking' && (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-bounce" />
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-500 font-sans tracking-wide uppercase">
            {dbConnected === 'online' ? 'Supabase' : 
             dbConnected === 'offline' ? 'Supabase Off' : 
             'Conectando...'}
          </span>
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
        <div className="relative">
          <button
            onClick={() => setShowProfileCard(!showProfileCard)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-lg transition-all text-left cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-[#071757] text-[#D8B46A] flex items-center justify-center font-bold text-xs ring-2 ring-[#D8B46A]/30 flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-none pr-1">
              <p className="text-xs font-bold text-[#0F172A]">{currentUser}</p>
              <p className="text-[10px] text-[#94A3B8] font-medium">Fazenda Real MT</p>
            </div>
          </button>

          {showProfileCard && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-4 z-50 animate-fade-in text-slate-700">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="h-12 w-12 rounded-full bg-[#071757] text-[#D8B46A] flex items-center justify-center font-bold text-lg ring-2 ring-[#D8B46A]/30">
                  {initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">{currentUser}</h4>
                  <p className="text-[10px] text-[#D8B46A] uppercase font-bold tracking-wide mt-0.5">
                    {currentUserPapel || (currentUser.includes('Admin') ? 'Administrador ERP' : currentUser.includes('Wagner') ? 'Diretor Geral' : 'Gestor Comercial')}
                  </p>
                </div>
              </div>

              <div className="py-3 space-y-2.5 text-xs border-b border-[#E2E8F0]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Departamento</span>
                  <span className="font-semibold text-slate-800">
                    {getUserDepartment(currentUserPapel || (currentUser.includes('Admin') ? 'Administrador ERP' : currentUser.includes('Wagner') ? 'Diretor Geral' : 'Gestor Comercial'))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Matrícula</span>
                  <span className="font-mono text-slate-800">
                    {currentUserMatricula || (currentUser.includes('Admin') ? 'OX-00001' : currentUser.includes('Wagner') ? 'OX-15648' : 'OX-38519')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Unidade</span>
                  <span className="font-semibold text-slate-800">Planta MT</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 hover:bg-red-100/70 text-red-600 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                >
                  <LogOut size={14} />
                  Logoff
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
