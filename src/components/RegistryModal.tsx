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
                  onSave(formData);
                  onClose();
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
