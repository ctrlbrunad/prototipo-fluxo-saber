/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimelineEntry {
  title: string;
  desc: string;
  date: string;
  icon: string;
  status: 'info' | 'success' | 'warning' | 'error' | 'pending';
}

export type DemandUrgency = 'alta' | 'media' | 'baixa';
export type DemandStatus = 'triagem_pendente' | 'em_analise' | 'respondida' | 'devolvida' | 'arquivada';
export type DemandComplexity = 'simples' | 'moderada' | 'complexa';
export type GradeLetter = 'A' | 'B' | 'C' | 'D' | '';

export interface Demand {
  id: string;
  title: string;
  area: string;
  urgency: DemandUrgency;
  status: DemandStatus;
  description: string;
  picoQuestion?: string;
  decisionSubsidized: string;
  gestorName: string;
  gestorEmail: string;
  municipio: string;
  createdAt: string;
  deadline?: string;
  evidenceFiles: string[];
  
  // NAPIE qualification
  complexity?: DemandComplexity;
  napieNotes?: string;
  assignedInstitution?: string; // Signature sigla e.g. 'UFAM', 'FIOCRUZ', 'UNIR', 'LACEN-RO'
  napieCheckedItems?: string[];
  
  // Institution response
  evidenceTypeExpected?: string;
  pesquisadorResponsavel?: string;
  prazoInterno?: string;
  observacoesInternas?: string;
  descritores?: string[];
  basesConsultadas?: string[];
  
  responseAuthor?: string;
  responseBody?: string;
  responseFiles?: string[];
  responseReferences?: string[];
  evidenceForce?: string;
  gradeRecommendation?: GradeLetter;
  responseDate?: string;
  
  timeline: TimelineEntry[];
}

export interface Institution {
  id: string;
  nome: string;
  sigla: string;
  tipo: 'federal' | 'estadual' | 'municipal' | 'privada';
  area: string;
  uf: string;
  demandas: number;
  status: 'ativo' | 'inativo';
  email: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'gestor' | 'napie' | 'instituicao' | 'admin';
  instituicao?: string;
}
