/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { AGRO_IMAGE_DATABASE } from '../data/imageDatabase';
import { supabase } from '../supabaseClient';
import logoWhite from '@/assets/logo_white.png';

interface HomeViewProps {
  onNavigateToLogin: () => void;
  logoUrl?: string;
}

export default function HomeView({ onNavigateToLogin, logoUrl }: HomeViewProps) {
  const [slides, setSlides] = useState(AGRO_IMAGE_DATABASE);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadSupabaseImages() {
      try {
        const { data, error } = await supabase
          .from('agro_images')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.warn('Supabase fetch error, using local fallback:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            imageUrl: item.image_url,
            accentColor: item.accent_color || 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          }));
          setSlides(mapped);
        }
      } catch (err) {
        console.warn('Failed to connect to Supabase, using local fallback:', err);
      }
    }
    
    loadSupabaseImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div 
      className="min-h-screen flex flex-col justify-between text-white cursor-pointer select-none overflow-hidden relative font-sans"
      onClick={onNavigateToLogin}
    >
      
      {/* Background Image Carousel with absolute positioning */}
      <div className="absolute inset-0 z-0 animate-fade-in">
        <div className="absolute inset-0 bg-slate-950/80 z-10 backdrop-blur-[2px]" />
        {slide && slide.imageUrl && (
          <img 
            src={slide.imageUrl} 
            alt={slide.title}
            className="w-full h-full object-cover transition-all duration-1000 transform scale-105"
            onError={(e) => {
              // Fallback image source if Supabase URL fails to resolve in browser
              console.warn('Image failed to load, falling back to local asset');
              const idx = AGRO_IMAGE_DATABASE.findIndex(x => x.title === slide.title);
              if (idx !== -1) {
                (e.target as HTMLImageElement).src = AGRO_IMAGE_DATABASE[idx].imageUrl;
              }
            }}
          />
        )}
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between z-20 relative">
        <div className="flex items-center">
          <img src={logoUrl || logoWhite} alt="Ox-Commerce Logo" className="h-10 md:h-12 w-auto object-contain rounded-lg" />
        </div>
        
        <button 
          onClick={onNavigateToLogin}
          className="px-5 py-2 text-sm font-bold text-[#071757] bg-[#D8B46A] hover:bg-[#A9823A] rounded-xl transition-all shadow-lg hover:shadow-[#D8B46A]/20 cursor-pointer hover:scale-105 duration-200"
        >
          Acessar Sistema
        </button>
      </header>

      {/* Main Slide Carousel Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 z-20 w-full relative">
        <div className="w-full flex items-center justify-between">
          
          {/* Left Arrow Button */}
          <button 
            onClick={handlePrev}
            className="p-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-full hover:bg-black/60 transition-all text-slate-300 hover:text-white cursor-pointer hidden md:flex items-center justify-center backdrop-blur-xs"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow Button */}
          <button 
            onClick={handleNext}
            className="p-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-full hover:bg-black/60 transition-all text-slate-300 hover:text-white cursor-pointer hidden md:flex items-center justify-center backdrop-blur-xs"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

        </div>

        {/* Slide Indicators */}
        <div className="flex items-center space-x-3 mt-12">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-300 cursor-pointer ${
                idx === currentSlide 
                  ? 'w-8 h-2 bg-[#D8B46A] rounded-full' 
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40 rounded-full'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer / CTA banner */}
      <footer className="w-full bg-[#05113b]/90 border-t border-white/10 py-8 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="flex items-center justify-center space-x-3 text-slate-300">
            <ShieldCheck className="h-5 w-5 text-[#D8B46A]" />
            <span className="text-xs font-medium">Plataforma homologada de acordo com as normas da SEFAZ & Orgãos de Defesa Agropecuária</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
