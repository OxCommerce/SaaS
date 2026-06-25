/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppConfig, DatabaseStats, SubMenuConfiguracoes } from '../types';
import {
  Settings,
  Database,
  Link,
  ShieldAlert,
  Users,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  UserCheck,
  Smartphone,
  Mail,
  Lock,
  Download,
  Upload,
  ImageIcon,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import logoWhiteAsset from '@/assets/logo_white.png';
import logoBlueAsset from '@/assets/logo_blue.png';

interface SettingsViewProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  dbStats: DatabaseStats;
  onRunBackup: () => void;
  activeSubMenu: SubMenuConfiguracoes;
  setActiveSubMenu: (sub: SubMenuConfiguracoes) => void;
  auditoriaLogs: Array<{ id: string; usuario: string; acao: string; horario: string; ip: string }>;
  usuarios: Array<{ id: string; nome: string; email: string; papel: string; status: string; matricula?: string }>;
  onToggleUserStatus: (id: string) => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export default function SettingsView({
  config,
  onUpdateConfig,
  dbStats,
  onRunBackup,
  activeSubMenu,
  setActiveSubMenu,
  auditoriaLogs,
  usuarios,
  onToggleUserStatus,
  onRefreshAll,
  isRefreshing
}: SettingsViewProps) {
  
  // Realtime fluctuating RAM usages for interactive DB view
  const [cpuUsage, setCpuUsage] = useState(dbStats.usoCPU);
  const [memUsage, setMemUsage] = useState(dbStats.usoMemoria);
  const [latency, setLatency] = useState(dbStats.latenciaMs);
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  // Fluctuating metric simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next > 5 && next < 85 ? next : prev;
      });
      setMemUsage((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next > 10 && next < 90 ? next : prev;
      });
      setLatency((prev) => {
        const delta = Math.floor(Math.random() * 4) - 2;
        const next = prev + delta;
        return next > 2 && next < 50 ? next : prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleBackupClick = () => {
    setIsBackupRunning(true);
    setTimeout(() => {
      onRunBackup();
      setIsBackupRunning(false);
    }, 2000);
  };

  const handleToggleIntegration = (key: keyof AppConfig['integracoes']) => {
    const updated = {
      ...config,
      integracoes: {
        ...config.integracoes,
        [key]: !config.integracoes[key]
      }
    };
    onUpdateConfig(updated);
  };

  const handleChangeThemeColor = (color: string) => {
    onUpdateConfig({
      ...config,
      corPrincipal: color
    });
  };

  // --- Logo upload handler ---
  const logoFileRef = useRef<HTMLInputElement>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, etc).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        onUpdateConfig({ ...config, logoUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div id="settings-view-wrapper" className="space-y-6">
      
      {/* Subnav links */}
      <div className="flex border-b border-gray-250 bg-white p-2 rounded-xl shadow-xs space-x-1 overflow-x-auto">
        <button
          id="set-sub-usuarios"
          onClick={() => setActiveSubMenu('usuarios')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
            activeSubMenu === 'usuarios' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Controle de Usuários</span>
        </button>
        <button
          id="set-sub-identidade"
          onClick={() => setActiveSubMenu('identidade')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
            activeSubMenu === 'identidade' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Identidade Visual</span>
        </button>
        <button
          id="set-sub-banco"
          onClick={() => setActiveSubMenu('banco')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
            activeSubMenu === 'banco' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Banco de Dados</span>
        </button>
        <button
          id="set-sub-integracoes"
          onClick={() => setActiveSubMenu('integracoes')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
            activeSubMenu === 'integracoes' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          <Link className="h-4 w-4" />
          <span>Integrações (API / SEFAZ)</span>
        </button>
        <button
          id="set-sub-auditoria"
          onClick={() => setActiveSubMenu('auditoria')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
            activeSubMenu === 'auditoria' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Logs de Auditoria</span>
        </button>
      </div>

      {/* ==================== 1. USUARIOS & PERFIL ==================== */}
      {activeSubMenu === 'usuarios' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Controle de Perfis Globais e Operadores</h4>
              <p className="text-xs text-gray-500">Credencias de funcionários e níveis hierárquicos de acesso para o gado</p>
            </div>
            <span className="text-[10px] bg-[#FDF6E3] text-[#8A6D2E] font-mono font-bold px-2 py-0.5 rounded border border-[#D8B46A]/30">GERENCIADOR DE GRUPOS</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                  <th className="p-3 pl-4">Matrícula</th>
                  <th className="p-3">Nome do Funcionário</th>
                  <th className="p-3">E-mail Corporativo</th>
                  <th className="p-3">Papel e Permissões</th>
                  <th className="p-3 text-center">Status Login</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[#071757]">{u.matricula || '-'}</td>
                    <td className="p-3 pl-4 font-bold text-gray-800 flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-[#182763] text-[#D8B46A] flex items-center justify-center font-bold font-mono text-[10px]">
                        {u.nome.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="pt-1.5">{u.nome}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-[#182763] font-bold rounded text-[10px]">
                        {u.papel}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        u.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        id={`toggle-user-${u.id}`}
                        onClick={() => onToggleUserStatus(u.id)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold border border-gray-300 cursor-pointer transition-all"
                      >
                        {u.status === 'Ativo' ? 'Inativar' : 'Re-ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 2. IDENTIDADE VISUAL ==================== */}
      {activeSubMenu === 'identidade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Logo & Visual customizations */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-800 font-sans">Customização da Identidade Rural S/A</h4>
              <p className="text-xs text-gray-500">Altere as cores principais das estâncias e logos rurais do ERP</p>
            </div>
 
            <div className="space-y-4 pt-2">
              
              {/* Preset Palette Colors Selection */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Cor Primária do Sistema</label>
                <div className="flex space-x-3 mt-2">
                  {[
                    { hex: '#071757', label: 'Azul Institucional' },
                    { hex: '#182763', label: 'Azul Secundário' },
                    { hex: '#57628D', label: 'Azul Suporte' },
                    { hex: '#D8B46A', label: 'Destaque Premium' }
                  ].map((colorObj) => (
                    <button
                      key={colorObj.hex}
                      id={`set-color-${colorObj.hex.replace('#', '')}`}
                      onClick={() => handleChangeThemeColor(colorObj.hex)}
                      className={`h-10 w-16 rounded-xl relative border cursor-pointer border-gray-300 flex flex-col justify-end p-1 text-[8px] font-bold text-white transition-all`}
                      style={{ backgroundColor: colorObj.hex }}
                    >
                      {config.corPrincipal === colorObj.hex && (
                        <CheckCircle2 className="h-4 w-4 text-white absolute top-1 right-1" />
                      )}
                      <span className="leading-none tracking-tight line-clamp-1">{colorObj.label}</span>
                    </button>
                  ))}
                </div>
              </div>
 
              {/* ---- Logo Upload Section ---- */}
              <div className="pt-2 space-y-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Logo da Empresa</label>
 
                {/* Preview card */}
                <div className="relative flex items-center justify-center bg-gradient-to-br from-[#071757] to-[#182763] rounded-xl border border-[#D8B46A]/20 p-6 shadow-inner overflow-hidden" style={{ minHeight: '90px' }}>
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #D8B46A 0%, transparent 60%)' }} />
                  {config.logoUrl ? (
                    <img
                      src={config.logoUrl}
                      alt="Preview Logo"
                      className="max-h-14 max-w-full object-contain relative z-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = logoWhiteAsset;
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center space-y-1 text-white/40 relative z-10">
                      <ImageIcon className="h-7 w-7" />
                      <span className="text-[10px] font-mono">Nenhuma logo definida</span>
                    </div>
                  )}
                  {/* Clear button */}
                  {config.logoUrl && (
                    <button
                      id="btn-clear-logo"
                      onClick={() => onUpdateConfig({ ...config, logoUrl: '' })}
                      title="Remover logo"
                      className="absolute top-2 right-2 h-6 w-6 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer z-20 shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
 
                {/* Upload from file */}
                <div>
                  <input
                    id="logo-file-input"
                    ref={logoFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                  <button
                    id="btn-upload-logo"
                    onClick={() => logoFileRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-[#071757] hover:bg-[#182763] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Carregar Arquivo de Logo</span>
                  </button>
                  <p className="text-[9px] text-gray-400 mt-1 font-mono">Formatos aceitos: PNG, JPG, SVG, WebP — máx. 5 MB</p>
                </div>
 
                {/* Presets row */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Logos Padrão do Sistema</p>
                  <div className="flex space-x-2">
                    <button
                      id="btn-preset-logo-white"
                      onClick={() => onUpdateConfig({ ...config, logoUrl: logoWhiteAsset })}
                      className={`flex-1 flex items-center justify-center space-x-1.5 px-2 py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                        config.logoUrl === logoWhiteAsset
                          ? 'bg-[#071757] border-[#D8B46A] text-white shadow'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#D8B46A]/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="h-4 w-4 rounded bg-[#071757] border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={logoWhiteAsset} alt="white" className="h-3 w-auto object-contain" />
                      </div>
                      <span>Logo Branca</span>
                    </button>
                    <button
                      id="btn-preset-logo-blue"
                      onClick={() => onUpdateConfig({ ...config, logoUrl: logoBlueAsset })}
                      className={`flex-1 flex items-center justify-center space-x-1.5 px-2 py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                        config.logoUrl === logoBlueAsset
                          ? 'bg-[#DEE1E9] border-[#57628D] text-[#071757] shadow'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#57628D]/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="h-4 w-4 rounded bg-white border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={logoBlueAsset} alt="blue" className="h-3 w-auto object-contain" />
                      </div>
                      <span>Logo Azul</span>
                    </button>
                  </div>
                </div>
 
                {/* Manual URL input */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Ou insira uma URL externa</p>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <input
                      id="logo-url-input"
                      type="text"
                      value={config.logoUrl.startsWith('data:') ? '' : config.logoUrl}
                      onChange={(e) => onUpdateConfig({ ...config, logoUrl: e.target.value })}
                      placeholder="https://seusite.com.br/logo.png"
                      className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#071757]"
                    />
                  </div>
                </div>
 
                {/* Reset to default */}
                <button
                  id="btn-reset-logo"
                  onClick={() => onUpdateConfig({ ...config, logoUrl: logoWhiteAsset })}
                  className="flex items-center space-x-1.5 text-[10px] text-gray-400 hover:text-[#D8B46A] font-mono transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Restaurar logo padrão (logo_white)</span>
                </button>
              </div>
 
            </div>
          </div>
 
          {/* Preset design layout preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Visualização do Tema Ativo</h4>
              <p className="text-xs text-gray-500">Design corporativo para terminais de venda</p>
            </div>
 
            <div className="p-4 rounded-xl border border-gray-300 mt-4 flex items-center justify-between" style={{ borderLeftColor: config.corPrincipal, borderLeftWidth: '8px' }}>
              <div className="flex items-center space-x-3">
                <img referrerPolicy="no-referrer" src={config.logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover shadow border border-gray-200" />
                <div>
                  <p className="font-bold text-xs text-gray-800">{config.sistemaNome}</p>
                  <p className="text-[10px] text-gray-500 font-mono">COR BASE: {config.corPrincipal}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#F8F8FA] border border-[#DEE1E9] text-[#D8B46A] font-bold rounded-full text-[10px] uppercase font-mono shadow-xs">Premium</span>
            </div>
 
            <p className="text-xs text-gray-400 mt-4 leading-relaxed font-sans font-normal italic">
              "A paleta e a marca modificadas serão replicadas imediatamente nos cabeçalhos operacionais, relatórios gerenciais e layouts de DANFE simulados."
            </p>
          </div>
 
        </div>
      )}

      {/* ==================== 3. BANCO DE DADOS MONITOR ==================== */}
      {activeSubMenu === 'banco' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts meters */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Monitor Computacional Drizzle / Cloud SQL</h4>
                <p className="text-xs text-gray-500">Latência de requisições de gado e persistência durável em tempo real</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#D8B46A] animate-ping"></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              
              {/* CPU */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1 relative overflow-hidden">
                <div className="h-1.5 bg-emerald-600 absolute bottom-0 left-0" style={{ width: `${cpuUsage}%` }}></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Processamento CPU</p>
                <h3 className="text-2xl font-bold font-mono text-gray-800">{cpuUsage}%</h3>
                <p className="text-[9px] text-gray-400">Instância db-f1-micro</p>
              </div>

              {/* RAM */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1 relative overflow-hidden">
                <div className="h-1.5 bg-[#182763] absolute bottom-0 left-0" style={{ width: `${memUsage}%` }}></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Uso de Memória</p>
                <h3 className="text-2xl font-bold font-mono text-gray-800">{memUsage}%</h3>
                <p className="text-[9px] text-gray-400">0.6 GB de 1.7 GB Alocados</p>
              </div>

              {/* Latency */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1 relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Latência Local</p>
                <h3 className="text-2xl font-bold font-mono text-[#182763]">{latency} ms</h3>
                <p className="text-[9px] text-gray-400">Tempo de Resposta DDL</p>
              </div>

            </div>

            {/* Simulated latency status bar */}
            <div className="p-3 bg-[#F8F8FA] border border-[#DEE1E9] text-[#071757] rounded-lg text-xs flex justify-between items-center">
              <span>Status do SQL: <strong>Relacional PostgreSQL Ativo</strong></span>
              <span className="font-mono text-[10px]">Pool: 15/20 conexões</span>
            </div>
          </div>

          {/* Backup area */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800"><span className="w-2 h-2 rounded-full bg-[#D8B46A] animate-pulse inline-block mr-1"></span>Resiliência de Negócio</h4>
              <p className="text-xs text-gray-500 mt-1">Cálculos de backup diário às 04:00 AM</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2 mt-4 font-mono">
              <p className="flex justify-between">
                <span className="text-gray-400">ÚLTIMO BACKUP:</span>
                <span className="font-bold text-gray-800">{dbStats.ultimoBackup}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">INTEGRIDADE:</span>
                <span className="font-bold text-green-700 uppercase">100% VERIFICADA</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">RETENÇÃO:</span>
                <span className="text-slate-700">30 Dias em Cold Storage</span>
              </p>
            </div>

            <button
              id="btn-trigger-backup"
              onClick={handleBackupClick}
              disabled={isBackupRunning}
              className={`w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-md transition-all uppercase cursor-pointer flex items-center justify-center space-x-1.5 mt-4 ${
                isBackupRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-950'
              }`}
            >
              <RotateCcw className={`h-4 w-4 ${isBackupRunning ? 'animate-spin' : ''}`} />
              <span>{isBackupRunning ? 'Gerando Backup...' : 'Iniciar Backup Manual'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================== 4. INTEGRACOES SEFAZ & BANCOS ==================== */}
      {activeSubMenu === 'integracoes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Portas de Integração API Exteriores</h4>
              <p className="text-xs text-gray-500">Conectores de sistemas SEFAZ estaduais, bancos, relatórios e WhatsApp</p>
            </div>
            
            {/* Status & Sync widgets moved from Header */}
            <div className="flex items-center space-x-3 self-stretch sm:self-auto justify-end">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F8F8FA] border border-[#DEE1E9] rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#D8B46A]" />
                <span className="text-[10px] font-mono font-medium text-[#071757]">SEFAZ ONLINE</span>
              </div>
              <button
                id="btn-sync-database"
                onClick={onRefreshAll}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-all focus:outline-none cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#D8B46A]' : ''}`} />
                <span>Sincronizar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Integracão 1: SEFAZ */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-42">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Conexão SEFAZ Nacional</h4>
                  <p className="text-[11px] text-gray-400 leading-snug mt-1">Sincronização de XML NFe, DANFE e autenticidade da assinatura digital</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black ${
                  config.integracoes.sefaz ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {config.integracoes.sefaz ? 'ATIVO' : 'DESATIVADO'}
                </span>
              </div>
              <button
                id="toggle-integ-sefaz"
                onClick={() => handleToggleIntegration('sefaz')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center w-full ${
                  config.integracoes.sefaz
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    : 'bg-[#FDF6E3] border-[#D8B46A]/30 text-[#8A6D2E] hover:bg-[#D8B46A]/10'
                }`}
              >
                {config.integracoes.sefaz ? 'Desconectar SEFAZ' : 'Conectar SEFAZ'}
              </button>
            </div>

            {/* Integracão 2: GTA ESTADUAL */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-42">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">SDA / GTA Estadual (INDEA)</h4>
                  <p className="text-[11px] text-gray-400 leading-snug mt-1">Interface com secretarias de agricultura estaduais para emissão de guias boiadeiras</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black ${
                  config.integracoes.gtaEstadual ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {config.integracoes.gtaEstadual ? 'ATIVO' : 'DESATIVADO'}
                </span>
              </div>
              <button
                id="toggle-integ-gta"
                onClick={() => handleToggleIntegration('gtaEstadual')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center w-full ${
                  config.integracoes.gtaEstadual
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    : 'bg-[#FDF6E3] border-[#D8B46A]/30 text-[#8A6D2E] hover:bg-[#D8B46A]/10'
                }`}
              >
                {config.integracoes.gtaEstadual ? 'Desconectar GTA' : 'Conectar GTA'}
              </button>
            </div>

            {/* Integracão 3: WHATSAPP RECEPIT */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-42">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">WhatsApp Dispatcher</h4>
                  <p className="text-[11px] text-gray-400 leading-snug mt-1">Disparar notificação e certidão em formato PDF de modo automático aos motoristas</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black ${
                  config.integracoes.whatsapp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {config.integracoes.whatsapp ? 'ATIVO' : 'DESATIVADO'}
                </span>
              </div>
              <button
                id="toggle-integ-whatsapp"
                onClick={() => handleToggleIntegration('whatsapp')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center w-full ${
                  config.integracoes.whatsapp
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-[#FDF6E3] border-[#D8B46A]/30 text-[#8A6D2E]'
                }`}
              >
                {config.integracoes.whatsapp ? 'Desconectar WhatsApp' : 'Conectar WhatsApp API'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== 5. AUDITORIA LOGS ==================== */}
      {activeSubMenu === 'auditoria' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Rastreabilidade e Logs de Auditoria Corporativa</h4>
              <p className="text-xs text-gray-500 font-sans">Histórico de ações críticas registradas por operários</p>
            </div>
            <span className="text-[10px] bg-red-50 text-red-800 font-mono font-bold px-2 py-0.5 rounded border border-red-200">ISO 27001 AUDIT</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs divide-y divide-gray-105">
            {auditoriaLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <span className="font-bold text-gray-800">{log.usuario}</span>
                  <p className="text-gray-500">{log.acao}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-gray-400 block">{log.horario}</span>
                  <span className="font-mono text-[10.5px] text-[#182763] bg-gray-100 hover:bg-gray-200/50 rounded inline-block px-1.5 py-0.2 mt-1">{log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
