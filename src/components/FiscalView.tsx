/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GTA, CTE, NFE, SubMenuFiscal, ViagemLogistica, Lote } from '../types';
import {
  FileText,
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Code,
  X,
  Heart,
  AlertCircle,
  Plus,
  Link as LinkIcon
} from 'lucide-react';

interface FiscalViewProps {
  gtas: GTA[];
  onResolveGTA: (id: string) => void;
  onAddGTA: (gta: GTA) => void;
  ctes: CTE[];
  onEmitCTE: (id: string) => void;
  onAddCTE: (cte: CTE) => void;
  nfes: NFE[];
  onEmitNFE: (nfe: NFE) => void;
  searchQuery: string;
  activeSubMenu: SubMenuFiscal;
  setActiveSubMenu: (sub: SubMenuFiscal) => void;
  viagens: ViagemLogistica[];
  lotes: Lote[];
}

export default function FiscalView({
  gtas,
  onResolveGTA,
  onAddGTA,
  ctes,
  onEmitCTE,
  onAddCTE,
  nfes,
  onEmitNFE,
  searchQuery,
  activeSubMenu,
  setActiveSubMenu,
  viagens,
  lotes
}: FiscalViewProps) {
  
  // Selected Doc for interactive detailing
  const [selectedGta, setSelectedGta] = useState<GTA | null>(gtas[0] || null);
  const [selectedCte, setSelectedCte] = useState<CTE | null>(ctes[0] || null);
  const [selectedNfe, setSelectedNfe] = useState<NFE | null>(nfes[0] || null);

  // Manual Creation expand/toggle states
  const [showAddGtaForm, setShowAddGtaForm] = useState(false);
  const [showAddCteForm, setShowAddCteForm] = useState(false);
  const [showAddNfeForm, setShowAddNfeForm] = useState(false);

  // Form State for manual GTA input
  const [newGtaForm, setNewGtaForm] = useState({
    numeroGTA: '351' + Math.floor(Math.random() * 900000 + 100000) + '287',
    origem: 'Rondonópolis - MT (Fazenda Santa Rita)',
    destino: 'Barretos - SP (Planta Frigorífico Minerva)',
    quantidadeAnimais: 120,
    observacoes: 'Gado Nelore para abate imediato. Vacinação anti-aftosa em dia.',
    processoId: ''
  });

  // Form State for manual CT-e input
  const [newCteForm, setNewCteForm] = useState({
    numeroCTE: 'CTE-' + Math.floor(Math.random() * 90000 + 10000),
    transportadora: 'TransGado Matogrosso',
    motorista: 'Valdecir Rodrigues Alves',
    veiculo: 'Bitrem Scania R440',
    placa: 'OQY-8E12',
    valorFrete: 4800,
    processoId: ''
  });

  // Form State for dynamic NF-e simulator
  const [newNfeForm, setNewNfeForm] = useState({
    numero: 'NFE-000109' + Math.floor(Math.random() * 1000 + 100),
    remetente: 'Fazenda Santa Rita (Ox Commerce S/A)',
    destinatario: 'Marfrig Global Foods Bataguassu',
    valor: 450000,
    processoId: ''
  });

  // Helper functions for autocompleting forms when linking a process (Viagem)
  const handleGtaProcessChange = (procId: string) => {
    if (!procId) {
      setNewGtaForm(prev => ({ ...prev, processoId: '' }));
      return;
    }
    const voyage = viagens.find(v => v.id === procId);
    if (voyage) {
      setNewGtaForm(prev => ({
        ...prev,
        processoId: procId,
        quantidadeAnimais: voyage.quantidadeCabecas,
        origem: `${voyage.origem} (Fazenda Santa Rita)`,
        destino: `${voyage.destino} (Planta Frigorífico)`,
        observacoes: `Nelore para abate imediato. Trânsito interestadual autorizado. Vacinação anti-aftosa em dia. Ref. Viagem ${voyage.id}.`
      }));
    }
  };

  const handleCteProcessChange = (procId: string) => {
    if (!procId) {
      setNewCteForm(prev => ({ ...prev, processoId: '' }));
      return;
    }
    const voyage = viagens.find(v => v.id === procId);
    if (voyage) {
      setNewCteForm(prev => ({
        ...prev,
        processoId: procId,
        transportadora: 'TransGado Matogrosso',
        motorista: voyage.motorista,
        veiculo: voyage.veiculo,
        placa: voyage.placa,
        valorFrete: voyage.freteContratado
      }));
    }
  };

  const handleNfeProcessChange = (procId: string) => {
    if (!procId) {
      setNewNfeForm(prev => ({ ...prev, processoId: '' }));
      return;
    }
    const voyage = viagens.find(v => v.id === procId);
    if (voyage) {
      const estimatedVal = voyage.quantidadeCabecas * 4800; // rough estimation for cattle value
      setNewNfeForm(prev => ({
        ...prev,
        processoId: procId,
        remetente: `Fazenda Santa Rita (Ox Commerce S/A - ${voyage.origem})`,
        destinatario: `Marfrig Global Foods (${voyage.destino})`,
        valor: estimatedVal
      }));
    }
  };

  const handleCreateGTA = (e: React.FormEvent) => {
    e.preventDefault();
    const randomizedSig = 'RAS-' + ['MT', 'GO', 'MS', 'PA'][Math.floor(Math.random() * 4)] + '-' + Math.floor(Math.random() * 900000 + 100000);
    const novaGTA: GTA = {
      id: 'gta-' + Math.random().toString(36).substr(2, 9),
      numeroGTA: newGtaForm.numeroGTA,
      origem: newGtaForm.origem,
      destino: newGtaForm.destino,
      quantidadeAnimais: Number(newGtaForm.quantidadeAnimais),
      dataEmissao: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      codigoRastreabilidade: randomizedSig,
      observações: newGtaForm.observacoes,
      processoId: newGtaForm.processoId || undefined
    };
    onAddGTA(novaGTA);
    setSelectedGta(novaGTA);
    setShowAddGtaForm(false);
    // Reset forms
    setNewGtaForm({
      numeroGTA: '351' + Math.floor(Math.random() * 900000 + 100000) + '287',
      origem: 'Rondonópolis - MT (Fazenda Santa Rita)',
      destino: 'Barretos - SP (Planta Frigorífico Minerva)',
      quantidadeAnimais: 120,
      observacoes: 'Gado Nelore para abate imediato. Vacinação anti-aftosa em dia.',
      processoId: ''
    });
  };

  const handleCreateCTE = (e: React.FormEvent) => {
    e.preventDefault();
    const novoCTE: CTE = {
      id: 'cte-' + Math.random().toString(36).substr(2, 9),
      numeroCTE: newCteForm.numeroCTE,
      transportadora: newCteForm.transportadora,
      motorista: newCteForm.motorista,
      veiculo: newCteForm.veiculo,
      placa: newCteForm.placa.toUpperCase(),
      valorFrete: Number(newCteForm.valorFrete),
      situacao: 'Pendente',
      dataEmissao: new Date().toISOString().split('T')[0],
      processoId: newCteForm.processoId || undefined
    };
    onAddCTE(novoCTE);
    setSelectedCte(novoCTE);
    setShowAddCteForm(false);
    // Reset forms
    setNewCteForm({
      numeroCTE: 'CTE-' + Math.floor(Math.random() * 90000 + 10000),
      transportadora: 'TransGado Matogrosso',
      motorista: 'Valdecir Rodrigues Alves',
      veiculo: 'Bitrem Scania R440',
      placa: 'OQY-8E12',
      valorFrete: 4500,
      processoId: ''
    });
  };

  const handleCreateNFE = (e: React.FormEvent) => {
    e.preventDefault();
    const randomizedSig = 'SHA256: ' + Math.random().toString(16).substr(2, 16).toUpperCase() + 'D1C2298FBEFEAEE';
    const novaNfe: NFE = {
      id: 'nfe-' + Math.random().toString(36).substr(2, 9),
      numeroNFE: newNfeForm.numero,
      emissao: new Date().toISOString().split('T')[0],
      remetente: newNfeForm.remetente,
      destinatario: newNfeForm.destinatario,
      xmlContent: `<?xml version="1.5" encoding="UTF-8"?><infNfe Versao="4.00"><emit><xNome>${newNfeForm.remetente}</xNome></emit><dest><xNome>${newNfeForm.destinatario}</xNome></dest><total><vProd>${newNfeForm.valor}.00</vProd></total></infNfe>`,
      danfeSimulado: 'NOTA FISCAL ELETRÔNICA EMITIDA COM PROTOCOLO DE AUTORIZAÇÃO SEFAZ',
      assinaturaDigital: randomizedSig,
      situacaoSefaz: 'Autorizada',
      valorTotal: Number(newNfeForm.valor),
      processoId: newNfeForm.processoId || undefined
    };
    onEmitNFE(novaNfe);
    setSelectedNfe(novaNfe);
    setShowAddNfeForm(false);
    // Reset forms
    setNewNfeForm({
      numero: 'NFE-000109' + Math.floor(Math.random() * 1000 + 100),
      remetente: 'Fazenda Santa Rita (Ox Commerce S/A)',
      destinatario: 'Marfrig Global Foods Bataguassu',
      valor: 450000,
      processoId: ''
    });
  };

  const filteredGtas = gtas.filter(g =>
    g.numeroGTA.includes(searchQuery) ||
    g.origem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.destino.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCtes = ctes.filter(c =>
    c.numeroCTE.includes(searchQuery) ||
    c.motorista.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.placa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNfes = nfes.filter(f =>
    f.numeroNFE.includes(searchQuery) ||
    f.remetente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.destinatario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="fiscal-module-container" className="space-y-6 animate-fade-in">
      
      {/* Sub tabs bar */}
      <div className="flex border-b border-gray-250 bg-white p-2 rounded-xl shadow-xs space-x-1">
        <button
          id="fiscal-tab-gta"
          onClick={() => setActiveSubMenu('gta')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'gta' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          Guia de Trânsito Animal (GTA)
        </button>
        <button
          id="fiscal-tab-cte"
          onClick={() => setActiveSubMenu('cte')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'cte' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          Conhecimento de Frete (CT-e)
        </button>
        <button
          id="fiscal-tab-nfe"
          onClick={() => setActiveSubMenu('nfe')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubMenu === 'nfe' ? 'bg-[#071757] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
          }`}
        >
          Nota Fiscal Eletrônica (NF-e)
        </button>
      </div>

      {/* ==================== 1. GTA (GUIA DE TRÂNSITO) ==================== */}
      {activeSubMenu === 'gta' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main List Table */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Header / Trigger */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Follow up das GTA's</h4>
                <p className="text-xs text-gray-500">Gestão e monitoramento das GTA's para liberação e rastreabilidade do transporte animal.</p>
              </div>
              <button
                onClick={() => setShowAddGtaForm(!showAddGtaForm)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#071757] hover:bg-[#182763] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Lançar GTA</span>
              </button>
            </div>

            {/* Manual GTA Launch Form */}
            {showAddGtaForm && (
              <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 font-sans w-full max-w-2xl max-h-[90vh] overflow-y-auto text-left flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Entrada de Documentação</span>
                      <h4 className="text-base font-bold text-slate-800 mt-0.5">Lançamento de Guia Sanitária</h4>
                    </div>
                    <button 
                      onClick={() => setShowAddGtaForm(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateGTA} className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vincular Processo de Origem (Viagem Logística)</label>
                        <select
                          value={newGtaForm.processoId}
                          onChange={(e) => handleGtaProcessChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-medium"
                        >
                          <option value="">-- Selecionar viagem ativa para autocompletar (Opcional) --</option>
                          {viagens.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.id} - {v.motorista} ({v.origem} → {v.destino} | {v.quantidadeCabecas} cab.)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Número Global da GTA</label>
                        <input
                          required
                          type="text"
                          value={newGtaForm.numeroGTA}
                          onChange={(e) => setNewGtaForm({...newGtaForm, numeroGTA: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-mono"
                          placeholder="Ex: 351403212876612"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade de Animais (Cab.)</label>
                        <input
                          required
                          type="number"
                          value={newGtaForm.quantidadeAnimais}
                          onChange={(e) => setNewGtaForm({...newGtaForm, quantidadeAnimais: Number(e.target.value)})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Município e Fazenda Origem</label>
                        <input
                          required
                          type="text"
                          value={newGtaForm.origem}
                          onChange={(e) => setNewGtaForm({...newGtaForm, origem: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                          placeholder="Ex: Rondonópolis - MT (Fazenda Santa Rita)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Frigorífico ou Fazenda Destino</label>
                        <input
                          required
                          type="text"
                          value={newGtaForm.destino}
                          onChange={(e) => setNewGtaForm({...newGtaForm, destino: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                          placeholder="Ex: Barretos - SP (Planta Frigorífico Minerva)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Observações Sanitárias</label>
                      <textarea
                        rows={3}
                        value={newGtaForm.observacoes}
                        onChange={(e) => setNewGtaForm({...newGtaForm, observacoes: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-sans"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                      <button 
                        type="button" 
                        onClick={() => setShowAddGtaForm(false)}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 bg-[#071757] hover:bg-[#182763] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                    <th className="p-3 pl-4">ID Processo</th>
                    <th className="p-3">Número GTA</th>
                    <th className="p-3 text-right">Quantidade</th>
                    <th className="p-3">Origem</th>
                    <th className="p-3">Destino</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredGtas.map((g) => (
                    <tr
                      key={g.id}
                      onClick={() => setSelectedGta(g)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedGta?.id === g.id ? 'bg-[#FDF6E3]/20 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 pl-4">
                        {g.processoId ? (
                          <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] font-bold rounded">
                            {g.processoId}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium font-mono text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3 pl-4 font-mono font-bold text-gray-800">{g.numeroGTA}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">{g.quantidadeAnimais} Cab.</td>
                      <td className="p-3 text-gray-500 truncate max-w-[130px]">{g.origem.split('(')[0]}</td>
                      <td className="p-3 text-gray-500 truncate max-w-[130px]">{g.destino.split('(')[0]}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          g.status === 'Homologado' ? 'bg-green-100 text-green-800' :
                          g.status === 'Emitido' ? 'bg-[#F8F8FA] text-[#071757]' :
                          g.status === 'Vencido' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {g.status === 'Pendente' ? (
                          <button
                            id={`homologar-gta-${g.id}`}
                            onClick={() => {
                              onResolveGTA(g.id);
                              if (selectedGta?.id === g.id) {
                                setSelectedGta({ ...selectedGta, status: 'Homologado' });
                              }
                            }}
                            className="px-2 py-0.5 bg-[#071757] text-white hover:bg-[#182763] rounded font-bold text-[10px] cursor-pointer"
                          >
                            Homologar
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-mono">Sincronizado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline and details of selected GTA */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            {selectedGta ? (
              <>
                <div className="border-b border-gray-150 pb-3">
                  <span className="text-[9px] font-bold text-[#D8B46A] uppercase tracking-wider font-mono">Guia Ativa do Lote</span>
                  <h4 className="text-xs font-bold text-gray-800 mt-1">Rastreamento da Guia #{selectedGta.numeroGTA}</h4>
                  <p className="text-[10.5px] text-gray-500 mt-1">Código único: <span className="font-mono font-bold text-gray-700">{selectedGta.codigoRastreabilidade}</span></p>
                </div>

                <div className="space-y-4">
                  {/* Timeline representation */}
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Timeline de Auditoria Sanitária</h5>
                  
                  <div className="relative border-l-2 border-[#D8B46A]/50 pl-4 space-y-5 ml-2 pt-1">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] rounded-full bg-[#071757] p-1 text-white border-2 border-white">
                        <CheckCircle className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className="font-bold text-gray-800">1. Emissão de GTA Digital</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">ID: {selectedGta.dataEmissao} - Assinatura INDEA</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] rounded-full p-1 text-white border-2 border-white ${
                        selectedGta.status === 'Homologado' || selectedGta.status === 'Emitido' ? 'bg-[#071757]' : 'bg-gray-300'
                      }`}>
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className={`font-bold ${
                          selectedGta.status === 'Homologado' || selectedGta.status === 'Emitido' ? 'text-gray-800' : 'text-gray-400'
                        }`}>2. Inspeção Clínico-Veterinária</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Vacina aftosa + brucelose auditadas no lote</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] rounded-full p-1 text-white border-2 border-white ${
                        selectedGta.status === 'Homologado' ? 'bg-[#071757]' : 'bg-gray-300'
                      }`}>
                        <Truck className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className={`font-bold ${
                          selectedGta.status === 'Homologado' ? 'text-gray-800' : 'text-gray-400'
                        }`}>3. Liberação e Trânsito Homologado</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {selectedGta.status === 'Homologado' ? 'Autorizado trânsito interestadual de gado' : 'Aguardando chancela estadual'}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
                    <p className="text-[10px] font-mono font-bold text-gray-500 uppercase">Observações da GTA:</p>
                    <p className="text-xs text-gray-600 mt-1 italic leading-relaxed">
                      "{selectedGta.observações}"
                    </p>
                  </div>

                  {/* Unified Process Traceability Pane */}
                  {selectedGta.processoId && (() => {
                    const voyage = viagens.find(v => v.id === selectedGta.processoId);
                    const lot = lotes.find(l => 
                      l.quantidade === selectedGta.quantidadeAnimais ||
                      (selectedGta.processoId === 'PRC-260610-MT-0001' && l.id === 'l-1') ||
                      (selectedGta.processoId === 'PRC-260612-GO-0002' && l.id === 'l-2') ||
                      (selectedGta.processoId === 'PRC-260614-PA-0003' && l.id === 'l-3')
                    );
                    const linkedCte = ctes.find(c => c.processoId === selectedGta.processoId);
                    const linkedNfe = nfes.find(n => n.processoId === selectedGta.processoId);
                    
                    return (
                      <div className="p-3 bg-[#071757]/5 border border-[#071757]/10 rounded-lg space-y-2.5">
                        <div className="flex items-center space-x-1.5 font-bold text-[#071757] text-xs">
                          <LinkIcon className="h-3.5 w-3.5 text-[#D8B46A]" />
                          <span>Rastreabilidade de Dados do Processo</span>
                        </div>
                        <p className="text-[10.5px] text-gray-600 leading-normal">
                          Esta guia foi emitida sob o fluxo do processo unificado de faturamento e transporte <strong>{selectedGta.processoId}</strong>.
                        </p>
                        
                        <div className="border-t border-gray-200/60 pt-2 space-y-1.5 text-[10px] text-gray-500">
                          <div>
                            <span className="font-semibold text-gray-700">Origem da Rota:</span> Herdada da contratação da Viagem Logística <strong>{voyage?.id}</strong> (Veículo: {voyage?.veiculo} | Placa: {voyage?.placa} | Condutor: {voyage?.motorista}).
                          </div>
                          {lot && (
                            <div>
                              <span className="font-semibold text-gray-700">Origem dos Animais:</span> Herdada do Lote <strong>{lot.codigoLote}</strong> ({lot.quantidade} Cab. faturadas do proprietário {lot.proprietario} - {lot.origem}).
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5 items-center mt-2.5 pt-2 border-t border-gray-150">
                            <span className="font-bold text-gray-600 mr-0.5 text-[9px] uppercase tracking-wider">Documentos do Fluxo:</span>
                            <span className="px-1.5 py-0.2 bg-green-50 text-green-700 font-mono font-bold rounded text-[9px] border border-green-200">
                              GTA-ATIVA
                            </span>
                            <span className={`px-1.5 py-0.2 font-mono rounded text-[9px] border ${
                              linkedCte ? 'bg-green-50 text-green-700 border-green-200 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}>
                              CT-e: {linkedCte ? linkedCte.numeroCTE : 'Pendente'}
                            </span>
                            <span className={`px-1.5 py-0.2 font-mono rounded text-[9px] border ${
                              linkedNfe ? 'bg-green-50 text-green-700 border-green-200 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}>
                              NF-e: {linkedNfe ? linkedNfe.numeroNFE : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-10">Selecione uma GTA para auditar os detalhes.</p>
            )}
          </div>

        </div>
      )}

      {/* ==================== 2. CT-e (CONHECIMENTO DE TRANSPORTE) ==================== */}
      {activeSubMenu === 'cte' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Header / Trigger */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Follow up das (CT-e)</h4>
                <p className="text-xs text-gray-500">Documento fiscal emitido para formalizar, registrar e controlar a prestação do serviço de transporte da carga</p>
              </div>
              <button
                onClick={() => setShowAddCteForm(!showAddCteForm)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#071757] hover:bg-[#182763] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Lançar CT-e</span>
              </button>
            </div>

            {/* Manual CT-e Launch Form */}
            {showAddCteForm && (
              <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 font-sans w-full max-w-2xl max-h-[90vh] overflow-y-auto text-left flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Entrada de Documentação</span>
                      <h4 className="text-base font-bold text-slate-800 mt-0.5">Lançamento de CT-e de Frete</h4>
                    </div>
                    <button 
                      onClick={() => setShowAddCteForm(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCTE} className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vincular Processo de Origem (Viagem Logística)</label>
                        <select
                          value={newCteForm.processoId}
                          onChange={(e) => handleCteProcessChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-medium"
                        >
                          <option value="">-- Selecionar viagem ativa para autocompletar (Opcional) --</option>
                          {viagens.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.id} - {v.motorista} ({v.origem} → {v.destino} | {v.quantidadeCabecas} cab.)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Número do CT-e</label>
                        <input
                          required
                          type="text"
                          value={newCteForm.numeroCTE}
                          onChange={(e) => setNewCteForm({...newCteForm, numeroCTE: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-mono"
                          placeholder="Ex: CTE-352210"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Valor do Frete (R$)</label>
                        <input
                          required
                          type="number"
                          value={newCteForm.valorFrete}
                          onChange={(e) => setNewCteForm({...newCteForm, valorFrete: Number(e.target.value)})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa Transportadora</label>
                        <input
                          required
                          type="text"
                          value={newCteForm.transportadora}
                          onChange={(e) => setNewCteForm({...newCteForm, transportadora: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Motorista</label>
                        <input
                          required
                          type="text"
                          value={newCteForm.motorista}
                          onChange={(e) => setNewCteForm({...newCteForm, motorista: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo do Veículo</label>
                        <input
                          required
                          type="text"
                          value={newCteForm.veiculo}
                          onChange={(e) => setNewCteForm({...newCteForm, veiculo: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Placa Cavalo / Semirreboque</label>
                        <input
                          required
                          type="text"
                          value={newCteForm.placa}
                          onChange={(e) => setNewCteForm({...newCteForm, placa: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-mono"
                          placeholder="Ex: OQY-8E12"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                      <button 
                        type="button" 
                        onClick={() => setShowAddCteForm(false)}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 bg-[#071757] hover:bg-[#182763] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                    <th className="p-3 pl-4">ID Processo</th>
                    <th className="p-3">Número CT-e</th>
                    <th className="p-3">Transportadora</th>
                    <th className="p-3">Motorista</th>
                    <th className="p-3">Placa</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredCtes.map((c) => (
                    <tr
                      key={c.id} 
                      onClick={() => setSelectedCte(c)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedCte?.id === c.id ? 'bg-[#FDF6E3]/20 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 pl-4">
                        {c.processoId ? (
                          <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] font-bold rounded">
                            {c.processoId}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium font-mono text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-800">{c.numeroCTE}</td>
                      <td className="p-3 text-gray-900">{c.transportadora}</td>
                      <td className="p-3 text-gray-500">{c.motorista}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 font-mono text-[10px] font-bold text-slate-700 rounded">
                          {c.placa}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#D8B46A]">
                        {c.valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          c.situacao === 'Autorizado' ? 'bg-green-100 text-green-800' :
                          c.situacao === 'Cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {c.situacao}
                        </span>
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {c.situacao === 'Pendente' ? (
                          <button
                            id={`emit-cte-${c.id}`}
                            onClick={() => {
                              onEmitCTE(c.id);
                              // Sync detailing local selection status 
                              if (selectedCte?.id === c.id) {
                                setSelectedCte({ ...selectedCte, situacao: 'Autorizado' });
                              }
                            }}
                            className="px-2 py-0.5 bg-[#071757] text-white hover:bg-[#182763] rounded font-bold text-[10px] cursor-pointer"
                          >
                            Autorizar
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-mono">Sincronizado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline and details of selected CT-e */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            {selectedCte ? (
              <>
                <div className="border-b border-gray-150 pb-3">
                  <span className="text-[9px] font-bold text-[#D8B46A] uppercase tracking-wider font-mono">Conhecimento Sincronizado</span>
                  <h4 className="text-xs font-bold text-gray-800 mt-1">Status de Frete: {selectedCte.numeroCTE}</h4>
                  <p className="text-[10.5px] text-gray-500 mt-1">Frota activa: <span className="font-mono font-bold text-gray-700">{selectedCte.veiculo}</span></p>
                </div>

                <div className="space-y-4">
                  {/* Timeline representation */}
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Timeline de Auditoria de Frete</h5>
                  
                  <div className="relative border-l-2 border-[#D8B46A]/50 pl-4 space-y-5 ml-2 pt-1">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] rounded-full bg-[#071757] p-1 text-white border-2 border-white">
                        <CheckCircle className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className="font-bold text-gray-800">1. Emissão de CT-e Rodoviário</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">ID: {selectedCte.dataEmissao} - Sincronizado SEFAZ</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] rounded-full p-1 text-white border-2 border-white ${
                        selectedCte.situacao === 'Autorizado' ? 'bg-[#071757]' : 'bg-gray-300'
                      }`}>
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className={`font-bold ${
                          selectedCte.situacao === 'Autorizado' ? 'text-gray-800' : 'text-gray-400'
                        }`}>2. Checklist e Liberação Sanitária</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Conexão obrigatória com numeração GTA do Lote</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] rounded-full p-1 text-white border-2 border-white ${
                        selectedCte.situacao === 'Autorizado' ? 'bg-[#071757]' : 'bg-gray-300'
                      }`}>
                        <Truck className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className={`font-bold ${
                          selectedCte.situacao === 'Autorizado' ? 'text-gray-800' : 'text-gray-400'
                        }`}>3. Liberação MDF-e e Viagem</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {selectedCte.situacao === 'Autorizado' ? 'Manifesto homologado. Transporte liberado na rodovia.' : 'Aguardando anuência e auditoria de placa'}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg space-y-1.5">
                    <p className="text-[10px] font-mono font-bold text-gray-500 uppercase">Ficha Logística do Motorista:</p>
                    <p className="text-xs text-gray-700">
                      <span className="font-bold text-gray-900">Motorista:</span> {selectedCte.motorista} <br />
                      <span className="font-bold text-gray-900">Frota Associada:</span> {selectedCte.veiculo} ({selectedCte.placa})
                    </p>
                  </div>

                  {/* Unified Process Traceability Pane */}
                  {selectedCte.processoId && (() => {
                    const voyage = viagens.find(v => v.id === selectedCte.processoId);
                    const lot = lotes.find(l => 
                      (selectedCte.processoId === 'PRC-260610-MT-0001' && l.id === 'l-1') ||
                      (selectedCte.processoId === 'PRC-260612-GO-0002' && l.id === 'l-2') ||
                      (selectedCte.processoId === 'PRC-260614-PA-0003' && l.id === 'l-3')
                    );
                    const linkedGta = gtas.find(g => g.processoId === selectedCte.processoId);
                    const linkedNfe = nfes.find(n => n.processoId === selectedCte.processoId);
                    
                    return (
                      <div className="p-3 bg-[#071757]/5 border border-[#071757]/10 rounded-lg space-y-2.5">
                        <div className="flex items-center space-x-1.5 font-bold text-[#071757] text-xs">
                          <LinkIcon className="h-3.5 w-3.5 text-[#D8B46A]" />
                          <span>Rastreabilidade de Dados do Processo</span>
                        </div>
                        <p className="text-[10.5px] text-gray-600 leading-normal">
                          Esta guia de transporte rodoviário está vinculada ao processo unificado <strong>{selectedCte.processoId}</strong>.
                        </p>
                        
                        <div className="border-t border-gray-200/60 pt-2 space-y-1.5 text-[10px] text-gray-500">
                          <div>
                            <span className="font-semibold text-gray-700">Origem da Rota:</span> Obtida das coordenadas logísticas da Viagem <strong>{voyage?.id}</strong> ({voyage?.origem} → {voyage?.destino}).
                          </div>
                          {lot && (
                            <div>
                              <span className="font-semibold text-gray-700">Lote e Carga:</span> Relacionado ao Lote <strong>{lot.codigoLote}</strong> ({voyage?.quantidadeCabecas || lot.quantidade} Cab. Nelore sob cuidados do motorista {selectedCte.motorista}).
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5 items-center mt-2.5 pt-2 border-t border-gray-150">
                            <span className="font-bold text-gray-600 mr-0.5 text-[9px] uppercase tracking-wider">Documentos do Fluxo:</span>
                            <span className={`px-1.5 py-0.2 font-mono rounded text-[9px] border ${
                              linkedGta ? 'bg-green-50 text-green-700 border-green-200 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}>
                              GTA: {linkedGta ? `GTA #${linkedGta.numeroGTA}` : 'Pendente'}
                            </span>
                            <span className="px-1.5 py-0.2 bg-green-50 text-green-700 font-mono font-bold rounded text-[9px] border border-green-200">
                              CT-e-ATIVO
                            </span>
                            <span className={`px-1.5 py-0.2 font-mono rounded text-[9px] border ${
                              linkedNfe ? 'bg-green-50 text-green-700 border-green-200 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}>
                              NF-e: {linkedNfe ? linkedNfe.numeroNFE : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-10">Selecione um Conhecimento de Frete para auditar detalhes.</p>
            )}
          </div>

        </div>
      )}

      {/* ==================== 3. NF-e (NOTA FISCAL ELETRÔNICA) ==================== */}
      {activeSubMenu === 'nfe' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main List Table */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Header / Trigger */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Follow up das NF-e</h4>
                <p className="text-xs text-gray-500">Controle e acompanhamento da emissão de NF-e.</p>
              </div>
              <button
                onClick={() => setShowAddNfeForm(!showAddNfeForm)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#071757] hover:bg-[#182763] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Lançar NF-e</span>
              </button>
            </div>

            {/* Manual NF-e Launch Form */}
            {showAddNfeForm && (
              <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 font-sans w-full max-w-2xl max-h-[90vh] overflow-y-auto text-left flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Emissão Eletrônica</span>
                      <h4 className="text-base font-bold text-slate-800 mt-0.5">Faturamento de NF-e SEFAZ</h4>
                    </div>
                    <button 
                      onClick={() => setShowAddNfeForm(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateNFE} className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vincular Processo de Origem (Viagem Logística)</label>
                        <select
                          value={newNfeForm.processoId}
                          onChange={(e) => handleNfeProcessChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-855 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-medium"
                        >
                          <option value="">-- Selecionar viagem ativa para autocompletar (Opcional) --</option>
                          {viagens.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.id} - {v.motorista} ({v.origem} → {v.destino} | {v.quantidadeCabecas} cab.)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nota Número</label>
                        <input
                          required
                          type="text"
                          value={newNfeForm.numero}
                          onChange={(e) => setNewNfeForm({...newNfeForm, numero: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-855 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-mono"
                          placeholder="Ex: NFE-000109524"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Total (R$)</label>
                        <input
                          required
                          type="number"
                          value={newNfeForm.valor}
                          onChange={(e) => setNewNfeForm({...newNfeForm, valor: Number(e.target.value)})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-855 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Razão Social Remetente</label>
                        <input
                          required
                          type="text"
                          value={newNfeForm.remetente}
                          onChange={(e) => setNewNfeForm({...newNfeForm, remetente: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-855 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Razão Social Destinatário</label>
                        <input
                          required
                          type="text"
                          value={newNfeForm.destinatario}
                          onChange={(e) => setNewNfeForm({...newNfeForm, destinatario: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-855 focus:outline-none focus:ring-2 focus:ring-[#071757]/20 focus:border-[#071757] bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                      <button 
                        type="button" 
                        onClick={() => setShowAddNfeForm(false)}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 bg-[#071757] hover:bg-[#182763] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Lançar NF-e
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                    <th className="p-3 pl-4">ID Processo</th>
                    <th className="p-3">Número NF-e</th>
                    <th className="p-3">Remetente</th>
                    <th className="p-3">Destinatário</th>
                    <th className="p-3 text-right">Valor Total</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredNfes.map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedNfe(f)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedNfe?.id === f.id ? 'bg-[#FDF6E3]/20 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 pl-4">
                        {f.processoId ? (
                          <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] font-bold rounded">
                            {f.processoId}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium font-mono text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-800">{f.numeroNFE}</td>
                      <td className="p-3 text-gray-900 truncate max-w-[150px]">{f.remetente}</td>
                      <td className="p-3 text-gray-500 truncate max-w-[150px]">{f.destinatario}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#D8B46A]">
                        {f.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold rounded text-[9px] border border-green-200">
                          {f.situacaoSefaz}
                        </span>
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-gray-450 font-mono font-semibold bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                          Sincronizado SEFAZ
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Detail timeline (No XML, no PDF options, no digital key hashes) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            {selectedNfe ? (
              <>
                <div className="border-b border-gray-150 pb-3">
                  <span className="text-[9px] font-bold text-[#D8B46A] uppercase tracking-wider font-mono">Nota Fiscal Sincronizada</span>
                  <h4 className="text-xs font-bold text-gray-800 mt-1">Faturamento: {selectedNfe.numeroNFE}</h4>
                  <p className="text-[10.5px] text-gray-500 mt-1">Destinatário: <span className="font-mono font-bold text-gray-700">{selectedNfe.destinatario}</span></p>
                </div>

                {/* NF-e Timeline representing the Document / Fiscal Audit flow */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Timeline de Auditoria Fiscal</h5>
                  
                  <div className="relative border-l-2 border-[#D8B46A]/50 pl-4 space-y-5 ml-2 pt-1">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] rounded-full bg-[#071757] p-1 text-white border-2 border-white">
                        <CheckCircle className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className="font-bold text-gray-800">1. Transmissão do XML Eletrônico</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Assinatura Certificado Digital A-1 do Produtor</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] rounded-full bg-[#071757] p-1 text-white border-2 border-white">
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className="font-bold text-gray-800">2. Homologação SEFAZ Federal</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Protocolo gerado e verificado com sucesso</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] rounded-full bg-[#071757] p-1 text-white border-2 border-white">
                        <FileText className="h-3 w-3" />
                      </span>
                      <div className="text-xs leading-none">
                        <p className="font-bold text-gray-800">3. Escrituração de Tributos e Razão</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Integração financeira realizada para contas a pagar/receber</p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-[11px] text-green-800 leading-snug">
                  <div className="flex items-center space-x-1 font-bold text-green-900 mb-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Assinatura Digital Válida</span>
                  </div>
                  Este documento de faturamento foi sincronizado com os servidores federais do Ministério da Fazenda. O ICMS gerado está integrado às contas a pagar de impostos.
                </div>

                {/* Unified Process Traceability Pane */}
                {selectedNfe.processoId && (() => {
                  const voyage = viagens.find(v => v.id === selectedNfe.processoId);
                  const lot = lotes.find(l => 
                    (selectedNfe.processoId === 'PRC-260610-MT-0001' && l.id === 'l-1') ||
                    (selectedNfe.processoId === 'PRC-260612-GO-0002' && l.id === 'l-2') ||
                    (selectedNfe.processoId === 'PRC-260614-PA-0003' && l.id === 'l-3')
                  );
                  const linkedGta = gtas.find(g => g.processoId === selectedNfe.processoId);
                  const linkedCte = ctes.find(c => c.processoId === selectedNfe.processoId);
                  
                  return (
                    <div className="p-3 bg-[#071757]/5 border border-[#071757]/10 rounded-lg space-y-2.5">
                      <div className="flex items-center space-x-1.5 font-bold text-[#071757] text-xs">
                        <LinkIcon className="h-3.5 w-3.5 text-[#D8B46A]" />
                        <span>Rastreabilidade de Dados do Processo</span>
                      </div>
                      <p className="text-[10.5px] text-gray-600 leading-normal">
                        Esta fatura de gado foi emitida sob o fluxo do processo unificado de faturamento e transporte <strong>{selectedNfe.processoId}</strong>.
                      </p>
                      
                      <div className="border-t border-gray-200/60 pt-2 space-y-1.5 text-[10px] text-gray-500">
                        <div>
                          <span className="font-semibold text-gray-700">Base de Cálculo:</span> Faturamento com base na pesagem do Lote <strong>{lot?.codigoLote || 'N/A'}</strong> ({voyage?.quantidadeCabecas || lot?.quantidade || 0} Cab. | Peso Estimado: {lot?.peso || 0} kg).
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Origem Financeira:</span> Negociação de Venda de Gado Gordo com o comprador/frigorífico.
                        </div>
                        <div className="flex flex-wrap gap-1.5 items-center mt-2.5 pt-2 border-t border-gray-150">
                          <span className="font-bold text-gray-600 mr-0.5 text-[9px] uppercase tracking-wider">Documentos do Fluxo:</span>
                          <span className={`px-1.5 py-0.2 font-mono rounded text-[9px] border ${
                            linkedGta ? 'bg-green-50 text-green-700 border-green-200 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}>
                            GTA: {linkedGta ? `GTA #${linkedGta.numeroGTA}` : 'Pendente'}
                          </span>
                          <span className={`px-1.5 py-0.2 font-mono rounded text-[9px] border ${
                            linkedCte ? 'bg-green-50 text-green-700 border-green-200 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}>
                            CT-e: {linkedCte ? linkedCte.numeroCTE : 'Pendente'}
                          </span>
                          <span className="px-1.5 py-0.2 bg-green-50 text-green-700 font-mono font-bold rounded text-[9px] border border-green-200">
                            NF-e-ATIVA
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-10">Consulte alguma nota fiscal para detalhes adicionais de faturamento SEFAZ.</p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
