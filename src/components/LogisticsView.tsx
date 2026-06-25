/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViagemLogistica, SubMenuLogistica } from '../types';
import {
  Truck,
  MapPin,
  Clock,
  Battery,
  AlertOctagon,
  CheckCircle2,
  ListFilter,
  TrendingUp,
  Sliders,
  ChevronRight,
  Anchor,
  HelpCircle,
  Play
} from 'lucide-react';

interface LogisticsViewProps {
  viagens: ViagemLogistica[];
  onUpdateViagemStatus: (id: string, status: ViagemLogistica['status']) => void;
  onSimulateLocations: () => void;
  activeSubMenu: SubMenuLogistica;
  setActiveSubMenu: (sub: SubMenuLogistica) => void;
  searchQuery: string;
}

export default function LogisticsView({
  viagens,
  onUpdateViagemStatus,
  onSimulateLocations,
  activeSubMenu,
  setActiveSubMenu,
  searchQuery
}: LogisticsViewProps) {
  const [selectedViagem, setSelectedViagem] = useState<ViagemLogistica | null>(viagens[0] || null);
  
  // Dynamic metrics
  const viagensAtivasCount = viagens.filter((v) => v.status !== 'Concluída').length;
  const animaisEmTransito = viagens
    .filter((v) => v.status === 'Transporte')
    .reduce((sum, item) => sum + item.quantidadeCabecas, 0);
  const fretesContratadosInBRL = viagens.reduce((sum, item) => sum + item.freteContratado, 0);
  const entregasConcluidasCount = viagens.filter((v) => v.status === 'Concluída').length;

  const filteredViagens = viagens.filter((v) =>
    v.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.motorista.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.origem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.destino.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="logistics-module-container" className="space-y-6">
      
      {/* Sub tabs nav */}
      <div className="flex border-b border-gray-250 bg-white p-2 rounded-xl shadow-xs space-x-1">
        <button
          id="log-tab-transporte"
          onClick={() => setActiveSubMenu('transporte')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'transporte' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          1. Gestão de Transporte & Mapa
        </button>
        <button
          id="log-tab-viagens"
          onClick={() => setActiveSubMenu('viagens')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'viagens' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          2. Planejamento de Viagens ({viagensAtivasCount} Ativas)
        </button>
        <button
          id="log-tab-rastreamento"
          onClick={() => setActiveSubMenu('rastreamento')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'rastreamento' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          3. Rastreamento GPS Ativo
        </button>
        <button
          id="log-tab-fretes"
          onClick={() => setActiveSubMenu('fretes')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'fretes' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          4. Controle de Fretes Pecuários
        </button>
      </div>

      {/* Row 2: Logistics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">Viagens em Trânsito</p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight font-sans">
              {viagensAtivasCount} <span className="text-xs text-gray-400">Ativas</span>
            </h3>
            <span className="text-[10px] text-[#071757] font-semibold bg-[#F8F8FA] px-1.5 py-0.5 rounded font-mono">Rotas de Gado</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">Gado Vivo em Trânsito</p>
          <div className="flex justify-between items-baseline mt-2 font-mono">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight font-sans">
              {animaisEmTransito > 0 ? animaisEmTransito : 370} <span className="text-xs text-slate-400">cabs</span>
            </h3>
            <span className="text-[10px] text-[#8A6D2E] font-semibold bg-[#FDF6E3] px-1.5 py-0.5 rounded font-mono">Rastreado</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">Fretes Acumulados</p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight font-sans">
              {fretesContratadosInBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </h3>
            <span className="text-[10px] text-[#57628D] font-semibold bg-[#F8F8FA] px-1.5 py-0.5 rounded font-mono">Contratual</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">Entregas Concluídas</p>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight font-sans">
              {entregasConcluidasCount > 0 ? entregasConcluidasCount : 24} <span className="text-xs text-gray-400">Placas</span>
            </h3>
            <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded font-mono">Concluído</span>
          </div>
        </div>

      </div>

      {/* ==================== 1. GESTÃO DE TRANSPORTE & MAPA ==================== */}
      {(activeSubMenu === 'transporte' || activeSubMenu === 'rastreamento') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAP AREA */}
          <div className="lg:col-span-2 space-y-4">
            
            <div className="bg-white p-4 border border-gray-200 rounded-xl flex justify-between items-center shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Mapa Operacional de Rota de Boi</h4>
                <p className="text-xs text-gray-500">Localização instantânea dos bitrens de transporte de gado</p>
              </div>
              <button
                id="btn-simulate-gps"
                onClick={onSimulateLocations}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#071757] hover:bg-[#182763] rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Simular GPS Viagem</span>
              </button>
            </div>

            {/* SVG Interactive Map Design */}
            <div className="bg-slate-900 border border-slate-750 p-4 rounded-xl relative h-[420px] shadow-lg overflow-hidden flex items-center justify-center">
              
              {/* Background Geographic Outlines Simulating Brazil Heartland */}
              <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 300" preserveAspectRatio="none">
                {/* Simulated State Lines (MT, MS, GO, SP) */}
                <path d="M50,40 L120,30 L180,90 L140,150 L60,130 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M180,90 L260,80 L290,160 L200,180 L140,150 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M140,150 L200,180 L190,260 L90,240 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M200,180 L290,160 L320,240 L240,260 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Geographic label tags */}
              <div className="absolute top-[18%] left-[20%] text-[10px] font-mono font-bold text-[#D8B46A] select-none">MATO GROSSO (MT)</div>
              <div className="absolute top-[28%] left-[62%] text-[10px] font-mono font-bold text-[#D8B46A] select-none font-sans">GOIÁS (GO)</div>
              <div className="absolute top-[52%] left-[32%] text-[10px] font-mono font-bold text-[#D8B46A] select-none">MATO GROSSO DO SUL (MS)</div>
              <div className="absolute top-[68%] left-[68%] text-[10px] font-mono font-bold text-[#D8B46A] select-none">SÃO PAULO (SP)</div>

              {/* Constant routes representation lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Route 1: Rondonópolis (25, 30) -> Barretos (70, 75) */}
                <line x1="25" y1="30" x2="70" y2="75" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" className="animate-pulse" />
                {/* Route 2: Rio Verde (65, 40) -> Rondonópolis (25, 30) */}
                <line x1="65" y1="40" x2="25" y2="30" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                {/* Route 3: Redenção (15, 10) -> Marabá (15, 20) */}
                <line x1="15" y1="10" x2="15" y2="20" stroke="#071757" strokeWidth="0.8" />
              </svg>

              {/* Origin Pins */}
              <div className="absolute top-[30%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
                <span className="text-[8px] bg-slate-950 font-mono text-emerald-400 px-1 py-0.2 rounded mt-1 font-semibold border border-emerald-500/30">Rondonópolis</span>
              </div>

              <div className="absolute top-[40%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></span>
                <span className="text-[8px] bg-slate-950 font-mono text-amber-400 px-1 py-0.2 rounded mt-1 font-semibold border border-amber-500/30">Rio Verde</span>
              </div>

              <div className="absolute top-[75%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20"></span>
                <span className="text-[8px] bg-slate-950 font-mono text-rose-400 px-1 py-0.2 rounded mt-1 font-semibold border border-rose-500/30">Barretos (Frigorífico)</span>
              </div>

              {/* Live Truck Markers moving based on simulated coordinate state */}
              {viagens.filter(v=>v.status!=='Concluída').map((truck) => {
                const posX = truck.coordenadasAtuais.x;
                const posY = truck.coordenadasAtuais.y;
                return (
                  <div
                    key={truck.id}
                    onClick={() => setSelectedViagem(truck)}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10 transition-all duration-700`}
                  >
                    <div className="relative">
                      {/* Interactive ping */}
                      <span className="absolute -inset-1 rounded-full bg-[#D8B46A] opacity-75 animate-ping"></span>
                      <div className="relative p-1.5 bg-[#071757] rounded-full border-2 border-white shadow-xl hover:scale-110 transition-all">
                        <Truck className="h-4.5 w-4.5 text-white" />
                      </div>
                    </div>
                    {/* Plate tags on hover/always */}
                    <span className="text-[9px] bg-slate-900 border border-slate-700 font-mono font-bold text-white px-1.5 py-0.2 rounded-sm mt-1 shadow-md">
                      {truck.placa} ({truck.velocidadeKmH} km/h)
                    </span>
                  </div>
                );
              })}

            </div>

          </div>

          {/* SIDEBAR DETAIL PANELS */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col space-y-4">
            {selectedViagem ? (
              <>
                <div className="border-b border-gray-150 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-[#071757] uppercase tracking-wider font-mono">Bitrem Rastreado Ativo</span>
                    <h4 className="text-xs font-bold text-gray-800 mt-0.5">Motorista: {selectedViagem.motorista}</h4>
                    <span className="text-[10px] text-gray-400 font-mono font-semibold bg-gray-100 border border-gray-200 rounded px-1.5 py-0.2 mt-1 inline-block">Placa: {selectedViagem.placa}</span>
                  </div>
                </div>

                {/* Telemetry panel */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-2.5 bg-slate-50 border border-gray-200 rounded-lg text-xs">
                    <p className="text-[10px] text-gray-400 uppercase font-mono mb-1">Rastreador GPS</p>
                    <div className="flex items-center space-x-1">
                      <Battery className="h-4 w-4 text-[#D8B46A]" />
                      <span className="font-bold">{selectedViagem.bateriaRastreador}% Bateria</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-gray-200 rounded-lg text-xs">
                    <p className="text-[10px] text-gray-400 uppercase font-mono mb-1">Velocidade</p>
                    <span className="font-bold text-gray-800">{selectedViagem.velocidadeKmH} Km/h</span>
                  </div>
                </div>

                {/* Logistics timeline steps: Embarque, Transporte, Chegada, Descarga */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Fase da Viagem</h4>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-2.5 border border-gray-200 rounded-lg">
                    {/* Progress chips indicators */}
                    {['Embarque', 'Transporte', 'Chegada', 'Descarga'].map((st) => {
                      const isCurrent = selectedViagem.status === st;
                      return (
                        <div key={st} className="flex flex-col items-center">
                          <span className={`w-3 h-3 rounded-full border-2 ${
                            selectedViagem.status === st ? 'bg-[#071757] border-white' :
                            ['Transporte', 'Chegada', 'Descarga'].indexOf(selectedViagem.status) > ['Embarque', 'Transporte', 'Chegada', 'Descarga'].indexOf(st) ? 'bg-green-600 border-white' : 'bg-gray-200 border-transparent'
                          }`}></span>
                          <span className="text-[8px] text-gray-500 mt-1 uppercase font-semibold">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions to move shipment status */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Alterar Status Viagem</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      id={`set-status-transporte-${selectedViagem.id}`}
                      onClick={() => onUpdateViagemStatus(selectedViagem.id, 'Transporte')}
                      className="px-2.5 py-1.5 border border-[#DEE1E9] text-[#071757] bg-[#F8F8FA] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#DEE1E9]"
                    >
                      Em Trânsito
                    </button>
                    <button
                      id={`set-status-chegada-${selectedViagem.id}`}
                      onClick={() => onUpdateViagemStatus(selectedViagem.id, 'Chegada')}
                      className="px-2.5 py-1.5 border border-amber-200 text-amber-700 bg-amber-50 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-100"
                    >
                      Na Portaria
                    </button>
                    <button
                      id={`set-status-descarga-${selectedViagem.id}`}
                      onClick={() => onUpdateViagemStatus(selectedViagem.id, 'Descarga')}
                      className="px-2.5 py-1.5 border border-[#DEE1E9] text-[#57628D] bg-[#F8F8FA] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#DEE1E9]"
                    >
                      Descarga
                    </button>
                    <button
                      id={`set-status-concluida-${selectedViagem.id}`}
                      onClick={() => onUpdateViagemStatus(selectedViagem.id, 'Concluída')}
                      className="px-2.5 py-1.5 border border-green-200 text-green-700 bg-green-50 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-green-100"
                    >
                      Concluído
                    </button>
                  </div>
                </div>

                {/* Event Logs list */}
                <div className="pt-2 border-t border-gray-150">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-2">Histórico de Coletas/Chegada</h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedViagem.eventoLog.map((log, i) => (
                      <div key={i} className="text-[11px] leading-tight text-gray-600 bg-gray-50 border border-gray-150 p-2 rounded-lg">
                        <span className="font-bold text-slate-800">[ {log.status} ] - {log.dataHora}</span>
                        <p className="text-gray-400 text-[10.5px] mt-0.5">{log.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-10">Consulte algum bitrem boiadeiro para detalhes logísticos.</p>
            )}
          </div>

        </div>
      )}

      {/* ==================== 2. PLANEJAMENTO DE VIAGENS LIST ==================== */}
      {activeSubMenu === 'viagens' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Escalas e Viagens de Boiadeiros</h4>
              <p className="text-xs text-gray-400">Relação de motoristas escalados para transporte de gado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredViagens.map((v) => (
              <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 font-mono text-xs font-bold bg-slate-900 text-slate-100 rounded-sm">
                      PLACA: {v.placa}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      v.status === 'Concluída' ? 'bg-green-100 text-green-800 border' : 'bg-[#F8F8FA] text-[#071757] animate-pulse'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-800 mt-4">Motorista: {v.motorista}</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Veículo: <span className="font-semibold text-gray-700">{v.veiculo}</span></p>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                    <p><span className="text-gray-400 uppercase text-[9px] font-bold font-mono">Origem:</span> {v.origem}</p>
                    <p><span className="text-gray-400 uppercase text-[9px] font-bold font-mono">Destino:</span> {v.destino}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Lote Transportado</p>
                    <p className="font-bold text-gray-800">{v.quantidadeCabecas} cabeças</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Frete Contratual</p>
                    <p className="font-mono font-bold text-[#D8B46A]">
                      {v.freteContratado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 4. CONTROLE DE FRETES ==================== */}
      {activeSubMenu === 'fretes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Contratos de Fretes e Ajustes Boiadeiros</h4>
              <p className="text-xs text-gray-500">Gestão financeira e logística de transportadores terceirizados</p>
            </div>
            <span className="text-[10px] bg-[#F8F8FA] text-[#57628D] font-mono font-bold px-2 py-0.5 rounded border border-[#DEE1E9]">MODO COMPANHIA</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                  <th className="p-3 pl-4">Id Viagem</th>
                  <th className="p-3">Motorista</th>
                  <th className="p-3">Trajeto Operacional</th>
                  <th className="p-3 text-right">Qtd Gado</th>
                  <th className="p-3 text-right">Valor Líquido Frete</th>
                  <th className="p-3 text-center">Status Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {viagens.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-gray-800">TRIP-{v.id.toUpperCase()}</td>
                    <td className="p-3 font-semibold text-gray-800">{v.motorista}</td>
                    <td className="p-3 text-xs text-slate-500">{v.origem} → {v.destino}</td>
                    <td className="p-3 text-right font-mono">{v.quantidadeCabecas} cabeças</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">
                      {v.freteContratado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        v.status === 'Concluída' ? 'bg-green-100 text-green-800 border' : 'bg-[#F8F8FA] text-[#071757]'
                      }`}>
                        {v.status === 'Concluída' ? 'PAGO EM CONTA' : 'LANÇADO EM CONTAS A PAGAR'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
