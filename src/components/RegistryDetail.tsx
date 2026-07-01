import React, { useState, useEffect } from 'react';
import { Input, Select } from './Input';
import { Button } from './Button';
import { Upload, CheckCircle2 } from 'lucide-react';

const formatCpfCnpj = (value: string) => {
  const nums = value.replace(/\D/g, '');
  if (nums.length <= 11) {
    // CPF: 999.999.999-99
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ: 99.999.999/9999-99
    return nums
      .substring(0, 14)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
};

const formatTelefone = (value: string) => {
  const nums = value.replace(/\D/g, '');
  if (nums.length <= 10) {
    // (99) 9999-9999
    return nums
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // (99) 99999-9999
    return nums
      .substring(0, 11)
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

const formatIE = (value: string) => {
  if (value.toLowerCase().includes('ise') || value.toLowerCase().includes('isen')) {
    return value;
  }
  const nums = value.replace(/\D/g, '');
  if (!nums) return value;
  
  if (nums.length <= 9) {
    return nums
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})$/, '$1-$2');
  } else {
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2');
  }
};

const formatPlaca = (value: string) => {
  const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (clean.length <= 3) {
    return clean;
  }
  return `${clean.substring(0, 3)}-${clean.substring(3, 7)}`;
};

const formatCep = (value: string) => {
  const nums = value.replace(/\D/g, '');
  return nums.replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
};

const formatData = (value: string) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parts = value.substring(0, 10).split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const nums = value.replace(/\D/g, '');
  if (nums.length <= 2) {
    return nums;
  }
  if (nums.length <= 4) {
    return `${nums.substring(0, 2)}/${nums.substring(2)}`;
  }
  return `${nums.substring(0, 2)}/${nums.substring(2, 4)}/${nums.substring(4, 8)}`;
};

const convertBrToIsoDate = (value: string) => {
  const clean = value.replace(/\D/g, '');
  if (clean.length === 8) {
    const day = clean.substring(0, 2);
    const month = clean.substring(2, 4);
    const year = clean.substring(4, 8);
    return `${year}-${month}-${day}`;
  }
  return value;
};

const convertIsoToBrDate = (value: string) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parts = value.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return value;
};

interface RegistryDetailProps {
  type: 'TEAM' | 'CLIENT' | 'DRIVER' | 'VEHICLE' | 'BROKER' | 'PARTNER' | 'COST_CENTER' | 'BANK' | 'PARTNER_TYPE' | 'CATEGORY';
  data: any;
  onChange: (data: any) => void;
  banks: { code: string; name: string }[]; // Recieving global banks
  partnerTypes?: { code: string; name: string }[]; // Recieving global partner types
}

