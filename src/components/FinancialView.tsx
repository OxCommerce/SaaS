/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TransacaoFinanceira, ConciliacaoBancaria, SubMenuFinanceiro } from '../types';
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  RefreshCw,
  Search,
  Check,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface FinancialViewProps {
  transacoes: TransacaoFinanceira[];
  onAddTransacao: (trans: TransacaoFinanceira) => void;
  onLiquidateTransacao: (id: string) => void;
  conciliacoes: ConciliacaoBancaria[];
  onConciliarTransacao: (id: string, transId: string) => void;
  searchQuery: string;
  activeSubMenu: SubMenuFinanceiro;
  setActiveSubMenu: (sub: SubMenuFinanceiro) => void;
  viagens?: any[]; // ViagemLogistica[] representing active processes
}

export default function FinancialView({
  transacoes,
  onAddTransacao,
  onLiquidateTransacao,
  conciliacoes,
  onConciliarTransacao,
  searchQuery,
  activeSubMenu,
  setActiveSubMenu,
  viagens = []
}: FinancialViewProps) {
  
  // Modals status
  const [showAddTransModal, setShowAddTransModal] = useState(false);
  const [transForm, setTransForm] = useState({
    descricao: '',
    tipo: 'despesa' as 'receita' | 'despesa',
    subcategoria: 'Compra de Gado' as TransacaoFinanceira['subcategoria'],
    valor: 15000,
    conta: 'Banco do Brasil - Ag: 1244-X',
    processoId: ''
  });

  // Calculate dynamic metrics
  const receitasPagas = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'Pago')
    .reduce((sum, item) => sum + item.valor, 0);

  const receitasPendentes = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'Pendente')
    .reduce((sum, item) => sum + item.valor, 0);

  const despesasPagas = transacoes
    .filter(t => t.tipo === 'despesa' && t.status === 'Pago')
    .reduce((sum, item) => sum + item.valor, 0);

  const despesasPendentes = transacoes
    .filter(t => t.tipo === 'despesa' && t.status === 'Pendente')
    .reduce((sum, item) => sum + item.valor, 0);

  const saldoAtualBB = 2450000; // Simulated active ledger balance
  const inadimplenciaInBRL = transacoes
    .filter(t => t.status === 'Vencido')
    .reduce((sum, item) => sum + item.valor, 0);

  const handleAddTransSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novaTrans: TransacaoFinanceira = {
      id: 't-' + Math.random().toString(36).substr(2, 9),
      descricao: transForm.descricao,
      tipo: transForm.tipo,
      subcategoria: transForm.subcategoria,
      valor: Number(transForm.valor),
      dataVencimento: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      conta: transForm.conta,
      processoId: transForm.processoId || undefined
    };
    onAddTransacao(novaTrans);
    setShowAddTransModal(false);
    setTransForm({
      descricao: '',
      tipo: 'despesa',
      subcategoria: 'Compra de Gado',
      valor: 15000,
      conta: 'Banco do Brasil - Ag: 1244-X',
      processoId: ''
    });
  };

  // Filter lists based on search
  const contasAReceberList = transacoes.filter(
    (t) => t.tipo === 'receita' && t.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contasAPagarList = transacoes.filter(
    (t) => t.tipo === 'despesa' && t.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConcils = conciliacoes.filter((c) =>
    c.descricaoExtrato.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial Chart details
  const cashFlowTrend = [
    { name: 'Jan', Receitas: 320000, Despesas: 210000, Saldo: 110000 },
    { name: 'Fev', Receitas: 410000, Despesas: 240000, Saldo: 170000 },
    { name: 'Mar', Receitas: 510000, Despesas: 310000, Saldo: 200005 },
    { name: 'Abr', Receitas: 480000, Despesas: 290000, Saldo: 190000 },
    { name: 'Mai', Receitas: 620000, Despesas: 380000, Saldo: 240000 },
    { name: 'Jun', Receitas: receitasPagas, Despesas: despesasPagas, Saldo: receitasPagas - despesasPagas }
  ];

  const receiveCurve = [
    { name: 'À Vista', Valor: 880000 },
    { name: '30 Dias', Valor: 1450000 },
    { name: '60 Dias', Valor: 320000 },
    { name: 'Média Prazo', Valor: 450000 }
  ];

  return (
    <div id="financial-module-container" className="space-y-6">
      
      {/* Sub tabs bar */}
      <div className="flex border-b border-gray-250 bg-white p-2 rounded-xl shadow-xs space-x-1">
        <button
          id="fin-tab-receber"
          onClick={() => setActiveSubMenu('receber')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'receber' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          1. Contas a Receber ({contasAReceberList.filter(t=>t.status==='Pendente').length})
        </button>
        <button
          id="fin-tab-pagar"
          onClick={() => setActiveSubMenu('pagar')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'pagar' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          2. Contas a Pagar ({contasAPagarList.filter(t=>t.status==='Pendente').length})
        </button>
        <button
          id="fin-tab-fluxo"
          onClick={() => setActiveSubMenu('fluxo')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'fluxo' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          3. Demonstrativo de Caixa
        </button>
        <button
          id="fin-tab-conciliacao"
          onClick={() => setActiveSubMenu('conciliacao')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'conciliacao' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          4. Conciliação Bancária
        </button>
      </div>

      {/* Row 1: Finance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI: Recebíveis */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Receitas Pendentes</p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight font-sans">
              {receitasPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <span className="text-[10px] text-[#8A6D2E] font-semibold bg-[#FDF6E3] px-1.5 py-0.5 rounded font-mono">Contrato</span>
          </div>
        </div>

        {/* KPI: Despesas a Pagar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Previsão Contas a Pagar</p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-lg font-bold text-rose-700 tracking-tight font-sans text-right sm:text-left">
              {despesasPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded font-mono">Impostos/Gado</span>
          </div>
        </div>

        {/* KPI: Saldo Conciliado */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Caixa Disponível BB / BRAD</p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-lg font-bold text-[#182763] tracking-tight font-sans">
              {saldoAtualBB.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <span className="text-[10px] text-[#071757] font-semibold bg-[#F8F8FA] px-1.5 py-0.5 rounded font-mono">Real</span>
          </div>
        </div>

        {/* KPI: Inadimplencia ou Glosa */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-mono flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 animate-pulse" />
            <span>Encargos Vencidos</span>
          </p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-lg font-bold text-rose-800 tracking-tight font-sans">
              {inadimplenciaInBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded font-mono">Vencidos</span>
          </div>
        </div>

      </div>

      {/* ==================== 1. CONTAS A RECEBER ==================== */}
      {activeSubMenu === 'receber' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Contas a Receber (Vendas e Créditos)</h4>
              <p className="text-xs text-gray-500">Liquidação de invoices registradas de lotes expedidos para frigoríficos</p>
            </div>
            <button
              id="btn-add-trans-rec"
              onClick={() => {
                setTransForm({...transForm, tipo: 'receita', subcategoria: 'Venda de Bovinos'});
                setShowAddTransModal(true);
              }}
              className="flex items-center space-x-1 bg-[#071757] hover:bg-[#182763] px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Lançar Recebível</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                  <th className="p-3 pl-4">ID Processo</th>
                  <th className="p-3">Inflow Descritivo</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Conta Alocada</th>
                  <th className="p-3 text-right">Vencimento</th>
                  <th className="p-3 text-right">Valor Bruto</th>
                  <th className="p-3 text-center">Situação</th>
                  <th className="p-3 text-center">Liquidação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {contasAReceberList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4">
                      {t.processoId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8B46A]/10 text-[#7C6329] border border-[#D8B46A]/30 font-mono">
                          {t.processoId}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-gray-800">{t.descricao}</td>
                    <td className="p-3 text-gray-500">{t.subcategoria}</td>
                    <td className="p-3 flex items-center space-x-1.5 pt-4 text-[#182763] font-medium">
                      <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                      <span>{t.conta}</span>
                    </td>
                    <td className="p-3 text-right font-mono text-gray-500">{t.dataVencimento}</td>
                    <td className="p-3 text-right font-mono font-bold text-[#D8B46A]">
                      {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status === 'Pago' ? 'LIQUIDADO' : 'AGUARDANDO'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {t.status !== 'Pago' ? (
                        <button
                          id={`liquid-rec-${t.id}`}
                          onClick={() => onLiquidateTransacao(t.id)}
                          className="px-2 py-0.5 bg-[#071757] text-white rounded hover:bg-[#182763] font-bold text-[10px] cursor-pointer"
                        >
                          Liquidar Recebimento
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-mono">Doc. Pago</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 2. CONTAS A PAGAR ==================== */}
      {activeSubMenu === 'pagar' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Contas a Pagar (Custos, Fretes e Insumos)</h4>
              <p className="text-xs text-gray-500">Ordens de pagamento cadastradas de fretes contratuais e parcerias rurais</p>
            </div>
            <button
              id="btn-add-trans-pay"
              onClick={() => {
                setTransForm({...transForm, tipo: 'despesa', subcategoria: 'Compra de Gado'});
                setShowAddTransModal(true);
              }}
              className="flex items-center space-x-1 bg-rose-700 hover:bg-rose-800 px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Despesa</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                  <th className="p-3 pl-4">ID Processo</th>
                  <th className="p-3">Outflow Despesa</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Conta Alocada</th>
                  <th className="p-3 text-right">Vencimento</th>
                  <th className="p-3 text-right">Valor Débito</th>
                  <th className="p-3 text-center">Situação</th>
                  <th className="p-3 text-center">Liquidação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {contasAPagarList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4">
                      {t.processoId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8B46A]/10 text-[#7C6329] border border-[#D8B46A]/30 font-mono">
                          {t.processoId}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-gray-800">{t.descricao}</td>
                    <td className="p-3 text-gray-500">{t.subcategoria}</td>
                    <td className="p-3 flex items-center space-x-1.5 pt-4 text-[#182763] font-medium">
                      <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                      <span>{t.conta}</span>
                    </td>
                    <td className="p-3 text-right font-mono text-gray-500">{t.dataVencimento}</td>
                    <td className="p-3 text-right font-mono font-bold text-rose-700">
                      {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        t.status === 'Pago' ? 'bg-green-150 text-green-800' :
                        t.status === 'Vencido' ? 'bg-red-150 text-red-800 animate-pulse' :
                        'bg-amber-150 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {t.status !== 'Pago' ? (
                        <button
                          id={`liquid-pay-${t.id}`}
                          onClick={() => onLiquidateTransacao(t.id)}
                          className="px-2 py-0.5 bg-rose-700 text-white rounded hover:bg-rose-800 font-bold text-[10px] cursor-pointer"
                        >
                          Quitar Despesa
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-mono">Quitado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 3. DEMONSTRATIVO DE CAIXA ==================== */}
      {activeSubMenu === 'fluxo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main area plot */}
          <div className="lg:col-span-2 bg-white p-5 border border-gray-200 rounded-xl shadow-xs">
            <h4 className="text-sm font-bold text-gray-800">Evolução de Fluxo de Caixa Mensal</h4>
            <p className="text-xs text-gray-500 mt-1">Saldo acumulado e curva líquida de caixa de operações rurais.</p>
            
            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowTrend} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DEE1E9" vertical={false} />
                  <XAxis dataKey="name" stroke="#57628D" fontSize={11} tickLine={false} />
                  <YAxis stroke="#57628D" fontSize={11} tickFormatter={(val)=>`R$${val/1000}k`} tickLine={false} />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  <Legend iconSize={8} />
                  <Line type="monotone" dataKey="Receitas" stroke="#D8B46A" strokeWidth={3} dot={{ r: 4 }} name="Receita Bruta" />
                  <Line type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Despesas Totais" opacity={0.8} />
                  <Line type="monotone" dataKey="Saldo" stroke="#182763" strokeWidth={2} strokeDasharray="5 5" name="Saldo Líquido" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar graph of receive curve */}
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Faixas de Recebimento de Gado</h4>
              <p className="text-xs text-gray-500 mt-1">Grumo por prazo médio ponderado em dias</p>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={receiveCurve}>
                  <XAxis dataKey="name" stroke="#57628D" fontSize={11} tickLine={false} />
                  <YAxis stroke="#57628D" fontSize={11} tickFormatter={(v)=>`${v/1000}k`} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Valor" fill="#D8B46A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 bg-[#FDF6E3] border border-[#D8B46A]/30 rounded-lg text-xs text-[#8A6D2E] leading-relaxed mt-4">
              <span className="font-bold">Análise do Tesoureiro:</span> Prazo médio ponderado de recebimento em frigoríficos está em 18 dias, gerando cobertura segura para o fluxo de pagamento aos pecuaristas (30 dias).
            </div>
          </div>

        </div>
      )}

      {/* ==================== 4. CONCILIAÇÃO BANCÁRIA ==================== */}
      {activeSubMenu === 'conciliacao' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Conciliação Bancária Independente</h4>
              <p className="text-xs text-gray-500">Guarde correspondência entre extratos bancários brutos e transações do razão</p>
            </div>
            <span className="text-[10px] bg-[#F8F8FA] text-[#071757] font-mono font-bold px-2 py-0.5 rounded border border-[#DEE1E9]">CONEXÃO OFX ATIVA</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Bank Statement Entries */}
            <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-xs space-y-3">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-gray-100 pb-2">Lançamentos de Extrato Banco do Brasil</h5>
              
              <div className="space-y-3">
                {filteredConcils.map((c) => (
                  <div key={c.id} className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-slate-100/50 transition-all">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-gray-400">{c.data}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          c.status === 'Conciliado' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-700 mt-1">{c.descricaoExtrato}</p>
                    </div>

                    <div className="text-right flex items-center space-x-4">
                      <span className={`font-mono text-sm font-bold ${c.valorExtrato > 0 ? 'text-green-700' : 'text-rose-700'}`}>
                        {c.valorExtrato > 0 ? '+' : ''}{c.valorExtrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      
                      {c.status === 'Pendente' && (
                        <button
                          id={`make-concil-${c.id}`}
                          onClick={() => {
                            // Find any pending matching transaction to conciliate
                            const candidate = transacoes.find(t => t.status === 'Pendente');
                            if (candidate) {
                              onConciliarTransacao(c.id, candidate.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-[#071757] hover:bg-[#182763] text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Auto Conciliar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ledger Transactions Audit */}
            <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-xs space-y-3">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-gray-100 pb-2">Razão Financeiro Geral (Não Conciliados)</h5>
              
              <div className="space-y-2.5">
                {transacoes.filter(t => t.status === 'Pendente').map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400">RAZÃO ID: {item.id.toUpperCase()}</span>
                      <p className="text-xs font-bold text-gray-800 mt-0.5">{item.descricao}</p>
                      <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-mono">{item.subcategoria}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-xs font-bold block ${item.tipo === 'receita' ? 'text-green-700' : 'text-rose-700'}`}>
                        {item.tipo === 'receita' ? '+' : '-'}{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider font-mono mt-1 block">Sincronia devida</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== CREATE INFLOW/OUTFLOW MODAL ==================== */}
      {showAddTransModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <h3 className="text-sm font-bold text-gray-800">
                {transForm.tipo === 'receita' ? 'Lançar Recebível Próprio' : 'Registrar Despesa / Pagamento'}
              </h3>
              <button onClick={() => setShowAddTransModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                <IconX className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddTransSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Descrição da Operação</label>
                  <input
                    type="text"
                    required
                    value={transForm.descricao}
                    onChange={(e) => setTransForm({ ...transForm, descricao: e.target.value })}
                    placeholder="Ex: Compra de Fertilizantes / Recebível de Gado"
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-1 focus:ring-[#D8B46A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Valor do Contrato (R$)</label>
                  <input
                    type="number"
                    required
                    value={transForm.valor}
                    onChange={(e) => setTransForm({ ...transForm, valor: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Banco Originador</label>
                  <select
                    value={transForm.conta}
                    onChange={(e) => setTransForm({ ...transForm, conta: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Banco do Brasil - Ag: 1244-X">Banco do Brasil</option>
                    <option value="Bradesco - Ag: 0910">Bradesco s/a</option>
                    <option value="Itaú Personnalité">Banco Itaú</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Categoria</label>
                  <select
                    value={transForm.subcategoria}
                    onChange={(e) => setTransForm({ ...transForm, subcategoria: e.target.value as any })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Venda de Bovinos">Venda de Bovinos</option>
                    <option value="Compra de Gado">Compra de Gado</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Impostos">Impostos</option>
                    <option value="Mão de Obra">Mão de Obra</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Vincular Processo de Origem</label>
                  <select
                    value={transForm.processoId}
                    onChange={(e) => {
                      const procId = e.target.value;
                      const voyage = viagens.find((v: any) => v.id === procId);
                      setTransForm(prev => {
                        const updated = { ...prev, processoId: procId };
                        if (voyage) {
                          if (prev.descricao === '' || prev.descricao.startsWith('Receita Processo') || prev.descricao.startsWith('Despesa Processo')) {
                            updated.descricao = prev.tipo === 'receita'
                              ? `Receita Processo ${voyage.id} - ${voyage.destino}`
                              : `Despesa Processo ${voyage.id} - ${voyage.origem}`;
                          }
                          if (prev.subcategoria === 'Transporte') {
                            updated.valor = voyage.freteContratado;
                          } else if (prev.subcategoria === 'Compra de Gado' && prev.tipo === 'despesa') {
                            updated.valor = voyage.quantidadeCabecas * 3000;
                          } else if (prev.subcategoria === 'Venda de Bovinos' && prev.tipo === 'receita') {
                            updated.valor = voyage.quantidadeCabecas * 5000;
                          }
                        }
                        return updated;
                      });
                    }}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono"
                  >
                    <option value="">-- Sem vínculo (Transação Avulsa) --</option>
                    {viagens.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.id} | {v.origem} ➔ {v.destino} ({v.quantidadeCabecas} cab.)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTransModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#071757] hover:bg-[#182763] text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Confirmar Razão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Fallback icon definition since we handle modular icons
function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
