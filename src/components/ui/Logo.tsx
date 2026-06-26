/**
 * OxCommerce Logo Components
 * Baseado nas logos originais da marca — símbolo OX institucional
 */

import React from 'react';

interface LogoProps {
  className?: string;
  /** 'white' = logo branca (para fundos escuros) | 'blue' = logo azul (para fundos claros) */
  variant?: 'white' | 'blue' | 'gold';
  /** Inclui o texto "COMMERCE" abaixo do símbolo */
  showText?: boolean;
}

export function OxLogo({ className = 'h-10 w-auto', variant = 'white', showText = true }: LogoProps) {
  const symbolColor = variant === 'white' ? '#FFFFFF' : variant === 'gold' ? '#D8B46A' : '#071757';
  const textColor   = variant === 'white' ? '#FFFFFF' : variant === 'gold' ? '#D8B46A' : '#0F172A';

  return (
    <svg
      viewBox={showText ? '0 0 260 130' : '0 0 260 90'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OxCommerce"
    >
      {/* ── Símbolo OX ── */}
      {/* Círculo O — lado esquerdo */}
      <circle
        cx="72"
        cy="48"
        r="44"
        stroke={symbolColor}
        strokeWidth="14"
        fill="none"
      />
      {/* Detalhe curvo interno (lune) */}
      <path
        d="M 90 20 Q 116 36 110 60"
        stroke={symbolColor}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* X — lado direito */}
      {/* Braço superior esquerdo para inferior direito */}
      <path
        d="M 148 10 Q 190 48 232 86"
        stroke={symbolColor}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Braço superior direito para inferior esquerdo */}
      <path
        d="M 232 10 Q 190 48 148 86"
        stroke={symbolColor}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Texto "COMMERCE" (opcional) ── */}
      {showText && (
        <text
          x="130"
          y="122"
          textAnchor="middle"
          fontFamily="'Inter', 'Manrope', system-ui, sans-serif"
          fontSize="18"
          fontWeight="400"
          letterSpacing="8"
          fill={textColor}
          opacity="0.85"
        >
          COMMERCE
        </text>
      )}
    </svg>
  );
}

/** Versão só símbolo — ícone compacto para favicon / avatar */
export function OxIcon({ className = 'h-8 w-8', variant = 'white' }: Omit<LogoProps, 'showText'>) {
  return <OxLogo className={className} variant={variant} showText={false} />;
}