export const RegistryDetail: React.FC<RegistryDetailProps> = ({ type, data, onChange, banks, partnerTypes }) => {
  const [activeTab, setActiveTab] = useState('Geral');
  
  // State for Auto-detection of Person Type (PF/PJ) in Client
  const [clientType, setClientType] = useState(data.clientType || 'PJ');

  // State for Financial Tab (Bank Logic)
  const [bankInfo, setBankInfo] = useState({ 
    code: data.bankCode || '', 
    name: data.bankName || '' 
  });

  // State for Address Logic (CEP Automation)
  const [address, setAddress] = useState({
    cep: data.cep || '',
    logradouro: data.logradouro || '',
    numero: data.numero || '',
    bairro: data.bairro || '',
    pais: data.pais || 'Brasil',
    estado: data.estado || '',
    cidade: data.cidade || '',
    uf: data.uf || '',
    complemento: data.complemento || ''
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);
  const [mapSourceUri, setMapSourceUri] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'docCavalo' | 'docCarreta') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          [`${field}Url`]: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync parent data change down to internal states (e.g. on mount or edit load)
  useEffect(() => {
    if (data) {
      if (data.clientType && data.clientType !== clientType) {
        setClientType(data.clientType);
      }
      if (data.bankCode !== undefined && data.bankCode !== bankInfo.code) {
        setBankInfo({
          code: data.bankCode || '',
          name: data.bankName || ''
        });
      }
      const hasAddressChanged = 
        (data.cep !== undefined && data.cep !== address.cep) ||
        (data.logradouro !== undefined && data.logradouro !== address.logradouro) ||
        (data.numero !== undefined && data.numero !== address.numero) ||
        (data.bairro !== undefined && data.bairro !== address.bairro) ||
        (data.estado !== undefined && data.estado !== address.estado) ||
        (data.cidade !== undefined && data.cidade !== address.cidade) ||
        (data.uf !== undefined && data.uf !== address.uf) ||
        (data.complemento !== undefined && data.complemento !== address.complemento);

      if (hasAddressChanged) {
        setAddress({
          cep: data.cep || '',
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          bairro: data.bairro || '',
          pais: data.pais || 'Brasil',
          estado: data.estado || '',
          cidade: data.cidade || '',
          uf: data.uf || '',
          complemento: data.complemento || ''
        });
      }
    }
  }, [data]);

  // Sync internal state to parent
  useEffect(() => {
    onChange({
      ...data,
      clientType,
      bankCode: bankInfo.code,
      bankName: bankInfo.name,
      ...address
    });
  }, [clientType, bankInfo, address]);

  // Update bank name when code changes
  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const bank = banks.find(b => b.code === code);
    setBankInfo({ code: code, name: bank ? bank.name : '' });
  };

  // CEP Automation Logic using public ViaCEP API
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    const newCep = e.target.value.replace(/\D/g, '');
    setAddress(prev => ({ ...prev, cep: formatted }));

    if (newCep.length === 8) {
        setIsLoadingCep(true);
        setMapSourceUri(null);
        
        try {
            const res = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
            if (res.ok) {
                const data = await res.json();
                if (!data.erro) {
                    const ufToEstado: Record<string, string> = {
                        AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
                        DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
                        MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará',
                        PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
                        RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
                        SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
                    };
                    const logradouro = data.logradouro || '';
                    const bairro = data.bairro || '';
                    const cidade = data.localidade || '';
                    const uf = data.uf || '';
                    const estado = data.estado || ufToEstado[uf] || '';

                    setAddress(prev => ({
                        ...prev,
                        logradouro,
                        bairro,
                        cidade,
                        estado,
                        uf,
                        pais: 'Brasil'
                    }));

                    if (logradouro) {
                        const query = `${logradouro}, ${bairro}, ${cidade} - ${uf}`;
                        setMapSourceUri(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao consultar CEP via ViaCEP:", error);
        } finally {
            setIsLoadingCep(false);
        }
    }
  };

  // Tabs Logic with Icons - UPDATED: Removed Operational, Fiscal, Attachments, History
  const isSimpleType = type === 'COST_CENTER' || type === 'BANK' || type === 'PARTNER_TYPE' || type === 'CATEGORY';
  const tabs = isSimpleType ? ['Geral'] : ['Geral', 'Contato', 'Endereço', 'Segurança', 'Financeiro'];
  
  const tabIcons: Record<string, string> = {
    'Geral': 'dvr',
    'Contato': 'contacts',
    'Endereço': 'location_on',
    'Segurança': 'admin_panel_settings',
    'Financeiro': 'payments'
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value);
    const val = e.target.value.replace(/\D/g, '');
    const isPJ = val.length > 11;
    if (isPJ) {
        setClientType('PJ');
    } else {
        setClientType('PF');
    }
    const updateObj: any = { ...data, cnpjCpf: formatted, clientType: isPJ ? 'PJ' : 'PF' };
    if (data.col1) {
      if (isPJ) {
        updateObj.contatoNome = data.col1;
        updateObj.contatoSobrenome = '';
        updateObj.contatoNomeContato = data.col1;
      } else {
        const parts = data.col1.split(' ');
        updateObj.contatoNome = parts[0] || '';
        updateObj.contatoSobrenome = parts.slice(1).join(' ') || '';
        updateObj.contatoNomeContato = data.col1;
      }
    }
    onChange(updateObj);

    if (val.length === 14) {
      setIsLoadingCnpj(true);
      (async () => {
        try {
          const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${val}`);
          if (res.ok) {
            const result = await res.json();
            
            let phoneVal = '';
            if (result.ddd_telefone_1) {
              phoneVal = formatTelefone(result.ddd_telefone_1);
            }

            const ufToEstado: Record<string, string> = {
              AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
              DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
              MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará',
              PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
              RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
              SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
            };
            const estadoName = ufToEstado[result.uf] || '';

            const rSocial = result.razao_social || '';
            const nFantasia = result.nome_fantasia || rSocial;
            const formattedCep = result.cep ? formatCep(result.cep) : '';

            const finalObj = {
              ...data,
              cnpjCpf: formatted,
              clientType: 'PJ',
              col1: rSocial,
              razaoSocial: rSocial,
              nomeFantasia: nFantasia,
              contatoNome: rSocial,
              contatoNomeContato: rSocial,
              contatoTelefone: phoneVal,
              cep: formattedCep,
              logradouro: result.logradouro || '',
              numero: result.numero || '',
              bairro: result.bairro || '',
              cidade: result.municipio || '',
              estado: estadoName,
              uf: result.uf || '',
              pais: 'Brasil'
            };
            
            onChange(finalObj);
            
            setAddress({
              cep: formattedCep,
              logradouro: result.logradouro || '',
              numero: result.numero || '',
              bairro: result.bairro || '',
              pais: 'Brasil',
              estado: estadoName,
              cidade: result.municipio || '',
              uf: result.uf || '',
              complemento: result.complemento || ''
            });
          }
        } catch (error) {
          console.error("Erro ao consultar CNPJ via BrasilAPI:", error);
        } finally {
          setIsLoadingCnpj(false);
        }
      })();
    }
  };

  // --- REUSABLE SECTIONS ---

  // Standard Header
  const renderHeader = () => (
    <div className="bg-white p-4 border border-slate-200 rounded-sm mb-6 shadow-sm relative">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
           <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">Dados Principais</span>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
             <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase ${
               data.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
             }`}>
               {data.status || 'Rascunho'}
             </span>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Input label="ID Interno" value={data.id || 'NOVO'} readOnly className="bg-slate-50 text-slate-800 font-mono" fullWidth />
           <Select label="Tipo de Cadastro" options={[{value: type, label: type}]} disabled fullWidth />
           <Input label="Responsável" value="Admin User" readOnly fullWidth />
        </div>
      </div>
    </div>
  );

  // Standard Workflow
  const renderWorkflow = () => (
    <div className="bg-blue-50 p-4 border border-blue-100 rounded-sm mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
         <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
         <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Workflow: {data.status || 'Rascunho'}</span>
      </div>
      <div className="flex gap-1">
        {['Rascunho', 'Validação', 'Aprovado', 'Ativo'].map((step, idx) => (
           <div key={step} className={`h-1.5 w-12 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
        ))}
      </div>
    </div>
  );

  // Standard Personal Identification Block (Replicating "Team" Layout)
  // Used for: TEAM, DRIVER, BROKER, PARTNER
  const renderStandardPersonalFields = (title: string = "Identificação Pessoal") => (
    <>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        </div>
        
        {/* Row 0: Custom Identifier Code */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {type === 'TEAM' && (
                <Input 
                  label="Matrícula" 
                  placeholder="Ex: A156488" 
                  value={data.matricula || ''}
                  readOnly
                  className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                  fullWidth 
                />
            )}
            {type === 'DRIVER' && (
                <Input 
                  label="Código do Motorista" 
                  placeholder="Ex: M-2406260001" 
                  value={data.codigo || data.code || ''}
                  readOnly
                  className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                  fullWidth 
                />
            )}
            {type === 'PARTNER' && (
                <Input 
                  label="Código do Parceiro" 
                  placeholder="Ex: P-2406260001" 
                  value={data.codigo || data.code || ''}
                  readOnly
                  className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                  fullWidth 
                />
            )}
            {type === 'BROKER' && (
                <Input 
                  label="Código do Corretor" 
                  placeholder="Ex: COR-001" 
                  value={data.codigo || data.code || ''}
                  readOnly
                  className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                  fullWidth 
                />
            )}
        </div>
        
        {/* Row 1: Nome, Sobrenome, Nome Curto / Apelido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input 
              label="Nome" 
              value={data.firstName || ''} 
              onChange={(e) => {
                const val = e.target.value;
                onChange({ 
                  ...data, 
                  firstName: val,
                  contatoNome: val,
                  contatoNomeContato: `${val} ${data.lastName || ''}`.trim()
                });
              }}
              fullWidth 
            />
            <Input 
              label="Sobrenome" 
              value={data.lastName || ''} 
              onChange={(e) => {
                const val = e.target.value;
                onChange({ 
                  ...data, 
                  lastName: val,
                  contatoSobrenome: val,
                  contatoNomeContato: `${data.firstName || ''} ${val}`.trim()
                });
              }}
              fullWidth 
            />
            <Input 
              label="Nome Curto / Apelido" 
              value={data.nickname || ''}
              onChange={(e) => onChange({ ...data, nickname: e.target.value })}
              fullWidth 
            />
        </div>

        {/* Row 2: CPF, RG, Sexo, Data de Nascimento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input 
              label="CPF" 
              placeholder="000.000.000-00" 
              value={data.cpf || ''}
              onChange={(e) => onChange({ ...data, cpf: formatCpfCnpj(e.target.value) })}
              fullWidth 
            />
            <Input 
              label="RG" 
              value={data.rg || ''}
              onChange={(e) => onChange({ ...data, rg: e.target.value })}
              fullWidth 
            />
            <Select 
                label="Sexo" 
                value={data.gender || ''}
                options={[
                    {value: 'M', label: 'M'}, 
                    {value: 'F', label: 'F'}
                ]} 
                onChange={(e) => onChange({ ...data, gender: e.target.value })}
                fullWidth 
            />
            <Input 
              label="Data Nascimento" 
              type="text" 
              placeholder="DD/MM/AAAA"
              value={convertIsoToBrDate(data.birthDate || '')}
              onChange={(e) => {
                const formatted = formatData(e.target.value);
                const iso = convertBrToIsoDate(formatted);
                onChange({ ...data, birthDate: iso });
              }}
              fullWidth 
            />
        </div>
    </>
  );
  // Standard Organizational Data Block (Only for TEAM)
  const renderOrganizationalFields = () => (
    <>
        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Dados Organizacionais</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
             <Input 
               label="Cargo" 
               value={data.cargo || ''}
               onChange={(e) => onChange({ ...data, cargo: e.target.value })}
               fullWidth 
             />
             <Select 
               label="Departamento" 
               value={data.departamento || 'COM'}
               onChange={(e) => onChange({ ...data, departamento: e.target.value })}
               options={[
                 {value: 'COM', label: 'Comercial'}, 
                 {value: 'LOG', label: 'Logística'}, 
                 {value: 'FIN', label: 'Financeiro'}, 
                 {value: 'TI', label: 'Tecnologia'}
               ]} 
               fullWidth 
             />
             <Select 
                label="Unidade" 
                value={data.unidade || 'MT'}
                onChange={(e) => onChange({ ...data, unidade: e.target.value })}
                options={[
                  { value: 'AC', label: 'Acre (AC)' },
                  { value: 'AL', label: 'Alagoas (AL)' },
                  { value: 'AP', label: 'Amapá (AP)' },
                  { value: 'AM', label: 'Amazonas (AM)' },
                  { value: 'BA', label: 'Bahia (BA)' },
                  { value: 'CE', label: 'Ceará (CE)' },
                  { value: 'DF', label: 'Distrito Federal (DF)' },
                  { value: 'ES', label: 'Espírito Santo (ES)' },
                  { value: 'GO', label: 'Goiás (GO)' },
                  { value: 'MA', label: 'Maranhão (MA)' },
                  { value: 'MT', label: 'Mato Grosso (MT)' },
                  { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
                  { value: 'MG', label: 'Minas Gerais (MG)' },
                  { value: 'PA', label: 'Pará (PA)' },
                  { value: 'PB', label: 'Paraíba (PB)' },
                  { value: 'PR', label: 'Paraná (PR)' },
                  { value: 'PE', label: 'Pernambuco (PE)' },
                  { value: 'PI', label: 'Piauí (PI)' },
                  { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
                  { value: 'RN', label: 'Rio Grande do Norte (RN)' },
                  { value: 'RS', label: 'Rio Grande do Sul (RS)' },
                  { value: 'RO', label: 'Rondônia (RO)' },
                  { value: 'RR', label: 'Roraima (RR)' },
                  { value: 'SC', label: 'Santa Catarina (SC)' },
                  { value: 'SP', label: 'São Paulo (SP)' },
                  { value: 'SE', label: 'Sergipe (SE)' },
                  { value: 'TO', label: 'Tocantins (TO)' }
                ]} 
                fullWidth 
              />
             <Input 
               label="Gestor" 
               value={data.gestor || ''}
               onChange={(e) => onChange({ ...data, gestor: e.target.value })}
               fullWidth 
             />
             <Input 
               label="Centro de Custo" 
               value={data.centroCusto || ''}
               onChange={(e) => onChange({ ...data, centroCusto: e.target.value })}
               fullWidth 
             />
        </div>
    </>
  );

  // --- TAB RENDERERS ---

  const renderGeneralFields = () => {
    switch (type) {
      case 'TEAM':
        return (
          <>
            {renderStandardPersonalFields()}
            {renderOrganizationalFields()}
          </>
        );
      
      case 'CLIENT': // Mantém específico conforme solicitado
        return (
          <>
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Identificação Legal e Cadastral</h4>
             
             {/* Row 0: Custom Code */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Input 
                    label={
                      data.relacionamento === 'CLI' 
                        ? 'Código do Cliente' 
                        : data.relacionamento === 'FOR' 
                        ? 'Código do Fornecedor' 
                        : 'Código do Cadastro (Cli/For)'
                    }
                    placeholder={data.relacionamento === 'FOR' ? 'Ex: F-2406260001' : 'Ex: C-2406260001'}
                    value={data.codigo || data.code || ''}
                    readOnly
                    className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                    fullWidth 
                />
             </div>

             {/* Row 1: CNPJ/CPF, Razão Social, Nome Fantasia, Relacionamento */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                 <div className="relative">
                   <Input 
                       label="CNPJ / CPF *" 
                       fullWidth 
                       placeholder="Digite apenas números..."
                       onChange={handleIdentityChange}
                       value={data.cnpjCpf || ''}
                   />
                   {isLoadingCnpj && (
                       <div className="absolute right-2 top-8">
                           <span className="material-symbols-outlined text-brand-600 animate-spin text-sm">progress_activity</span>
                       </div>
                   )}
                 </div>
                <Input 
                    label="Razão Social / Nome" 
                    value={data.col1 || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      const updateObj: any = { ...data, col1: val };
                      if (clientType === 'PJ') {
                        updateObj.contatoNome = val;
                        updateObj.contatoNomeContato = val;
                      }
                      onChange(updateObj);
                    }}
                    fullWidth 
                />
                <Input 
                    label="Nome Fantasia / Sobrenome*" 
                    value={data.nomeFantasia || ''} 
                    onChange={(e) => onChange({ ...data, nomeFantasia: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Relacionamento" 
                    value={data.relacionamento || ''} 
                    options={[
                        {value: 'CLI', label: 'Cliente'}, 
                        {value: 'FOR', label: 'Fornecedor'}, 
                        {value: 'AMB', label: 'Ambos'}
                    ]} 
                    onChange={(e) => onChange({ ...data, relacionamento: e.target.value })}
                    fullWidth 
                />
             </div>

             {/* Row 2: Inscrição Estadual, Inscrição Municipal, Tipo Pessoa (Auto) */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input 
                    label="Inscrição Estadual" 
                    value={data.inscricaoEstadual || ''} 
                    onChange={(e) => onChange({ ...data, inscricaoEstadual: formatIE(e.target.value) })} 
                    fullWidth 
                />
                <Input 
                    label="Inscrição Municipal" 
                    value={data.inscricaoMunicipal || ''} 
                    onChange={(e) => onChange({ ...data, inscricaoMunicipal: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Tipo Pessoa (Auto)" 
                    value={clientType}
                    options={[{value: 'PJ', label: 'Jurídica'}, {value: 'PF', label: 'Física'}]} 
                    disabled 
                    fullWidth 
                    className="bg-slate-50 font-medium"
                />
             </div>
          </>
        );

      case 'DRIVER':
        return (
          <>
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Identificação Legal e Cadastral</h4>
             
             {/* Row 0: Custom Code */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Input 
                    label="Código do Motorista / Transportadora"
                    placeholder="Ex: M-2406260001"
                    value={data.codigo || data.code || ''}
                    readOnly
                    className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                    fullWidth 
                />
             </div>

             {/* Row 1: CNPJ/CPF, Razão Social, Nome Fantasia, Relacionamento */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="relative">
                    <Input 
                        label="CNPJ / CPF *" 
                        fullWidth 
                        placeholder="Digite apenas números..."
                        onChange={handleIdentityChange}
                        value={data.cnpjCpf || ''}
                    />
                    {isLoadingCnpj && (
                        <div className="absolute right-2 top-8">
                            <span className="material-symbols-outlined text-brand-600 animate-spin text-sm">progress_activity</span>
                        </div>
                    )}
                  </div>
                 <Input 
                     label="Razão Social / Nome" 
                     value={data.col1 || ''} 
                     onChange={(e) => {
                       const val = e.target.value;
                       const updateObj: any = { ...data, col1: val };
                       if (clientType === 'PJ') {
                         updateObj.contatoNome = val;
                         updateObj.contatoNomeContato = val;
                       } else if (clientType === 'PF') {
                         const parts = val.split(' ');
                         updateObj.contatoNome = parts[0] || '';
                         updateObj.contatoSobrenome = parts.slice(1).join(' ') || '';
                         updateObj.contatoNomeContato = val;
                       } else if (clientType === 'PF') {
                         const parts = val.split(' ');
                         updateObj.contatoNome = parts[0] || '';
                         updateObj.contatoSobrenome = parts.slice(1).join(' ') || '';
                         updateObj.contatoNomeContato = val;
                       }
                       onChange(updateObj);
                     }}
                     fullWidth 
                 />
                 <Input 
                     label="Nome Fantasia / Sobrenome*" 
                     value={data.nomeFantasia || ''} 
                     onChange={(e) => {
                       const val = e.target.value;
                       const updateObj: any = { ...data, nomeFantasia: val };
                       if (clientType === 'PF') {
                         updateObj.contatoSobrenome = val;
                         updateObj.contatoNomeContato = `${data.col1 || ''} ${val}`.trim();
                       }
                       onChange(updateObj);
                     }} 
                     fullWidth 
                 />
                 <Select 
                     label="Relacionamento" 
                     value={data.relacionamento || 'MOT'} 
                     options={[
                         {value: 'MOT', label: 'Motorista Autônomo'}, 
                         {value: 'TRA', label: 'Transportadora'}, 
                         {value: 'AMB', label: 'Ambos'}
                     ]} 
                     onChange={(e) => onChange({ ...data, relacionamento: e.target.value })}
                     fullWidth 
                 />
              </div>

              {/* Row 2: Inscrição Estadual, Inscrição Municipal, Tipo Pessoa (Auto) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                 <Input 
                     label="Inscrição Estadual" 
                     value={data.inscricaoEstadual || ''} 
                     onChange={(e) => onChange({ ...data, inscricaoEstadual: formatIE(e.target.value) })} 
                     fullWidth 
                 />
                 <Input 
                     label="Inscrição Municipal" 
                     value={data.inscricaoMunicipal || ''} 
                     onChange={(e) => onChange({ ...data, inscricaoMunicipal: e.target.value })} 
                     fullWidth 
                 />
                 <Select 
                     label="Tipo Pessoa (Auto)" 
                     value={clientType}
                     options={[{value: 'PJ', label: 'Jurídica'}, {value: 'PF', label: 'Física'}]} 
                     disabled 
                     fullWidth 
                     className="bg-slate-50 font-medium"
                 />
              </div>
             
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Certificação do Motorista</h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input 
                  label="Número CNH" 
                  value={data.cnh || ''}
                  onChange={(e) => onChange({ ...data, cnh: e.target.value })}
                  fullWidth 
                />
                <Input 
                  label="Categoria" 
                  placeholder="Ex: AE" 
                  value={data.cnhCategoria || ''}
                  onChange={(e) => onChange({ ...data, cnhCategoria: e.target.value })}
                  fullWidth 
                />
                <Input 
                  label="Validade CNH" 
                  type="text" 
                  placeholder="DD/MM/AAAA"
                  value={convertIsoToBrDate(data.cnhValidade || '')}
                  onChange={(e) => {
                    const formatted = formatData(e.target.value);
                    const iso = convertBrToIsoDate(formatted);
                    onChange({ ...data, cnhValidade: iso });
                  }}
                  fullWidth 
                />
             </div>

             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Dados do Veículo</h4>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Input 
                  label="Modelo do Veículo" 
                  placeholder="Ex: Scania R450" 
                  value={data.veiculoModelo || ''}
                  onChange={(e) => onChange({ ...data, veiculoModelo: e.target.value })}
                  fullWidth 
                />
                <Input 
                  label="Placa do Cavalo" 
                  placeholder="ABC-1234" 
                  className="uppercase font-mono" 
                  value={data.veiculoPlaca || ''}
                  onChange={(e) => onChange({ ...data, veiculoPlaca: formatPlaca(e.target.value) })}
                  fullWidth 
                />
                <Input 
                  label="Placa da Carreta" 
                  placeholder="DEF-5678" 
                  className="uppercase font-mono" 
                  value={data.placaCarreta || ''}
                  onChange={(e) => onChange({ ...data, placaCarreta: formatPlaca(e.target.value) })}
                  fullWidth 
                />
             </div>

             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Documentação do Veículo</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Documento do Cavalo Upload */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-600 uppercase">Documento do Cavalo (Cavalinho)</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-all cursor-pointer shadow-sm">
                      <Upload size={14} />
                      Carregar Documento
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'docCavalo')} 
                      />
                    </label>
                    {data.docCavaloUrl && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-emerald-500" /> Carregado
                        </span>
                        <button 
                          type="button" 
                          onClick={() => onChange({ ...data, docCavaloUrl: undefined })}
                          className="text-xs text-red-500 hover:text-red-700 font-bold"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                  {data.docCavaloUrl && (
                    <div className="mt-2 flex flex-col gap-2">
                      {data.docCavaloUrl.startsWith('data:image/') ? (
                        <a href={data.docCavaloUrl} target="_blank" rel="noopener noreferrer" className="block max-w-max">
                          <img 
                            src={data.docCavaloUrl} 
                            alt="Preview do Documento do Cavalo" 
                            className="h-16 w-auto object-cover rounded border border-slate-300 shadow-sm hover:opacity-90 transition-opacity" 
                          />
                        </a>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-full">
                          <a href={data.docCavaloUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-bold">Ver Documento Carregado</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Documento da Carreta Upload */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-600 uppercase">Documento da Carreta</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-all cursor-pointer shadow-sm">
                      <Upload size={14} />
                      Carregar Documento
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'docCarreta')} 
                      />
                    </label>
                    {data.docCarretaUrl && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-emerald-500" /> Carregado
                        </span>
                        <button 
                          type="button" 
                          onClick={() => onChange({ ...data, docCarretaUrl: undefined })}
                          className="text-xs text-red-500 hover:text-red-700 font-bold"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                  {data.docCarretaUrl && (
                    <div className="mt-2 flex flex-col gap-2">
                      {data.docCarretaUrl.startsWith('data:image/') ? (
                        <a href={data.docCarretaUrl} target="_blank" rel="noopener noreferrer" className="block max-w-max">
                          <img 
                            src={data.docCarretaUrl} 
                            alt="Preview do Documento da Carreta" 
                            className="h-16 w-auto object-cover rounded border border-slate-300 shadow-sm hover:opacity-90 transition-opacity" 
                          />
                        </a>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-full">
                          <a href={data.docCarretaUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-bold">Ver Documento Carregado</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
             </div>
          </>
        );

      case 'BROKER':
        return (
            <>
                {renderStandardPersonalFields()}
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Registro Profissional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input 
                      label="Registro (CRECI/Outros)" 
                      value={data.registroProfissional || ''}
                      onChange={(e) => onChange({ ...data, registroProfissional: e.target.value })}
                      fullWidth 
                    />
                    <Input 
                      label="Região de Atuação Principal" 
                      value={data.regiaoAtuacao || ''}
                      onChange={(e) => onChange({ ...data, regiaoAtuacao: e.target.value })}
                      fullWidth 
                    />
                </div>
            </>
        );

      case 'PARTNER':
        return (
            <>
                {renderStandardPersonalFields()}
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Perfil da Parceria</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Select 
                      label="Tipo de Parceiro" 
                      value={data.parceiroTipo || ''}
                      onChange={(e) => onChange({ ...data, parceiroTipo: e.target.value })}
                      options={[
                        {value: '', label: 'Selecione...'},
                        ...(partnerTypes && partnerTypes.length > 0 
                          ? partnerTypes.map(pt => ({ value: (pt as any).codigo || pt.code, label: (pt as any).nome || pt.name }))
                          : [
                              {value: 'LOG', label: 'Logístico'},
                              {value: 'FIS', label: 'Fiscal / Tributário'},
                              {value: 'EXP', label: 'Exportação / Trading'},
                              {value: 'TEC', label: 'Tecnologia / TI'}
                            ])
                      ]} 
                      fullWidth 
                    />
                </div>
            </>
        );

      case 'VEHICLE': // Mantém específico de Veículo (Não é pessoa)
         return (
           <>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 block border-b border-slate-100 pb-1">Identificação do Veículo</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Input label="Placa" defaultValue={data.col1} fullWidth className="uppercase font-mono" />
                 <Input label="Renavam" fullWidth />
                 <Input label="Chassi" fullWidth />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Input label="Marca" fullWidth />
                 <Input label="Modelo" fullWidth />
                 <Input label="Ano" type="number" fullWidth />
              </div>
              
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 block border-b border-slate-100 pb-1 mt-6">Características Físicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Select label="Tipo Veículo" options={[
                   {value: 'TRUCK', label: 'Truck'}, 
                   {value: 'CARRETA', label: 'Carreta'},
                   {value: 'BITREM', label: 'Bi-trem'},
                   {value: 'RODOTREM', label: 'Rodotrem'}
                 ]} fullWidth />
                 <Input label="Capacidade Carga (Kg)" fullWidth />
                 <Select label="Tipo Carroceria" options={[
                   {value: 'GRADE_BAIXA', label: 'Grade Baixa'}, 
                   {value: 'GRANELEIRO', label: 'Graneleiro'},
                   {value: 'BOIADEIRA', label: 'Boiadeira'},
                   {value: 'BAU', label: 'Baú'},
                   {value: 'FRIGORIFICO', label: 'Frigorífico'}
                 ]} fullWidth />
              </div>
           </>
         );
      case 'COST_CENTER':
        return (
          <>
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Estrutura de Centro de Custo</h4>
             
             {/* Row 1: Código, Nome, Tipo */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input 
                    label="Código Estruturado" 
                    placeholder="Ex: 01.100.001"
                    value={data.codigo || data.code || ''}
                    readOnly
                    className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                    fullWidth 
                />
                <Input 
                    label="Nome / Identificador" 
                    placeholder="Ex: Confinamento Pasto Seco"
                    value={data.col1 || ''} 
                    onChange={(e) => onChange({ ...data, col1: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Tipo de Centro" 
                    value={data.tipo || 'Operacional'} 
                    options={[
                        {value: 'Operacional', label: 'Operacional'}, 
                        {value: 'Administrativo', label: 'Administrativo'}, 
                        {value: 'Produtivo', label: 'Produtivo'}
                    ]} 
                    onChange={(e) => onChange({ ...data, tipo: e.target.value })}
                    fullWidth 
                />
             </div>

             {/* Row 2: Responsável, Status */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input 
                    label="Responsável / Gestor" 
                    placeholder="Nome do gestor..."
                    value={data.responsavel || ''} 
                    onChange={(e) => onChange({ ...data, responsavel: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Status" 
                    value={data.status || 'Ativo'} 
                    options={[
                        {value: 'Ativo', label: 'Ativo'}, 
                        {value: 'Inativo', label: 'Inativo'}
                    ]} 
                    onChange={(e) => onChange({ ...data, status: e.target.value })}
                    fullWidth 
                />
             </div>

             {/* Row 3: Descrição */}
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Descrição / Objetivo</label>
                <textarea
                    placeholder="Objetivo do centro de custo..."
                    value={data.descricao || ''}
                    onChange={(e) => onChange({ ...data, descricao: e.target.value })}
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg text-xs font-sans text-gray-700 outline-none focus:border-[#071757] focus:ring-1 focus:ring-[#071757] transition-all"
                />
             </div>
          </>
        );
      case 'BANK':
        return (
          <>
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Cadastro de Instituição Bancária</h4>
             
             {/* Row 1: Código, Nome, Status */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input 
                    label="Código do Banco" 
                    placeholder="Ex: 001, 237, 341"
                    value={data.codigo || data.code || ''}
                    onChange={(e) => onChange({ ...data, codigo: e.target.value, code: e.target.value })}
                    className="font-mono"
                    fullWidth 
                />
                <Input 
                    label="Nome do Banco" 
                    placeholder="Ex: Banco do Brasil S.A."
                    value={data.col1 || ''} 
                    onChange={(e) => onChange({ ...data, col1: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Status" 
                    value={data.status || 'Ativo'} 
                    options={[
                        {value: 'Ativo', label: 'Ativo'}, 
                        {value: 'Inativo', label: 'Inativo'}
                    ]} 
                    onChange={(e) => onChange({ ...data, status: e.target.value })}
                    fullWidth 
                />
             </div>
          </>
        );
      case 'PARTNER_TYPE':
        return (
          <>
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Cadastro de Tipo de Parceiro</h4>
             
             {/* Row 1: Código, Nome, Status */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input 
                    label="Código do Tipo" 
                    placeholder="Ex: T-2406260001"
                    value={data.codigo || data.code || ''}
                    readOnly
                    className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                    fullWidth 
                />
                <Input 
                    label="Nome do Tipo" 
                    placeholder="Ex: Fiscal / Tributário"
                    value={data.nome || ''} 
                    onChange={(e) => onChange({ ...data, nome: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Status" 
                    value={data.status || 'Ativo'} 
                    options={[
                        {value: 'Ativo', label: 'Ativo'}, 
                        {value: 'Inativo', label: 'Inativo'}
                    ]} 
                    onChange={(e) => onChange({ ...data, status: e.target.value })}
                    fullWidth 
                />
             </div>
             {/* Row 2: Descrição */}
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                <textarea
                    placeholder="Descrição do tipo de parceiro..."
                    value={data.descricao || ''}
                    onChange={(e) => onChange({ ...data, descricao: e.target.value })}
                    className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg text-xs font-sans text-gray-700 outline-none focus:border-[#071757] focus:ring-1 focus:ring-[#071757] transition-all"
                />
             </div>
          </>
        );
      case 'CATEGORY':
        return (
          <>
             <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Cadastro de Categoria de Animal</h4>
             
             {/* Row 1: Código, Nome, Status */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input 
                    label="Código da Categoria" 
                    placeholder="Ex: K-2406260001"
                    value={data.codigo || data.code || ''}
                    readOnly
                    className="bg-slate-50 text-slate-800 font-mono cursor-not-allowed"
                    fullWidth 
                />
                <Input 
                    label="Nome da Categoria" 
                    placeholder="Ex: Boi Gordo"
                    value={data.nome || ''} 
                    onChange={(e) => onChange({ ...data, nome: e.target.value })} 
                    fullWidth 
                />
                <Select 
                    label="Status" 
                    value={data.status || 'Ativo'} 
                    options={[
                        {value: 'Ativo', label: 'Ativo'}, 
                        {value: 'Inativo', label: 'Inativo'}
                    ]} 
                    onChange={(e) => onChange({ ...data, status: e.target.value })}
                    fullWidth 
                />
             </div>
             {/* Row 2: Descrição */}
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                <textarea
                    placeholder="Descrição da categoria..."
                    value={data.descricao || ''}
                    onChange={(e) => onChange({ ...data, descricao: e.target.value })}
                    className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg text-xs font-sans text-gray-700 outline-none focus:border-[#071757] focus:ring-1 focus:ring-[#071757] transition-all"
                />
             </div>
          </>
        );
      default:
        return <Input label="Nome / Descrição" defaultValue={data.col1} fullWidth />;
    }
  };

  const renderContactFields = () => {
    if (type === 'COST_CENTER' || type === 'BANK' || type === 'PARTNER_TYPE' || type === 'CATEGORY') return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-sm">
           <span className="material-symbols-outlined text-5xl mb-3">contact_mail</span>
           <span className="text-sm font-medium uppercase tracking-wide">Acesso não aplicável para este tipo</span>
        </div>
    );

    // Standardized Contact Tab for ALL Modules
    // Fields Nome, Sobrenome and Nome de Contato are removed for DRIVER, VEHICLE, BROKER and PARTNER
    // as requested, because they are already in the General tab.
    const showNameFields = type === 'TEAM' || type === 'CLIENT' || type === 'DRIVER';

    return (
        <div className="space-y-6">
            {showNameFields && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                        label="Nome" 
                        value={data.contatoNome || ''} 
                        onChange={(e) => onChange({ ...data, contatoNome: e.target.value })} 
                        fullWidth 
                    />
                    <Input 
                        label="Sobrenome" 
                        value={data.contatoSobrenome || ''} 
                        onChange={(e) => onChange({ ...data, contatoSobrenome: e.target.value })} 
                        fullWidth 
                    />
                    <Input 
                        label={type === 'CLIENT' ? "Nome de Contato *" : "Nome de Contato"} 
                        value={data.contatoNomeContato || ''} 
                        onChange={(e) => onChange({ ...data, contatoNomeContato: e.target.value })} 
                        fullWidth 
                    />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                    label={type === 'CLIENT' ? "Telefone / Celular *" : "Telefone / Celular"} 
                    value={data.contatoTelefone || ''} 
                    onChange={(e) => onChange({ ...data, contatoTelefone: formatTelefone(e.target.value) })} 
                    fullWidth 
                />
                <Input 
                    label="WhatsApp" 
                    value={data.contatoWhatsapp || ''} 
                    onChange={(e) => onChange({ ...data, contatoWhatsapp: e.target.value })} 
                    fullWidth 
                />
                <Input 
                    label="E-mail" 
                    type="email" 
                    value={data.contatoEmail || ''} 
                    onChange={(e) => onChange({ ...data, contatoEmail: e.target.value })} 
                    fullWidth 
                />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Observações</label>
                <textarea 
                    value={data.contatoObservacoes || ''} 
                    onChange={(e) => onChange({ ...data, contatoObservacoes: e.target.value })}
                    className="h-24 px-3 py-2 text-sm text-slate-800 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400 bg-white disabled:bg-slate-100 resize-none"
                />
            </div>
        </div>
    );
  };

  const renderAddressFields = () => {
    if (type === 'COST_CENTER' || type === 'BANK' || type === 'PARTNER_TYPE' || type === 'CATEGORY') return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-sm">
           <span className="material-symbols-outlined text-5xl mb-3">map</span>
           <span className="text-sm font-medium uppercase tracking-wide">Acesso não aplicável para este tipo</span>
        </div>
    );

    return (
     <div className="space-y-6">
        {/* Linha 1: CEP, Logradouro, Número, Bairro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
           <div className="md:col-span-2 relative">
             <Input 
                 label={type === 'CLIENT' ? "CEP *" : "CEP"} 
                 value={address.cep} 
                 onChange={handleCepChange} 
                 placeholder="00000-000" 
                 maxLength={9} 
                 fullWidth 
             />
             {isLoadingCep && (
                 <div className="absolute right-2 top-8">
                     <span className="material-symbols-outlined text-brand-600 animate-spin text-sm">progress_activity</span>
                 </div>
             )}
           </div>
           <div className="md:col-span-6">
             <Input 
                 label={type === 'CLIENT' ? "Logradouro *" : "Logradouro"} 
                 value={address.logradouro} 
                 onChange={(e) => setAddress({...address, logradouro: e.target.value})}
                 fullWidth 
             />
           </div>
           <div className="md:col-span-2">
             <Input 
                 label="Número" 
                 value={address.numero}
                 onChange={(e) => setAddress({...address, numero: e.target.value})}
                 fullWidth 
             />
           </div>
           <div className="md:col-span-2">
              <Input 
                 label={type === 'CLIENT' ? "Bairro *" : "Bairro"} 
                 value={address.bairro}
                 onChange={(e) => setAddress({...address, bairro: e.target.value})}
                 fullWidth 
              />
           </div>
        </div>

        {/* Linha 2: País, Estado, Cidade, UF */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
           <div className="md:col-span-3">
             <Input label="País" value={address.pais} onChange={(e) => setAddress({...address, pais: e.target.value})} fullWidth />
           </div>
           <div className="md:col-span-3">
             <Input label="Estado" value={address.estado} readOnly className="bg-slate-50" fullWidth />
           </div>
           <div className="md:col-span-4">
              <Input label={type === 'CLIENT' ? "Cidade *" : "Cidade"} value={address.cidade} readOnly className="bg-slate-50" fullWidth />
           </div>
           <div className="md:col-span-2">
              <Input label={type === 'CLIENT' ? "UF *" : "UF"} value={address.uf} readOnly className="bg-slate-50 uppercase" fullWidth />
           </div>
        </div>

        {/* Linha 3: Complemento */}
        <div className="flex flex-col gap-2">
            <Input 
                 label="Complemento" 
                 value={address.complemento}
                 onChange={(e) => setAddress({...address, complemento: e.target.value})}
                 fullWidth 
            />
            {mapSourceUri && (
                 <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 justify-end">
                     <span className="material-symbols-outlined text-[12px]">map</span>
                     <span>Dados providos por</span>
                     <a href={mapSourceUri} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline flex items-center gap-1 font-semibold">
                         Google Maps <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                     </a>
                 </div>
            )}
        </div>
     </div>
    );
  };

  const renderSecurityFields = () => {
    if (type !== 'TEAM') return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-sm">
           <span className="material-symbols-outlined text-5xl mb-3">lock_person</span>
           <span className="text-sm font-medium uppercase tracking-wide">Acesso não aplicável para este tipo</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Credenciais e Acesso</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Select 
                 label="Perfil de Acesso" 
                 value={data.segurancaPerfil || 'ADM'} 
                 options={[
                    {value: 'ADM', label: 'Administrador Global'}, 
                    {value: 'MGR', label: 'Gerente / Gestor'}, 
                    {value: 'OPR', label: 'Operador Padrão'},
                    {value: 'VIEW', label: 'Apenas Leitura'}
                 ]} 
                 onChange={(e) => onChange({ ...data, segurancaPerfil: e.target.value })}
                 fullWidth 
               />
               <Select 
                 label="Papel Principal" 
                 value={data.segurancaPapel || 'ADM'} 
                 options={[
                    {value: 'FIS', label: 'Analista Fiscal'},
                    {value: 'SUP', label: 'Analista de Suprimentos'},
                    {value: 'LOG', label: 'Analista Logístico'},
                    {value: 'FIN', label: 'Analista Financeiro'},
                    {value: 'ADM', label: 'Administrador'}
                 ]} 
                 onChange={(e) => onChange({ ...data, segurancaPapel: e.target.value })}
                 fullWidth 
               />
               <Select 
                 label="Status do Usuário" 
                 value={data.segurancaStatus || 'A'} 
                 options={[{value: 'A', label: 'Ativo'}, {value: 'I', label: 'Inativo'}, {value: 'B', label: 'Bloqueado'}]} 
                 onChange={(e) => onChange({ ...data, segurancaStatus: e.target.value })}
                 fullWidth 
               />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Input 
                 label="Login de Acesso (E-mail)" 
                 placeholder="usuario@oxcommerce.com" 
                 value={data.segurancaLogin || ''} 
                 onChange={(e) => onChange({ ...data, segurancaLogin: e.target.value })}
                 fullWidth 
               />
               <Input label="Último Login" value={data.segurancaUltimoLogin || "Ainda não acessou"} readOnly className="bg-slate-50" fullWidth />
               <Input label="IP Último Acesso" value={data.segurancaIpUltimoAcesso || "N/A"} readOnly className="bg-slate-50" fullWidth />
            </div>

            {/* Password Section */}
            <div className="border-t border-slate-100 pt-6">
               {data.id ? (
                 <div className="space-y-4">
                   <div className="flex items-center">
                     <input
                       id="alterarSenhaCheckbox"
                       type="checkbox"
                       checked={data.alterarSenha || false}
                       onChange={(e) => onChange({ 
                         ...data, 
                         alterarSenha: e.target.checked,
                         segurancaSenha: '',
                         segurancaConfirmarSenha: ''
                       })}
                       className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                     />
                     <label htmlFor="alterarSenhaCheckbox" className="ml-2 block text-xs font-bold text-slate-700 uppercase cursor-pointer">
                       Alterar Senha de Acesso
                     </label>
                   </div>
                   
                   {data.alterarSenha && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                       <Input 
                         label="Nova Senha" 
                         type="password"
                         placeholder="Mínimo 6 caracteres"
                         value={data.segurancaSenha || ''} 
                         onChange={(e) => onChange({ ...data, segurancaSenha: e.target.value })}
                         fullWidth 
                       />
                       <Input 
                         label="Confirmar Nova Senha" 
                         type="password"
                         placeholder="Repita a nova senha"
                         value={data.segurancaConfirmarSenha || ''} 
                         onChange={(e) => onChange({ ...data, segurancaConfirmarSenha: e.target.value })}
                         fullWidth 
                       />
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input 
                     label="Senha de Acesso *" 
                     type="password"
                     placeholder="Mínimo 6 caracteres"
                     value={data.segurancaSenha || ''} 
                     onChange={(e) => onChange({ ...data, segurancaSenha: e.target.value })}
                     fullWidth 
                   />
                   <Input 
                     label="Confirmar Senha *" 
                     type="password"
                     placeholder="Repita a senha"
                     value={data.segurancaConfirmarSenha || ''} 
                     onChange={(e) => onChange({ ...data, segurancaConfirmarSenha: e.target.value })}
                     fullWidth 
                   />
                 </div>
               )}
            </div>
        </div>
    );
  };

  const renderFinancialFields = () => {
    if (type === 'COST_CENTER' || type === 'BANK' || type === 'PARTNER_TYPE' || type === 'CATEGORY') return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-sm">
           <span className="material-symbols-outlined text-5xl mb-3">credit_card</span>
           <span className="text-sm font-medium uppercase tracking-wide">Acesso não aplicável para este tipo</span>
        </div>
    );

    // Reusable Bank Block Logic (Column 1: Code, Column 2: Name)
    const renderBankBlock = () => (
        <>
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Dados Bancários</h4>
            
            {/* Split Bank Selection: Code | Name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                <div className="md:col-span-3">
                    <Select 
                        label="Cód. Banco" 
                        options={[{value: '', label: 'Selecione...'}, ...banks.map(b => ({value: b.code, label: `${b.code}`}))]} 
                        onChange={handleBankChange}
                        value={bankInfo.code}
                        fullWidth 
                    />
                </div>
                <div className="md:col-span-9">
                    <Input 
                        label="Nome do Banco" 
                        value={bankInfo.name} 
                        readOnly 
                        className="bg-slate-50 text-slate-600 font-medium" 
                        fullWidth 
                    />
                </div>
            </div>

            {/* Compact Row 2: Agency (Small) | Account (Med) | Type (Med) | Pix (Auto) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-2">
                    <Input 
                      label="Agência" 
                      placeholder="0000-0" 
                      value={data.financeiroAgencia || ''} 
                      onChange={(e) => onChange({ ...data, financeiroAgencia: e.target.value })}
                      fullWidth 
                    />
                </div>
                <div className="md:col-span-3">
                    <Input 
                      label="Conta Corrente" 
                      placeholder="00000-0" 
                      value={data.financeiroConta || ''} 
                      onChange={(e) => onChange({ ...data, financeiroConta: e.target.value })}
                      fullWidth 
                    />
                </div>
                <div className="md:col-span-3">
                     <Select 
                       label="Tipo de Conta" 
                       value={data.financeiroTipoConta || 'CC'} 
                       options={[{value: 'CC', label: 'Conta Corrente'}, {value: 'CP', label: 'Conta Poupança'}, {value: 'CS', label: 'Conta Salário'}]} 
                       onChange={(e) => onChange({ ...data, financeiroTipoConta: e.target.value })}
                       fullWidth 
                     />
                </div>
                <div className="md:col-span-4">
                    <Input 
                      label="Chave PIX" 
                      value={data.financeiroChavePix || ''} 
                      onChange={(e) => onChange({ ...data, financeiroChavePix: e.target.value })}
                      fullWidth 
                    />
                </div>
            </div>
        </>
    );

    // Clients have Extra Commercial Conditions + Standard Bank Block
    if (type === 'CLIENT') {
        return (
            <div className="space-y-6">
                {renderBankBlock()}

                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6">Condições Comerciais</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select 
                      label="Condição de Pagamento Padrão" 
                      value={data.financeiroCondicaoPagamento || '30'} 
                      options={[{value: '30', label: '30 Dias Líquido'}, {value: '15', label: '15 Dias'}, {value: '0', label: 'À Vista'}]} 
                      onChange={(e) => onChange({ ...data, financeiroCondicaoPagamento: e.target.value })}
                      fullWidth 
                    />
                    <Input 
                      label="Limite de Crédito (R$)" 
                      placeholder="0,00" 
                      value={data.financeiroLimiteCredito || ''} 
                      onChange={(e) => onChange({ ...data, financeiroLimiteCredito: e.target.value })}
                      fullWidth 
                    />
                    <Select 
                      label="Moeda Padrão" 
                      value={data.financeiroMoedaPadrao || 'BRL'} 
                      options={[{value: 'BRL', label: 'BRL - Real'}, {value: 'USD', label: 'USD - Dólar'}]} 
                      onChange={(e) => onChange({ ...data, financeiroMoedaPadrao: e.target.value })}
                      fullWidth 
                    />
                </div>
            </div>
        );
    }
    
    // Broker Specifics + Standard Bank Block
    if (type === 'BROKER') {
        return (
            <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Comissionamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Input 
                     label="Comissão Padrão (%)" 
                     placeholder="0.5%" 
                     value={data.financeiroComissaoPadrao || ''} 
                     onChange={(e) => onChange({ ...data, financeiroComissaoPadrao: e.target.value })}
                     fullWidth 
                   />
                   <Select 
                     label="Base de Cálculo" 
                     value={data.financeiroBaseCalculo || 'LIQ'} 
                     options={[{value: 'LIQ', label: 'Valor Líquido'}, {value: 'BRT', label: 'Valor Bruto'}]} 
                     onChange={(e) => onChange({ ...data, financeiroBaseCalculo: e.target.value })}
                     fullWidth 
                   />
                </div>
                {renderBankBlock()}
            </div>
        );
    }

    // Partner Specifics + Standard Bank Block
    if (type === 'PARTNER') {
        return (
            <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Condições Comerciais</h4>
                <Input 
                  label="Condições de Pagamento / Recebimento" 
                  placeholder="Ex: Mensal dia 10" 
                  value={data.financeiroCondicoesPagamentoRecebimento || ''} 
                  onChange={(e) => onChange({ ...data, financeiroCondicoesPagamentoRecebimento: e.target.value })}
                  fullWidth 
                />
                {renderBankBlock()}
            </div>
        );
    }

    // Default for TEAM, DRIVER, VEHICLE (Using Standard Bank Block with Security Warning)
    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-sm text-sm text-yellow-800 mb-2 flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-[20px]">lock</span>
                Dados sensíveis. Apenas usuários do grupo Financeiro podem editar.
            </div>
            {renderBankBlock()}
        </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Geral': return <div className="space-y-6">{renderGeneralFields()}</div>;
      case 'Contato': return renderContactFields();
      case 'Endereço': return renderAddressFields();
      case 'Segurança': return renderSecurityFields();
      case 'Financeiro': return renderFinancialFields();
      default: return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-sm font-semibold">
           <span className="material-symbols-outlined text-5xl mb-3 font-normal">construction</span>
           <span className="text-sm font-medium uppercase tracking-wide">Módulo em desenvolvimento</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col w-full text-left">

      {/* Corporate 'Folder/Tab' Navigation - Consistent with Buttons & Inputs (rounded-sm) */}
      <div className="flex items-end gap-1 px-4 border-b border-slate-200 select-none">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
            className={`
              relative flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all rounded-t-sm z-10 -mb-px border-t-2 border-x cursor-pointer
              ${activeTab === tab
                ? 'bg-white border-t-brand-600 border-x-slate-200 border-b-white text-brand-600 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]'
                : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 hover:border-b-slate-200'
              }
            `}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeTab === tab ? 'text-brand-600' : 'text-slate-400'}`}>
              {tabIcons[tab] || 'circle'}
            </span>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content - Connected to Active Tab */}
      <div className="bg-white p-8 border border-slate-200 border-t-0 rounded-b-sm shadow-sm min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};
