/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Demand, DemandUrgency, DemandStatus } from '../types';
import { RoleSelector } from './RoleSelector';
import { 
  FileText, Plus, Clock, CheckCircle, ArrowLeft, 
  Send, User, MapPin, Upload, X, Search, FileUp, HelpCircle, CheckSquare, Calendar, Phone, AlertCircle
} from 'lucide-react';

interface GestorProfileProps {
  demands: Demand[];
  onAddDemand: (demand: Demand) => void;
  selectedDemandId: string | null;
  setSelectedDemandId: (id: string | null) => void;
  showToast: (msg: string) => void;
  activeRole: 'gestor' | 'napie' | 'instituicao' | 'admin';
  onChangeRole: (role: 'gestor' | 'napie' | 'instituicao' | 'admin') => void;
}

export const GestorProfile: React.FC<GestorProfileProps> = ({
  demands,
  onAddDemand,
  selectedDemandId,
  setSelectedDemandId,
  showToast,
  activeRole,
  onChangeRole
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'nova' | 'lista' | 'perfil'>('home');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States para o cadastro de nova demanda
  const [formTitulo, setFormTitulo] = useState('');
  const [formArea, setFormArea] = useState('');
  const [formUrgency, setFormUrgency] = useState<DemandUrgency>('media');
  const [formDeadline, setFormDeadline] = useState('');
  const [formMunicipio, setFormMunicipio] = useState('Porto Velho — RO');
  const [formDescricao, setFormDescricao] = useState('');
  const [formPico, setFormPico] = useState('');
  const [formDecisao, setFormDecisao] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>(['boletim_epidemiologico_local.pdf']);

  const listDemands = demands.filter(d => d.gestorName === 'Carlos Mendes');
  
  // Limpa formulário
  const resetForm = () => {
    setFormTitulo('');
    setFormArea('');
    setFormUrgency('media');
    setFormDeadline('');
    setFormMunicipio('Porto Velho — RO');
    setFormDescricao('');
    setFormPico('');
    setFormDecisao('');
    setAttachedFiles(['boletim_epidemiologico_local.pdf']);
    setCurrentStep(1);
  };

  const handleSimulateUpload = () => {
    const defaultFiles = [
      'relatorio_indicadores_saude_2026.pdf',
      'tabela_internacoes_mental.xlsx',
      'protocolo_vigilancia_vigente.pdf',
      'boletim_semanal_casos.pdf'
    ];
    const n = Math.floor(Math.random() * defaultFiles.length);
    const selected = defaultFiles[n];
    if (!attachedFiles.includes(selected)) {
      setAttachedFiles([...attachedFiles, selected]);
      showToast(`Arquivo "${selected}" anexado virtualmente!`);
    } else {
      showToast('Este arquivo já está anexado.');
    }
  };

  const handleRemoveFile = (index: number) => {
    const copy = [...attachedFiles];
    copy.splice(index, 1);
    setAttachedFiles(copy);
  };

  const handleAddDemand = () => {
    if (!formTitulo || !formArea || !formDescricao || !formDecisao) {
      showToast('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    const newDemand: Demand = {
      id: String(Math.floor(Math.random() * 100) + 142),
      title: formTitulo,
      area: formArea,
      urgency: formUrgency,
      status: 'triagem_pendente',
      description: formDescricao,
      picoQuestion: formPico,
      decisionSubsidized: formDecisao,
      gestorName: 'Carlos Mendes',
      gestorEmail: 'c.mendes@semusa.portovelho.ro.gov.br',
      municipio: formMunicipio,
      createdAt: new Date().toISOString().substring(0, 10),
      deadline: formDeadline || undefined,
      evidenceFiles: attachedFiles,
      timeline: [
        {
          title: 'Demanda Registrada',
          desc: 'Cadastro realizado com sucesso na plataforma SABER pelo Gestor.',
          date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
          icon: 'FilePlus',
          status: 'info'
        },
        {
          title: 'Encaminhado ao NAPIE',
          desc: 'Demanda aguardando análise de qualificação pelo analista Edson Neves Da Cruz.',
          date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
          icon: 'Inbox',
          status: 'pending'
        }
      ]
    };

    onAddDemand(newDemand);
    showToast('Demanda aberta e enviada ao NAPIE com sucesso!');
    resetForm();
    setActiveTab('lista');
  };

  // Status badges help
  const getStatusBadge = (status: DemandStatus) => {
    switch (status) {
      case 'triagem_pendente':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200" id="badge-triagem">Triagem Pendente</span>;
      case 'em_analise':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200" id="badge-analise">Em Análise Científica</span>;
      case 'respondida':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200" id="badge-respondida">Respondido</span>;
      case 'devolvida':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200" id="badge-devolvida">Devolvida p/ Ajuste</span>;
      case 'arquivada':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200" id="badge-arquivada">Arquivada</span>;
    }
  };

  const getUrgencyBadge = (urgency: DemandUrgency) => {
    switch (urgency) {
      case 'alta':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">Urgência: Alta</span>;
      case 'media':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Urgência: Média</span>;
      case 'baixa':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Urgência: Baixa</span>;
    }
  };

  // Se tem detalhe selecionado...
  const selectedDemand = demands.find(d => d.id === selectedDemandId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full overflow-y-auto md:overflow-hidden bg-slate-50" id="gestor-profile-root">
      {/* Sidebar do Perfil Gestor - Image Style Consistency */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-850 h-auto md:h-full" id="gestor-sidebar">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-teal-400 font-sans tracking-wide">SABER</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">Sistema de Apoio Baseado em Evidências e Respostas</p>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto px-2">
          {/* MENU PRINCIPAL */}
          <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Menu Principal</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => { setActiveTab('home'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'home' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-gestor-home"
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span>Painel</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('nova'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'nova' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-gestor-nova"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Criar Demanda</span>
            </button>
          </nav>

          {/* DEMANDAS */}
          <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Demandas</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => { setActiveTab('lista'); setSelectedDemandId(null); }}
              className={`flex items-center justify-between w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'lista' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-gestor-lista"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Demandas em aberto</span>
              </div>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {listDemands.length}
              </span>
            </button>
          </nav>

          {/* PERFIL */}
          <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Conta</div>
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('perfil'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border-l-4 ${
                activeTab === 'perfil' && !selectedDemandId 
                  ? 'bg-slate-800 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-transparent'
              }`}
              id="tab-gestor-perfil"
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-teal-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0">
              CM
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white truncate block">Carlos Mendes</span>
              <span className="text-[10px] text-teal-400 bg-[#042f2e] px-2 py-0.5 mt-0.5 rounded font-bold uppercase tracking-wider block font-mono text-center w-max">GESTOR</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal do Perfil Gestor - Outer Grid alignment with padding and clean borders */}
      <main className="flex-grow flex flex-col h-auto md:h-full overflow-visible md:overflow-hidden" id="gestor-content">
        {/* Header bar designed after High Density style */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-800 font-sans tracking-tight">Módulo de Decisor do SUS</h1>
            <p className="text-[11px] text-gray-500 font-medium">Porto Velho — RO  ·  Ambiente de Evidências</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-500 bg-slate-100 py-1 px-2.5 rounded border border-slate-200">
              CARLOS MENDES (Gestor)
            </div>
            <RoleSelector activeRole={activeRole} onChangeRole={onChangeRole} />
          </div>
        </header>

        {/* Content Scroll Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* Caso tenha uma demanda selecionada para visualização de detalhes */}
        {selectedDemandId && selectedDemand ? (
          <div id="demand-detail-view" className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
            
            {/* Header com breadcrumbs e botões de ação idênticos à imagem */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Detalhe da demanda</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-teal-600 font-sans lowercase">acompanhamento</span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Demanda #{selectedDemand.id} — {selectedDemand.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Aberta em {selectedDemand.createdAt} · {selectedDemand.area}
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                <button
                  onClick={() => setSelectedDemandId(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Voltar
                </button>
                <span className={`px-4 py-2 rounded-lg text-xs font-extrabold shadow-sm ${
                  selectedDemand.status === 'triagem_pendente'
                    ? 'bg-amber-100 text-amber-800'
                    : selectedDemand.status === 'em_analise'
                    ? 'bg-indigo-100 text-indigo-800'
                    : selectedDemand.status === 'respondida'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedDemand.status === 'triagem_pendente' ? 'Triagem' : 
                   selectedDemand.status === 'em_analise' ? 'Em Análise' :
                   selectedDemand.status === 'respondida' ? 'Respondida' : 'Devolvida'}
                </span>
              </div>
            </div>

            {/* Layout em Grid Responsivo: Detalhes na esquerda (2/3) e Linha do Tempo na direita (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Coluna da Esquerda: Detalhes e Pareceres técnicos */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Alerta de solicitação DEVOLVIDA do NAPIE */}
                {selectedDemand.status === 'devolvida' && (
                  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 flex gap-3 text-amber-900 shadow-sm" id="devolvida-warning">
                    <span className="font-extrabold shrink-0 text-xl font-mono text-amber-500">!</span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-800">Necessário Complementar Evidências (Sinalizado pelo NAPIE)</h4>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        A proposta necessita de detalhamento técnico ou dados locais para que possamos qualificar e encaminhar com eficácia. Por favor, edite a proposta adicionando novos anexos explicativos.
                      </p>
                      <div className="mt-3">
                        <button 
                          onClick={() => {
                            showToast("Simulando envio de complemento técnico ao NAPIE...");
                            selectedDemand.status = "triagem_pendente";
                            selectedDemand.timeline.push({
                              title: "Complemento Fornecido",
                              desc: "Gestor anexou novos documentos requisitados e reenvio à triagem.",
                              date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
                              icon: "FileUp",
                              status: "success"
                            });
                            setSelectedDemandId(null);
                          }}
                          className="text-xs font-bold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          Reenviar com Evidências Complementares
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card principal com detalhes da solicitação */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Detalhes da solicitação
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Área temática</h4>
                      <p className="text-xs text-slate-800 font-medium mt-1 uppercase tracking-wide">{selectedDemand.area}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pergunta clínica / Contexto</h4>
                      <p className="text-xs text-slate-800 leading-relaxed mt-1 whitespace-pre-line">
                        {selectedDemand.description}
                      </p>
                    </div>

                    {selectedDemand.picoQuestion && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estrutura de Pergunta Científica PICO</h4>
                        <div className="bg-slate-50 text-slate-700 text-[11px] p-3 rounded-lg border border-slate-150 font-mono leading-relaxed mt-1 whitespace-pre-line">
                          {selectedDemand.picoQuestion}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Decisão a subsidiar</h4>
                      <p className="text-xs text-slate-800 leading-relaxed mt-1">
                        {selectedDemand.decisionSubsidized}
                      </p>
                    </div>

                    {selectedDemand.municipio && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Localidade de Abrangência</h4>
                        <p className="text-xs text-slate-800 flex items-center gap-1.5 mt-1 font-medium">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          {selectedDemand.municipio}
                        </p>
                      </div>
                    )}

                    {selectedDemand.evidenceFiles && selectedDemand.evidenceFiles.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evidências anexadas</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDemand.evidenceFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs border border-slate-200 font-mono">
                              <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PARECER CIENTÍFICO RECEBIDO */}
                {selectedDemand.status === 'respondida' && selectedDemand.responseBody && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6" id="scientific-response-section">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Parecer Científico de Resposta
                    </h3>

                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 space-y-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm font-mono">
                            {selectedDemand.assignedInstitution?.substring(0, 2) || 'IP'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{selectedDemand.responseAuthor || 'Dra. Renata Alves'}</h4>
                            <p className="text-xs text-slate-500">{selectedDemand.assignedInstitution} · Publicado em {selectedDemand.responseDate}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 text-xs">
                          {selectedDemand.gradeRecommendation && (
                            <span className="bg-emerald-700 text-white px-3 py-1 rounded-full font-bold shadow-sm uppercase tracking-wide text-[10px]">
                              RECOMENDAÇÃO: GRAU {selectedDemand.gradeRecommendation}
                            </span>
                          )}
                          <span className="bg-white text-emerald-800 px-2.5 py-1 rounded-full font-bold border border-emerald-250 text-[10px] font-mono shadow-xs">
                            {selectedDemand.evidenceForce || 'Força de Evidência: Forte'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-5 rounded-lg border border-emerald-100 shadow-sm whitespace-pre-line">
                        {selectedDemand.responseBody}
                      </div>

                      {selectedDemand.responseReferences && selectedDemand.responseReferences.length > 0 && (
                        <div className="pt-2">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans mb-1.5">Referências Bibliográficas Recomendadas</h4>
                          <ol className="list-decimal list-inside text-xs text-slate-600 mt-1.5 space-y-1.5 font-mono">
                            {selectedDemand.responseReferences.map((ref, idx) => (
                              <li key={idx} className="bg-emerald-100/30 p-2 rounded border border-emerald-100/20">{ref}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {selectedDemand.responseFiles && selectedDemand.responseFiles.length > 0 && (
                        <div className="pt-3 border-t border-emerald-100">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans mb-1.5">Relatórios Técnicos / Pareceres Anexos</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDemand.responseFiles.map((file, i) => (
                              <a
                                href="#simulate-download"
                                key={i}
                                onClick={(e) => { e.preventDefault(); showToast(`Baixando parecer técnico: ${file}`); }}
                                className="flex items-center gap-1.5 bg-white hover:bg-emerald-100 hover:text-emerald-900 text-slate-800 px-3 py-1.5 rounded-lg text-xs border border-emerald-200 transition-colors shadow-xs"
                              >
                                <FileText className="h-4 w-4 text-emerald-600" />
                                <span>{file} 📥</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna da Direita: Linha do Tempo de Rastreabilidade */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Linha do tempo
                  </h3>

                  <div className="relative border-l border-slate-150 ml-3 pl-6 space-y-6">
                    {selectedDemand.timeline.map((item, idx) => {
                      const isRegistered = item.title.toLowerCase().includes('registrada') || item.title.toLowerCase().includes('aberta');
                      const isNapie = item.title.toLowerCase().includes('napie') || item.title.toLowerCase().includes('triagem');
                      const isComplement = item.title.toLowerCase().includes('complement') || item.title.toLowerCase().includes('adequação');
                      const isPublished = item.title.toLowerCase().includes('publicado') || item.title.toLowerCase().includes('parecer') || item.title.toLowerCase().includes('respondido');
                      
                      let circleColor = 'bg-slate-50 border-slate-200 text-slate-400';
                      if (isRegistered) circleColor = 'bg-sky-50 border-sky-200 text-sky-500';
                      else if (isNapie) circleColor = 'bg-amber-50 border-amber-200 text-amber-500';
                      else if (isComplement) circleColor = 'bg-red-50 border-red-200 text-red-500';
                      else if (isPublished) circleColor = 'bg-teal-50 border-teal-200 text-teal-500';

                      return (
                        <div key={idx} className="relative">
                          <span className={`absolute -left-[35px] top-0 border rounded-full p-1.5 flex items-center justify-center shrink-0 shadow-xs ${circleColor}`}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                          </span>
                          <div>
                            <p className="text-[10px] text-slate-400 font-mono">{item.date}</p>
                            <h5 className="text-xs font-bold text-slate-800 mt-0.5">{item.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. SEÇÃO HOME */}
            {activeTab === 'home' && (
              <div className="space-y-8" id="gestor-tab-home">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Painel de Decisor em Saúde</h1>
                    <p className="text-slate-500 text-sm mt-1">
                      Pesquise e registre demandas de evidências científicas para subsidiar e respaldar tomadas de decisão regulatória no SUS.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('nova')}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-teal-500 hover:bg-teal-600 border border-teal-500 text-slate-950 transition-colors shadow-sm rounded-lg shrink-0 cursor-pointer"
                  >
                    <Plus className="h-4.5 w-4.5" /> Abrir Solicitação de Evidências
                  </button>
                </div>

                {/* Grid estatístico do gestor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 border border-teal-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">{listDemands.length}</div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Minhas Demandas</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 border border-amber-100">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">
                        {listDemands.filter(d => d.status === 'triagem_pendente' || d.status === 'em_analise').length}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Em Processamento</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-55 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">
                        {listDemands.filter(d => d.status === 'respondida').length}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Respondidas c/ Parecer</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 border border-rose-100">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold text-slate-900">
                        {listDemands.filter(d => d.status === 'devolvida').length}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase font-medium mt-0.5">Deajustes Sinalizados</div>
                    </div>
                  </div>
                </div>

                {/* Demandas Recentes */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Histórico Recente de Solicitações</h3>
                      <p className="text-[11px] text-slate-400">Clique sobre o item para rastrear o fluxo e ler a resposta técnica.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('lista')}
                      className="text-xs hover:text-teal-600 font-medium text-slate-600 cursor-pointer"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {listDemands.slice(0, 4).map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-xs font-mono font-semibold bg-slate-150 bg-slate-100 px-2 py-1 rounded text-slate-600 shrink-0">
                            #{demand.id}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 hover:text-teal-600 truncate transition-colors">
                              {demand.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Área: {demand.area} · Aberta em: {demand.createdAt} · {demand.municipio}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {getUrgencyBadge(demand.urgency)}
                          {getStatusBadge(demand.status)}
                          <div className="text-xs text-slate-400">Ver 📁</div>
                        </div>
                      </div>
                    ))}
                    {listDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-450 text-sm">Nenhuma demanda cadastrada. Clique em "Nova Demanda" no sidebar.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. TAB ABRIR NOVA SOLICITAÇÃO (WIZARD) */}
            {activeTab === 'nova' && (
              <div className="max-w-2xl mx-auto space-y-6" id="gestor-tab-nova">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Formulário Estruturado de Solicitação Científica</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Preencha as informações necessárias seguindo as boas práticas recomendadas do Ministério da Saúde para facilitar o trabalho do NAPIE e das universidades.
                  </p>
                </div>

                {/* Indicador de Passos */}
                <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-900">Passo {currentStep} de 4</span>
                    <span>
                      {currentStep === 1 && 'Identificação Geral'}
                      {currentStep === 2 && 'Definição da Pergunta Científica'}
                      {currentStep === 3 && 'Busca Preliminar & Evidências'}
                      {currentStep === 4 && 'Revisão Final'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-1.5 transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Passo 1 - Identificação */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="pas-1-content">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide pb-1 border-b border-slate-100">Etapa 1 — Identificação Inicial</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Título Resumido da Demanda *</label>
                        <input
                          type="text"
                          required
                          value={formTitulo}
                          onChange={(e) => setFormTitulo(e.target.value)}
                          placeholder="Ex: Efetividade da vacina bivalente em maiores de 60 anos"
                          className="w-full px-3 py-2 text-xs border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500"
                          id="input-form-titulo"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Área Temática Prioritária *</label>
                          <select
                            value={formArea}
                            onChange={(e) => setFormArea(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500"
                            id="select-form-area"
                          >
                            <option value="">Selecione...</option>
                            <option value="Epidemiologia e Vigilância">Epidemiologia e Vigilância</option>
                            <option value="Imunização e Vacinas">Imunização e Vacinas</option>
                            <option value="Saúde Materno-Infantil">Saúde Materno-Infantil</option>
                            <option value="Doenças Crônicas">Doenças Crônicas</option>
                            <option value="Doenças Infecciosas e Parasitárias">Doenças Infecciosas e Parasitárias</option>
                            <option value="Saúde Mental">Saúde Mental</option>
                            <option value="Atenção Primária à Saúde">Atenção Primária à Saúde</option>
                            <option value="Gestão e Políticas de Saúde">Gestão e Políticas de Saúde</option>
                            <option value="Medicamentos e Farmácia">Medicamentos e Farmácia</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Impacto & Urgência Clínica</label>
                          <div className="flex gap-2">
                            {(['alta', 'media', 'baixa'] as const).map((urg) => (
                              <button
                                key={urg}
                                type="button"
                                onClick={() => setFormUrgency(urg)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all uppercase border ${
                                  formUrgency === urg
                                    ? 'bg-amber-450 border-amber-500 bg-teal-50 text-teal-800 border-teal-500'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {urg}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Abrangência Territorial (Município)</label>
                          <input
                            type="text"
                            value={formMunicipio}
                            onChange={(e) => setFormMunicipio(e.target.value)}
                            placeholder="Ex: Porto Velho — RO"
                            className="w-full px-3 py-2 text-xs border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          if (!formTitulo || !formArea) {
                            showToast('Por favor, defina o Título e a Área Temática para prosseguir!');
                          } else {
                            setCurrentStep(2);
                          }
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-800"
                        id="btn-next-step-1"
                      >
                        Próximo Passo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Passo 2 - Descrição & PICO */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="pas-2-content">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide pb-1 border-b border-slate-100">Etapa 2 — A Pergunta Científica</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Pergunta Clínica Detalhada ou Contexto *</label>
                        <textarea
                          rows={4}
                          value={formDescricao}
                          onChange={(e) => setFormDescricao(e.target.value)}
                          placeholder="Explique detalhadamente qual é o problema prático enfrentado de saúde pública municipal..."
                          className="w-full p-3 text-xs border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500"
                          id="textarea-form-descricao"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Estrutura de Pergunta Científica PICO (Opcional)</label>
                        <textarea
                          rows={3}
                          value={formPico}
                          onChange={(e) => setFormPico(e.target.value)}
                          placeholder="P - Pacientes/População: Ex. Crianças ribeirinhas.\nI - Intervenção: Ex. Uso de ivermectina dose única.\nC - Comparação: Ex. Tratamento habitual.\nO - Desfecho/Outcome: Ex. Segurança de saúde ou efeitos colaterais."
                          className="w-full p-3 text-xs border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Qual Decisão na Gestão Pública será Pautada por esta Evidência? *</label>
                        <textarea
                          rows={2}
                          value={formDecisao}
                          onChange={(e) => setFormDecisao(e.target.value)}
                          placeholder="Ex: Aquisição e alteração no protocolo de atendimento ou inclusão de insumo na farmácia básica..."
                          className="w-full p-3 text-xs border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500"
                          id="textarea-form-decisao"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2 bg-slate-105 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        ← Voltar anterior
                      </button>
                      <button
                        onClick={() => {
                          if (!formDescricao || !formDecisao) {
                            showToast('Defina a pergunta do problema e a decisão pública a ser influenciada para prosseguir!');
                          } else {
                            setCurrentStep(3);
                          }
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-800"
                        id="btn-next-step-2"
                      >
                        Próximo Passo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Passo 3 - Evidências virtuais */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="pas-3-content">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide pb-1 border-b border-slate-100">Etapa 3 — Anexar Evidências ou Dados Disponíveis</h3>

                    <div className="space-y-4">
                      <div className="bg-slate-50 border-2 border-dashed border-slate-250 rounded-xl p-6 text-center">
                        <FileUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <h4 className="text-xs font-semibold text-slate-700">Adicione arquivos que auxiliem a responder</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-1">
                          Você pode anexar boletins, dados locais, planilhas preliminares ou pesquisas que fundamentam o problema.
                        </p>
                        
                        <button
                          type="button"
                          onClick={handleSimulateUpload}
                          className="mt-3 inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs px-3 py-1.5 rounded border border-slate-250 cursor-pointer"
                          id="btn-simulate-upload"
                        >
                          Anexar Arquivo (Simulado)
                        </button>
                      </div>

                      {attachedFiles.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-600 mb-1.5">Arquivos Anexados virtualmente ({attachedFiles.length})</h4>
                          <div className="space-y-1.5">
                            {attachedFiles.map((f, i) => (
                              <div key={i} className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded p-2 text-slate-700">
                                <div className="flex items-center gap-1.5 font-mono truncate mr-2">
                                  <FileText className="h-3.5 w-3.5 text-teal-600" />
                                  <span>{f}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(i)}
                                  className="text-rose-600 hover:text-rose-850 cursor-pointer"
                                >
                                  Remover
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 bg-slate-105 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        ← Voltar anterior
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-800"
                        id="btn-next-step-3"
                      >
                        Ir para Revisão →
                      </button>
                    </div>
                  </div>
                )}

                {/* Passo 4 - Revisão final e envio */}
                {currentStep === 4 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="pas-4-content">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide pb-1 border-b border-slate-100">Etapa 4 — Revisão Geral e Assinatura</h3>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 test-sm text-slate-700 leading-relaxed font-sans">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Título Proposto</span>
                        <strong className="text-slate-900">{formTitulo || '(não definido)'}</strong>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Área Primária</span>
                          <span>{formArea || '(não definida)'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Urgência</span>
                          <span className="uppercase font-semibold">{formUrgency}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Problema Clínico / Contextual</span>
                        <p className="text-xs text-slate-650 line-clamp-3">{formDescricao || '(não preenchido)'}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Decisão Pública Impactada</span>
                        <p className="text-xs font-medium text-slate-900">{formDecisao || '(não preenchida)'}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Arquivos Anexos</span>
                        <span className="text-xs">{attachedFiles.join(', ') || 'Nenhum documento anexado'}</span>
                      </div>
                    </div>

                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-teal-900 text-xs leading-relaxed">
                      💡 <strong>Sobre o Fluxamento:</strong> Após o envio, a equipe de cientistas qualificados de saúde pública do <strong>NAPIE</strong> (liderado por Edson Neves Da Cruz) avaliará a elegibilidade e encaminhará à instituição mais apta (como a <strong>Instituição Parceira</strong>).
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-2 bg-slate-105 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        ← Voltar anterior
                      </button>
                      <button
                        onClick={handleAddDemand}
                        className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-md shadow-teal-500/10"
                        id="btn-submit-demand"
                      >
                        Confirmar e Enviar para Triagem do NAPIE 🚀
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. LISTA COMPLETA DAS DEMANDAS */}
            {activeTab === 'lista' && (
              <div className="space-y-4" id="gestor-tab-lista">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Demandas de Carlos Mendes</h1>
                    <p className="text-xs text-slate-500">Acompanhe as propostas abertas pela sua assessoria de saúde em Porto Velho.</p>
                  </div>
                  
                  {/* Busca */}
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar propostas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-250 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {listDemands
                      .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.includes(searchQuery))
                      .map(demand => (
                        <div
                          key={demand.id}
                          onClick={() => setSelectedDemandId(demand.id)}
                          className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="text-xs font-mono font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600 shrink-0">
                              #{demand.id}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-slate-900 hover:text-teal-600 truncate transition-colors">
                                {demand.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Área: {demand.area} · Aberto em: {demand.createdAt} · No. Arquivos: {demand.evidenceFiles.length}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {getUrgencyBadge(demand.urgency)}
                            {getStatusBadge(demand.status)}
                          </div>
                        </div>
                      ))}
                    {listDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-450 text-xs">Nenhuma demanda encontrada para o filtro de busca citado.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. PERFIL DO GESTOR */}
            {activeTab === 'perfil' && (
              <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="gestor-tab-perfil">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Informações Cadastrais do Gestor</h3>
                
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-teal-500 rounded-full flex items-center justify-center text-white font-black text-xl">
                    CM
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Carlos Mendes</h3>
                    <p className="text-xs text-slate-500">Assessor Executivo / Coordenador Geral</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-mono">Instituição de Origem</span>
                    <span className="font-medium text-slate-800">Secretaria Municipal de Saúde — SEMUSA Porto Velho/RO</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">E-mail de Contato</span>
                    <span className="font-medium text-slate-800">c.mendes@semusa.portovelho.ro.gov.br</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Telefone Corporativo</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-teal-600" />
                      (69) 3901-3638 (Ramal 401)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Autorização no Sistema SABER</span>
                    <span className="text-teal-600 font-bold">Autorizado · Nível Decisor SUS</span>
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
