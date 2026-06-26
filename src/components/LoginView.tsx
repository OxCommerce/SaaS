/**
 * LoginView — OxCommerce
 * Design System: AgroTech B2B | Verde Institucional
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { OxLogo } from './ui/Logo';

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
    setTimeout(() => {
      setIsLoading(false);
      let name = 'Diego Silveira';
      if (email.toLowerCase().includes('wagner')) name = 'Wagner Targa';
      else if (email.toLowerCase().includes('admin')) name = 'Administrador do Sistema';
      onLoginSuccess(name);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* ── Left Panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #05113b 0%, #071757 60%, #182763 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <OxLogo variant="white" className="h-10 w-auto" />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white font-display leading-tight mb-4">
            Gestão pecuária integrada,<br />do campo ao frigorífico
          </h2>
          <p className="text-blue-200 text-base leading-relaxed mb-8 max-w-sm">
            Rastreabilidade total, conformidade fiscal e controle operacional em uma única plataforma.
          </p>
          <div className="space-y-3">
            {[
              'Integração direta com SEFAZ & GTA',
              'Rastreamento logístico em tempo real',
              'Fluxo de caixa e conciliação bancária',
              'Dashboard executivo com BI pecuário',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-[#D8B46A] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <div className="relative z-10 flex flex-wrap gap-3">
          {['SEFAZ Homologado', 'SSL-256', 'LGPD Compliant', '99,9% Uptime'].map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#D8B46A] bg-[#D8B46A]/10 border border-[#D8B46A]/20 px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3 w-3 text-[#D8B46A]" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right Panel (login form) ── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#F8FAFC] px-6 py-12 relative">

        {/* Back button */}
        <button
          onClick={onNavigateBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#14532D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Início
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex justify-center">
          <OxLogo variant="blue" className="h-12 w-auto" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A] font-display mb-1.5">
              Acesso ao painel
            </h1>
            <p className="text-sm text-[#64748B]">
              Insira suas credenciais corporativas para continuar.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2.5"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email-input"
                className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide"
              >
                E-mail corporativo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="login-email-input"
                  type="text"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com.br"
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password-input"
                  className="block text-xs font-semibold text-[#475569] uppercase tracking-wide"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="text-xs text-[#D8B46A] hover:text-[#A9823A] font-semibold cursor-pointer transition-colors"
                  onClick={() => alert('Contate o suporte TI para recuperação de senhas.')}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="form-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando credenciais...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D8B46A]" />
              <span>Conexão criptografada com SSL-256</span>
            </div>
            <p className="text-[10px] text-[#CBD5E1]">
              © {new Date().getFullYear()} OxCommerce · Agropecuária de Rastreabilidade Integrada S/A
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
