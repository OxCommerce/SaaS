/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  BarChart,
  Download,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Database
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RelatoriosViewProps {}

export default function RelatoriosView({}: RelatoriosViewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  const triggerExport = (type: string) => {
    setIsExporting(true);
    setExportType(type);
    setTimeout(() => {
      setIsExporting(false);
      setExportType(null);
      // Simulate real browser download!
      alert(`✓ Relatório de [${type}] exportado com sucesso em formato XLS/CSV.`);
    }, 1500);
  };

  const performanceDataset = [
    { name: 'Fazenda Santa Rita', BoiGordo: 420, Margem: 22 },
    { name: 'Estância do Sol', BoiGordo: 310, Margem: 19 },
    { name: 'Sítio Novo', BoiGordo: 190, Margem: 15 },
    { name: 'Parceiros MT', BoiGordo: 280, Margem: 18 }
  ];

  return (
    <div id="reports-view-root" className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs">
        <h3 className="text-sm font-bold text-gray-800">Centro de Relatórios e Exportação de Planilhas</h3>
        <p className="text-xs text-gray-500 mt-1">Extraia relatórios fiscais do INDEA, volumes de pesagem e reconciliação financeira em formatos regulamentares.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Export options column */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Exportações Disponíveis</h4>
          
          {/* Option 1 */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <h5 className="text-xs font-bold text-gray-800">1. Fechamento de Compras (Mensal)</h5>
              <p className="text-[11px] text-gray-500 mt-0.5">XLS com dados de peso de balança, impostos e frete boiadeiro.</p>
            </div>
            <button
              id="export-compras"
              disabled={isExporting}
              onClick={() => triggerExport('DFe_Compras_Gado_Lote')}
              className="p-2 bg-[#D8B46A]/10 hover:bg-[#D8B46A]/20 text-[#D8B46A] rounded-lg cursor-pointer transition-all"
              title="Download Planilha"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Option 2 */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <h5 className="text-xs font-bold text-gray-800">2. Demonstração de Resultados (DRE)</h5>
              <p className="text-[11px] text-gray-500 mt-0.5">PDF sintético com margem, impostos municipais e custos extraordinários.</p>
            </div>
            <button
              id="export-dre"
              disabled={isExporting}
              onClick={() => triggerExport('Financeiro_DRE_Bovino_S_A')}
              className="p-2 bg-[#D8B46A]/10 hover:bg-[#D8B46A]/20 text-[#D8B46A] rounded-lg cursor-pointer transition-all"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Option 3 */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <h5 className="text-xs font-bold text-gray-800">3. Rastreabilidade Sanitária (GTAs)</h5>
              <p className="text-[11px] text-gray-500 mt-0.5">Consolidado legal para inspeção federal MAPA e auditoria.</p>
            </div>
            <button
              id="export-gtas"
              disabled={isExporting}
              onClick={() => triggerExport('GTA_INDEA_Rastreio_Sanitario')}
              className="p-2 bg-[#D8B46A]/10 hover:bg-[#D8B46A]/20 text-[#D8B46A] rounded-lg cursor-pointer transition-all"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {isExporting && (
            <p className="text-xs text-[#071757] italic font-mono text-center">Exportando arquivo {exportType}...</p>
          )}
        </div>

        {/* Dynamic Recharts Performance visualization */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-5 rounded-xl shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase font-mono">Rendimento e Lotação de Lote por Propriedade</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-[#D8B46A] animate-ping inline-block mr-2"></span>
                Comparativo de cabeças gado e margem gerada (%)
              </p>
            </div>
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={performanceDataset}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEE1E9" />
                <XAxis dataKey="name" stroke="#57628D" fontSize={11} tickLine={false} />
                <YAxis stroke="#57628D" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="BoiGordo" fill="#D8B46A" name="Cabeças Ativas" radius={[4, 4, 0, 0]} barSize={34} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
