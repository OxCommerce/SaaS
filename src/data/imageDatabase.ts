/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgroImage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  accentColor: string;
}

export const AGRO_IMAGE_DATABASE: AgroImage[] = [
  {
    id: 1,
    title: 'Ox-Commerce',
    subtitle: 'Rastreabilidade Pecuária',
    description: 'Rastreamento inteligente de rebanhos de Nelore, monitorando o ciclo de vida completo diretamente do pasto.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ocasi%C3%A3o_Parida_de_Macho_do_Xyuc_das_Reunidas.jpg/1280px-Ocasi%C3%A3o_Parida_de_Macho_do_Xyuc_das_Reunidas.jpg',
    accentColor: 'border-[#D8B46A]/30 bg-[#D8B46A]/10 text-[#D8B46A]'
  },
  {
    id: 2,
    title: 'Genética & Melhoramento',
    subtitle: 'Touros de Elite Nelore',
    description: 'Mapeamento e seleção dos melhores exemplares da raça Nelore, garantindo alta fertilidade, rusticidade e rendimento de carcaça.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Touro_Nelore_REFON.jpg/1280px-Touro_Nelore_REFON.jpg',
    accentColor: 'border-[#071757]/30 bg-[#071757]/10 text-[#57628D]'
  },
  {
    id: 3,
    title: 'Manejo no Pasto',
    subtitle: 'Tecnologia e Sustentabilidade',
    description: 'Rotação de pastagem e acompanhamento ativo de rebanhos Nelore zebuínos para pecuária de corte eficiente.',
    imageUrl: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=1200',
    accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
  }
];
