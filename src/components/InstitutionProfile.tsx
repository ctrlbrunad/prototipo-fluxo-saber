/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Demand, DemandUrgency, DemandStatus, GradeLetter } from '../types';
import { RoleSelector } from './RoleSelector';
import { 
  Inbox, FileText, CheckCircle, Clock, ArrowLeft, Send, Save, Eye, Edit, Plus, BookOpen, ListFilter,
  Check, FileUp, Award, User, Layers, Search, AlignLeft, ShieldCheck, Database
} from 'lucide-react';

interface InstitutionProfileProps {
  demands: Demand[];
  onUpdateDemand: (demand: Demand) => void;
  selectedDemandId: string | null;
  setSelectedDemandId: (id: string | null) => void;
  showToast: (msg: string) => void;
  activeRole: 'gestor' | 'napie' | 'instituicao' | 'admin';
  onChangeRole: (role: 'gestor' | 'napie' | 'instituicao' | 'admin') => void;
}

export const InstitutionProfile: React.FC<InstitutionProfileProps> = ({
  demands,
  onUpdateDemand,
  selectedDemandId,
  setSelectedDemandId,
  showToast,
  activeRole,
  onChangeRole
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'recebidas' | 'pesquisadores'>('home');
  const [statusFilter, setStatusFilter] = useState<'all' | 'em_analise' | 'respondida'>('all');
  const [triageSubTab, setTriageSubTab] = useState<'conteudo' | 'classificacao' | 'redacao' | 'preview'>('conteudo');

  // Cadastro de Pesquisadores
  const [pesquisadores, setPesquisadores] = useState([
    { nome: 'Dr. Adriano Costa', role: 'Infectologia / Coordenação', resp: 12 },
    { nome: 'Dra. Renata Alves', role: 'Epidemiologia Geral', resp: 8 },
    { nome: 'Dr. Paulo Nunes', role: 'Saúde Coletiva', resp: 5 },
    { nome: 'Dra. Flávia Moraes', role: 'Medicina Tropical Avançada', resp: 7 },
  ]);
  const [novoPesqNome, setNovoPesqNome] = useState('');
  const [novoPesqCargo, setNovoPesqCargo] = useState('');
  const [novoPesqEspecialidade, setNovoPesqEspecialidade] = useState('');
  const [showCadastroForm, setShowCadastroForm] = useState(false);
  
  // States para a formulação da resposta científica
  const [responsavelName, setResponsavelName] = useState('Dr. Adriano Costa (Infectologia)');
  const [evidenceExpected, setEvidenceExpected] = useState('Revisão rápida da literatura');
  const [responseNotes, setResponseNotes] = useState('');
  const [references, setReferences] = useState<string[]>([
    'Organização Pan-Americana da Saúde. Diretrizes para o Diagnóstico e Tratamento da Dengue nas Américas. OPAS, 2022.',
    'Ministério da Saúde. Dengue: diagnóstico e manejo clínico: adulto e criança. Brasília, 2024.',
    'Cruz, E. N. et al. Controle integrado de vetores em áreas urbanas amazônicas. Revista de Medicina Tropical, 2025.'
  ]);
  const [newRefInput, setNewRefInput] = useState('');
  
  const [decsTags, setDecsTags] = useState<string[]>(['Dengue', 'Surtos de Doenças', 'Controle de Vetores', 'Amazônia Legal']);
  const [newTagInput, setNewTagInput] = useState('');
  
  const [databases, setDatabases] = useState<string[]>(['PubMed / MEDLINE', 'LILACS / BVS', 'OPAS / OMS Guidelines']);
  
  const [selectedForce, setSelectedForce] = useState('Moderada — Qualidade moderada');
  const [selectedGrade, setSelectedGrade] = useState<GradeLetter>('A');
  const [draftBody, setDraftBody] = useState('');
  const [attachedReportFiles, setAttachedReportFiles] = useState<string[]>(['parecer_tecnico_dengue_ufam.pdf']);

  const handleCadastrarPesquisador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPesqNome.trim()) {
      showToast('O nome do pesquisador é obrigatório');
      return;
    }
    const novo = {
      nome: novoPesqNome.trim(),
      role: `${novoPesqCargo.trim() || 'Pesquisador'}  ·  ${novoPesqEspecialidade.trim() || 'Geral'}`,
      resp: 0
    };
    setPesquisadores([...pesquisadores, novo]);
    setNovoPesqNome('');
    setNovoPesqCargo('');
    setNovoPesqEspecialidade('');
    setShowCadastroForm(false);
    showToast('Pesquisador cadastrado com sucesso!');
  };

  const ufamDemands = demands.filter(d => d.assignedInstitution === 'Instituição Parceira');

  const availableDatabases = ['PubMed / MEDLINE', 'LILACS / BVS', 'Cochrane Library', 'OPAS / OMS Guidelines', 'Embase', 'SciELO'];

  const sectionTemplates = {
    contexto: '## Contexto Epidemiológico e Clínico\nDe acordo com a solicitação da SEMUSA, analisamos a situação do município. A incidência que ultrapassa o limiar endêmico requer intervenção integrada...\n\n',
    evidencias: '## Síntese das Evidências Encontradas\nA literatura aponta que a nebulização espacial combinada à busca ativa de focos por agentes de endemias apresenta redução na taxa de transmissão em até 30% em 3 semanas...\n\n',
    recomendacoes: '## Recomendações Técnicas para Gestão\n1. Ativação imediata da Sala de Situação de Arboviroses.\n2. Adaptação das diretrizes de manejo clínico da OPAS (2022) com telemonitoramento dos casos suspeitos.\n3. Mutirões comunitários dirigidos aos bairros de maior taxa de infecção.\n\n',
    limitacoes: '## Limitações Teóricas Gerais\nAs evidências para controle vetorial contínuo na Amazônia sofrem forte influência de fatores climáticos sazonais (período de chuvas), necessitando de validação de modelos estatísticos locais.\n\n',
    conclusao: '## Conclusão e Próximos Passos\nA recomendação primária é de caráter forte (GRADE A) no que tange ao manejo clínico preventivo e reorganização da triagem primária nos postos de atenção básica.\n\n'
  };

  const handleInsertTemplate = (key: keyof typeof sectionTemplates) => {
    setDraftBody(draftBody + sectionTemplates[key]);
    showToast(`Seção "${key.toUpperCase()}" inserida no parecer!`);
  };

  const handleSimulateReportAttach = () => {
    const list = ['revisao_sistematica_complemento.pdf', 'tabelas_custos_arboviroses.xlsx', 'mapa_risco_bairros_pvh.pdf'];
    const r = list[Math.floor(Math.random() * list.length)];
    if (!attachedReportFiles.includes(r)) {
      setAttachedReportFiles([...attachedReportFiles, r]);
      showToast(`Documento científico "${r}" anexado virtuamente!`);
    } else {
      showToast('Documentado já anexado.');
    }
  };

  const handleAddRef = () => {
    if (newRefInput.trim()) {
      setReferences([...references, newRefInput.trim()]);
      setNewRefInput('');
      showToast('Referência acadêmica incluída!');
    }
  };

  const handleRemoveRef = (idx: number) => {
    const r = [...references];
    r.splice(idx, 1);
    setReferences(r);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !decsTags.includes(newTagInput.trim())) {
      setDecsTags([...decsTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleToggleDatabase = (db: string) => {
    if (databases.includes(db)) {
      setDatabases(databases.filter(d => d !== db));
    } else {
      setDatabases([...databases, db]);
    }
  };

  const handlePublishResponse = (demand: Demand) => {
    if (draftBody.trim().length < 50) {
      showToast('Por favor, redija um parecer científico detalhado (mínimo de 50 caracteres) antes de publicar.');
      return;
    }

    const updatedTimeline = [...demand.timeline];
    updatedTimeline.push({
      title: 'Resposta Técnica Emitida',
      desc: `Parecer publicado homologado com grau GRADE: ${selectedGrade} pelo pesquisador responsável.`,
      date: `${new Date().toISOString().substring(0, 10)} ${new Date().toTimeString().substring(0, 5)}`,
      icon: 'Award',
      status: 'success'
    });

    const updated: Demand = {
      ...demand,
      status: 'respondida',
      responseAuthor: responsavelName,
      responseBody: draftBody,
      responseReferences: references,
      responseFiles: attachedReportFiles,
      evidenceForce: selectedForce.split('—')[0].trim(),
      gradeRecommendation: selectedGrade,
      responseDate: new Date().toISOString().substring(0, 10),
      timeline: updatedTimeline,
      
      // internal info
      pesquisadorResponsavel: responsavelName,
      evidenceTypeExpected: evidenceExpected,
      observacoesInternas: responseNotes,
      descritores: decsTags,
      basesConsultadas: databases
    };

    onUpdateDemand(updated);
    showToast('Parecer técnico emitido e enviado com sucesso ao Gestor!');
    setSelectedDemandId(null);
    setDraftBody('');
    setActiveTab('home');
  };

  const getStatusBadge = (status: DemandStatus) => {
    switch (status) {
      case 'triagem_pendente':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">Qualificação pendente</span>;
      case 'em_analise':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Aguardando parecer</span>;
      case 'respondida':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Respondido</span>;
      case 'devolvida':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-rose-50 text-rose-700 border border-rose-200">Devolvido ao gestor</span>;
      default:
        return null;
    }
  };

  const selectedDemand = demands.find(d => d.id === selectedDemandId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full overflow-y-auto md:overflow-hidden bg-slate-50" id="institution-profile-root">
      {/* Sidebar Científica - Image 1 Style */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-850 h-auto md:h-full" id="inst-sidebar">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-teal-400 font-sans tracking-wide">SABER</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">Sistema de Apoio Baseado em Evidências e Respostas</p>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          {/* MEU PAINEL */}
          <div className="px-6 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Meu Painel</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => { setActiveTab('home'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'home' && !selectedDemandId 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
              id="tab-inst-home"
            >
              <span>Painel</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('recebidas'); setStatusFilter('all'); setSelectedDemandId(null); }}
              className={`flex items-center justify-between w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'recebidas' && statusFilter === 'all' && !selectedDemandId 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
              id="tab-inst-recebidas"
            >
              <span>Demandas recebidas</span>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {ufamDemands.length}
              </span>
            </button>
          </nav>

          {/* TRABALHO */}
          <div className="px-6 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Trabalho</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => { setActiveTab('recebidas'); setStatusFilter('em_analise'); setSelectedDemandId(null); }}
              className={`flex items-center justify-between w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'recebidas' && statusFilter === 'em_analise' && !selectedDemandId
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
            >
              <span>Em análise</span>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                2
              </span>
            </button>
            
            <button
              onClick={() => { setActiveTab('recebidas'); setStatusFilter('respondida'); setSelectedDemandId(null); }}
              className={`flex items-center justify-between w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'recebidas' && statusFilter === 'respondida' && !selectedDemandId
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
            >
              <span>Respondidas</span>
            </button>
          </nav>

          {/* PRODUÇÃO */}
          <div className="px-6 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Produção</div>
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('pesquisadores'); setSelectedDemandId(null); }}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'pesquisadores' && !selectedDemandId 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
              id="tab-inst-pesquisadores"
            >
              <span>Pesquisadores</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0">
              AC
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white truncate block">Dr. Adriano Costa</span>
              <span className="text-[10px] text-blue-400 bg-[#172554] px-2 py-0.5 mt-0.5 rounded font-bold uppercase tracking-wider block font-mono text-center w-max">INST. CIENTÍFICA</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal do Pesquisador (UFAM) */}
      <main className="flex-grow flex flex-col h-auto md:h-full overflow-visible md:overflow-hidden">
        {/* Header bar designed after High Density style */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-800 font-sans tracking-tight">Módulo de Pesquisa e Parecer</h1>
            <p className="text-[11px] text-gray-500 font-medium">Instituição Parceira</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-500 bg-slate-100 py-1 px-2.5 rounded border border-slate-205">
              INSTITUIÇÃO PARCEIRA
            </div>
            <RoleSelector activeRole={activeRole} onChangeRole={onChangeRole} />
          </div>
        </header>

        {/* Content Scroll Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* Caso tenha uma demanda selecionada */}
        {selectedDemandId && selectedDemand ? (
          <div id="demand-response-workspace" className="max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => setSelectedDemandId(null)}
              className="flex items-center gap-1 text-slate-650 text-slate-650 text-slate-600 hover:text-slate-900 text-xs font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" /> Voltar ao Painel
            </button>

            {/* Cabeçalho da Demanda */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-450 uppercase tracking-widest font-mono">Processando Demanda #{selectedDemand.id}</span>
                  <h2 className="text-base font-bold text-slate-900 block mt-0.5">{selectedDemand.title}</h2>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Triage Direcionador: Edson Neves Da Cruz (NAPIE)</p>
                </div>
                {getStatusBadge(selectedDemand.status)}
              </div>

              {/* Sub-Tabs do Redator Técnico */}
              <div className="flex border-b border-slate-100 overflow-x-auto gap-4">
                <button
                  onClick={() => setTriageSubTab('conteudo')}
                  className={`py-2 text-xs font-semibold cursor-pointer ${
                    triageSubTab === 'conteudo' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-400'
                  }`}
                >
                  1. Solicitação do Gestor
                </button>
                <button
                  onClick={() => setTriageSubTab('classificacao')}
                  className={`py-2 text-xs font-semibold cursor-pointer ${
                    triageSubTab === 'classificacao' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-400'
                  }`}
                  id="tab-sub-classificacao"
                >
                  2. Classificação Científica
                </button>
                <button
                  onClick={() => setTriageSubTab('redacao')}
                  className={`py-2 text-xs font-semibold cursor-pointer ${
                    triageSubTab === 'redacao' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-400'
                  }`}
                  id="tab-sub-redacao"
                >
                  3. Redigir Parecer Técnico
                </button>
                <button
                  onClick={() => setTriageSubTab('preview')}
                  className={`py-2 text-xs font-semibold cursor-pointer ${
                    triageSubTab === 'preview' ? 'border-b-2 border-emerald-500 text-emerald-600 font-bold' : 'text-slate-405 text-slate-400'
                  }`}
                  id="tab-sub-preview"
                >
                  4. Pré-visualização Final
                </button>
              </div>

              {/* CONTEÚDO DA SUBTAB 1 - DADOS ENVIADOS */}
              {triageSubTab === 'conteudo' && (
                <div className="space-y-4 pt-2 text-xs text-slate-800" id="subtab-conteudo-content">
                  <div>
                    <h4 className="text-slate-450 uppercase font-mono tracking-widest text-[9px]">Instruções do NAPIE para a Pesquisa</h4>
                    <p className="mt-1 bg-amber-50 p-3 rounded text-amber-900 border border-amber-100 whitespace-pre-line leading-relaxed italic">
                      "{selectedDemand.napieNotes || 'Proposta padrão qualificada elegível.'}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-slate-450 uppercase font-mono tracking-widest text-[9px]">Pergunta do Gestor</h4>
                    <p className="mt-1 font-serif bg-slate-50 p-3 rounded leading-relaxed border border-slate-150">{selectedDemand.description}</p>
                  </div>

                  {selectedDemand.picoQuestion && (
                    <div>
                      <h4 className="text-slate-450 uppercase font-mono tracking-widest text-[9px]">Fatores Clínicos (PICO)</h4>
                      <p className="mt-1 font-mono leading-relaxed bg-slate-900 text-slate-250 p-3 rounded">{selectedDemand.picoQuestion}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-slate-450 uppercase font-mono tracking-widest text-[9px]">Decisão a subsidiar</h4>
                      <p className="mt-0.5 font-medium text-slate-900">{selectedDemand.decisionSubsidized}</p>
                    </div>
                    <div>
                      <h4 className="text-slate-450 uppercase font-mono tracking-widest text-[9px]">Prazo do Parecer</h4>
                      <p className="mt-0.5 text-rose-750 font-bold">{selectedDemand.deadline || 'Urgente'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA SUBTAB 2 - CLASSIFICAÇÃO */}
              {triageSubTab === 'classificacao' && (
                <div className="space-y-4 pt-2" id="subtab-classificacao-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável Interno</label>
                      <input 
                        type="text"
                        value={responsavelName} 
                        onChange={(e) => setResponsavelName(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-250 bg-white rounded focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Método de Síntese Acadêmica</label>
                      <select 
                        value={evidenceExpected} 
                        onChange={(e) => setEvidenceExpected(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-250 bg-white rounded focus:outline-none"
                      >
                        <option>Revisão rápida da literatura</option>
                        <option>Síntese de evidências clínicas</option>
                        <option>Revisão sistemática com metanálise de Cochrane</option>
                      </select>
                    </div>
                  </div>

                  {/* Bases de Dados & Descritores */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-750">Descritores Buscados (DeCS / MeSH)</label>
                      <div className="flex flex-wrap gap-1 border border-slate-200 p-2 rounded bg-slate-50 min-h-11">
                        {decsTags.map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 bg-teal-50 text-teal-800 text-[10px] px-2 py-0.5 rounded border border-teal-200">
                            {tag}
                            <button onClick={() => setDecsTags(decsTags.filter(t => t !== tag))} className="text-teal-605 text-[11px] font-bold">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          placeholder="Ex: Arboviroses"
                          className="flex-1 text-xs px-2 py-1.5 border border-slate-250 rounded focus:outline-none focus:border-teal-500"
                        />
                        <button onClick={handleAddTag} className="bg-slate-800 text-white text-xs px-3 rounded shadow hover:bg-slate-705">Adicionar</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-750">Bases Consultadas para busca de estudos</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableDatabases.map((db) => (
                          <label key={db} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={databases.includes(db)}
                              onChange={() => handleToggleDatabase(db)}
                              className="accent-teal-600 rounded"
                            />
                            <span>{db}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notas Internas para Equipe</label>
                    <textarea 
                      rows={2}
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      placeholder="Essas notas explicativas são confidenciais ao laboratório da universidade..."
                      className="w-full text-xs p-2.5 border border-slate-250 bg-white rounded focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setTriageSubTab('redacao')}
                      className="text-white text-xs font-bold px-4 py-2 bg-slate-900 rounded hover:bg-slate-850 cursor-pointer"
                      id="btn-next-subtab-classificacao"
                    >
                      Avançar para Redação do Parecer →
                    </button>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA SUBTAB 3 - REDAÇÃO */}
              {triageSubTab === 'redacao' && (
                <div className="space-y-4 pt-2" id="subtab-redacao-content">
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-slate-750 block flex items-center gap-1">
                      <Database className="h-4 w-4 text-teal-600" /> Auxiliar de Redação Científica
                    </span>
                    <p className="text-[11px] text-slate-500">Clique para inserir blocos de estrutura acadêmica diretamente no editor abaixo:</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button onClick={() => handleInsertTemplate('contexto')} className="text-[11px] bg-white border border-slate-250 hover:bg-teal-50 px-2.5 py-1 rounded text-slate-700">Contexto</button>
                      <button onClick={() => handleInsertTemplate('evidencias')} className="text-[11px] bg-white border border-slate-250 hover:bg-teal-50 px-2.5 py-1 rounded text-slate-700">Evidências</button>
                      <button onClick={() => handleInsertTemplate('recomendacoes')} className="text-[11px] bg-white border border-slate-250 hover:bg-teal-50 px-2.5 py-1 rounded text-slate-700">Recomendações</button>
                      <button onClick={() => handleInsertTemplate('limitacoes')} className="text-[11px] bg-white border border-slate-250 hover:bg-teal-50 px-2.5 py-1 rounded text-slate-700">Limitações</button>
                      <button onClick={() => handleInsertTemplate('conclusao')} className="text-[11px] bg-white border border-slate-250 hover:bg-teal-50 px-2.5 py-1 rounded text-slate-700">Conclusão</button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-750">Conteúdo do Parecer Técnico de Resposta (SABER format)</label>
                    <textarea
                      rows={10}
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      placeholder="Redija o parecer científico formal baseando-se nas evidências encontradas nas bases. Utilize títulos Markdown (##) para organizar as seções."
                      className="w-full p-4 border border-slate-250 rounded-lg bg-white text-xs font-serif leading-relaxed focus:outline-none focus:border-teal-500"
                      id="editor-draft-body"
                    />
                  </div>

                  {/* Referências de Autoria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-750">Métricas GRADE e Nível de Segurança Geral</label>
                      <div className="bg-slate-5 border border-slate-200 p-3 rounded bg-slate-50 space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Grau de Recomendação Técnico (Grau GRADE)</label>
                          <div className="flex gap-2">
                            {(['A', 'B', 'C', 'D'] as const).map((grade) => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => setSelectedGrade(grade)}
                                className={`flex-1 py-1.5 rounded text-xs font-mono font-bold cursor-pointer border ${
                                  selectedGrade === grade
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white border-slate-250 hover:bg-slate-100 text-slate-800'
                                }`}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Qualidade das Evidências Levantadas</label>
                          <select
                            value={selectedForce}
                            onChange={(e) => setSelectedForce(e.target.value)}
                            className="w-full p-1.5 border border-slate-250 bg-white text-xs rounded"
                          >
                            <option>Forte — Alta qualidade de evidência</option>
                            <option>Moderada — Qualidade moderada</option>
                            <option>Baixa — Qualidade baixa / opcional</option>
                            <option>Inconclusiva — Falta dados suficientes para inferência</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-755">Incluir Referências Citadas (Vancouver/ABNT)</label>
                      <div className="space-y-1 max-h-36 overflow-y-auto border border-slate-200 bg-slate-50 p-2 rounded">
                        {references.map((r, i) => (
                          <div key={i} className="flex justify-between items-start gap-1 p-1 text-[11px] text-slate-650 font-sans border-b border-slate-200/50 last:border-b-0 leading-tight">
                            <span className="truncate flex-1">[{i+1}] {r}</span>
                            <button onClick={() => handleRemoveRef(i)} className="text-rose-600 hover:text-rose-800 font-bold shrink-0">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRefInput}
                          onChange={(e) => setNewRefInput(e.target.value)}
                          placeholder="Cole a citação científica..."
                          className="flex-1 text-xs px-2.5 py-1.5 border border-slate-250 rounded focus:outline-none"
                        />
                        <button onClick={handleAddRef} className="bg-slate-800 hover:bg-slate-750 text-white text-xs px-3 rounded shadow">Adicionar</button>
                      </div>
                    </div>
                  </div>

                  {/* Anexar simulação de PDF de laudos */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-750 mb-1.5">Anexar documento formal chancelado (simulation)</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      <button onClick={handleSimulateReportAttach} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-250 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded cursor-pointer">
                        <FileUp className="h-4 w-4" /> Simular Envio de Parecer Assinado
                      </button>
                      {attachedReportFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded text-[11px] font-mono shadow-sm">
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-105">
                    <button
                      onClick={() => setTriageSubTab('preview')}
                      className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
                      id="btn-next-subtab-redacao"
                    >
                      Visualizar Prévia Final e Publicar →
                    </button>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA SUBTAB 4 - PREVIEW */}
              {triageSubTab === 'preview' && (
                <div className="pt-2 space-y-6" id="subtab-preview-content">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-teal-900 text-xs flex gap-2">
                    <span className="font-bold">✓</span>
                    <span>Esta é uma simulação fiel de como os analistas do NAPIE e o Gestor Carlos Mendes lerão o parecer emitido pela Instituição Parceira. Verifique se todos os campos estão descritos corretamente antes do envio.</span>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-205 p-6 shadow-md font-sans space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <div className="h-8 w-8 bg-indigo-650 bg-indigo-100 text-indigo-850 rounded flex items-center justify-center font-bold tracking-tight text-[9px] text-center uppercase">
                          INST.
                        </div>
                        <h3 className="font-extrabold text-slate-900 mt-2 text-sm">Parecer Técnico da Instituição Parceira</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Composição Autora: {responsavelName}</p>
                      </div>
                      <span className="bg-emerald-600 text-white font-bold font-mono text-center px-4 py-1.5 text-xs rounded-full">
                        RECOMENDAÇÃO GRAU: {selectedGrade}
                      </span>
                    </div>

                    <div className="border border-slate-100 p-4 rounded text-xs bg-slate-50 font-serif whitespace-pre-line text-slate-800 leading-relaxed leading-6">
                      {draftBody || 'Editor vazio! Por favor, redija o corpo do parecer técnico na etapa anterior.'}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-450 uppercase tracking-widest font-mono block">Qualidade das Evidências científicas</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{selectedForce}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-450 uppercase tracking-widest font-mono block">Referências Acadêmicas Citadas</span>
                        <ul className="list-disc list-inside mt-1 select-all font-mono text-[10px] text-slate-500 space-y-1">
                          {references.map((ref, idx) => (
                            <li key={idx}>[{idx+1}] {ref}</li>
                          ))}
                        </ul>
                      </div>

                      {attachedReportFiles.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-450 uppercase tracking-widest font-mono block mb-1">Arquivos Complementares chancelados</span>
                          <div className="flex gap-2">
                            {attachedReportFiles.map((file, i) => (
                              <div key={i} className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-50 border border-slate-200 py-1 px-2.5 rounded text-slate-650">
                                <FileText className="h-3.5 w-3.5 text-teal-600" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setTriageSubTab('redacao')}
                      className="px-4 py-2 bg-slate-100 text-slate-750 text-xs font-bold rounded hover:bg-slate-200 cursor-pointer"
                    >
                      ← Voltar e Ajustar Parecer
                    </button>
                    <button
                      onClick={() => handlePublishResponse(selectedDemand)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all shadow-emerald-600/10"
                      id="btn-publish-demand-response"
                    >
                      Assinar e Publicar Parecer Técnico Oficial 🚀
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. SEÇÃO HOME - PAINEL UFAM */}
            {activeTab === 'home' && (
              <div className="space-y-6" id="inst-tab-home">
                <div className="flex justify-between items-end gap-4 pb-2">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Laboratório de Evidências em Saúde — Instituição Parceira</h1>
                    <p className="text-xs text-slate-500">Módulo Científico de Resposta Exclusivo da Instituição Parceira.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('recebidas')}
                    className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Ver Demandas Recebidas
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-700 rounded flex items-center justify-center font-bold">
                      {ufamDemands.filter(d => d.status === 'em_analise').length}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {ufamDemands.filter(d => d.status === 'em_analise').length}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wild mt-0.5">Aguardando Parecer Técnico</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="h-10 w-10 bg-emerald-50 text-emerald-700 rounded flex items-center justify-center font-bold">
                      {ufamDemands.filter(d => d.status === 'respondida').length}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {ufamDemands.filter(d => d.status === 'respondida').length}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wild mt-0.5">Pareceres Concluídos</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-205 flex items-center gap-4 shadow-sm">
                    <div className="h-10 w-10 bg-teal-50 text-teal-700 rounded flex items-center justify-center font-bold">
                      24d
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Alta</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wild mt-0.5">Taxa de Conformidade</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Demandas Recentes Direcionadas pelo NAPIE</h3>
                    <p className="text-[10px] text-slate-400">Clique para assumir a demanda e redigir o corpo técnico do documento cientifico.</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {ufamDemands.map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-[11px] font-mono bg-slate-100 p-1 border rounded text-slate-600 font-bold">
                            #{demand.id}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 truncate">{demand.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Urgência: {demand.urgency} · Qualificação: {demand.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(demand.status)}
                          <span className="text-xs text-teal-605 font-bold hover:underline cursor-pointer">Responder ✒️</span>
                        </div>
                      </div>
                    ))}
                    {ufamDemands.length === 0 && (
                      <div className="p-8 text-center text-slate-405 text-sm">Fila vazia! Nenhuma demanda encaminhada à UFAM no momento.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DEMANDAS RECEBIDAS */}
            {activeTab === 'recebidas' && (
              <div className="space-y-4" id="inst-tab-recebidas">
                <div>
                  <h1 className="text-base font-bold text-slate-900">Histórico de Demandas Recebidas do NAPIE</h1>
                  <p className="text-xs text-slate-500">Acompanhamento e emissão das metodologias e pareceres para subsidiar decisores.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {ufamDemands
                      .filter(demand => statusFilter === 'all' || demand.status === statusFilter)
                      .map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => setSelectedDemandId(demand.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-mono bg-slate-100 p-1 border rounded text-slate-550 font-bold">#{demand.id}</span>
                          <div>
                            <h4 className="text-xs font-semibold text-slate-900">{demand.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Área: {demand.area} · Complexidade NAPIE: {demand.complexity || 'Não definida'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {getStatusBadge(demand.status)}
                        </div>
                      </div>
                    ))}
                    {ufamDemands.filter(demand => statusFilter === 'all' || demand.status === statusFilter).length === 0 && (
                      <div className="p-8 text-center text-xs text-slate-400">Nenhuma demanda nesta categoria no momento.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. PESQUISADORES CIENTÍFICOS */}
            {activeTab === 'pesquisadores' && (
              <div className="space-y-4 animate-fadeIn" id="inst-tab-pesquisadores">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h1 className="text-base font-bold text-slate-900">Quadro de Pesquisadores Cadastrados — Instituição Parceira</h1>
                    <p className="text-xs text-slate-500">Membros da equipe habilitados para assinar os pareceres de políticas baseadas em evidências (SABER).</p>
                  </div>
                  <button
                    onClick={() => setShowCadastroForm(!showCadastroForm)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Cadastrar Pesquisador</span>
                  </button>
                </div>

                {showCadastroForm && (
                  <form onSubmit={handleCadastrarPesquisador} className="bg-white p-5 rounded-xl border border-teal-150 shadow-sm space-y-4 mb-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Formulário de Cadastro de Pesquisador</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={novoPesqNome}
                          onChange={(e) => setNovoPesqNome(e.target.value)}
                          placeholder="Ex: Dr. Edson Neves"
                          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Cargo</label>
                        <input
                          type="text"
                          value={novoPesqCargo}
                          onChange={(e) => setNovoPesqCargo(e.target.value)}
                          placeholder="Ex: Infectologista Sênior"
                          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Especialidade</label>
                        <input
                          type="text"
                          value={novoPesqEspecialidade}
                          onChange={(e) => setNovoPesqEspecialidade(e.target.value)}
                          placeholder="Ex: Vigilância Epidemiológica"
                          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCadastroForm(false)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Salvar Cadastro
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pesquisadores.map((pesq, idx) => {
                    const initials = pesq.nome.replace(/^(Dr\.|Dra\.|Prof\.|Professor)\s+/i, '').substring(0, 2).toUpperCase();
                    return (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 text-teal-400 font-black flex items-center justify-center text-xs tracking-wider">
                          {initials}
                        </div>
                        <div className="text-xs">
                          <h4 className="font-bold text-slate-900">{pesq.nome}</h4>
                          <p className="text-slate-400 text-[11px]">{pesq.role}</p>
                          <span className="text-[10px] text-teal-600 font-mono mt-0.5 block">{pesq.resp} pareceres técnicos emitidos</span>
                        </div>
                      </div>
                    );
                  })}
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
