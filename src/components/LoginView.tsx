/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  User, 
  QrCode, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import logoWhite from '@/assets/logo_white.png';

interface LoginViewProps {
  onLoginSuccess: (username: string) => void;
  onNavigateBack: () => void;
  logoUrl?: string;
}

export default function LoginView({ onLoginSuccess, onNavigateBack, logoUrl }: LoginViewProps) {
  const [email, setEmail] = useState('diego.silveira@oxcommerce.com.br');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor, insira o seu e-mail ou usuário.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor, digite a sua senha.');
      return;
    }

    setIsLoading(true);

    // Simula a autenticação e carregamento de permissões da base de dados
    setTimeout(() => {
      setIsLoading(false);
      // Extrai um nome amigável a partir do email
      let name = 'Diego Silveira';
      if (email.toLowerCase().includes('wagner')) {
        name = 'Wagner Targa';
      } else if (email.toLowerCase().includes('admin')) {
        name = 'Administrador do Sistema';
      }
      onLoginSuccess(name);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative select-none font-sans overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D8B46A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#071757]/20 rounded-full blur-3xl" />

      {/* Back button */}
      <button 
        onClick={onNavigateBack}
        className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-white transition-all text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar ao Início</span>
      </button>

      {/* Card container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#071757]/70 border border-[#D8B46A]/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative z-10"
      >
        
        {/* Brand identity */}
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl || logoWhite} alt="Ox-Commerce Logo" className="h-12 w-auto object-contain rounded-lg mb-2" />
          <p className="text-xs text-[#D8B46A] font-mono tracking-widest uppercase mt-1">Acesso ao Painel</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center space-x-2.5"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">E-mail ou Usuário</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                id="login-email-input"
                type="text"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@oxcommerce.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-[#D8B46A] focus:ring-1 focus:ring-[#D8B46A] transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Senha</label>
              <button 
                type="button" 
                className="text-[10px] text-slate-400 hover:text-[#D8B46A] font-bold"
                onClick={() => alert('Simulação: contate o suporte TI para recuperação de senhas.')}
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira sua senha"
                className="w-full pl-11 pr-10 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-[#D8B46A] focus:ring-1 focus:ring-[#D8B46A] transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#071757] hover:bg-[#182763] active:bg-[#05113b] text-white border border-[#D8B46A]/20 hover:border-[#D8B46A]/40 text-sm font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Carregando dados e acessos...</span>
              </>
            ) : (
              <span>Entrar no Sistema</span>
            )}
          </button>
        </form>

        {/* Small Notice */}
        <div className="mt-8 text-center text-[10px] text-slate-500">
          <p>Conexão corporativa criptografada (SSL-256).</p>
          <p className="mt-1">Agropecuária de Rastreabilidade Integrada S/A.</p>
        </div>

      </motion.div>
    </div>
  );
}
