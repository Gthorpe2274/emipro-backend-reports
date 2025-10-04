// Fix: Add React import to resolve type conflicts. Without this, TypeScript may resolve React types from different sources, causing incompatibility.
import React from 'react';

export interface UserInput {
  destinationCountry: string;
  destinationCity: string;
  profession: string;
  age: string;
  lifestyle: string;
}

export interface Concern {
  id: string;
  title: string;
  description: string;
  prompt: (input: UserInput) => string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  responseSchema?: Record<string, any>;
}

export interface ReportSectionData {
  id: string;
  title: string;
  content: string;
  sources: { title: string; uri: string }[];
}

export enum AppStep {
  USER_INPUT = 'USER_INPUT',
  CONCERN_SELECTION = 'CONCERN_SELECTION',
  PAYMENT = 'PAYMENT',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW',
}