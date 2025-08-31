
import React from 'react';

const HeaderButton = ({ children }: { children: React.ReactNode }) => (
  <button
    onClick={() => alert(`Funcionalidad "${children}" no implementada.`)}
    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
  >
    {children}
  </button>
);

const Header = () => {
  return (
    <header className="flex items-center justify-between p-3 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 z-10">
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-xl font-bold text-slate-100">Diseñador de Flujos</h1>
      </div>
      <div className="flex items-center gap-3">
        <HeaderButton>Guardar</HeaderButton>
        <HeaderButton>Compartir</HeaderButton>
        <HeaderButton>Ayuda</HeaderButton>
      </div>
    </header>
  );
};

export default Header;
