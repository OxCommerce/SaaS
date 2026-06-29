import React, { useState } from 'react';
import { 
  X, User, MapPin, Phone, CreditCard, Lock, Eye, EyeOff, 
  Briefcase, Truck, Users, ShieldAlert, Layers, Building2,
  Calendar, FileText, DollarSign, Activity
} from 'lucide-react';
import { supabase } from '../supabaseClient';

interface RegistryDetailsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'CLIENT' | 'SUPPLIER' | 'PARTNER' | 'DRIVER' | 'TEAM' | 'COST_CENTER' | 'BANK' | 'PARTNER_TYPE' | 'CATEGORY' | 'PURCHASE_ORDER' | 'SALES_ORDER' | 'NEGOTIATION';
  data: any;
  // Lists for nested lookup drilldown
  clientes?: any[];
  fornecedores?: any[];
  usuarios?: any[];
  bancos?: any[];
  centrosCusto?: any[];
  tiposParceiro?: any[];
  categorias?: any[];
  motoristas?: any[];
  parceiros?: any[];
  ordensCompraCliente?: any[];
}

export default function RegistryDetailsViewModal({
  isOpen,
  onClose,
  type: initialType,
  data: initialData,
  clientes = [],
  fornecedores = [],
  usuarios = [],
  bancos = [],
  centrosCusto = [],
  tiposParceiro = [],
  categorias = [],
  motoristas = [],
  parceiros = [],
  ordensCompraCliente = []
}: RegistryDetailsViewModalProps) {
  
  // State to support nested drilldowns dynamically
  const [currentType, setCurrentType] = useState(initialType);
  const [currentData, setCurrentData] = useState(initialData);
  const [history, setHistory] = useState<Array<{ type: any; data: any }>>([]);
  const [showConfidential, setShowConfidential] = useState(false);

  // Sync state if initial props change
  React.useEffect(() => {
    setCurrentType(initialType);
    setCurrentData(initialData);
    setHistory([]);
    setShowConfidential(false);
  }, [initialType, initialData, isOpen]);

  if (!isOpen || !currentData) return null;

  const navigateTo = (newType: typeof initialType, newData: any) => {
    setHistory(prev => [...prev, { type: currentType, data: currentData }]);
    setCurrentType(newType);
    setCurrentData(newData);
    setShowConfidential(false);
  };

  const navigateBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(prevHist => prevHist.slice(0, -1));
    setCurrentType(prev.type);
    setCurrentData(prev.data);
    setShowConfidential(false);
  };

  // Safe helper to find and navigate to details of nested relations
  const handleNestedLookup = (relType: typeof initialType, codeOrId: string) => {
    if (!codeOrId) return;
    let found: any = null;
    const searchVal = codeOrId.trim().toLowerCase();

    if (relType === 'CLIENT' || relType === 'SUPPLIER') {
      found = [...clientes, ...fornecedores].find(c => 
        (c.codigo || '').toLowerCase() === searchVal || 
        (c.id || '').toLowerCase() === searchVal
      );
    } else if (relType === 'PARTNER') {
      found = parceiros.find(p => 
        (p.codigo || '').toLowerCase() === searchVal || 
        (p.id || '').toLowerCase() === searchVal
      );
    } else if (relType === 'DRIVER') {
      found = motoristas.find(m => 
        (m.codigo || '').toLowerCase() === searchVal || 
        (m.id || '').toLowerCase() === searchVal
      );
    } else if (relType === 'TEAM') {
      found = usuarios.find(u => 
        (u.matricula || '').toLowerCase() === searchVal || 
        (u.id || '').toLowerCase() === searchVal
      );
    }

    if (found) {
      navigateTo(relType, found);
    } else {
      alert(`Registro associado "${codeOrId}" não encontrado.`);
    }
  };

  // Section Header Generator
  const renderSectionHeader = (title: string, icon: React.ReactNode) => (
    <div className="flex items-center space-x-2 border-b border-gray-150 pb-2 mb-4 mt-6 first:mt-0">
      <div className="text-[#071757]">{icon}</div>
      <h4 className="text-xs font-bold text-[#071757] uppercase tracking-wider">{title}</h4>
    </div>
  );

  // Field Renderer
  const renderField = (label: string, value: any, isLink = false, onLinkClick?: () => void) => {
    const displayVal = value !== undefined && value !== null && String(value).trim() !== '' ? String(value) : 'Não Informado';
    return (
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</label>
        {isLink && displayVal !== 'Não Informado' ? (
          <button 
            type="button"
            onClick={onLinkClick}
            className="text-[#071757] hover:text-[#182763] hover:underline font-bold text-xs focus:outline-none text-left cursor-pointer transition-colors"
          >
            {displayVal}
          </button>
        ) : (
          <p className="text-xs font-medium text-gray-800 break-words">{displayVal}</p>
        )}
      </div>
    );
  };

  // Helper to extract nested raw data or root data
  const raw = currentData.raw_data || {};
  const getVal = (field: string, fallback: any = '') => {
    return raw[field] !== undefined ? raw[field] : (currentData[field] !== undefined ? currentData[field] : fallback);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 z-[60] p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in fade-in zoom-in-95 max-h-[calc(100vh-100px)] flex flex-col border border-gray-150">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {history.length > 0 && (
              <button 
                onClick={navigateBack}
                className="mr-1 px-2.5 py-1 text-xs font-bold text-[#071757] bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all uppercase tracking-wide"
              >
                Voltar
              </button>
            )}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="h-3 w-1 bg-[#D8B46A] rounded-xs"></span>
                <span>Ficha de Informações</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">Visualização rápida de dados • Modo Leitura</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <X className="h-4.5 w-4.5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mt-4 overflow-y-auto pr-2 flex-1 scrollbar-thin space-y-2">
          
          {/* ────────────────── 1. REGISTRIES: CLIENTS & SUPPLIERS ────────────────── */}
          {(currentType === 'CLIENT' || currentType === 'SUPPLIER') && (
            <>
              {renderSectionHeader("Informações Gerais", <User className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Código de Identificação", currentData.codigo || getVal("codigo", "Gerado Automaticamente"))}
                {renderField("Razão Social / Nome Completo", currentData.nome || getVal("razaoSocial"))}
                {renderField("Nome Fantasia / Apelido", currentData.nomeFantasia || getVal("nomeFantasia"))}
                {renderField("CNPJ / CPF", getVal("cnpj") || getVal("cpf") || currentData.documento)}
                {renderField("Inscrição Estadual", getVal("ie"))}
                {renderField("Inscrição Municipal", getVal("im"))}
                {renderField("Suframa", getVal("suframa"))}
                {renderField("Isento de IE", getVal("isentoIE") ? "Sim" : "Não")}
                {renderField("Regime Tributário", getVal("regimeTributario"))}
                {renderField("Tipo Cadastro", currentData.tipo || getVal("clientType") || "Pessoa Física")}
              </div>

              {renderSectionHeader("Informações de Contato", <Phone className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Nome do Contato", getVal("contatoNome") || currentData.contato)}
                {renderField("Telefone Comercial", getVal("contatoTelefone") || currentData.telefone)}
                {renderField("Celular / WhatsApp", getVal("contatoWhatsapp"))}
                {renderField("E-mail Comercial", getVal("contatoEmail"))}
                {renderField("Observações do Contato", getVal("observacao"), false)}
              </div>

              {renderSectionHeader("Endereço Principal", <MapPin className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("CEP", getVal("cep"))}
                {renderField("Logradouro", getVal("logradouro"))}
                {renderField("Número", getVal("numero"))}
                {renderField("Complemento", getVal("complemento"))}
                {renderField("Bairro", getVal("bairro"))}
                {renderField("Cidade", getVal("cidade") || currentData.cidade)}
                {renderField("Estado / UF", getVal("uf") || currentData.uf)}
                {renderField("País", getVal("pais") || "Brasil")}
              </div>

              {renderSectionHeader("Dados Financeiros e Confidenciais", <CreditCard className="h-4 w-4" />)}
              {!showConfidential ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center space-y-2">
                  <Lock className="h-6 w-6 text-slate-400" />
                  <p className="text-xs text-gray-500 font-medium">Os dados financeiros e bancários estão ocultados por privacidade.</p>
                  <button 
                    onClick={() => setShowConfidential(true)} 
                    className="flex items-center space-x-1.5 bg-[#071757] hover:bg-[#182763] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer shadow-sm"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Visualizar Informações Financeiras</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowConfidential(false)}
                      className="text-xs text-rose-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Ocultar Dados</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    {renderField("Banco", getVal("financeiroBanco"))}
                    {renderField("Agência", getVal("financeiroAgencia"))}
                    {renderField("Conta Corrente", getVal("financeiroConta"))}
                    {renderField("Tipo Conta", getVal("financeiroTipoConta") === "CC" ? "Conta Corrente" : "Poupança")}
                    {renderField("Tipo Chave Pix", getVal("financeiroPixTipo"))}
                    {renderField("Chave Pix", getVal("financeiroPixChave"))}
                    {renderField("Centro de Custo", getVal("financeiroCentroCusto"))}
                    {renderField("Limite de Crédito", getVal("financeiroLimiteCredito") ? Number(getVal("financeiroLimiteCredito")).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'Ilimitado')}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ────────────────── 2. PARTNERS ────────────────── */}
          {currentType === 'PARTNER' && (
            <>
              {renderSectionHeader("Informações do Parceiro", <Briefcase className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Código do Parceiro", currentData.codigo || getVal("codigo", "Gerado Automaticamente"))}
                {renderField("Nome / Razão Social", currentData.nome || getVal("nome"))}
                {renderField("CNPJ / CPF", getVal("cnpj") || getVal("cpf") || currentData.documento)}
                {renderField("Inscrição Estadual", getVal("ie"))}
                {renderField("Tipo de Parceiro", getVal("tipoParceiro") || currentData.tipo)}
                {renderField("Comissão (%)", getVal("comissao") ? `${getVal("comissao")}%` : "0%")}
                {renderField("Status", currentData.status || "Ativo")}
              </div>

              {renderSectionHeader("Contato", <Phone className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Responsável", getVal("contatoNome") || currentData.contato)}
                {renderField("Telefone", getVal("contatoTelefone") || currentData.telefone)}
                {renderField("Celular / WhatsApp", getVal("contatoWhatsapp"))}
                {renderField("E-mail", getVal("contatoEmail"))}
              </div>

              {renderSectionHeader("Endereço", <MapPin className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Logradouro", getVal("logradouro"))}
                {renderField("CEP", getVal("cep"))}
                {renderField("Cidade", getVal("cidade") || currentData.cidade)}
                {renderField("Estado / UF", getVal("uf") || currentData.uf)}
              </div>

              {renderSectionHeader("Financeiro (Confidencial)", <CreditCard className="h-4 w-4" />)}
              {!showConfidential ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center space-y-2">
                  <Lock className="h-6 w-6 text-slate-400" />
                  <button onClick={() => setShowConfidential(true)} className="flex items-center space-x-1.5 bg-[#071757] hover:bg-[#182763] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer shadow-sm">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Exibir Dados Financeiros</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-end">
                    <button onClick={() => setShowConfidential(false)} className="text-xs text-rose-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer">
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Ocultar</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    {renderField("Banco", getVal("financeiroBanco"))}
                    {renderField("Agência", getVal("financeiroAgencia"))}
                    {renderField("Conta", getVal("financeiroConta"))}
                    {renderField("Pix Chave", getVal("financeiroPixChave"))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ────────────────── 3. DRIVERS ────────────────── */}
          {currentType === 'DRIVER' && (
            <>
              {renderSectionHeader("Informações do Motorista", <Truck className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Código do Motorista", currentData.codigo || getVal("codigo"))}
                {renderField("Nome do Motorista", currentData.nome || getVal("nome"))}
                {renderField("CNPJ / CPF", getVal("cnpj") || getVal("cpf") || currentData.documento)}
                {renderField("CNH", currentData.cnh || getVal("cnh"))}
                {renderField("Placa Cavalo", currentData.placa || getVal("veiculoPlaca"))}
                {renderField("Placa Carreta", getVal("carretaPlaca"))}
                {renderField("Placa Bitrem", getVal("bitremPlaca"))}
                {renderField("Transportadora Vinculada", currentData.transportadora || getVal("transportadora"))}
                {renderField("Vínculo", getVal("unidade") === "FIL" ? "Filial" : "Terceiro")}
                {renderField("Status", currentData.status || "Disponível")}
              </div>

              {renderSectionHeader("Contato", <Phone className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Telefone/WhatsApp", getVal("contatoWhatsapp") || currentData.telefone)}
                {renderField("E-mail", getVal("contatoEmail"))}
              </div>

              {renderSectionHeader("Financeiro (Confidencial)", <CreditCard className="h-4 w-4" />)}
              {!showConfidential ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center space-y-2">
                  <Lock className="h-6 w-6 text-slate-400" />
                  <button onClick={() => setShowConfidential(true)} className="flex items-center space-x-1.5 bg-[#071757] hover:bg-[#182763] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer shadow-sm">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Exibir Dados Financeiros</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-end">
                    <button onClick={() => setShowConfidential(false)} className="text-xs text-rose-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer">
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Ocultar</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    {renderField("Banco", getVal("financeiroBanco"))}
                    {renderField("Agência", getVal("financeiroAgencia"))}
                    {renderField("Conta", getVal("financeiroConta"))}
                    {renderField("Chave Pix", getVal("financeiroPixChave"))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ────────────────── 4. TEAM / USERS ────────────────── */}
          {currentType === 'TEAM' && (
            <>
              {renderSectionHeader("Informações do Membro da Equipe", <Users className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Matrícula", currentData.matricula || getVal("matricula"))}
                {renderField("Nome Completo", currentData.nome || `${getVal("firstName")} ${getVal("lastName")}`)}
                {renderField("CPF", getVal("cpf"))}
                {renderField("RG", getVal("rg"))}
                {renderField("Gênero", getVal("gender") === "M" ? "Masculino" : "Feminino")}
                {renderField("Cargo", getVal("cargo"))}
                {renderField("Departamento", getVal("departamento"))}
                {renderField("Unidade / Filial", getVal("unidade"))}
                {renderField("Gestor Direto", getVal("gestor"))}
                {renderField("Centro de Custo", getVal("centroCusto"))}
                {renderField("Status Colaborador", currentData.status || "Ativo")}
              </div>

              {renderSectionHeader("Contato", <Phone className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Telefone/WhatsApp", getVal("contatoWhatsapp"))}
                {renderField("E-mail Corporativo", currentData.email || getVal("contatoEmail"))}
              </div>

              {renderSectionHeader("Segurança & Acessos (Confidencial)", <ShieldAlert className="h-4 w-4" />)}
              {!showConfidential ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center space-y-2">
                  <Lock className="h-6 w-6 text-slate-400" />
                  <button onClick={() => setShowConfidential(true)} className="flex items-center space-x-1.5 bg-[#071757] hover:bg-[#182763] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer shadow-sm">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Visualizar Credenciais</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-end">
                    <button onClick={() => setShowConfidential(false)} className="text-xs text-rose-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer">
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Ocultar</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    {renderField("Perfil de Segurança", getVal("segurancaPerfil") === "ADM" ? "Administrador" : "Operador")}
                    {renderField("Papel Principal", currentData.papel || getVal("segurancaPapel"))}
                    {renderField("Status Acesso", getVal("segurancaStatus") === "A" ? "Ativo" : "Inativo")}
                    {renderField("Login de Acesso", getVal("segurancaLogin"))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ────────────────── 5. SIMPLIFIED REGISTRIES ────────────────── */}
          {(currentType === 'COST_CENTER' || currentType === 'BANK' || currentType === 'PARTNER_TYPE' || currentType === 'CATEGORY') && (
            <>
              {renderSectionHeader("Informações do Registro", <Layers className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField("Código", currentData.code || currentData.codigo)}
                {renderField("Nome / Identificador", currentData.nome || currentData.name)}
                {renderField("Status", currentData.status || "Ativo")}
                
                {/* Cost Center exclusive fields */}
                {currentType === 'COST_CENTER' && renderField("Tipo", currentData.tipo || "Operacional")}
                {currentType === 'COST_CENTER' && renderField("Responsável", currentData.responsavel || "Não Informado")}
              </div>
              
              {/* Optional description field */}
              {currentData.descricao && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-gray-150">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Descrição / Observações</label>
                  <p className="text-xs mt-1 text-gray-700 font-medium">{currentData.descricao}</p>
                </div>
              )}
            </>
          )}

          {/* ────────────────── 6. PURCHASE ORDERS (COMPRAS) ────────────────── */}
          {currentType === 'PURCHASE_ORDER' && (
            <>
              {renderSectionHeader("Dados da Ordem de Compra", <FileText className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("ID Operação", currentData.numeroOperacao)}
                {renderField("Código Fornecedor", currentData.codigoFornecedor, true, () => handleNestedLookup('SUPPLIER', currentData.codigoFornecedor))}
                {renderField("Fornecedor", currentData.fornecedor)}
                {renderField("Fazenda de Origem", currentData.fazendaOrigem)}
                {renderField("Estado / UF", currentData.estado)}
                {renderField("Cidade / Município", currentData.municipio)}
                {renderField("Status Operação", currentData.status || "Aberta")}
                {renderField("Data Criação", currentData.dataCriacao || currentData.dataEmissao)}
                {renderField("Data Entrega", currentData.dataEntrega)}
              </div>

              {renderSectionHeader("Animais e Valores", <DollarSign className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Categoria Animal", currentData.categoriaAnimal)}
                {renderField("Quantidade (cabeças)", currentData.quantidade)}
                {renderField("Peso Médio (kg)", currentData.pesoMedio ? `${currentData.pesoMedio} kg` : null)}
                {renderField("Valor Arroba", currentData.valorArroba ? currentData.valorArroba.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : null)}
                {renderField("Comissão (%)", currentData.comissao ? `${currentData.comissao}%` : null)}
                {renderField("Valor Frete", currentData.frete ? currentData.frete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : null)}
                {renderField("Valor Total da Compra", currentData.valorTotal ? currentData.valorTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : null)}
              </div>

              {renderSectionHeader("Destino & Logística", <Truck className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Destino Frigorífico", currentData.destinoFrigorifico)}
                {renderField("Cidade Destino", currentData.destinoCidade)}
                {renderField("Corretor / Negociador", currentData.corretor)}
                {renderField("Motorista Escalado", currentData.motorista)}
                {renderField("Placa Veículo", currentData.placa)}
              </div>

              {currentData.observacoes && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-gray-150">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Observações da Compra</label>
                  <p className="text-xs mt-1 text-gray-700 font-medium">{currentData.observacoes}</p>
                </div>
              )}
            </>
          )}

          {/* ────────────────── 7. SALES ORDERS (VENDAS) ────────────────── */}
          {currentType === 'SALES_ORDER' && (
            <>
              {renderSectionHeader("Dados da Ordem de Venda (Cliente)", <FileText className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("ID OC (Ordem de Compra)", currentData.numeroOC)}
                {renderField("Código Cliente", currentData.codigoCliente, true, () => handleNestedLookup('CLIENT', currentData.codigoCliente))}
                {renderField("Cliente (Razão Social)", currentData.cliente)}
                {renderField("Data Emissão", currentData.dataCriacao || currentData.dataEmissao)}
                {renderField("Status OC", currentData.status)}
                {renderField("Código Cliente OC (Ref)", currentData.codigoOrdemCompraCliente)}
              </div>

              {renderSectionHeader("Animais e Logística", <Layers className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("Destino / Planta Frigorífico", currentData.frigorifico)}
                {renderField("Categoria Animal", currentData.categoriaAnimal)}
                {renderField("Quantidade (cabeças)", currentData.quantidade)}
                {renderField("Peso Total (kg)", currentData.peso ? `${currentData.peso.toLocaleString('pt-BR')} kg` : null)}
                {renderField("Valor @", currentData.valorArroba ? currentData.valorArroba.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : null)}
                {renderField("Valor Total Líquido", currentData.resultadoOperacao ? currentData.resultadoOperacao.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : null)}
              </div>
            </>
          )}

          {/* ────────────────── 8. NEGOTIATIONS (CRM) ────────────────── */}
          {currentType === 'NEGOTIATION' && (
            <>
              {renderSectionHeader("Dados da Negociação (CRM)", <Activity className="h-4 w-4" />)}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField("ID Negociação", currentData.id.toUpperCase())}
                {renderField("Título", currentData.titulo)}
                {renderField("Cliente / Fornecedor", currentData.clienteFornecedor, true, () => handleNestedLookup('CLIENT', currentData.clienteFornecedor))}
                {renderField("Fazenda", currentData.fazenda)}
                {renderField("Quantidade (Cabeças)", currentData.cabecas)}
                {renderField("Valor Estimado", currentData.valorEstimado ? currentData.valorEstimado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0}) : null)}
                {renderField("Fase do Funil", currentData.fase === 'prospeccao' ? 'Prospecção' : currentData.fase === 'negociacao' ? 'Em Negociação' : currentData.fase === 'documentacao' ? 'Documentação' : currentData.fase === 'contrato' ? 'Contrato Fechado' : 'Cancelado')}
                {renderField("ID Ordem Compra Cliente", currentData.ordemCompraClienteId)}
                {renderField("ID Processo Associado", currentData.processoId)}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-150 bg-slate-50/50 flex justify-end mt-4 rounded-b-xl">
          <button 
            onClick={onClose}
            type="button"
            className="px-6 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-350 rounded-lg transition-all uppercase tracking-wide cursor-pointer"
          >
            Fechar Visualização
          </button>
        </div>

      </div>
    </div>
  );
}
