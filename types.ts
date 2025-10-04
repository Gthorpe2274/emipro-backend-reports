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
  // Use a simpler type for the Icon to avoid importing React in a type-only file
  Icon: (props: any) => any;
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