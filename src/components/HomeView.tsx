/**
 * HomeView — OxCommerce Landing Page
 * Design System: Azul Institucional #071757 + Dourado #D8B46A
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  CheckCircle2,
  Lock,
  Globe,
  Zap,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Menu,
  X,
  Beef,
  Target,
  Eye,
  Heart,
  DollarSign,
  FileCheck,
  Award
} from 'lucide-react';
import { OxLogo } from './ui/Logo';

interface HomeViewProps {
  onNavigateToLogin: () => void;
  logoUrl?: string;
}

// ---------- Data ----------

const MODULES = [
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Módulo Comercial',
    desc: 'Gerencie compras, vendas, negociações e ordens de cliente com rastreabilidade completa do gado.',
    badge: 'Compras & Vendas',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Módulo Fiscal',
    desc: 'Emissão e gestão de GTA, CT-e e NF-e integradas com SEFAZ e órgãos estaduais de defesa agropecuária.',
    badge: 'GTA · CT-e · NF-e',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Financeiro',
    desc: 'Contas a pagar e receber, fluxo de caixa, conciliação bancária e controle de despesas operacionais.',
    badge: 'Fluxo de Caixa',
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Logística & Rastreamento',
    desc: 'Acompanhe viagens em tempo real, gerencie fretes, motoristas e rotas com rastreador integrado.',
    badge: 'Tempo Real',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Cadastros',
    desc: 'Base centralizada de clientes, fornecedores, parceiros, motoristas, veículos e centros de custo.',
    badge: 'Base Unificada',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Relatórios & BI',
    desc: 'Dashboards interativos, indicadores de performance pecuária e relatórios exportáveis em PDF e Excel.',
    badge: 'Analytics',
  },
];

const SECURITY_ITEMS = [
  { icon: <Lock className="h-5 w-5" />, title: 'Criptografia SSL-256', desc: 'Dados transmitidos com protocolo militar de criptografia ponta a ponta.' },
  { icon: <ShieldCheck className="h-5 w-5" />, title: 'LGPD Compliant', desc: 'Política de privacidade e tratamento de dados em conformidade com a LGPD.' },
  { icon: <Globe className="h-5 w-5" />, title: 'Homologado SEFAZ', desc: 'Integração direta com SEFAZ e sistemas estaduais de defesa agropecuária.' },
  { icon: <Zap className="h-5 w-5" />, title: 'Uptime 99,9%', desc: 'Infraestrutura em nuvem com redundância e backup automático diário.' },
  { icon: <FileCheck className="h-5 w-5" />, title: 'Auditoria Completa', desc: 'Log de todas as operações com histórico de alterações rastreável.' },
  { icon: <Award className="h-5 w-5" />, title: 'ISO 27001', desc: 'Certificação internacional de segurança da informação e gestão de riscos.' },
];

const METRICS = [
  { value: '12.000+', label: 'Animais Rastreados', icon: <Beef className="h-6 w-6" /> },
  { value: 'R$ 48M+', label: 'em Operações Geridas', icon: <DollarSign className="h-6 w-6" /> },
  { value: '98%', label: 'Satisfação dos Clientes', icon: <Star className="h-6 w-6" /> },
  { value: '99,9%', label: 'Uptime Garantido', icon: <Zap className="h-6 w-6" /> },
];

const MVP_VALUES = [
  {
    icon: <Target className="h-7 w-7" />,
    title: 'Missão',
    desc: 'Digitalizar e profissionalizar a gestão de operações agropecuárias, oferecendo tecnologia de ponta com usabilidade acessível ao produtor rural.',
  },
  {
    icon: <Eye className="h-7 w-7" />,
    title: 'Visão',
    desc: 'Ser a plataforma de referência em gestão AgroTech para o mercado pecuário brasileiro, com expansão para toda América Latina até 2027.',
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: 'Valores',
    desc: 'Transparência nas operações, rastreabilidade total, confiança no dado e compromisso com o produtor rural em cada decisão do produto.',
  },
];

// ---------- Sub-components ----------

function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-white/70 hover:text-[#D8B46A] transition-colors relative group"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#D8B46A] rounded-full transition-all group-hover:w-full" />
    </a>
  );
}

interface ModuleCardProps {
  key?: React.Key;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge: string;
  index: number;
}
function ModuleCard({ icon, title, desc, badge, index }: ModuleCardProps) {
  return (
    <div
      className="card card-hover p-6 flex flex-col gap-4 group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-xl bg-[#DEE1E9] text-[#071757] flex items-center justify-center group-hover:bg-[#071757] group-hover:text-[#D8B46A] transition-all">
          {icon}
        </div>
        <span className="badge badge-brand text-[10px]">{badge}</span>
      </div>
      <div>
        <h3 className="text-base font-bold text-[#071757] mb-1.5">{title}</h3>
        <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
      </div>
      <div className="mt-auto flex items-center text-xs font-semibold text-[#D8B46A] gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Saiba mais <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function CounterNumber({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState('0');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayed(value);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold text-white font-display transition-all duration-700">
      {displayed}
    </div>
  );
}

// ---------- Main Component ----------

export default function HomeView({ onNavigateToLogin, logoUrl }: HomeViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ nome: '', email: '', empresa: '', mensagem: '' });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 5000);
    setContactForm({ nome: '', email: '', empresa: '', mensagem: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA] font-sans">

      {/* ============ HEADER ============ */}
      <header
        id="home-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#071757]/98 backdrop-blur-md shadow-lg border-b border-white/10'
            : 'bg-transparent'
        }`}
        style={{ background: scrolled ? undefined : 'linear-gradient(180deg, rgba(7,23,87,0.95) 0%, transparent 100%)' }}
      >
        <div className="container-wide flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <OxLogo variant="white" showText={false} className="h-9 w-auto" />
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <NavItem label="Sobre" href="#sobre" />
            <NavItem label="Módulos" href="#modulos" />
            <NavItem label="Segurança" href="#seguranca" />
            <NavItem label="Contato" href="#contato" />
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="text-sm font-semibold text-white/80 hover:text-[#D8B46A] transition-colors px-4 py-2"
            >
              Entrar
            </button>
            <button
              id="btn-home-demo"
              onClick={onNavigateToLogin}
              className="btn-accent text-sm px-5 py-2"
            >
              Fale Conosco
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-white cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#071757] border-t border-white/10 px-6 py-4 flex flex-col gap-4 animate-fade-in">
            {['Sobre', 'Módulos', 'Segurança', 'Contato'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/70 hover:text-[#D8B46A] py-1"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); onNavigateToLogin(); }}
              className="btn-accent text-sm w-full mt-2"
            >
              Acessar o Sistema
            </button>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #05113b 0%, #071757 45%, #182763 80%, #57628D 100%)' }}
      >
        {/* Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#D8B46A]/8 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-[#D8B46A]/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-wide relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D8B46A]/15 border border-[#D8B46A]/30 text-[#D8B46A] text-xs font-semibold mb-8 animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8B46A] animate-pulse" />
              Plataforma homologada · SEFAZ & Defesa Agropecuária
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-display leading-tight mb-6 animate-fade-in-up delay-100">
              Gestão completa para
              <span className="block text-[#D8B46A] mt-1">operações pecuárias</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-10 animate-fade-in-up delay-200">
              OxCommerce é o ERP AgroTech que integra comercial, fiscal, financeiro e logística em uma única plataforma — com rastreabilidade total do gado do campo ao frigorífico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <button
                id="btn-hero-access"
                onClick={onNavigateToLogin}
                className="btn-accent px-8 py-3.5 text-base"
              >
                Acessar o Sistema
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#modulos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full text-base hover:bg-white/10 hover:border-[#D8B46A]/50 transition-all cursor-pointer"
              >
                Ver Módulos
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-12 animate-fade-in-up delay-400">
              {['Rastreabilidade GTA', 'Integração SEFAZ', 'SSL-256', 'LGPD'].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#D8B46A]" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs animate-bounce">
          <div className="h-8 w-px bg-[#D8B46A]/30" />
          <span>scroll</span>
        </div>
      </section>

      {/* ============ SOBRE ============ */}
      <section id="sobre" className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEE1E9] border border-[#C5CAD8] text-xs font-semibold text-[#071757] uppercase tracking-wide mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8B46A]" />
                Sobre o Sistema
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#071757] font-display leading-tight mb-6">
                Tecnologia que fala a língua do campo
              </h2>
              <p className="text-[#475569] text-base leading-relaxed mb-5">
                O OxCommerce nasceu da necessidade real de pecuaristas, corretores e frigoríficos de ter uma ferramenta que conecte todas as etapas da cadeia: da negociação inicial até a nota fiscal de venda.
              </p>
              <p className="text-[#475569] text-base leading-relaxed mb-8">
                Desenvolvido com foco em usabilidade, rastreabilidade e conformidade legal, o sistema garante que cada movimento de gado seja documentado, auditado e integrado aos órgãos competentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onNavigateToLogin} className="btn-primary px-6 py-3">
                  Começar Agora
                </button>
                <a href="#seguranca" className="btn-secondary px-6 py-3 text-center">
                  Ver Segurança
                </a>
              </div>
            </div>

            {/* Preview card */}
            <div className="relative">
              <div className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#DEE1E9] rounded-full -translate-y-32 translate-x-32 opacity-40" />
                <div className="relative z-10 space-y-4">
                  {[
                    { label: 'Compras Processadas Hoje', value: '12 operações', up: true },
                    { label: 'Cabeças em Trânsito', value: '847 animais', up: true },
                    { label: 'GTAs Emitidas no Mês', value: '38 documentos', up: false },
                    { label: 'Receita Consolidada', value: 'R$ 2,4M', up: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#DEE1E9] last:border-0">
                      <span className="text-sm text-[#64748B]">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#071757]">{item.value}</span>
                        <TrendingUp className={`h-3.5 w-3.5 ${item.up ? 'text-[#D8B46A]' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#DEE1E9] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#D8B46A] animate-pulse" />
                  <span className="text-xs text-[#64748B] font-medium">Sistema operando em tempo real</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSÃO, VISÃO E VALORES ============ */}
      <section className="section-padding bg-[#F8F8FA]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEE1E9] border border-[#C5CAD8] text-xs font-semibold text-[#071757] uppercase tracking-wide mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8B46A]" />
              Nossa Essência
            </span>
            <h2 className="text-3xl font-bold text-[#071757] font-display">Missão, Visão & Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MVP_VALUES.map((item, i) => (
              <div
                key={i}
                className="card card-hover p-7 text-center flex flex-col items-center gap-5 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-14 w-14 rounded-2xl bg-[#DEE1E9] text-[#071757] flex items-center justify-center group-hover:bg-[#071757] group-hover:text-[#D8B46A] transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#071757] font-display">{item.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MÓDULOS ============ */}
      <section id="modulos" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEE1E9] border border-[#C5CAD8] text-xs font-semibold text-[#071757] uppercase tracking-wide mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8B46A]" />
              Plataforma Completa
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#071757] font-display mb-4">
              Todos os módulos que você precisa
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto leading-relaxed">
              Uma plataforma integrada que cobre todo o ciclo operacional pecuário — da negociação ao relatório gerencial.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((mod, i) => (
              <ModuleCard key={i} icon={mod.icon} title={mod.title} desc={mod.desc} badge={mod.badge} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <button id="btn-modules-access" onClick={onNavigateToLogin} className="btn-primary px-8 py-3">
              Acessar todos os módulos
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ SEGURANÇA ============ */}
      <section
        id="seguranca"
        className="section-padding"
        style={{ background: 'linear-gradient(135deg, #05113b 0%, #071757 100%)' }}
      >
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8B46A]/15 border border-[#D8B46A]/25 text-[#D8B46A] text-xs font-semibold uppercase tracking-wide mb-4">
              <ShieldCheck className="h-3 w-3" />
              Segurança & Confiabilidade
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-4">
              Seus dados protegidos com padrão enterprise
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              Construído com as melhores práticas de segurança da informação para o agronegócio brasileiro.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECURITY_ITEMS.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:-translate-y-1 transition-all duration-200 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="h-10 w-10 rounded-xl bg-[#D8B46A]/15 text-[#D8B46A] flex items-center justify-center mb-4 group-hover:bg-[#D8B46A]/25 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INDICADORES ============ */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEE1E9] border border-[#C5CAD8] text-xs font-semibold text-[#071757] uppercase tracking-wide mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8B46A]" />
              Números que importam
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#071757] font-display">
              Resultados reais no campo
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map((m, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl text-center group animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  background: 'linear-gradient(135deg, #05113b, #071757)',
                }}
              >
                <div className="h-12 w-12 rounded-xl bg-[#D8B46A]/15 text-[#D8B46A] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#D8B46A]/25 transition-colors">
                  {m.icon}
                </div>
                <CounterNumber value={m.value} />
                <p className="text-slate-400 text-xs font-medium mt-2 leading-tight">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTATO ============ */}
      <section id="contato" className="section-padding bg-[#F8F8FA]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Info */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEE1E9] border border-[#C5CAD8] text-xs font-semibold text-[#071757] uppercase tracking-wide mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8B46A]" />
                Fale Conosco
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#071757] font-display leading-tight mb-6">
                Entre em contato com nossa equipe
              </h2>
              <p className="text-[#64748B] leading-relaxed mb-8">
                Ficou com dúvidas ou quer conhecer melhor o sistema? Nossa equipe técnica está pronta para apresentar a plataforma e tirar todas as suas dúvidas.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Phone className="h-4 w-4" />, label: 'Suporte', value: '(11) 4000-0000' },
                  { icon: <Mail className="h-4 w-4" />, label: 'E-mail', value: 'contato@oxcommerce.com.br' },
                  { icon: <MapPin className="h-4 w-4" />, label: 'Sede', value: 'São Paulo, SP — Brasil' },
                ].map((info, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-[#071757] text-[#D8B46A] flex items-center justify-center flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-medium">{info.label}</p>
                      <p className="text-sm font-semibold text-[#071757]">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="card p-8">
              {contactSent ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-[#DEE1E9] text-[#D8B46A] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#071757] mb-2">Mensagem enviada!</h3>
                  <p className="text-sm text-[#64748B]">Nossa equipe entrará em contato em até 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
                        Nome completo <span className="text-red-500">*</span>
                      </label>
                      <input type="text" required value={contactForm.nome}
                        onChange={(e) => setContactForm({ ...contactForm, nome: e.target.value })}
                        placeholder="Seu nome" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <input type="email" required value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="seu@email.com" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
                      Empresa / Fazenda
                    </label>
                    <input type="text" value={contactForm.empresa}
                      onChange={(e) => setContactForm({ ...contactForm, empresa: e.target.value })}
                      placeholder="Nome da sua empresa ou fazenda" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
                      Mensagem <span className="text-red-500">*</span>
                    </label>
                    <textarea required rows={4} value={contactForm.mensagem}
                      onChange={(e) => setContactForm({ ...contactForm, mensagem: e.target.value })}
                      placeholder="Conte-nos sobre sua operação e como podemos ajudar..."
                      className="form-input resize-none" />
                  </div>
                  <button id="btn-contact-submit" type="submit" className="btn-primary w-full py-3 text-base">
                    Enviar Mensagem
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                  <p className="text-[10px] text-center text-[#94A3B8]">
                    Seus dados são protegidos conforme a LGPD. Não fazemos spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: 'linear-gradient(135deg, #05113b 0%, #071757 100%)' }}>
        <div className="container-wide py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-2">
              <OxLogo variant="white" showText={false} className="h-8 w-auto mb-4 opacity-90" />
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-5">
                Plataforma SaaS de gestão AgroTech para o mercado pecuário brasileiro. Da negociação ao frigorífico, com rastreabilidade total.
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D8B46A] animate-pulse" />
                <span className="text-xs text-[#D8B46A] font-medium">Sistema operacional — 99,9% uptime</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Módulos</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {['Comercial', 'Fiscal (GTA/NF-e)', 'Financeiro', 'Logística', 'Relatórios'].map((l) => (
                  <li key={l}><a href="#modulos" className="hover:text-[#D8B46A] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal & Suporte</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {['Privacidade', 'Termos de Uso', 'Segurança', 'Suporte Técnico', 'Status do Sistema'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-[#D8B46A] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} OxCommerce · Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {['SEFAZ', 'LGPD', 'SSL-256', 'ISO 27001'].map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold text-[#D8B46A] bg-[#D8B46A]/10 border border-[#D8B46A]/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
