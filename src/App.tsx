/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Demand, Institution } from './types';
import { INITIAL_DEMANDS, INITIAL_INSTITUTIONS } from './data';
import { RoleSelector } from './components/RoleSelector';
import { GestorProfile } from './components/GestorProfile';
import { NapieProfile } from './components/NapieProfile';
import { InstitutionProfile } from './components/InstitutionProfile';
import { AdminProfile } from './components/AdminProfile';
import { Sparkles, X, Info, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState<'gestor' | 'napie' | 'instituicao' | 'admin'>('gestor');
  const [demands, setDemands] = useState<Demand[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [isGuideExpanded, setIsGuideExpanded] = useState(true);

  // Inicializa dados do localStorage ou do template estático
  useEffect(() => {
    const savedDemands = localStorage.getItem('FLUXO_SABER_DEMANDS');
    const savedInstitutions = localStorage.getItem('FLUXO_SABER_INSTITUTIONS');

    if (savedDemands) {
      setDemands(JSON.parse(savedDemands));
    } else {
      setDemands(INITIAL_DEMANDS);
      localStorage.setItem('FLUXO_SABER_DEMANDS', JSON.stringify(INITIAL_DEMANDS));
    }

    if (savedInstitutions) {
      setInstitutions(JSON.parse(savedInstitutions));
    } else {
      setInstitutions(INITIAL_INSTITUTIONS);
      localStorage.setItem('FLUXO_SABER_INSTITUTIONS', JSON.stringify(INITIAL_INSTITUTIONS));
    }
  }, []);

  // Mostra Toast temporário
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Persiste demandas
  const saveDemandsToStorage = (updated: Demand[]) => {
    setDemands(updated);
    localStorage.setItem('FLUXO_SABER_DEMANDS', JSON.stringify(updated));
  };

  // Persiste instituições
  const saveInstitutionsToStorage = (updated: Institution[]) => {
    setInstitutions(updated);
    localStorage.setItem('FLUXO_SABER_INSTITUTIONS', JSON.stringify(updated));
  };

  // Funções de Update/Adição de dados
  const handleAddDemand = (newDemand: Demand) => {
    const updated = [newDemand, ...demands];
    saveDemandsToStorage(updated);
  };

  const handleUpdateDemand = (updatedDemand: Demand) => {
    const updated = demands.map(d => d.id === updatedDemand.id ? updatedDemand : d);
    saveDemandsToStorage(updated);
  };

  const handleAddInstitution = (newInst: Institution) => {
    const updated = [newInst, ...institutions];
    saveInstitutionsToStorage(updated);
  };

  const handleUpdateInstitution = (updatedInst: Institution) => {
    const updated = institutions.map(i => i.id === updatedInst.id ? updatedInst : i);
    saveInstitutionsToStorage(updated);
  };

  const handleRoleChange = (role: 'gestor' | 'napie' | 'instituicao' | 'admin') => {
    setActiveRole(role);
    setSelectedDemandId(null);
    showToast(`Perfil alterado para: ${role.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-teal-550 selection:text-slate-900" id="app-wrapper">
      
      {/* Renderização de Perfil de Acordo com Role Dinâmico selecionado */}
      <div className="flex-1 flex flex-col" id="profile-content-container">
        {activeRole === 'gestor' && (
          <GestorProfile
            demands={demands}
            onAddDemand={handleAddDemand}
            selectedDemandId={selectedDemandId}
            setSelectedDemandId={setSelectedDemandId}
            showToast={showToast}
            activeRole={activeRole}
            onChangeRole={handleRoleChange}
          />
        )}

        {activeRole === 'napie' && (
          <NapieProfile
            demands={demands}
            institutions={institutions}
            onUpdateDemand={handleUpdateDemand}
            selectedDemandId={selectedDemandId}
            setSelectedDemandId={setSelectedDemandId}
            showToast={showToast}
            activeRole={activeRole}
            onChangeRole={handleRoleChange}
          />
        )}

        {activeRole === 'instituicao' && (
          <InstitutionProfile
            demands={demands}
            onUpdateDemand={handleUpdateDemand}
            selectedDemandId={selectedDemandId}
            setSelectedDemandId={setSelectedDemandId}
            showToast={showToast}
            activeRole={activeRole}
            onChangeRole={handleRoleChange}
          />
        )}

        {activeRole === 'admin' && (
          <AdminProfile
            institutions={institutions}
            demands={demands}
            onAddInstitution={handleAddInstitution}
            onUpdateInstitution={handleUpdateInstitution}
            showToast={showToast}
            activeRole={activeRole}
            onChangeRole={handleRoleChange}
          />
        )}
      </div>

      {/* Guia Didático Interativo do Fluxo de Validação - Floating Card or Bubble in Bottom Right */}
      {showGuide && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full md:max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform" id="val-guide-floating">
          {isGuideExpanded ? (
            <div className="flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-indigo-700 text-white px-4 py-3 flex items-center justify-between border-b border-indigo-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-teal-300 shrink-0 animate-pulse" />
                  <span className="font-extrabold text-[11px] tracking-wide uppercase">Guia de Simulação</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsGuideExpanded(false)}
                    className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                    title="Minimizar Guia"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => setShowGuide(false)}
                    className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                    title="Fechar guia definitivamente"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 bg-slate-50 text-slate-700 text-[11px] leading-relaxed space-y-2.5 max-h-[350px] overflow-y-auto">
                <p className="font-bold text-slate-800 text-[11px]">Siga as 4 etapas de simulação SABER:</p>
                <ol className="space-y-2.5 list-none p-0 m-0">
                  <li className="flex gap-2 items-start">
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-teal-100 text-teal-850 font-extrabold text-[9px] shrink-0 mt-0.5 font-mono">1</span>
                    <div>
                      <strong className="text-slate-900 font-bold block">Perfil: Gestor</strong>
                      <span className="text-slate-500 block text-[10px]">Acesse "Criar Demanda" e preencha as etapas do fluxo.</span>
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-teal-100 text-teal-850 font-extrabold text-[9px] shrink-0 mt-0.5 font-mono">2</span>
                    <div>
                      <strong className="text-slate-900 font-bold block">Perfil: NAPIE</strong>
                      <span className="text-slate-500 block text-[10px]">Selecione a demanda na "Fila de Triagem", faça o checklist, selecione "Qualificar", destine à <span className="font-semibold text-slate-705">Instituição Parceira</span> e envie.</span>
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-teal-100 text-teal-850 font-extrabold text-[9px] shrink-0 mt-0.5 font-mono">3</span>
                    <div>
                      <strong className="text-slate-900 font-bold block">Perfil: Instituição Parceira</strong>
                      <span className="text-slate-500 block text-[10px]">Acesse, selecione a proposta, clique em "Redigir Parecer" usando os botões e chanceladores metodológicos e publique.</span>
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-teal-100 text-teal-850 font-extrabold text-[9px] shrink-0 mt-0.5 font-mono">4</span>
                    <div>
                      <strong className="text-slate-900 font-bold block">Perfil: Gestor</strong>
                      <span className="text-slate-500 block text-[10px]">Volte ao Gestor para visualizar o Parecer Científico final de alta fidelidade publicado.</span>
                    </div>
                  </li>
                </ol>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400">
                  <span>SABer — Apoio à Decisão</span>
                  <button 
                    onClick={() => setIsGuideExpanded(false)}
                    className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Recolher guia
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed State - Floating Badge */
            <button 
              onClick={() => setIsGuideExpanded(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-full shadow-xl transition-all hover:scale-105 cursor-pointer text-xs font-extrabold"
              title="Abrir guia de simulação"
              id="guide-collapsed-badge"
            >
              <Lightbulb className="h-4 w-4 text-teal-200 animate-pulse shrink-0" />
              <span>Guia de Simulação</span>
              <ChevronUp className="h-3.5 w-3.5 ml-0.5 opacity-80 shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* Sistema Integrado de Toasts de Notificação - Left Corner to avoid Guide collision */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 left-6 bg-slate-900 border border-slate-750 text-white font-medium text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce"
          role="status"
          id="toast-notification"
        >
          <Info className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
