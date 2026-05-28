/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Institution, Demand } from '../types';
import { RoleSelector } from './RoleSelector';
import { 
  Building, Plus, Search, Check, Power, Trash, LayoutDashboard, 
  BarChart, Users, Settings, Activity, HelpCircle, ArrowLeft, Mail, Map, BookmarkCheck, Clock
} from 'lucide-react';

interface AdminProfileProps {
  institutions: Institution[];
  demands: Demand[];
  onAddInstitution: (inst: Institution) => void;
  onUpdateInstitution: (inst: Institution) => void;
  showToast: (msg: string) => void;
  activeRole: 'gestor' | 'napie' | 'instituicao' | 'admin';
  onChangeRole: (role: 'gestor' | 'napie' | 'instituicao' | 'admin') => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({
  institutions,
  demands,
  onAddInstitution,
  onUpdateInstitution,
  showToast,
  activeRole,
  onChangeRole
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'instituicoes' | 'config' | 'activities'>('kpis');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Seletor filtro tipo
  const [filterTipo, setFilterTipo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Formulário nova instituição
  const [formNome, setFormNome] = useState('');
  const [formSigla, setFormSigla] = useState('');
  const [formTipo, setFormTipo] = useState<'federal' | 'estadual' | 'municipal' | 'privada'>('federal');
  const [formArea, setFormArea] = useState('');
  const [formUf, setFormUf] = useState('RO');
  const [formEmail, setFormEmail] = useState('');

  const handleCreateInstitution = () => {
    if (!formNome || !formSigla || !formArea || !formEmail) {
      showToast('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    const newInst: Institution = {
      id: String(institutions.length + 1),
      nome: formNome,
      sigla: formSigla.toUpperCase(),
      tipo: formTipo,
      area: formArea,
      uf: formUf,
      demandas: 0,
      status: 'ativo',
      email: formEmail
    };

    onAddInstitution(newInst);
    showToast(`Instituição "${newInst.sigla}" cadastrada com sucesso!`);
    
    // Reseta form
    setFormNome('');
    setFormSigla('');
    setFormTipo('federal');
    setFormArea('');
    setFormUf('RO');
    setFormEmail('');
    setShowAddModal(false);
  };

  const handleToggleStatus = (inst: Institution) => {
    const updated: Institution = {
      ...inst,
      status: inst.status === 'ativo' ? 'inativo' : 'ativo'
    };
    onUpdateInstitution(updated);
    showToast(`Instituição ${inst.sigla} marcada como ${updated.status === 'ativo' ? 'ATIVA' : 'INATIVA'}!`);
  };

  const filteredInsts = institutions.filter(inst => {
    const matchQ = !searchQuery || inst.nome.toLowerCase().includes(searchQuery.toLowerCase()) || inst.sigla.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTipo = !filterTipo || inst.tipo === filterTipo;
    const matchStatus = !filterStatus || inst.status === filterStatus;
    return matchQ && matchTipo && matchStatus;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full overflow-y-auto md:overflow-hidden bg-slate-50" id="admin-profile-root">
      {/* Sidebar Admin - Image 3 Style */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-850 h-auto md:h-full" id="admin-sidebar">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-teal-400 font-sans tracking-wide">SABER</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">Sistema de Apoio Baseado em Evidências e Respostas</p>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          {/* VISÃO GERAL */}
          <div className="px-6 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Visão Geral</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => setActiveTab('kpis')}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'kpis' 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
            >
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center justify-between w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'activities' 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
            >
              <span>Atividades</span>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                3
              </span>
            </button>
          </nav>

          {/* GESTÃO */}
          <div className="px-6 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Gestão</div>
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => setActiveTab('instituicoes')}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'instituicoes' 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
            >
              <span>Instituições</span>
            </button>
            <button
              onClick={() => setActiveTab('instituicoes')}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 border-l-transparent text-slate-400 hover:text-white hover:bg-slate-850`}
            >
              <span>Usuários</span>
            </button>
          </nav>

          {/* SISTEMA */}
          <div className="px-6 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Sistema</div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-l-4 ${
                activeTab === 'config' 
                  ? 'bg-slate-850 text-white border-teal-500 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850 border-l-transparent'
              }`}
            >
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white truncate block">Admin SABER</span>
              <span className="text-[10px] text-cyan-400 bg-[#083344] px-2 py-0.5 mt-0.5 rounded font-bold uppercase tracking-wider block font-mono text-center w-max">Administrador</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Admin */}
      <main className="flex-grow flex flex-col h-auto md:h-full overflow-visible md:overflow-hidden" id="admin-main-content">
        {/* Header bar designed after High Density style */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-800 font-sans tracking-tight">Módulo Administrativo e Mapeamento</h1>
            <p className="text-[11px] text-gray-500 font-medium">Controle de Unidades, KPIs e Configurações de Fluxo</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-500 bg-slate-100 py-1 px-2.5 rounded border border-slate-200">
              ROOT ADMIN
            </div>
            <RoleSelector activeRole={activeRole} onChangeRole={onChangeRole} />
          </div>
        </header>

        {/* Content Scroll Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* TAB 0: HISTÓRICO DE ATIVIDADES RECENTES */}
        {activeTab === 'activities' && (
          <div className="space-y-6" id="admin-tab-activities">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Registro de Atividades do Sistema</h1>
              <p className="text-xs text-slate-500">Log detalhado de transações, encaminhamentos e alterações de status em tempo real.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 font-mono">Últimas 5 ações registradas</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">Online</span>
              </div>
              <div className="divide-y divide-slate-150">
                <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Nova demanda registrada no sistema</p>
                    <p className="text-xs text-slate-500 mt-0.5">O gestor <strong>Dr. Lucas Alencar</strong> registrou a demanda #401 "Estudo de efetividade de coletores pluviais no controle do Aedes aegypti".</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Hoje às 14:32 · Perfil Gestor</p>
                  </div>
                </div>

                <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Demanda enviada para a Instituição Parceira</p>
                    <p className="text-xs text-slate-500 mt-0.5">A analista <strong>Ana Lima (NAPIE)</strong> qualificou e encaminhou a demanda #301 para a Instituição Parceira.</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Hoje às 11:15 · Perfil NAPIE</p>
                  </div>
                </div>

                <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Nota técnica elaborada e publicada</p>
                    <p className="text-xs text-slate-500 mt-0.5">O <strong>Dr. Adriano Costa (Instituição Parceira)</strong> publicou a resposta científica e anexou parecer final para a demanda #101.</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Ontem às 17:40 · Perfil Instituição Parceira</p>
                  </div>
                </div>

                <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Unidade UFMA ativada com sucesso</p>
                    <p className="text-xs text-slate-500 mt-0.5">O administrador do sistema ativou as credenciais da <strong>Universidade Federal do Maranhão (UFMA)</strong> no módulo de mapeamento.</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Ontem às 15:10 · Perfil Administrador</p>
                  </div>
                </div>

                <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50">
                  <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Parâmetro de prazo customizado</p>
                    <p className="text-xs text-slate-505 text-slate-500 mt-0.5">Variável regulatória de prazo de triagem foi alterada para 48h nas configurações gerais de fluxo.</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">26 Mai 2026, 10:22 · Perfil Administrador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: KPIS DA PLATAFORMA */}
        {activeTab === 'kpis' && (
          <div className="space-y-6" id="admin-tab-kpis">
            <div>
              <h1 className="text-xl font-black text-slate-905 text-slate-900 tracking-tight">Estatísticas Gerais do Sistema</h1>
              <p className="text-xs text-slate-500">Métricas operacionais agregadas desde Janeiro de 2025.</p>
            </div>

            {/* Grid Admin de Resumos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-55 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded text-indigo-700">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-mono">{demands.length}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wild">Demandas Totais</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 bg-amber-50 border border-amber-100 flex items-center justify-center rounded text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-mono">
                    {demands.filter(d => d.status === 'triagem_pendente' || d.status === 'em_analise').length}
                  </h4>
                  <p className="text-[10px] text-slate-404 uppercase tracking-wild">Em andamento</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-mono">
                    {demands.filter(d => d.status === 'respondida').length}
                  </h4>
                  <p className="text-[10px] text-slate-404 uppercase tracking-wild font-medium">Respondidas</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-sky-50 border border-sky-100 flex items-center justify-center rounded text-sky-600">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-mono">
                    {institutions.filter(i => i.status === 'ativo').length}
                  </h4>
                  <p className="text-[10px] text-slate-404 uppercase tracking-wild font-medium">Parceiros ativos</p>
                </div>
              </div>
            </div>

            {/* Gráficos e Distribuição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Demanda Acumulada por Parceiro Técnico</h3>
                <div className="space-y-3.5 pt-2 text-xs">
                  {institutions.map(inst => {
                    const count = demands.filter(d => d.assignedInstitution === inst.sigla).length;
                    const percent = count > 0 ? (count / demands.length) * 100 : 0;
                    return (
                      <div key={inst.sigla} className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-750 font-bold">{inst.sigla} — {inst.nome}</span>
                          <span className="font-mono">{count} propostas ({percent.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-teal-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Registro Operacional do Sistema */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Histórico Recente e Rastreamento Geral</h3>
                <div className="relative border-l-2 border-slate-200 ml-2 pl-4 space-y-4 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[23px] top-0 bg-emerald-500 p-0.5 rounded-full border border-white text-white block">✓</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">Hoje às 11:34</span>
                      <h4 className="font-bold text-slate-900 leading-tight">FIOCRUZ adicionada aos parceiros</h4>
                      <p className="text-slate-500 mt-0.5">Fundação homologada para emitir e responder citopatológicos.</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute -left-[23px] top-0 bg-sky-500 p-0.5 rounded-full border border-white text-white block">✓</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">Hoje às 09:12</span>
                      <h4 className="font-bold text-slate-900 leading-tight">Demanda #138 direcionada Instituição Parceira</h4>
                      <p className="text-slate-500 mt-0.5">Analista Edson Cruz completou qualificação rápida.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[23px] top-0 bg-slate-400 p-0.5 rounded-full border border-white text-white block">•</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">Ontem às 16:20</span>
                      <h4 className="font-bold text-slate-900 leading-tight">Adequações efetuadas</h4>
                      <p className="text-slate-500 mt-0.5">Gestão de Porto Velho corrigiu anexos de saúde indígena.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GESTÃO DE INSTITUIÇÕES */}
        {activeTab === 'instituicoes' && (
          <div className="space-y-6" id="admin-tab-instituicoes">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Instituições Científicas Parceiras</h1>
                <p className="text-xs text-slate-500">Cadastre e configure o perfil de acesso dos laboratórios parceiros emissores de parecer.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
                id="btn-trigger-add-inst"
              >
                <Plus className="h-4.5 w-4.5" /> Nova Instituição
              </button>
            </div>

            {/* Listagem de Filtros */}
            <div className="flex flex-wrap gap-4 bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex-1 min-w-44">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Pesquisar</label>
                <input
                  type="text"
                  placeholder="Sigla ou nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-250 bg-white rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Esfera Tipo</label>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="text-xs p-2.5 border border-slate-250 bg-white rounded focus:outline-none"
                >
                  <option value="">Todas</option>
                  <option value="federal">Federal</option>
                  <option value="estadual">Estadual</option>
                  <option value="municipal">Municipal</option>
                  <option value="privada">Privada</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Status Ativo</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs p-2.5 border border-slate-250 bg-white rounded focus:outline-none"
                >
                  <option value="">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Tabela de Instituições */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-bold text-[10px] tracking-wide">
                    <tr>
                      <th className="p-4">Sigla / Nome Completo</th>
                      <th className="p-4">Esfera administrativa</th>
                      <th className="p-4">Foco / Sub-especialidade</th>
                      <th className="p-4">UF Origem</th>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredInsts.map(inst => (
                      <tr key={inst.sigla} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-900 rounded font-bold text-white flex items-center justify-center font-mono">
                              {inst.sigla.substring(0,2)}
                            </div>
                            <div>
                              <span className="font-extrabold block text-slate-900">{inst.sigla}</span>
                              <span className="text-[11px] text-slate-400 leading-tight block">{inst.nome}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 uppercase">{inst.tipo}</td>
                        <td className="p-4 truncate max-w-44 text-slate-500">{inst.area}</td>
                        <td className="p-4 font-mono font-bold text-slate-500">{inst.uf}</td>
                        <td className="p-4 font-mono">{inst.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inst.status === 'ativo' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-150 text-slate-650 bg-slate-100'
                          }`}>
                            {inst.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(inst)}
                            className={`p-1.5 rounded border text-[11px] h-8 w-18 cursor-pointer ${
                              inst.status === 'ativo'
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-105'
                            }`}
                          >
                            {inst.status === 'ativo' ? 'Inativar' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredInsts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-404">Nenhuma instituição cadastrada para as condições de busca selecionadas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONFIGURAÇÕES */}
        {activeTab === 'config' && (
          <div className="max-w-md bg-white p-6 rounded-xl border border-slate-200 space-y-4" id="admin-tab-config">
            <h3 className="text-sm font-bold text-slate-900">Variáveis Operacionais de Parâmetros</h3>
            
            <div className="space-y-3.5 text-xs text-slate-750">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">E-mail Operações Geral NAPIE</label>
                <input type="text" className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none" defaultValue="operacoes@napie.ro.gov.br" />
              </div>
              
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Prazo Padrão de Triagem Interna (Dias)</label>
                <input type="number" className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none" defaultValue={3} />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1 font-sans">Responsável Primário pelo NAPIE neste Protótipo</label>
                <input type="text" className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none font-bold text-slate-900" defaultValue="Edson Neves Da Cruz" disabled />
                <span className="text-[10px] text-amber-600 block mt-0.5">✓ Alinhado com a requisitação do formulário do Usuário.</span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ADICIONAR INSTITUIÇÃO */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-20" id="add-inst-modal">
            <div className="bg-white rounded-xl border border-slate-300 w-full max-w-md p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-950 text-sm">Habilitar Nova Instituição Científica</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 text-lg font-mono">×</button>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Inst. Leônidas e Maria Deane"
                      value={formNome}
                      onChange={(e) => setFormNome(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Sigla *</label>
                    <input
                      type="text"
                      required
                      placeholder="Sigla"
                      value={formSigla}
                      onChange={(e) => setFormSigla(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Esfera Tipo</label>
                    <select
                      value={formTipo}
                      onChange={(e) => setFormTipo(e.target.value as any)}
                      className="w-full text-xs p-2 border border-slate-250 rounded bg-white focus:outline-none"
                    >
                      <option value="federal">Federal</option>
                      <option value="estadual">Estadual</option>
                      <option value="municipal">Municipal</option>
                      <option value="privada">Privada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">UF Origem</label>
                    <select
                      value={formUf}
                      onChange={(e) => setFormUf(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-250 rounded bg-white focus:outline-none"
                    >
                      {['RO', 'AC', 'AM', 'PA', 'DF', 'SP', 'RJ', 'MG', 'BA', 'PE'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">E-mail Institucional *</label>
                  <input
                    type="email"
                    required
                    placeholder="contato@instituto.br"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Especialidade / Foco Técnico *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Medicina Tropical, Arboviroses, Saúde Coletiva"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-250 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                <button onClick={() => setShowAddModal(false)} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">Cancelar</button>
                <button onClick={handleCreateInstitution} className="px-3.5 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 rounded-lg" id="btn-submit-new-inst">Habilitar e Salvar</button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};
