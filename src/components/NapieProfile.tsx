/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Demand, DemandStatus, DemandComplexity, Institution } from '../types';
import { RoleSelector } from './RoleSelector';
import { 
  Inbox, CheckCircle, Send, ArrowLeft, Archive, Award, Users, Building, History, 
  HelpCircle, Search, Sparkles, CheckSquare, ListPlus, Terminal, FileText, AlertTriangle, AlertCircle
} from 'lucide-react';

interface NapieProfileProps {
  demands: Demand[];
  institutions: Institution[];
  onUpdateDemand: (demand: Demand) => void;
  selectedDemandId: string | null;
  setSelectedDemandId: (id: string | null) => void;
  showToast: (msg: string) => void;
  activeRole: 'gestor' | 'napie' | 'instituicao' | 'admin';
  onChangeRole: (role: 'gestor' | 'napie' | 'instituicao' | 'admin') => void;
}

export const NapieProfile: React.FC<NapieProfileProps> = ({
  demands,
  institutions,
  onUpdateDemand,
  selectedDemandId,
  setSelectedDemandId,
  showToast,
  activeRole,
  onChangeRole
}) => {
  const [activeTab, setActiveTab ] = useState<'home' | 'fila' | 'encaminhadas' | 'devolvidas' | 'instituicoes' | 'historico'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Triage state variables
  const [actionChoice, setActionChoice] = useState<'qualificar' | 'devolver' | 'arquivar' | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<DemandComplexity>('moderada');
  const [napieNotesInput, setNapieNotesInput] = useState('');
  const [targetInstSigla, setTargetInstSigla] = useState('Instituição Parceira');
  const [internalDeadline, setInternalDeadline] = useState('2026-06-12');
  const [evidenceType, setEvidenceType] = useState('Revisão rápida da literatura');
  
  // Return form state
  const [devolverMotivo, setDevolverMotivo] = useState('');
  const [devolverOrientacoes, setDevolverOrientacoes] = useState('');
  
  // Archive form state
  const [arquivarJustificativa, setArquivarJustificativa] = useState('');
  
  // Checklist checked states for qualification
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const handleToggleCheck = (item: string) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter(i => i !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const activeDemands = demands.filter(d => d.status === 'triagem_pendente');
  const qualifiedDemands = demands.filter(d => d.status === 'em_analise' && d.complexity);
  const forwardedDemands = demands.filter(d => d.status === 'em_analise');
  const returnedDemands = demands.filter(d => d.status === 'devolvida');
  
  const resetTriageForm = () => {
    setActionChoice(null);
    setSelectedComplexity('moderada');
    setNapieNotesInput('');
    setTargetInstSigla('Instituição Parceira');
    setInternalDeadline('2026-06-12');
    setEvidenceType('Revisão rápida da literatura');
    setDevolverMotivo('');
    setDevolverOrientacoes('');
    setArquivarJustificativa('');
    setCheckedItems([]);
  };

  const handleQualifyAndForward = (demand: Demand) => {
    if (checkedItems.length < 2) {
      showToast('Por favor, marque ao menos algumas verificações básicas do checklist para qualificar com rigor científico.');
      return;
    }
    if (!targetInstSigla) {
      showToast('Selecione uma instituição científica para responder à demanda.');
      return;
    }

    const updatedTimeline = [...demand.timeline];
    updatedTimeline.push({
      title: 'Qualificada pelo NAPIE',
      desc: `Demanda homologada sob complexidade ${selectedComplexity.toUpperCase()} e notas de instrução por Edson Neves Da Cruz.`,
      date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
      icon: 'Check',
      status: 'success'
    });
    updatedTimeline.push({
      title: `Encaminhada para ${targetInstSigla}`,
      desc: `Documentação científica qualificada de apoio enviada formalmente. Tipo de evidência recomendada: ${evidenceType}.`,
      date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
      icon: 'Send',
      status: 'info'
    });

    const updated: Demand = {
      ...demand,
      status: 'em_analise',
      complexity: selectedComplexity,
      napieNotes: napieNotesInput || 'Demanda analisada e considerada elegível de acordo com os critérios gerais de saúde pública.',
      assignedInstitution: targetInstSigla,
      napieCheckedItems: checkedItems,
      deadline: internalDeadline,
      evidenceTypeExpected: evidenceType,
      timeline: updatedTimeline
    };

    onUpdateDemand(updated);
    showToast(`Demanda #${demand.id} qualificada e encaminhada para a instituição ${targetInstSigla}!`);
    setSelectedDemandId(null);
    resetTriageForm();
    setActiveTab('encaminhadas');
  };

  const handleDevolver = (demand: Demand) => {
    if (!devolverMotivo || !devolverOrientacoes) {
      showToast('Preencha o motivo de devolução e as orientações necessárias ao Gestor.');
      return;
    }

    const updatedTimeline = [...demand.timeline];
    updatedTimeline.push({
      title: 'Devolvida para Ajuste',
      desc: `Motivo: ${devolverMotivo}. Orientações: ${devolverOrientacoes}`,
      date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
      icon: 'ArrowLeft',
      status: 'warning'
    });

    const updated: Demand = {
      ...demand,
      status: 'devolvida',
      timeline: updatedTimeline
    };

    onUpdateDemand(updated);
    showToast(`Demandada #${demand.id} devolvida com orientações para Carlos Mendes.`);
    setSelectedDemandId(null);
    resetTriageForm();
    setActiveTab('devolvidas');
  };

  const handleArquivar = (demand: Demand) => {
    if (!arquivarJustificativa) {
      showToast('Forneça a justificativa técnica de arquivamento.');
      return;
    }

    const updatedTimeline = [...demand.timeline];
    updatedTimeline.push({
      title: 'Demanda Arquivada',
      desc: `Justificativa/Falta de Escopo: ${arquivarJustificativa}`,
      date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
      icon: 'Archive',
      status: 'error'
    });

    const updated: Demand = {
      ...demand,
      status: 'arquivada',
      timeline: updatedTimeline
    };

    onUpdateDemand(updated);
    showToast(`Demandada #${demand.id} arquivada no sistema.`);
    setSelectedDemandId(null);
    resetTriageForm();
    setActiveTab('home');
  };

  // Status badges help
  const getStatusBadge = (status: DemandStatus) => {
    switch (status) {
      case 'triagem_pendente':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-850 border border-orange-200" id="badge-triagem">Aguardando Triagem</span>;
      case 'em_analise':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-105 bg-blue-100 text-blue-800 border border-blue-200" id="badge-analise">Encaminhado à Instituição</span>;
      case 'respondida':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200" id="badge-respondido">Resposta Concluída</span>;
      case 'devolvida':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200" id="badge-devolvida">Devolvido ao Gestor</span>;
      case 'arquivada':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200" id="badge-arquivada">Arquivado</span>;
    }
  };

  const selectedDemand = demands.find(d => d.id === selectedDemandId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full overflow-y-auto md:overflow-hidden bg-slate-50" id="napie-profile-root">
      {/* Sidebar NAPIE */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-850 h-auto md:h-full" id="napie-sidebar">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-teal-400 font-sans tracking-wide">SABER</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">Sistema de Apoio Baseado em Evidências e Respostas</p>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto px-2">
          {/* FILA DE TRABALHO */}
          <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Fila de Trabalho</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => { setActiveTab('home'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'home' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-napie-home"
            >
              <Terminal className="h-4 w-4 shrink-0" />
              <span>Painel NAPIE</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('fila'); setSelectedDemandId(null); }}
              className={`flex items-center justify-between w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'fila' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-napie-fila"
            >
              <div className="flex items-center gap-3">
                <Inbox className="h-4 w-4 shrink-0" />
                <span>Fila de triagem</span>
              </div>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {activeDemands.length}
              </span>
            </button>
          </nav>

          {/* GESTÃO */}
          <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Gestão</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => { setActiveTab('encaminhadas'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'encaminhadas' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-napie-encaminhadas"
            >
              <Send className="h-4 w-4 shrink-0" />
              <span>Encaminhadas</span>
            </button>
            <button
              onClick={() => { setActiveTab('devolvidas'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'devolvidas' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-napie-devolvidas"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Devolvidas</span>
            </button>
          </nav>

          {/* SISTEMA */}
          <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Sistema</div>
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('instituicoes'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'instituicoes' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-napie-instituicoes"
            >
              <Building className="h-4 w-4 shrink-0" />
              <span>Instituições</span>
            </button>
            <button
              onClick={() => { setActiveTab('historico'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'historico' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-napie-historico"
            >
              <History className="h-4 w-4 shrink-0" />
              <span>Histórico</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0 font-mono">
              EC
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white truncate block">Edson Neves da Cruz</span>
              <span className="text-[10px] text-purple-400 bg-[#2e1065] px-2 py-0.5 mt-0.5 rounded font-bold uppercase tracking-wider block font-mono text-center w-max">NAPIE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal NAPIE */}
      <main className="flex-grow flex flex-col h-auto md:h-full overflow-visible md:overflow-hidden" id="napie-content">
        {/* Header bar designed after High Density style */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-800 font-sans tracking-tight">Painel de Supervisão Científica</h1>
            <p className="text-[11px] text-gray-500 font-medium">NAPIE  ·  Gestão de Qualificação de Evidências</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-500 bg-slate-100 py-1 px-2.5 rounded border border-slate-200">
              EDSON NEVES DA CRUZ (NAPIE)
            </div>
            <RoleSelector activeRole={activeRole} onChangeRole={onChangeRole} />
          </div>
        </header>

        {/* Content Scroll Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {selectedDemandId && selectedDemand ? (
          <div id="demand-triage-view" className="w-full max-w-[1550px] mx-auto space-y-6">
            <button
              onClick={() => { setSelectedDemandId(null); resetTriageForm(); }}
              className="flex items-center gap-1 text-slate-655 text-slate-600 hover:text-slate-900 text-xs font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" /> Cancelar Análise e Voltar
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Coluna Esquerda: Dados Gerais da Demanda */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Solicitação #{selectedDemand.id}</span>
                    <h2 className="text-base font-bold text-slate-900 leading-tight block mt-0.5">{selectedDemand.title}</h2>
                    <p className="text-xs text-slate-550 mt-1">Autor: {selectedDemand.gestorName} ({selectedDemand.gestorEmail})</p>
                  </div>
                  {getStatusBadge(selectedDemand.status)}
                </div>

                <div className="space-y-3.5 text-xs text-slate-800 leading-relaxed">
                  <div>
                    <span className="text-slate-450 uppercase tracking-widest text-[9px] block font-mono">Problema Base / Sintetização</span>
                    <p className="mt-1 font-serif bg-slate-50 p-3 rounded border border-slate-150 whitespace-pre-line">{selectedDemand.description}</p>
                  </div>

                  <div>
                    <span className="text-slate-450 uppercase tracking-widest text-[9px] block font-mono">Pergunta Estruturada PICO</span>
                    <p className="mt-1 font-mono text-[11px] bg-slate-950 text-slate-200 p-3 rounded leading-relaxed whitespace-pre-line truncate-3-lines">
                      {selectedDemand.picoQuestion || 'Não estruturada formalmente pelo Gestor.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-450 uppercase tracking-widest text-[9px] block font-mono">Decisão a ser respaldas</span>
                    <p className="mt-1 font-medium">{selectedDemand.decisionSubsidized}</p>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <span className="text-slate-450 uppercase tracking-widest text-[9px] block font-mono">Urgência declarada</span>
                      <span className="font-bold text-red-750">{selectedDemand.urgency.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 uppercase tracking-widest text-[9px] block font-mono">Município</span>
                      <span>{selectedDemand.municipio}</span>
                    </div>
                  </div>

                  {selectedDemand.evidenceFiles.length > 0 && (
                    <div>
                      <span className="text-slate-450 uppercase tracking-widest text-[9px] block font-mono">Evidências Anexadas</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedDemand.evidenceFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-1 bg-slate-100 text-slate-755 border border-slate-200 px-2.5 py-1 text-[11px] rounded-md font-mono">
                            <FileText className="h-3 w-3 text-slate-500" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna Direita: Caixa de Ações do NAPIE (Edson Neves Da Cruz) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase">Processo de Qualificação Ético-Científica</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Como Edson Neves Da Cruz (NAPIE), valide os critérios regulatórios de relevância pública antes de destinar a demanda.
                  </p>
                </div>

                {/* Checklist Regulatório */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                    <CheckSquare className="h-4 w-4 text-emerald-600" /> Checklist de Qualificação de Demanda
                  </h4>
                  {[
                    'Pergunta clara com relevância para a saúde pública territorial',
                    'A decisão a ser subsidiada está explicitamente fundamentada',
                    'Os arquivos anexos fornecem dados locais compatíveis e confiáveis',
                    'A solicitação não duplica resposta científica recente na plataforma',
                    'O tema enquadra-se estritamente no escopo de competência da SUS local'
                  ].map((chk, i) => (
                    <label 
                      key={i} 
                      className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none py-1 border-b border-slate-200/50 last:border-b-0"
                    >
                      <input 
                        type="checkbox"
                        checked={checkedItems.includes(chk)}
                        onChange={() => handleToggleCheck(chk)}
                        className="mt-0.5 rounded accent-teal-600"
                      />
                      <span className={checkedItems.includes(chk) ? 'line-through text-slate-400' : ''}>{chk}</span>
                    </label>
                  ))}
                  <div className="text-[10px] text-slate-405 text-slate-400 mt-2 font-mono">
                    {checkedItems.length} de 5 critérios de cientificidade validados.
                  </div>
                </div>

                {/* Seletores de Ação Central */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setActionChoice('qualificar')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        actionChoice === 'qualificar'
                          ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-md shadow-teal-500/15 scale-102'
                          : 'bg-white border-slate-200 text-slate-705 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5 mb-1.5 text-emerald-600" />
                      <span>Qualificar e Encaminhar</span>
                      <span className="text-[9px] font-normal text-slate-500 mt-0.5">Destinar à Univ/FIOCRUZ</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActionChoice('devolver')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        actionChoice === 'devolver'
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/15 scale-102'
                          : 'bg-white border-slate-200 text-slate-705 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowLeft className="h-5 w-5 mb-1.5 text-amber-500" />
                      <span>Devolver ao Gestor</span>
                      <span className="text-[9px] font-normal text-slate-500 mt-0.5">Solicitar complemento técnico</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionChoice('arquivar')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        actionChoice === 'arquivar'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/15 scale-102'
                          : 'bg-white border-slate-200 text-slate-705 hover:bg-rose-50'
                      }`}
                    >
                      <Archive className="h-5 w-5 mb-1.5 text-rose-600" />
                      <span>Arquivar Solicitação</span>
                      <span className="text-[9px] font-normal text-slate-500 mt-0.5">Não aplicável</span>
                    </button>
                  </div>

                  {/* FORMULÁRIO ACCIONADO - QUALIFICAR */}
                  {actionChoice === 'qualificar' && (
                    <div className="border border-teal-200 rounded-xl p-5 bg-teal-50/25 space-y-4 shadow-sm" id="napie-qualificar-form">
                      <h4 className="text-xs font-bold text-teal-800 flex items-center gap-1.5 pb-2 border-b border-teal-100">
                        <Sparkles className="h-4 w-4 text-teal-400" /> Configurar Destinação da Demanda Qualificada
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmar Complexidade Técnica</label>
                          <select 
                            value={selectedComplexity}
                            onChange={(e) => setSelectedComplexity(e.target.value as DemandComplexity)}
                            className="w-full text-xs p-2 bg-white border border-slate-250 rounded focus:outline-none"
                          >
                            <option value="simples">Simples (Resposta rápida/Diretrizes)</option>
                            <option value="moderada">Moderada (Revisão sistemática rápida)</option>
                            <option value="complexa">Complexa (Revisão completa / Análise estatística)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Evidência Científica Esperada</label>
                          <select 
                            value={evidenceType}
                            onChange={(e) => setEvidenceType(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-slate-250 rounded focus:outline-none"
                          >
                            <option>Revisão rápida da literatura</option>
                            <option>Revisão sistemática de diretrizes</option>
                            <option>Análise de dados epidemiológicos brutos</option>
                            <option>Síntese de recomendações de saúde pública</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Selecionar Instituição Científica Parceira</label>
                          <select 
                            value={targetInstSigla}
                            onChange={(e) => setTargetInstSigla(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-teal-300 rounded focus:outline-none focus:border-teal-500 font-bold text-teal-900"
                          >
                            {institutions.filter(inst => inst.status === 'ativo').map((inst) => (
                              <option key={inst.sigla} value={inst.sigla}>
                                {inst.sigla} — {inst.nome}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Prazo Máximo do Parecer Científico</label>
                          <input 
                            type="date"
                            value={internalDeadline}
                            onChange={(e) => setInternalDeadline(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-slate-250 rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Recomendações e Escopo de Análise para a Instituição</label>
                        <textarea 
                          rows={3}
                          value={napieNotesInput}
                          onChange={(e) => setNapieNotesInput(e.target.value)}
                          placeholder="Notas orientativas adicionais para os pesquisadores. Ex: Focar nos impactos do semi-árido ou no vácuo de cobertura ribeirinha..."
                          className="w-full p-2 text-xs bg-white border border-slate-250 rounded focus:outline-none"
                          id="input-napie-notes"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleQualifyAndForward(selectedDemand)}
                          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-teal-500/10"
                          id="btn-confirm-qualify"
                        >
                          Concluir Qualificação e Encaminhar à {targetInstSigla} 🚀
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORMULÁRIO ACCIONADO - DEVOLVER */}
                  {actionChoice === 'devolver' && (
                    <div className="border border-amber-300 rounded-xl p-5 bg-amber-50/30 space-y-4 shadow-sm" id="napie-devolver-form">
                      <h4 className="text-xs font-bold text-amber-805 text-amber-800 pb-2 border-b border-amber-200 flex items-center gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Especificações de Ajustes Requeridos ao Gestor
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Motivação Principal da Negativa de Triagem</label>
                        <select
                          value={devolverMotivo}
                          onChange={(e) => setDevolverMotivo(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-250 rounded focus:outline-none"
                        >
                          <option value="">Selecione o motivo de ajuste...</option>
                          <option value="Documentação e dados locais insuficientes">Documentação e dados locais insuficientes</option>
                          <option value="Pergunta clínica necessita de refinamento estrutural">Pergunta clínica necessita de refinamento estrutural</option>
                          <option value="Reclamação fora das competências reguladas de saúde pública">Reclamação fora das competências reguladas de saúde pública</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Instruções Pragmáticas de Correção para o Gestor</label>
                        <textarea
                          rows={3}
                          value={devolverOrientacoes}
                          onChange={(e) => setDevolverOrientacoes(e.target.value)}
                          placeholder="Digite aqui as instruções que aparecerão na tela do gestor para que ele possa realizar a correção..."
                          className="w-full p-2 text-xs bg-white border border-slate-250 rounded focus:outline-none"
                          id="input-devolver-orientacoes"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDevolver(selectedDemand)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-amber-600/10"
                          id="btn-confirm-devolver"
                        >
                          Sinalizar Devolução ao Gestor 
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORMULÁRIO ACCIONADO - ARQUIVAR */}
                  {actionChoice === 'arquivar' && (
                    <div className="border border-rose-200 rounded-xl p-5 bg-rose-50/20 space-y-4 shadow-sm" id="napie-arquivar-form">
                      <h4 className="text-xs font-bold text-rose-800 pb-2 border-b border-rose-200">
                        Justificativa Técnica de Arquivamento
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo do Indeferimento de Triage</label>
                        <textarea
                          rows={3}
                          value={arquivarJustificativa}
                          onChange={(e) => setArquivarJustificativa(e.target.value)}
                          placeholder="Explicite detalhadamente por que esta demanda não detém relevância regulatória de saúde ou duplica resposta existente formalmente."
                          className="w-full p-2 text-xs bg-white border border-slate-250 rounded focus:outline-none"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleArquivar(selectedDemand)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Arquivar Demanda Permanentemente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. HOME - DASHBOARD DO NAPIE */}
            {activeTab === 'home' && (
              <div className="space-y-8" id="napie-tab-home">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Painel de Triagem Científica</h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Análise e qualificação metodológica de perguntas de políticas informadas por evidência de saúde pública de Porto Velho.
                  </p>
                </div>

                {/* Grid estatístico do NAPIE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
                      <Inbox className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">{activeDemands.length}</div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Triagens Pendentes</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">{forwardedDemands.length}</div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Sob Análise Científica</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 border border-rose-100">
                      <ArrowLeft className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">{returnedDemands.length}</div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Devolvidas para Ajustes</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">{demands.filter(d => d.status === 'respondida').length}</div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Respostas Concluídas</div>
                    </div>
                  </div>
                </div>

                {/* Lista Completa da Fila de Triagem */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" id="napie-fila-triage-home">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Demandas Aguardando Qualificação de Filtro</h3>
                      <p className="text-[11px] text-slate-400">Demandas direcionadas pelos gestores regulatórios municipais.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('fila')}
                      className="text-xs text-amber-600 font-semibold hover:text-amber-700 cursor-pointer"
                    >
                      Processar Fila
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {activeDemands.map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-xs font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800 px-2 py-1 rounded shrink-0">
                            #{demand.id}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {demand.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Área: {demand.area} · Decisor solicitante: {demand.gestorName} · Recebido em: {demand.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            demand.urgency === 'alta' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            Urgência: {demand.urgency}
                          </span>
                        </div>
                      </div>
                    ))}
                    {activeDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">Fila vazia! Nenhuma demanda aguardando triagem regulatória ativa.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. FILA COMPLETA DETALHADA */}
            {activeTab === 'fila' && (
              <div className="space-y-4" id="napie-tab-fila">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fila Geral de Triagem e Admissibilidade</h1>
                  <p className="text-xs text-slate-500">Fluxo cronológico de propostas admitidas na plataforma SABER.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {activeDemands.map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-xs font-mono font-bold bg-orange-50 text-orange-700 px-2 py-1 border border-orange-205 rounded shrink-0">
                            #{demand.id}
                          </span>
                          <div>
                            <h4 className="text-xs font-semibold text-slate-900 truncate">{demand.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Solicitante: {demand.gestorName} · Área: {demand.area} · Criada: {demand.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-amber-50 pr-2 block rounded text-amber-800">Urgência: {demand.urgency}</span>
                          <span className="text-xs px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded cursor-pointer">Revisar Admissibilidade</span>
                        </div>
                      </div>
                    ))}
                    {activeDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">Sem propostas pendentes no momento.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ENCAMINHADAS */}
            {activeTab === 'encaminhadas' && (
              <div className="space-y-4" id="napie-tab-encaminhadas">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Demandas em Trabalho Científico Interno</h1>
                  <p className="text-xs text-slate-500">Propostas já triadas e destinadas para as instituições científicas.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {forwardedDemands.map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-[11px] font-mono bg-slate-105 bg-slate-100 text-slate-600 px-2 py-1 rounded shrink-0 font-semibold border border-slate-200">
                            #{demand.id}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{demand.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Destinatária: {demand.assignedInstitution} · Prazo Estimado: {demand.deadline || 'Sem prazo'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getStatusBadge(demand.status)}
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">Ver Histórico</span>
                        </div>
                      </div>
                    ))}
                    {forwardedDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">Nenhuma proposta destinada ativa.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. DEVOLVIDAS */}
            {activeTab === 'devolvidas' && (
              <div className="space-y-4" id="napie-tab-devolvidas">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Solicitações Devolvidas ao Gestor p/ Complementação</h1>
                  <p className="text-xs text-slate-500">Aguardando que as assessorias de Porto Velho preencham mais dados técnicos.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {returnedDemands.map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-[11px] font-mono bg-rose-50 text-rose-705 text-rose-800 px-2 py-1 rounded shrink-0 font-semibold border border-rose-100">
                            #{demand.id}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-slate-900 truncate">{demand.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Gestor: {demand.gestorName} · Devolvido em: {demand.timeline[demand.timeline.length - 1]?.date || demand.createdAt}</p>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1">
                          <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-750 font-semibold border border-amber-100">Complementação Pendente</span>
                        </div>
                      </div>
                    ))}
                    {returnedDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-450 text-xs">Nenhuma demanda devolvida recentemente.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. INSTITUIÇÕES */}
            {activeTab === 'instituicoes' && (
              <div className="space-y-6" id="napie-tab-instituicoes">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Instituições Científicas Ativas no Sistema</h1>
                  <p className="text-xs text-slate-500">Laboratórios de excelência habilitados pelo sistema SABER para emitir sínteses consultivas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institutions.map(inst => (
                    <div key={inst.sigla} className="bg-white p-5 rounded-xl border border-slate-200 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-teal-50 border border-teal-150 flex items-center justify-center font-bold text-slate-900 text-sm tracking-wide shadow-sm shrink-0">
                        {inst.sigla}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 truncate">{inst.nome}</h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                            inst.status === 'ativo' ? 'bg-emerald-105 bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {inst.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] truncate">{inst.area}</p>
                        <div className="text-[10px] text-slate-404 text-slate-400 flex justify-between font-mono pt-1">
                          <span>D/E: {inst.uf}</span>
                          <span className="text-teal-600 font-bold">{inst.demandas} respondidas</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. HISTÓRICO (Timeline conforme imagem anexa) */}
            {activeTab === 'historico' && (
              <div className="space-y-6" id="napie-tab-historico">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Histórico</h1>
                  <p className="text-xs text-slate-500">Registro de ações no sistema</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-fadeIn">
                  {/* Timeline container */}
                  <div className="p-8">
                    <div className="relative border-l border-slate-150 ml-4 pl-8 space-y-8">
                      
                      {/* Item 1 */}
                      <div className="relative">
                        <div className="absolute -left-[41px] top-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full p-1.5 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 shrink-0 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">Análise iniciada — demanda #135 por Dr. Adriano Costa</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">27/05/2026 às 09:00</p>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="relative">
                        <div className="absolute -left-[41px] top-0.5 bg-teal-50 border border-teal-200 text-teal-600 rounded-full p-1.5 flex items-center justify-center">
                          <Inbox className="h-4 w-4 shrink-0 text-teal-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">Demanda #141 recebida do NAPIE</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">27/05/2026 às 08:10</p>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="relative">
                        <div className="absolute -left-[41px] top-0.5 bg-teal-50 border border-teal-200 text-teal-600 rounded-full p-1.5 flex items-center justify-center">
                          <Inbox className="h-4 w-4 shrink-0 text-teal-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">Demandas #135 e #133 recebidas do NAPIE</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">25/05/2026 às 08:00</p>
                        </div>
                      </div>

                      {/* Item 4 */}
                      <div className="relative">
                        <div className="absolute -left-[41px] top-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full p-1.5 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">Parecer publicado — demanda #129 por Dr. Adriano Costa</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">26/05/2026 às 14:30</p>
                        </div>
                      </div>

                      {/* Item 5 */}
                      <div className="relative">
                        <div className="absolute -left-[41px] top-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full p-1.5 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">Parecer publicado — demanda #125 por Dra. Renata Alves</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">20/05/2026 às 11:00</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};
