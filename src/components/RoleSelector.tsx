/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { UserCheck, Shield, Award, User, ChevronDown } from 'lucide-react';

interface RoleSelectorProps {
  activeRole: 'gestor' | 'napie' | 'instituicao' | 'admin';
  onChangeRole: (role: 'gestor' | 'napie' | 'instituicao' | 'admin') => void;
}
export const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onChangeRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const roles = [
    {
      id: 'gestor' as const,
      name: 'Gestor (Decisor)',
      desc: 'Carlos Mendes',
      icon: User,
      color: 'bg-blue-600',
    },
    {
      id: 'napie' as const,
      name: 'Equipe NAPIE',
      desc: 'Edson Cruz',
      icon: Award,
      color: 'bg-purple-600',
    },
    {
      id: 'instituicao' as const,
      name: 'Instituição Parceira',
      desc: 'Dr. Adriano Costa',
      icon: UserCheck,
      color: 'bg-teal-600',
    },
    {
      id: 'admin' as const,
      name: 'Administrador',
      desc: 'Painel de Gestão',
      icon: Shield,
      color: 'bg-rose-600',
    },
  ];
  
  const current = roles.find(r => r.id === activeRole) || roles[0];
  const Icon = current.icon;
  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="profile-selector-dropdown">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer min-w-[210px] hover:shadow-lg hover:scale-[1.02]"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <Icon className="h-3.5 w-3.5 text-blue-100 shrink-0" />
            <span className="truncate">{current.name}</span>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-blue-100 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 overflow-hidden transform origin-top-right animate-fadeIn"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Alternar Perfil SABER</span>
          </div>
          
          <div className="py-1" role="none">
            {roles.map((role) => {
              const RoleIcon = role.icon;
              const isActive = role.id === activeRole;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    onChangeRole(role.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-all hover:bg-slate-50 cursor-pointer ${
                    isActive ? 'bg-slate-50/85 font-semibold' : ''
                  }`}
                  role="menuitem"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <RoleIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className={`text-[12px] ${isActive ? 'text-slate-950 font-bold' : 'text-slate-800 font-medium'}`}>{role.name}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">{role.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
