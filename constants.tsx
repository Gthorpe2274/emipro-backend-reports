
import React from 'react';
import { UserInput, Concern } from './types.ts';

const HealthcareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9h18" />
    </svg>
);

const FinanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const SituationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const VisaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM9 16h6" />
    </svg>
  );

const financeSchema = {
    type: 'OBJECT',
    properties: {
        currencyName: { type: 'STRING', description: "The official name of the local currency in the destination country (e.g., 'Euro')." },
        currencyCode: { type: 'STRING', description: "The 3-letter ISO 4217 currency code for the local currency (e.g., 'EUR')." },
        budgetItems: {
            type: 'ARRAY',
            description: "A list of budget items for various expense categories.",
            items: {
                type: 'OBJECT',
                properties: {
                    category: { type: 'STRING', description: "Main category of the expense (e.g., Housing, Utilities, Living Expenses)." },
                    item: { type: 'STRING', description: "Specific item within the category (e.g., Rent (1-bedroom), Groceries)." },
                    initialSetupCost: { type: 'STRING', description: "Estimated cost for the first month. Can be a number, 'Varies', or '-'." },
                    monthlyOngoingCost: { type: 'STRING', description: "Estimated ongoing monthly cost. Can be a number, 'Varies', or '-'." },
                    sixMonthTotal: { type: 'STRING', description: "Total estimated cost for 6 months. Can be a number, 'Varies', or '-'." },
                    notes: { type: 'STRING', description: "Additional notes or details about the item." },
                },
                required: ['category', 'item', 'initialSetupCost', 'monthlyOngoingCost', 'sixMonthTotal', 'notes']
            }
        },
        importDuties: {
            type: 'STRING',
            description: "An explanation of the process and potential costs of importing personal belongings."
        },
        taxOptimizationStrategies: {
            type: 'STRING',
            description: "An overview of the personal income tax system and common legal tax optimization strategies."
        }
    },
    required: ['currencyName', 'currencyCode', 'budgetItems', 'importDuties', 'taxOptimizationStrategies']
};

