/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Demand, Institution } from './types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: '1',
    nome: 'Fundação Oswaldo Cruz',
    sigla: 'FIOCRUZ',
    tipo: 'federal',
    area: 'Epidemiologia, Saúde Pública, Imunizações',
    uf: 'RJ',
    demandas: 31,
    status: 'ativo',
    email: 'contato@fiocruz.br'
  },
  {
    id: '2',
    nome: 'Instituição Parceira',
    sigla: 'Instituição Parceira',
    tipo: 'federal',
    area: 'Medicina Tropical, Doenças Infecciosas',
    uf: 'AM',
    demandas: 22,
    status: 'ativo',
    email: 'contato@instituicaoparceira.org.br'
  },
  {
    id: '3',
    nome: 'Universidade Federal de Rondônia',
    sigla: 'UNIR',
    tipo: 'federal',
    area: 'Saúde Coletiva, Atenção Primária à Saúde',
    uf: 'RO',
    demandas: 16,
    status: 'ativo',
    email: 'saudecoletiva@unir.br'
  },
  {
    id: '4',
    nome: 'Laboratório Central de Saúde Pública',
    sigla: 'LACEN-RO',
    tipo: 'estadual',
    area: 'Vigilância Laboratorial, Microbiologia',
    uf: 'RO',
    demandas: 11,
    status: 'ativo',
    email: 'direcao@lacen.ro.gov.br'
  },
  {
    id: '5',
    nome: 'Instituto de Saúde Coletiva UFBA',
    sigla: 'ISC/UFBA',
    tipo: 'federal',
    area: 'Análise de Políticas de Saúde',
    uf: 'BA',
    demandas: 7,
    status: 'ativo',
    email: 'isc@ufba.br'
  }
];

