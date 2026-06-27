/**
 * OxCommerce Logo Components
 * Usa os arquivos SVG reais da marca
 */

import React from 'react';
import logoWhitePng from '@/assets/logo_white.png';
import logoBluePng from '@/assets/logo_blue.png';

interface LogoProps {
  className?: string;
  /** 'white' = logo branca (fundos escuros) | 'blue' = logo azul (fundos claros) */
  variant?: 'white' | 'blue';
  alt?: string;
}

export function OxLogo({ className = 'h-10 w-auto', variant = 'white', alt = 'OxCommerce' }: LogoProps) {
  const src = variant === 'white' ? logoWhitePng : logoBluePng;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

/** Alias – ícone compacto (mesmo componente, só muda o tamanho via className) */
export function OxIcon({ className = 'h-8 w-8', variant = 'white' }: Omit<LogoProps, 'alt'>) {
  return <OxLogo className={className} variant={variant} />;
}