export const CONCERNS: Concern[] = [
  {
    id: 'healthcare',
    title: 'Healthcare Mapping',
    description: 'Get a detailed overview of healthcare facilities, insurance providers, and emergency procedures in your chosen city.',
    Icon: HealthcareIcon,
    prompt: (input: UserInput) => `
      Generate a detailed healthcare mapping report for a ${input.age}-year-old individual moving to ${input.destinationCity}, ${input.destinationCountry}.
      The report should be professional, well-structured, and easy to read.
      Focus on the following areas:
      1.  **Quality Hospitals in the City:** Identify and describe the top 3-5 hospitals in ${input.destinationCity}. For each hospital, provide its specialty, reputation, and address.
      2.  **Insurance Providers:** List and compare at least 3 major health insurance providers that offer plans in ${input.destinationCity} and have dedicated English-speaking customer support. Detail the types of plans they offer (e.g., inpatient, outpatient, emergency).
      3.  **Emergency Procedures:** Outline the standard emergency contact procedures. Include the primary emergency phone number (like 911 or 112), and the locations of 24/7 emergency rooms in central or easily accessible areas of ${input.destinationCity}.
      Use markdown for formatting, including headers, bold text, and lists.
    `,
  },
  {
    id: 'finance',
    title: 'Precise Financial Planning',
    description: 'Receive a comprehensive financial plan including budgets, housing costs, import duties, and tax considerations.',
    Icon: FinanceIcon,
    prompt: (input: UserInput) => `
      Create a precise financial planning report for a ${input.age}-year-old individual with a profession in '${input.profession}' moving to ${input.destinationCity}, ${input.destinationCountry}, with a '${input.lifestyle}' lifestyle.
      
      Respond with a JSON object that matches the provided schema. Make sure to include the local 'currencyName' and 'currencyCode' for ${input.destinationCountry}.
      
      Your analysis should be comprehensive and cover these specific points:
      1.  **6-Month Transition Budget:** Create an itemized budget for the first six months. This should be an array of objects in the 'budgetItems' field. Include categories like Housing (rent, security deposit, agency fees), Utilities (electricity, water, internet, mobile), Initial Setup Costs (furniture, bank account setup), and Living Expenses (groceries, transport, healthcare, leisure). For each item, provide estimates for initial setup, monthly ongoing, and 6-month total costs, along with relevant notes. The costs should be in the local currency.
      2.  **Import Duties:** In the 'importDuties' field, provide a string explaining the process and potential costs of importing personal belongings into ${input.destinationCountry}.
      3.  **Tax Optimization Strategies:** In the 'taxOptimizationStrategies' field, provide a string with an overview of the personal income tax system in ${input.destinationCountry} and suggest 2-3 common legal tax optimization strategies for a foreign professional.
      
      Base your cost estimates on the provided lifestyle: '${input.lifestyle}'. Ensure all numeric fields in the JSON are represented as strings to accommodate currency symbols and variations like 'Varies'.
    `,
    responseSchema: financeSchema,
  },
  {
    id: 'situation',
    title: 'Personal Situation Analysis',
    description: 'An assessment of the job market for your profession, immigration factors, timelines, and potential risks.',
    Icon: SituationIcon,
    prompt: (input: UserInput) => `
      Conduct a professional situation analysis for a ${input.age}-year-old '${input.profession}' planning to immigrate to ${input.destinationCity}, ${input.destinationCountry}.
      The analysis should be personalized and actionable.
      Address the following sections:
      1.  **Job Market Analysis:** Analyze the current job market for a '${input.profession}' in ${input.destinationCity}. Mention key companies, expected salary ranges, and demand for this profession.
      2.  **Age-Specific Immigration Advantages:** Discuss any specific advantages, disadvantages, or considerations related to being ${input.age} years old in the context of immigrating to ${input.destinationCountry}. This could relate to visa types, social integration, or healthcare.
      3.  **Timeline Optimization:** Propose an optimized, step-by-step timeline for the move, starting from 6 months before the planned departure date. Include key milestones like visa application, job search, and securing accommodation.
      4.  **Risk Assessment and Mitigation:** Identify 3-4 potential risks for this specific move (e.g., visa rejection, difficulty finding a job, cultural adjustment). For each risk, suggest a practical mitigation strategy.
      Use markdown for formatting, including headers, bold text, and lists.
    `,
  },
  {
    id: 'visa',
    title: 'Visa & Immigration Guide',
    description: 'Understand the visa options, application process, and documentation needed for your move.',
    Icon: VisaIcon,
    prompt: (input: UserInput) => `
      Generate a comprehensive Visa and Immigration guide for a ${input.age}-year-old '${input.profession}' moving to ${input.destinationCity}, ${input.destinationCountry}.
      The guide should be clear, well-structured, and professional.
      Address the following key points:
      1.  **Primary Visa Options:** Identify and detail the most relevant visa or work permit options for a '${input.profession}'. Explain the eligibility criteria for each.
      2.  **Application Process:** Provide a step-by-step guide on how to apply for the most common visa type from their home country. Include where to apply (e.g., embassy, online portal).
      3.  **Required Documentation Checklist:** Create a clear checklist of all necessary documents. This should include items like passport validity, proof of funds, employment contract, educational certificates, and any required translations or apostilles.
      4.  **Timelines and Costs:** Provide estimated processing times for the visa application and a breakdown of associated costs (application fees, legal fees, etc.).
      5.  **Key Considerations:** Mention 2-3 important considerations or a potential hurdles in the immigration process for ${input.destinationCountry}, such as interviews, medical exams, or police clearance certificates.
      Use markdown for formatting, including headers, bold text, and lists for clarity.
    `,
  },
];