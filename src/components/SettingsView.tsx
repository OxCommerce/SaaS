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
  ExternalLink,
  Search,
  Copy,
  Plus,
  Eye
} from 'lucide-react';
import logoWhiteAsset from '@/assets/logo_white.svg';
import logoBlueAsset from '@/assets/logo_blue.svg';

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

  // States for Image Bank
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [copiedImageId, setCopiedImageId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; category: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom image form states
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImageTitle, setCustomImageTitle] = useState('');
  const [customImageCategory, setCustomImageCategory] = useState('Pecuária');

  // Pre-loaded images list
  const [galleryImages, setGalleryImages] = useState([
    {
      id: 'img-pecuaria-1',
      title: 'Nelore em Pastagem Verde',
      category: 'Pecuária',
      url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-pecuaria-2',
      title: 'Gado Angus sob Sol da Manhã',
      category: 'Pecuária',
      url: 'https://images.unsplash.com/photo-1543590535-65a25e6e3c1a?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-agricultura-1',
      title: 'Colheitadeira em Campo de Grãos',
      category: 'Agricultura',
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-agricultura-2',
      title: 'Germinação de Soja e Solo Fértil',
      category: 'Agricultura',
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-logistica-1',
      title: 'Transporte Rodoviário de Carga',
      category: 'Logística',
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-logistica-2',
      title: 'Centro de Distribuição Integrado',
      category: 'Logística',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-tecnologia-1',
      title: 'Drone de Mapeamento Agrícola',
      category: 'Tecnologia',
      url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    },
    {
      id: 'img-corporativo-1',
      title: 'Escritório de Gestão Corporativa',
      category: 'Corporativo',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      author: 'Unsplash'
    }
  ]);

  const handleUseAsLogo = (url: string) => {
    onUpdateConfig({ ...config, logoUrl: url });
  };

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedImageId(id);
      setTimeout(() => setCopiedImageId(null), 2000);
    }).catch(err => {
      console.error('Falha ao copiar link: ', err);
    });
  };

  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) {
      alert('Por favor, insira uma URL de imagem válida.');
      return;
    }
    if (!customImageTitle.trim()) {
      alert('Por favor, insira um título para a imagem.');
      return;
    }
    const newImg = {
      id: `img-custom-${Date.now()}`,
      title: customImageTitle,
      category: customImageCategory,
      url: customImageUrl,
      author: 'Usuário'
    };
    setGalleryImages([newImg, ...galleryImages]);
    setCustomImageUrl('');
    setCustomImageTitle('');
    alert('Imagem adicionada com sucesso ao Banco de Imagens local.');
  };

  const filteredImages = galleryImages.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || img.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
        <>
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
              <div className="pt-2 space-y-4">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Logo da Empresa</label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/40 p-4 rounded-xl border border-gray-200">
                  {/* Col 1: Preview & Quick Actions */}
                  <div className="flex flex-col justify-between space-y-3">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">Visualização</span>
                    
                    {/* Compact Preview frame */}
                    <div className="relative flex-1 min-h-[100px] flex items-center justify-center bg-gradient-to-br from-[#071757] to-[#182763] rounded-xl border border-[#D8B46A]/20 p-4 shadow-inner overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #D8B46A 0%, transparent 60%)' }} />
                      {config.logoUrl ? (
                        <img
                          src={config.logoUrl}
                          alt="Preview Logo"
                          className="max-h-12 max-w-full object-contain relative z-10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = logoWhiteAsset;
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center space-y-1 text-white/30 relative z-10">
                          <ImageIcon className="h-6 w-6" />
                          <span className="text-[9px] font-mono">Sem logo</span>
                        </div>
                      )}
                    </div>

                    {/* Quick actions row */}
                    <div className="flex gap-2 justify-between">
                      {config.logoUrl && (
                        <button
                          id="btn-clear-logo"
                          onClick={() => onUpdateConfig({ ...config, logoUrl: '' })}
                          title="Remover logo"
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold border border-rose-200 cursor-pointer transition-all"
                        >
                          <X className="h-3 w-3" />
                          <span>Remover</span>
                        </button>
                      )}
                      <button
                        id="btn-reset-logo"
                        onClick={() => onUpdateConfig({ ...config, logoUrl: logoWhiteAsset })}
                        title="Restaurar padrão"
                        className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-200 cursor-pointer transition-all"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Restaurar</span>
                      </button>
                    </div>
                  </div>

                  {/* Col 2 & 3: Fields & Controls */}
                  <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
                    
                    {/* File Upload and Presets in a 2-col row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* File upload field */}
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">Upload de Arquivo</span>
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
                          className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-[#071757] border border-gray-300 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer h-[34px]"
                        >
                          <Upload className="h-3.5 w-3.5 text-gray-500" />
                          <span>Selecionar Imagem</span>
                        </button>
                        <p className="text-[8px] text-gray-400 font-mono leading-none">PNG, JPG, SVG, WebP (máx. 5MB)</p>
                      </div>

                      {/* Presets field */}
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">Modelos do Sistema</span>
                        <div className="flex space-x-2 h-[34px]">
                          <button
                            id="btn-preset-logo-white"
                            onClick={() => onUpdateConfig({ ...config, logoUrl: logoWhiteAsset })}
                            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              config.logoUrl === logoWhiteAsset
                                ? 'bg-[#071757] border-[#071757] text-white shadow-xs'
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>Branca</span>
                          </button>
                          <button
                            id="btn-preset-logo-blue"
                            onClick={() => onUpdateConfig({ ...config, logoUrl: logoBlueAsset })}
                            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              config.logoUrl === logoBlueAsset
                                ? 'bg-[#071757] border-[#071757] text-white shadow-xs'
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>Azul</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* URL Input field */}
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">Endereço de Imagem Externa (URL)</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                            <ExternalLink className="h-3 w-3" />
                          </span>
                          <input
                            id="logo-url-input"
                            type="text"
                            value={config.logoUrl.startsWith('data:') ? '' : config.logoUrl}
                            onChange={(e) => onUpdateConfig({ ...config, logoUrl: e.target.value })}
                            placeholder="https://seusite.com.br/logo.png"
                            className="w-full pl-7 pr-3 py-1.5 border border-gray-300 bg-white rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#071757]"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
 
            </div>
          </div>
 
          {/* Preset design layout preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800 font-sans">Visualização do Tema Ativo</h4>
              <p className="text-xs text-gray-500 font-sans">Design corporativo para terminais de venda</p>
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

        {/* ==================== BANCO DE IMAGENS ==================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#071757]/10 text-[#071757] rounded-lg">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Banco de Imagens & Mídias do Setor</h4>
                <p className="text-xs text-gray-500">Biblioteca integrada de imagens de alta resolução para uso operacional e customização</p>
              </div>
            </div>
            
            {/* Quick stats / count */}
            <span className="text-[10px] bg-slate-100 text-[#071757] font-mono font-bold px-2 py-1 rounded border border-slate-250">
              {filteredImages.length} IMAGENS DISPONÍVEIS
            </span>
          </div>

          {/* Search, filters, and addition bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left/Center: Filters & Search */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar imagens por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#071757] bg-white"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {['Todas', 'Pecuária', 'Agricultura', 'Logística', 'Corporativo', 'Tecnologia'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer border ${
                      activeCategory === cat
                        ? 'bg-[#071757] text-white border-[#071757] shadow-xs'
                        : 'bg-white text-gray-600 border-gray-250 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Toggle addition form */}
            <div className="lg:col-span-4 flex justify-end">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-750 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{showAddForm ? 'Fechar Cadastro' : 'Cadastrar Nova Imagem'}</span>
              </button>
            </div>

          </div>

          {/* Simulated Local Upload / Addition Form */}
          {showAddForm && (
            <form onSubmit={handleAddCustomImage} className="p-4 bg-emerald-50/55 border border-emerald-150 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center space-x-2 pb-1 border-b border-emerald-100/50">
                <Plus className="h-4 w-4 text-emerald-600" />
                <h5 className="text-xs font-bold text-emerald-800">Simulador de Upload Local para o Banco</h5>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-emerald-750 uppercase">Título da Imagem</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nelore sob o pôr do sol"
                    value={customImageTitle}
                    onChange={(e) => setCustomImageTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border border-emerald-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-emerald-755 uppercase">Categoria</label>
                  <select
                    value={customImageCategory}
                    onChange={(e) => setCustomImageCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-emerald-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {['Pecuária', 'Agricultura', 'Logística', 'Corporativo', 'Tecnologia'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* URL */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-emerald-755 uppercase">URL de Alta Resolução</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border border-emerald-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-lg text-xs font-bold cursor-pointer shadow transition-all"
                >
                  Confirmar Cadastro na Biblioteca
                </button>
              </div>
            </form>
          )}

          {/* Images Grid */}
          {filteredImages.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <ImageIcon className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs text-gray-500 font-bold">Nenhuma imagem encontrada</p>
              <p className="text-[10px] text-gray-400 font-sans">Experimente ajustar o termo de pesquisa ou trocar de categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="group bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  {/* Image container with hover overlay */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105 group-hover:opacity-85"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-305 flex items-center justify-center space-x-2 z-20">
                      <button
                        type="button"
                        onClick={() => setLightboxImage(img)}
                        title="Visualizar ampliado"
                        className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full hover:scale-110 transition-all cursor-pointer shadow-md"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(img.id, img.url)}
                        title="Copiar URL"
                        className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full hover:scale-110 transition-all cursor-pointer shadow-md"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Category pill */}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase z-10 border shadow-sm ${
                      img.category === 'Pecuária' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      img.category === 'Agricultura' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      img.category === 'Logística' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      img.category === 'Tecnologia' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      {img.category}
                    </span>

                    {/* Quick author tag */}
                    <span className="absolute bottom-1 right-2 text-[8px] text-white/50 font-mono tracking-tight bg-black/30 px-1 rounded">
                      {img.author}
                    </span>
                  </div>

                  {/* Body info */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-bold text-gray-700 line-clamp-1 group-hover:text-gray-950 transition-colors" title={img.title}>
                        {img.title}
                      </h5>
                      <p className="text-[9px] text-gray-400 font-mono truncate">{img.url}</p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Copy URL */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(img.id, img.url)}
                        className={`px-2 py-1.5 border rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          copiedImageId === img.id
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Copy className="h-3 w-3" />
                        <span>{copiedImageId === img.id ? 'Copiado!' : 'Copiar Link'}</span>
                      </button>

                      {/* Use as Logo */}
                      <button
                        type="button"
                        onClick={() => handleUseAsLogo(img.url)}
                        className="px-2 py-1.5 bg-[#071757] hover:bg-[#182763] text-white rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all shadow-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#D8B46A]" />
                        <span>Definir Logo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox / Modal de Zoom */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 h-8 w-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg z-50"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image Frame */}
              <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadados / Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-850 border border-slate-200 rounded text-[9px] font-bold uppercase tracking-wide">
                      {lightboxImage.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Resolução Nativa / UHD</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 mt-1">{lightboxImage.title}</h4>
                </div>

                {/* Lightbox Actions */}
                <div className="flex space-x-2 self-stretch sm:self-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(lightboxImage.url, lightboxImage.url)}
                    className="px-3 py-1.5 border border-gray-350 hover:bg-gray-50 text-gray-755 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedImageId === lightboxImage.url ? 'Copiado!' : 'Copiar URL'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleUseAsLogo(lightboxImage.url);
                      setLightboxImage(null);
                    }}
                    className="px-4 py-1.5 bg-[#071757] hover:bg-[#182763] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D8B46A]" />
                    <span>Usar como Logo Oficial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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