export const INITIAL_DEMANDS: Demand[] = [
  {
    id: '138',
    title: 'Efetividade da vacina bivalente em maiores de 60 anos',
    area: 'Imunização e Vacinas',
    urgency: 'media',
    status: 'triagem_pendente',
    description: 'Solicito revisão de evidências científicas acerca da efetividade real da vacina bivalente contra COVID-19 em idosos de 60 anos ou mais, especialmente no contexto epidemiológico da Região Norte, para subsidiar planejamento do calendário vacinal municipal de 2026/2027.',
    picoQuestion: 'População: Idosos residindo em ambiente urbano da Amazônia.\nIntervenção: Vacina bivalente COVID-19.\nComparador: Vacina monovalente ou esquema primário original.\nDesfechos: Hospitalizações, óbitos e resposta celular imunológica.',
    decisionSubsidized: 'Definição e aquisição estratégica de doses de reforço para idosos acima de 60 anos pela Secretaria Municipal de Saúde (SEMUSA).',
    gestorName: 'Carlos Mendes',
    gestorEmail: 'c.mendes@semusa.portovelho.ro.gov.br',
    municipio: 'Porto Velho — RO',
    createdAt: '2026-05-28',
    evidenceFiles: ['boletim_vacina_pvh.pdf', 'cobertura_idosos_2025.xlsx'],
    timeline: [
      {
        title: 'Demanda Registrada',
        desc: 'Cadastrada pelo Gestor Carlos Mendes (SEMUSA Porto Velho).',
        date: '2026-05-28 11:20',
        icon: 'FilePlus',
        status: 'info'
      },
      {
        title: 'Recebida pelo NAPIE',
        desc: 'Aguardando avaliação de triagem.',
        date: '2026-05-28 12:05',
        icon: 'Inbox',
        status: 'pending'
      }
    ]
  },
  {
    id: '135',
    title: 'Protocolos para surto de dengue em áreas endêmicas',
    area: 'Doenças Infecciosas e Parasitárias',
    urgency: 'alta',
    status: 'em_analise',
    description: 'Quais são os protocolos baseados em evidências científicas de resposta e controle para surtos epidêmicos de dengue em grandes e médios municípios da Região Amazônica com incidência acumulada excedendo 500 casos por 100 mil habitantes?',
    picoQuestion: 'Protocolos de controle de vetor e barreira sanitária em comparação com práticas habituais em cidades amazônicas.',
    decisionSubsidized: 'Elaboração do Plano de Contingência para Surtos de Arboviroses de 2026.',
    gestorName: 'Carlos Mendes',
    gestorEmail: 'c.mendes@semusa.portovelho.ro.gov.br',
    municipio: 'Porto Velho — RO',
    createdAt: '2026-05-24',
    deadline: '2026-06-10',
    evidenceFiles: ['historico_casos_dengue.xlsx', 'boletim_epidemiologico_04.pdf'],
    complexity: 'moderada',
    napieNotes: 'Demanda de alta relevância pública para a saúde municipal. Recomenda-se enfocar o controle integrado de vetores e a capacidade de expansão da rede assistencial.',
    assignedInstitution: 'Instituição Parceira',
    napieCheckedItems: ['Pergunta clássica bem formulada', 'Dentro do escopo do sistema SABER', 'Relação com decisão clara'],
    timeline: [
      {
        title: 'Demanda Registrada',
        desc: 'Cadastrada pelo Gestor Carlos Mendes (SEMUSA).',
        date: '2026-05-24 09:10',
        icon: 'FilePlus',
        status: 'info'
      },
      {
        title: 'Qualificada pelo NAPIE',
        desc: 'Análise de triagem concluída por Edson Neves Da Cruz. Classificada como complexidade moderada.',
        date: '2026-05-24 14:30',
        icon: 'Check',
        status: 'success'
      },
      {
        title: 'Encaminhada para Instituição Parceira',
        desc: 'Fila de análise técnica da Instituição Parceira (membro Dr. Adriano Costa).',
        date: '2026-05-25 08:00',
        icon: 'Send',
        status: 'info'
      }
    ]
  },
  {
    id: '133',
    title: 'Evidências para cobertura de internação em saúde mental',
    area: 'Saúde Mental',
    urgency: 'media',
    status: 'em_analise',
    description: 'Quais são as evidências disponíveis que embasam os custos-benefícios e a eficácia terapêutica de internações psiquiátricas curtas em CAPS III comparadas à internação em hospitais psiquiátricos tradicionais para surtos agudos?',
    decisionSubsidized: 'Plano de adequação e expansão de leitos de saúde mental em Porto Velho.',
    gestorName: 'João Braga',
    gestorEmail: 'j.braga@semusa.portovelho.ro.gov.br',
    municipio: 'Porto Velho — RO',
    createdAt: '2026-05-22',
    deadline: '2026-06-15',
    evidenceFiles: ['leito_caps_pvh.pdf'],
    complexity: 'moderada',
    assignedInstitution: 'UNIR',
    timeline: [
      {
        title: 'Demanda Registrada',
        desc: 'Cadastrada pelo Gestor João Braga.',
        date: '2026-05-22 10:00',
        icon: 'FilePlus',
        status: 'info'
      },
      {
        title: 'Qualificada pelo NAPIE',
        desc: 'Aprovada para encaminhamento científico.',
        date: '2026-05-23 15:00',
        icon: 'Check',
        status: 'success'
      },
      {
        title: 'Encaminhada para UNIR',
        desc: 'Fila de análise na Universidade Federal de Rondônia.',
        date: '2026-05-25 11:30',
        icon: 'Send',
        status: 'info'
      }
    ]
  },
  {
    id: '141',
    title: 'Uso de terapia fotodinâmica em úlceras venosas crônicas',
    area: 'Doenças Crônicas',
    urgency: 'alta',
    status: 'triagem_pendente',
    description: 'Quais são as evidências de efetividade clínica, taxa de cicatrização e relação de custo-efetividade da Terapia Fotodinâmica (PDT) comparada ao curativo convencional para o tratamento de úlceras venosas graves de membros inferiores em âmbito ambulatorial do SUS?',
    decisionSubsidized: 'Incorporação de novos protocolos de cicatrização de feridas crônicas na rede especializada de atenção à saúde do município.',
    gestorName: 'Maria Souza',
    gestorEmail: 'm.souza@saude.gov.br',
    municipio: 'Porto Velho — RO',
    createdAt: '2026-05-28',
    evidenceFiles: ['especificacoes_teoricas_pdt.pdf', 'relatorio_feridas_especializado.pdf'],
    timeline: [
      {
        title: 'Demanda Registrada',
        desc: 'Cadastrada pela Gestora Maria Souza (Porto Velho).',
        date: '2026-05-28 07:10',
        icon: 'FilePlus',
        status: 'info'
      },
      {
        title: 'Recebida pelo NAPIE',
        desc: 'Aguardando triagem de qualificação rápida.',
        date: '2026-05-28 07:30',
        icon: 'Inbox',
        status: 'pending'
      }
    ]
  },
  {
    id: '129',
    title: 'Rastreamento precoce do câncer de colo do útero',
    area: 'Saúde Materno-Infantil',
    urgency: 'media',
    status: 'respondida',
    description: 'Quais estratégias organizacionais e de captação ativa de mulheres na faixa etária de 25 a 64 anos apresentam as melhores evidências para ampliar a cobertura de rastreamento de câncer do colo do útero (Papanicolaou) na Atenção Primária em cenários urbanos periféricos?',
    decisionSubsidized: 'Ampliação do programa de busca ativa e agendamento informatizado de citopatológicos pelas Unidades Básicas de Saúde da SEMUSA.',
    gestorName: 'Carlos Mendes',
    gestorEmail: 'c.mendes@semusa.portovelho.ro.gov.br',
    municipio: 'Porto Velho — RO',
    createdAt: '2026-05-18',
    deadline: '2026-06-05',
    evidenceFiles: ['dados_papanicolau_2025.xlsx'],
    complexity: 'simples',
    assignedInstitution: 'FIOCRUZ',
    responseAuthor: 'Dra. Luiza Valente (Pesquisadora Associada)',
    responseDate: '2026-05-26',
    evidenceForce: 'Forte — Alta qualidade de evidência',
    gradeRecommendation: 'A',
    responseReferences: [
      'Organização Mundial da Saúde. Diretriz para Rastreio e Tratamento de Lesões Precursoras de Colo do Útero. OMS, 2021.',
      'Instituto Nacional de Câncer. Diretrizes Brasileiras para o Rastreamento do Câncer do Colo do Útero. INCA, 2016.',
      'Valente, L. et al. Intervenções comunitárias e cobertura de Papanicolau em áreas periféricas brasileiras. Cadernos de Saúde Pública, 2023.'
    ],
    responseBody: '## Resumo das Evidências\n\nA revisão de literatura aponta de maneira inequívoca que o agendamento individualizado por agentes comunitários de saúde (ACS) somado à oferta de horários alternativos (terceiro turno ou finais de semana) são as intervenções organizacionais com maior impacto na ampliação da cobertura do exame preventivo de Papanicolaou em territórios vulneráveis.\n\n## Recomendações Técnicas\n\n1. Enfoque e Treinamento nos ACS: A capacitação dos agentes comunitários para que realizem convites verbais e direcionados a mulheres na faixa de 25 a 64 anos que estão há mais de 3 anos sem coletar. Isso aumenta a taxa de aceitação em até 45%.\n2. Coletas em Horários Flexíveis: Implantação de consultórios de enfermagem abertos até às 21h em dias estratégicos ou mutirões mensais organizados aos sábados.\n3. Sistemas de Lembrete por SMS/WhatsApp: Enviar mensagens curtas personalizadas de aviso na semana agendada é altamente eficaz e de baixo custo.',
    responseFiles: ['diretrizes_inca_comentado.pdf', 'modelo_agendamento_ativo.docx'],
    timeline: [
      {
        title: 'Demanda Registrada',
        desc: 'Cadastrada pelo Gestor Carlos Mendes.',
        date: '2026-05-18 09:00',
        icon: 'FilePlus',
        status: 'info'
      },
      {
        title: 'Qualificada pelo NAPIE',
        desc: 'Aprovada na triagem por Edson Neves Da Cruz.',
        date: '2026-05-19 11:00',
        icon: 'Check',
        status: 'success'
      },
      {
        title: 'Encaminhada para FIOCRUZ',
        desc: 'Direcionada para análise científica.',
        date: '2026-05-20 09:30',
        icon: 'Send',
        status: 'info'
      },
      {
        title: 'Análise Concluída',
        desc: 'Parecer emitido pela Dra. Luiza Valente e homologado com grau GRADE A.',
        date: '2026-05-26 14:30',
        icon: 'CheckSquare',
        status: 'success'
      }
    ]
  },
  {
    id: '122',
    title: 'Uso de ivermectina em gestantes — revisão de evidências',
    area: 'Medicamentos e Farmácia',
    urgency: 'alta',
    status: 'devolvida',
    description: 'Solicito a verificação urgente se existem estudos ou diretrizes robustas baseadas em segurança clínica que embasem a prescrição de ivermectina dose única para helmintíases intestinais comuns em pacientes no 2º trimestre de gestação, em regiões de transmissão contínua de estrongiloidíase.',
    decisionSubsidized: 'Adequação das cartilhas de prescrição médica pré-natal para médicos das Unidades Básicas de Saúde da Família ribeirinhas.',
    gestorName: 'Carlos Mendes',
    gestorEmail: 'c.mendes@semusa.portovelho.ro.gov.br',
    municipio: 'Porto Velho — RO',
    createdAt: '2026-05-12',
    evidenceFiles: [],
    timeline: [
      {
        title: 'Demanda Registrada',
        desc: 'Cadastrada pelo Gestor Carlos Mendes.',
        date: '2026-05-12 11:00',
        icon: 'FilePlus',
        status: 'info'
      },
      {
        title: 'Devolvida pelo NAPIE',
        desc: 'Solicitado complemento. Edson Neves Da Cruz sinalizou a necessidade de anexar relatórios de reações adversas locais ou o roteiro assistencial atual das equipes ribeirinhas para prosseguir com a qualificação.',
        date: '2026-05-14 15:40',
        icon: 'ArrowLeft',
        status: 'warning'
      }
    ]
  }
];
