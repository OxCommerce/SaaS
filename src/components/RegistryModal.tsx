import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, UserPlus } from 'lucide-react';
import { RegistryDetail } from './RegistryDetail';

interface RegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: 'TEAM' | 'CLIENT' | 'DRIVER' | 'VEHICLE' | 'BROKER' | 'PARTNER' | 'COST_CENTER' | 'BANK' | 'PARTNER_TYPE' | 'CATEGORY';
  title: string;
  banks: { code: string; name: string }[];
  partnerTypes?: { code: string; name: string }[];
  initialData?: any;
}

const isValidCPF = (value: string): boolean => {
  if (!value) return true;
  const cleanCPF = value.replace(/[^\d]/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder >= 10 ? 0 : remainder;
  if (parseInt(cleanCPF.charAt(9)) !== digit1) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder >= 10 ? 0 : remainder;
  return parseInt(cleanCPF.charAt(10)) === digit2;
};

const isValidCNPJ = (value: string): boolean => {
  if (!value) return true;
  const cleanCNPJ = value.replace(/[^\d]/g, '');
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  let digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
};

export const RegistryModal: React.FC<RegistryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  type, 
  title,
  banks,
  partnerTypes,
  initialData
}) => {
  const [formData, setFormData] = React.useState<any>(initialData || {});

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  const validateForm = (data: any) => {
    // 1. CPF Validation for personal registrations (TEAM, BROKER, PARTNER)
    if (type === 'TEAM' || type === 'BROKER' || type === 'PARTNER') {
      if (data.cpf && data.cpf.trim() !== '') {
        if (!isValidCPF(data.cpf)) {
          alert("O CPF informado é inválido. Por favor, verifique a digitação ou informe um CPF válido.");
          return false;
        }
      }
    }

    // 2. Client and Driver registration validation
    if (type === 'CLIENT' || type === 'DRIVER') {
      // Geral fields validation
      if (!data.cnpjCpf || !data.cnpjCpf.trim()) {
        alert("Por favor, preencha o campo CNPJ / CPF na aba Geral.");
        return false;
      }
      
      const cleanDoc = data.cnpjCpf.replace(/[^\d]/g, '');
      const isPJ = cleanDoc.length > 11;
      
      if (isPJ) {
        if (!isValidCNPJ(data.cnpjCpf)) {
          alert("O CNPJ informado é inválido. Por favor, verifique a digitação.");
          return false;
        }
      } else {
        if (!isValidCPF(data.cnpjCpf)) {
          alert("O CPF informado é inválido. Por favor, verifique a digitação.");
          return false;
        }
      }

      if ((!data.col1 || !data.col1.trim()) && (!data.razaoSocial || !data.razaoSocial.trim())) {
        alert("Por favor, preencha o campo Razão Social / Nome Completo na aba Geral.");
        return false;
      }
      if (!data.nomeFantasia || !data.nomeFantasia.trim()) {
        alert("Por favor, preencha o campo Nome Fantasia / Apelido na aba Geral.");
        return false;
      }

      // Contato fields validation
      if (!data.contatoNomeContato || !data.contatoNomeContato.trim()) {
        alert("Por favor, preencha o campo Nome de Contato na aba Contato.");
        return false;
      }
      if (!data.contatoTelefone || !data.contatoTelefone.trim()) {
        alert("Por favor, preencha o campo Telefone / Celular na aba Contato.");
        return false;
      }

      // Endereço fields validation
      if (!data.cep || !data.cep.trim()) {
        alert("Por favor, preencha o campo CEP na aba Endereço.");
        return false;
      }
      if (!data.logradouro || !data.logradouro.trim()) {
        alert("Por favor, preencha o campo Logradouro na aba Endereço.");
        return false;
      }
      if (!data.bairro || !data.bairro.trim()) {
        alert("Por favor, preencha o campo Bairro na aba Endereço.");
        return false;
      }
      if (!data.cidade || !data.cidade.trim()) {
        alert("Por favor, preencha o campo Cidade na aba Endereço.");
        return false;
      }
      if (!data.uf || !data.uf.trim()) {
        alert("Por favor, preencha o campo UF na aba Endereço.");
        return false;
      }
    }

    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-6xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-600 rounded-lg text-white">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{formData.id ? 'Editar Registro Existente' : 'Novo Registro de Cadastro'}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                type="button"
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
              <div className="max-w-5xl mx-auto">
                <RegistryDetail 
                  type={type} 
                  data={formData} 
                  onChange={(newData) => setFormData(newData)}
                  banks={banks} 
                  partnerTypes={partnerTypes}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                type="button"
                className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-all uppercase tracking-wide cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (validateForm(formData)) {
                    onSave(formData);
                    onClose();
                  }
                }}
                type="button"
                className="px-6 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all flex items-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
