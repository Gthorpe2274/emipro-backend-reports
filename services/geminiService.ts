
import { GoogleGenAI } from "@google/genai";
import { UserInput, Concern } from '../types.ts';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatFinanceDataAsHtmlTable = (data: any): string => {
  const { currencyName, currencyCode, budgetItems, importDuties, taxOptimizationStrategies } = data;

  let conversionButtonHtml = '';
  if (currencyCode && currencyName) {
    const conversionUrl = `https://www.google.com/search?q=convert+${encodeURIComponent(currencyCode)}+to+usd`;
    conversionButtonHtml = `
      <div class="my-4">
        <a href="${conversionUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors" aria-label="Convert ${currencyName} to USD">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Convert ${currencyName} (${currencyCode}) to USD</span>
        </a>
      </div>
    `;
  }

  const groupedByCategory = (budgetItems || []).reduce((acc: any, item: any) => {
    const category = item.category || 'Other';
    (acc[category] = acc[category] || []).push(item);
    return acc;
  }, {});

  let tableHtml = `
  <div class="overflow-x-auto not-prose rounded-lg border border-slate-200 shadow-sm">
    <table class="min-w-full text-sm">
      <thead class="bg-slate-50">
        <tr>
          <th class="p-3 text-left font-semibold text-slate-700 w-2/6">Category / Item</th>
          <th class="p-3 text-left font-semibold text-slate-700">Initial Setup (Month 1)</th>
          <th class="p-3 text-left font-semibold text-slate-700">Monthly Ongoing (Months 1-6)</th>
          <th class="p-3 text-left font-semibold text-slate-700">6-Month Total</th>
          <th class="p-3 text-left font-semibold text-slate-700 w-2/6">Notes</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">`;

    for (const category in groupedByCategory) {
        tableHtml += `
            <tr class="bg-slate-100">
                <td class="p-3 font-bold text-slate-800" colspan="5">${category}</td>
            </tr>
        `;
        groupedByCategory[category].forEach((item: any) => {
            tableHtml += `
                <tr class="hover:bg-slate-50">
                    <td class="p-3 text-slate-700 pl-6">${item.item}</td>
                    <td class="p-3 text-slate-700">${item.initialSetupCost}</td>
                    <td class="p-3 text-slate-700">${item.monthlyOngoingCost}</td>
                    <td class="p-3 text-slate-700">${item.sixMonthTotal}</td>
                    <td class="p-3 text-slate-600">${item.notes}</td>
                </tr>
            `;
        });
    }

    tableHtml += `
        </tbody>
      </table>
    </div>`;
  
    const importDutiesHtml = importDuties ? `<h3 class="text-xl font-semibold mt-8 mb-2 text-slate-700">Import Duties</h3><p class="text-slate-700 leading-relaxed">${importDuties.replace(/\n/g, '<br/>')}</p>` : '';
    const taxHtml = taxOptimizationStrategies ? `<h3 class="text-xl font-semibold mt-8 mb-2 text-slate-700">Tax Optimization Strategies</h3><p class="text-slate-700 leading-relaxed">${taxOptimizationStrategies.replace(/\n/g, '<br/>')}</p>`: '';


  return conversionButtonHtml + tableHtml + importDutiesHtml + taxHtml;
}

export const generateReportSection = async (userInput: UserInput, concern: Concern): Promise<{ content: string; sources: {title: string; uri: string}[] }> => {
  const prompt = concern.prompt(userInput);
  
  const isJsonRequest = concern.id === 'finance' && concern.responseSchema;
  
  const genAIConfig: any = {};
  if (isJsonRequest) {
    genAIConfig.responseMimeType = "application/json";
    genAIConfig.responseSchema = concern.responseSchema;
  } else {
    genAIConfig.tools = [{googleSearch: {}}];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: genAIConfig
    });

    let content: string;
    if (isJsonRequest) {
      try {
        const jsonData = JSON.parse(response.text);
        content = formatFinanceDataAsHtmlTable(jsonData);
      } catch (e) {
        console.error("Failed to parse JSON response or format it:", e);
        content = "Error: Could not display financial data. The data received was not in the correct format. Please try generating the report again.";
      }
    } else {
      content = response.text;
    }
    
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = rawChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
      .filter((web, index, self) => index === self.findIndex(w => w.uri === web.uri)); // a little expensive but ensures unique URIs

    return { content, sources };
  } catch (error) {
    console.error(`Error generating content for ${concern.title}:`, error);
    throw new Error(`Failed to generate report section for "${concern.title}".`);
  }
};