
import React, { useState, useCallback, useEffect } from 'react';
import { UserInput, ReportSectionData, AppStep } from './types';
import { generateReportSection } from './services/geminiService';
import { CONCERNS } from './constants';
import UserInputForm from './components/UserInputForm';
import ConcernSelector from './components/ConcernSelector';
import ReportGenerator from './components/ReportGenerator';
import ReportPreview from './components/ReportPreview';
import Payment from './components/Payment';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.USER_INPUT);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [reportData, setReportData] = useState<ReportSectionData[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startReportGeneration = async (input: UserInput, concerns: string[]) => {
    setStep(AppStep.GENERATING);
    setError(null);
    setReportData([]);

    const selectedConcernDetails = CONCERNS.filter(c => concerns.includes(c.id));

    try {
        const generatedData: ReportSectionData[] = [];
        for (let i = 0; i < selectedConcernDetails.length; i++) {
            const concern = selectedConcernDetails[i];
            setLoadingMessage(`Researching: ${concern.title}... (${i + 1}/${selectedConcernDetails.length})`);
            const content = await generateReportSection(input, concern);
            const newSection = {
                id: concern.id,
                title: concern.title,
                ...content
            };
            generatedData.push(newSection);
            setReportData([...generatedData]);
        }
        setStep(AppStep.PREVIEW);
    } catch (err) {
        console.error(err);
        setError('An error occurred while generating the report. Please check your API key and try again.');
        setStep(AppStep.CONCERN_SELECTION);
    } finally {
        setLoadingMessage('');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success')) {
        const storedData = localStorage.getItem('emigrationReportData');
        if (storedData) {
            try {
                const { userInput: storedUserInput, concerns: storedConcerns } = JSON.parse(storedData);
                localStorage.removeItem('emigrationReportData');
                
                setUserInput(storedUserInput);
                setSelectedConcerns(storedConcerns);
                startReportGeneration(storedUserInput, storedConcerns);
            } catch (e) {
                console.error("Failed to parse stored data:", e);
                setError("There was an issue retrieving your session after payment. Please start over.");
                setStep(AppStep.USER_INPUT);
            }
        }
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleUserInputSubmit = (data: UserInput) => {
    setUserInput(data);
    setStep(AppStep.CONCERN_SELECTION);
  };

  const handleConcernsSubmit = (concerns: string[]) => {
    if (!userInput || concerns.length === 0) return;
    
    try {
        localStorage.setItem('emigrationReportData', JSON.stringify({ userInput, concerns }));
        setSelectedConcerns(concerns);
        setStep(AppStep.PAYMENT);
    } catch (e) {
        console.error("Failed to save data to localStorage:", e);
        setError("Could not save your session. Please ensure your browser allows site data storage.");
    }
  };
  
  const restart = () => {
    setStep(AppStep.USER_INPUT);
    setUserInput(null);
    setSelectedConcerns([]);
    setReportData([]);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.USER_INPUT:
        return <UserInputForm onSubmit={handleUserInputSubmit} />;
      case AppStep.CONCERN_SELECTION:
        return <ConcernSelector onSubmit={handleConcernsSubmit} onBack={restart} error={error}/>;
      case AppStep.PAYMENT:
        return <Payment onBack={() => setStep(AppStep.CONCERN_SELECTION)} />;
      case AppStep.GENERATING:
        return <ReportGenerator loadingMessage={loadingMessage} completedSections={reportData.length} totalSections={selectedConcerns.length} />;
      case AppStep.PREVIEW:
        return <ReportPreview reportData={reportData} userInput={userInput!} onRestart={restart} />;
      default:
        return <UserInputForm onSubmit={handleUserInputSubmit} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Emigration Pro Report Generator</h1>
        <p className="text-slate-600 mt-2 text-lg">Your Guide To Moving Abroad</p>
      </header>
      <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {renderStep()}
      </main>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;