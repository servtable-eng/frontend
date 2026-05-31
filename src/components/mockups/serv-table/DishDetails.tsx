import React from 'react';
import { ChevronLeft, Clock, Camera } from 'lucide-react';
import './_shared/tokens.css';

export function DishDetails() {
  return (
    <div className="serv-theme serv-bg-background min-h-[100dvh] w-full max-w-[390px] mx-auto relative flex flex-col font-sans overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[340px] w-full shrink-0">
        <img 
          src="/__mockup/images/peixe.png" 
          alt="Filé de Peixe" 
          className="w-full h-full object-cover grayscale-[40%] opacity-80"
        />
        
        {/* Top bar over image */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800">
            <ChevronLeft size={24} />
          </button>
          <div className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Indisponível
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="serv-bg-surface flex-1 -mt-6 rounded-t-2xl relative z-20 px-5 pt-6 pb-32 shadow-sm">
        {/* Availability Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            <span className="text-[#EF4444] text-[13px] font-medium">Indisponível</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock size={14} />
            <span className="text-[13px]">Previsão: 14h00</span>
          </div>
        </div>

        {/* Dish Name */}
        <h1 className="text-[26px] font-bold serv-text-primary leading-tight mb-6">
          Filé de Peixe
        </h1>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
            Descrição
          </h2>
          <p className="text-[14px] text-gray-600 leading-[1.6]">
            Filé grelhado ao molho de limão siciliano com ervas finas, acompanha legumes no vapor e arroz integral.
          </p>
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
            Ingredientes
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Filé de peixe', 'Limão siciliano', 'Ervas finas', 'Legumes', 'Arroz integral', 'Azeite'].map((item) => (
              <span 
                key={item} 
                className="bg-[#F0EDE9] text-[#1F2937] px-3 py-1 rounded-full text-[13px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Media Indicator */}
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <Camera size={14} />
          <span className="text-[12px]">Foto atualizada em 28/05/2026</span>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-[#EAE4DF] p-4 z-30">
        <div className="flex justify-between gap-3 mb-2">
          <button className="w-[40%] py-3.5 rounded-xl border border-[#EAE4DF] text-gray-700 font-medium text-[15px]">
            Voltar
          </button>
          <button className="w-[56%] py-3.5 rounded-xl bg-[#EAE4DF] text-[#6B7280] font-medium text-[15px] cursor-not-allowed flex items-center justify-center">
            Adicionar ao prato
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-500 w-full">
          Este prato está temporariamente indisponível
        </p>
      </div>
    </div>
  );
}
