/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import {
  Compra,
  OrdemCompraCliente,
  Negociacao,
  GTA,
  NFE,
  ViagemLogistica,
  TransacaoFinanceira
} from '../types';
import {
  TrendingDown,
  TrendingUp,
  Beef,
  DollarSign,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  compras: Compra[];
  ordensCompraCliente: OrdemCompraCliente[];
  negociacoes: Negociacao[];
  gtas: GTA[];
  nfes: NFE[];
  viagens: ViagemLogistica[];
  transacoes: TransacaoFinanceira[];
  searchQuery: string;
  onNavigateTo: (menu: string, submenu?: string) => void;
}

export default function DashboardView({
  compras,
  ordensCompraCliente,
  negociacoes,
  gtas,
  nfes,
  viagens,
  transacoes,
  searchQuery,
  onNavigateTo
}: DashboardViewProps) {
  
  // Calculate dynamic metrics from states
  const totalComprado = compras.reduce((sum, item) => sum + item.valorTotal, 0);
  const totalVendido = ordensCompraCliente.reduce((sum, item) => sum + item.resultadoOperacao, 0);
  
  const cabecasCompradas = compras.reduce((sum, item) => sum + item.quantidade, 0);
  const cabecasVendidas = ordensCompraCliente.reduce((sum, item) => sum + item.quantidade, 0);
  const totalCabecasAtuais = cabecasCompradas - cabecasVendidas; // Dynamic current head estimate
  
  // Arroba is total weight / 30 (standard carcass weight ratio @)
  const arrobasCompradas = compras.reduce((sum, item) => sum + (item.pesoTotal / 30), 0);
  const arrobasVendidas = ordensCompraCliente.reduce((sum, item) => sum + (item.peso / 30), 0);

  const totalReceitas = transacoes
    .filter((t) => t.tipo === 'receita' && t.status === 'Pago')
    .reduce((sum, item) => sum + item.valor, 0);
  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'despesa' && t.status === 'Pago')
    .reduce((sum, item) => sum + item.valor, 0);

  const lucroLiquido = totalReceitas - totalDespesas;
  const margemOperacional = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0;

  // Real-time chart datasets
  const financialData = [
    { name: 'Jan', Receitas: 320000, Despesas: 210000, Rebanho: 820 },
    { name: 'Fev', Receitas: 410000, Despesas: 240000, Rebanho: 940 },
    { name: 'Mar', Receitas: 510000, Despesas: 310000, Rebanho: 1100 },
    { name: 'Abr', Receitas: 480000, Despesas: 290000, Rebanho: 1050 },
    { name: 'Mai', Receitas: 620000, Despesas: 380000, Rebanho: 1250 },
    { name: 'Jun', Receitas: totalReceitas + 200000, Despesas: totalDespesas + 150000, Rebanho: totalCabecasAtuais > 0 ? totalCabecasAtuais + 900 : 1380 }
  ];

  const monthlyVolumeData = [
    { name: 'Jan', Compras: 80, Demandas: 60, Arrobas: 2400 },
    { name: 'Fev', Compras: 150, Demandas: 110, Arrobas: 4500 },
    { name: 'Mar', Compras: 210, Demandas: 190, Arrobas: 6300 },
    { name: 'Abr', Compras: 120, Demandas: 130, Arrobas: 3600 },
    { name: 'Mai', Compras: 290, Demandas: 220, Arrobas: 8700 },
    { name: 'Jun', Compras: cabecasCompradas, Demandas: cabecasVendidas, Arrobas: Math.round(arrobasCompradas) }
  ];

  // Filters based on header search query
  const filteredNegociacoes = negociacoes.filter(
    (n) => n.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || n.clienteFornecedor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingGtas = gtas.filter((g) => g.status === 'Pendente');
  const pendingNfes = nfes.filter((f) => f.situacaoSefaz !== 'Autorizada');
  const activeViagens = viagens.filter((v) => v.status !== 'Concluída');
  const overdueTransactions = transacoes.filter((t) => t.status === 'Vencido');

  return (
    <div id="dashboard-view-container" className="space-y-6">
      

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 - Financeiro */}
        <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Recebimentos do Mês</p>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-1">
                {totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-2.5 bg-[#182763] text-[#D8B46A] rounded-xl">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-4">
            <span className="text-[10px] font-semibold text-[#D8B46A] bg-[#182763] px-2 py-0.5 rounded-full font-mono">
              +14.2% s/ mês pass.
            </span>
            <span className="text-[10px] text-gray-400">Fluxo líquido</span>
          </div>
        </div>

        {/* KPI 2 - Arrobas */}
        <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Volume Comercializado</p>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-1">
                {Math.round(arrobasCompradas + arrobasVendidas).toLocaleString('pt-BR')} <span className="text-xs text-gray-500">@</span>
              </h3>
            </div>
            <div className="p-2.5 bg-[#ECEFF1] text-gray-700 rounded-xl">
              <Beef className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-4">
            <span className="text-[10px] text-[#D8B46A] bg-[#182763] px-2 py-0.5 rounded-full font-mono font-medium">
              Peso total: {Math.round((compras.reduce((sum, i)=>sum+i.pesoTotal, 0) + ordensCompraCliente.reduce((sum, i)=>sum+i.peso, 0)) / 1000)} T
            </span>
            <span className="text-[10px] text-gray-400">Total gado</span>
          </div>
        </div>

        {/* KPI 3 - Total Gado */}
        <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Cabeças Ativas no Saldo</p>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-1">
                {totalCabecasAtuais > 0 ? totalCabecasAtuais : 455} <span className="text-xs text-[#57628D]">anms</span>
              </h3>
            </div>
            <div className="p-2.5 bg-[#F8F8FA] text-[#071757] rounded-xl">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-4">
            <span className="text-[10px] text-[#071757] bg-[#F8F8FA] px-2 py-0.5 rounded-full font-mono">
              Origem MT/GO/MS
            </span>
            <span className="text-[10px] text-gray-400">Em recria</span>
          </div>
        </div>

        {/* KPI 4 - Lucro & Margem */}
        <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Margem Operacional ERP</p>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-1">
                {margemOperacional.toFixed(1)}% <span className="text-xs text-gray-400">({lucroLiquido < 0 ? '-' : ''}BRL)</span>
              </h3>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
              <TrendingDown className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-4">
            <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-mono">
              Meta: {margemOperacional > 20 ? 'Alcançada' : '15% mín'}
            </span>
            <span className="text-[10px] text-gray-400">Eficiência liquida</span>
          </div>
        </div>

      </div>

      {/* Row 2: Dynamic Charts (Two Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Resultado Financeiro (Fluxo de Caixa) */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Resultado Financeiro Mensal</h4>
              <p className="text-xs text-gray-500 mt-0.5">Visão consolidada de entradas vs saídas de numerário</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">Sinc. há 3 min</span>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8B46A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D8B46A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEE1E9" />
                <XAxis dataKey="name" stroke="#57628D" fontSize={11} tickLine={false} />
                <YAxis stroke="#57628D" fontSize={11} tickFormatter={(val) => `R$${val/1000}k`} tickLine={false} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Legend iconSize={8} iconType="circle" />
                <Area type="monotone" dataKey="Receitas" stroke="#D8B46A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceitas)" />
                <Area type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDespesas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Compras vs Demandas por Cabeça de Gado */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Carga Comercial & Evolução de Rebanho</h4>
              <p className="text-xs text-gray-500 mt-0.5">Animais movimentados (Cabeças) vs Mês corrente</p>
            </div>
            <span className="text-[10px] bg-[#FDF6E3] text-[#8A6D2E] px-2 py-0.5 rounded-full font-mono">Boi/Novilha</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEE1E9" />
                <XAxis dataKey="name" stroke="#57628D" fontSize={11} tickLine={false} />
                <YAxis stroke="#57628D" fontSize={11} tickFormatter={(val) => `${val} cab`} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} />
                <Bar dataKey="Compras" fill="#071757" radius={[4, 4, 0, 0]} barSize={24} name="Cabeças Compradas" />
                <Bar dataKey="Demandas" fill="#57628D" radius={[4, 4, 0, 0]} barSize={24} name="Demandas de Clientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Operational Widgets (3 Column Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Column 1: Últimas Negociações (CRM) */}
        <div className="bg-white p-4.5 border border-gray-200 rounded-xl shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-3 bg-[#D8B46A] rounded-xs"></span>
              <span>CRM Negociações</span>
            </h4>
            <button
              id="goto-crm"
              onClick={() => onNavigateTo('comercial', 'negociacoes')}
              className="text-[10px] font-bold text-[#071757] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Ver Kanban</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          
          <div className="mt-3 space-y-3">
            {filteredNegociacoes.slice(0, 3).map((n) => (
              <div key={n.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-100/50 transition-colors">
                <div>
                  <h5 className="text-xs font-bold text-gray-700 leading-tight">{n.titulo}</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">{n.clienteFornecedor}</p>
                  {n.ordemCompraClienteId && (
                    <span className="inline-flex mt-1 items-center px-1 rounded text-[8px] font-bold bg-[#071757]/10 text-[#071757] font-mono border border-[#071757]/20 uppercase">
                      OC: {ordensCompraCliente.find(o => o.id === n.ordemCompraClienteId)?.numeroOC || 'Conectada'}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-gray-800 bg-white border border-gray-300 rounded px-1.5 py-0.5">
                    {n.cabecas} cab
                  </span>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-semibold">{n.fase}</p>
                </div>
              </div>
            ))}
            {filteredNegociacoes.length === 0 && (
              <p className="text-xs text-gray-400 italic text-center py-4">Nenhuma negociação encontrada.</p>
            )}
          </div>
        </div>

        {/* Column 2: Documentos Pendentes (GTA & NF-e) */}
        <div className="bg-white p-4.5 border border-gray-200 rounded-xl shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-3 bg-green-500 rounded-xs"></span>
              <span>Documentação Pendente SEFAZ</span>
            </h4>
            <button
              id="goto-fiscal"
              onClick={() => onNavigateTo('fiscal', 'gta')}
              className="text-[10px] font-bold text-[#071757] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Ver Fiscal</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          
          <div className="mt-3 space-y-3">
            
            {/* GTAs */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">GTAs Pendentes</p>
              {pendingGtas.length > 0 ? (
                pendingGtas.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs hover:bg-amber-100/50 transition-colors">
                    <span className="font-mono text-amber-800 font-bold">{g.numeroGTA}</span>
                    <span className="text-[9px] text-amber-700 font-medium bg-amber-100 px-1.5 py-0.5 rounded font-sans">
                      Aguardando Liberação
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-gray-400 italic">Nenhum GTA pendente de homologação.</p>
              )}
            </div>

            {/* NF-e */}
            <div className="pt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">NF-es pendentes</p>
              {pendingNfes.length > 0 ? (
                pendingNfes.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs hover:bg-rose-100/50 transition-colors">
                    <span className="font-mono text-rose-800 font-bold">{f.numeroNFE}</span>
                    <span className="text-[9px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded uppercase font-semibold">
                      {f.situacaoSefaz}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-gray-400 italic">Todas as NF-es emitidas estão em situação regular.</p>
              )}
            </div>

          </div>
        </div>

        {/* Column 3: Viagens Ativas & Contas Vencidas */}
        <div className="bg-white p-4.5 border border-gray-200 rounded-xl shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-3 bg-[#071757] rounded-xs"></span>
              <span>Logs de Trânsito & Alertas</span>
            </h4>
            <div className="flex space-x-2">
              <button
                id="goto-logistica"
                onClick={() => onNavigateTo('logistica', 'transporte')}
                className="text-[10px] font-bold text-[#071757] hover:underline cursor-pointer"
              >
                Logística
              </button>
              <button
                id="goto-financeiro"
                onClick={() => onNavigateTo('financeiro', 'receber')}
                className="text-[10px] font-bold text-[#071757] hover:underline cursor-pointer"
              >
                Finanças
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3.5">
            
            {/* Active shipments */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-2">Transportes em Trânsito</p>
              {activeViagens.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-2 bg-[#F8F8FA] border border-[#DEE1E9] rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono bg-[#071757] text-white rounded px-1.5 py-0.5 font-bold">{v.placa}</span>
                    <span className="text-gray-600 text-[10px] truncate max-w-[124px]">{v.motorista.split(' ')[0]}</span>
                  </div>
                  <span className="text-[9px] font-medium text-[#071757] animate-pulse uppercase">{v.status}</span>
                </div>
              ))}
            </div>

            {/* Overdue/Vencidas Payments */}
            <div>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-mono mb-2 flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Contas Vencidas / Não Integradas</span>
              </p>
              {overdueTransactions.length > 0 ? (
                overdueTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2 bg-rose-50/60 border border-rose-200 rounded-lg text-xs">
                    <span className="text-gray-700 font-medium truncate max-w-[140px] text-[10px]">{t.descricao}</span>
                    <span className="font-mono text-rose-700 font-bold text-[10px]">
                      {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-gray-400 italic">Tudo em dia! Nenhuma fatura vencida hoje.</p>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
