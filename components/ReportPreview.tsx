
import React, { useState, useEffect } from 'react';
import { ReportSectionData, UserInput } from '../types.ts';
import { generatePdf } from '../utils/pdfGenerator.ts';
import { CONCERNS } from '../constants.tsx';

// A simple markdown to HTML converter. For a real app, a library like 'marked' would be better.
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2 text-slate-700">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-2 text-slate-800">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-4 text-slate-900">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1 rounded">$1</code>')
        .replace(/^\s*[-*] (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
        .replace(/(\r\n|\n){2,}/g, '<br/><br/>') // paragraphs
        .replace(/(<li.*<\/li>)+/g, '<ul class="list-disc pl-5 mb-4">$1</ul>');

    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const ReportSection: React.FC<{ section: ReportSectionData }> = ({ section }) => (
  <div id={`section-${section.id}`} className="mb-12 break-after-page">
    <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-indigo-500 pb-2 mb-6">{section.title}</h2>
    <div className="text-slate-700 leading-relaxed">
        <SimpleMarkdown content={section.content} />
    </div>
    {section.sources && section.sources.length > 0 && (
        <div className="mt-8 pt-4 border-t border-slate-200">
            <h4 className="text-lg font-semibold text-slate-600 mb-2">Sources:</h4>
            <ul className="list-disc pl-5 text-sm">
                {section.sources.map((source, index) => (
                    <li key={index} className="mb-1">
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">{source.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    )}
  </div>
);

const ReportPreview: React.FC<{ reportData: ReportSectionData[], userInput: UserInput, onRestart: () => void }> = ({ reportData, userInput, onRestart }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) {
            alert("Your 30-minute session has expired, and the report is no longer available. Please start over to generate a new report.");
            onRestart();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime > 0 ? prevTime - 1 : 0);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onRestart]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await generatePdf('report-content', `Emigration_Pro_Report_${userInput.destinationCity}.pdf`);
        } catch(e) {
            console.error("PDF generation failed", e);
            alert("Sorry, there was an error generating the PDF.");
        } finally {
            setIsDownloading(false);
        }
    };
    
    // Sort reportData to match CONCERNS order
    const sortedReportData = reportData.sort((a, b) => {
        const indexA = CONCERNS.findIndex(c => c.id === a.id);
        const indexB = CONCERNS.findIndex(c => c.id === b.id);
        return indexA - indexB;
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Your Personalized Report</h2>
                    <p className="text-slate-600">Here is the detailed analysis based on your requirements.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onRestart} className="text-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition">
                        Start Over
                    </button>
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-wait"
                    >
                        {isDownloading ? 'Downloading...' : 'Download as PDF'}
                    </button>
                </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg mb-6" role="alert">
                <p>
                    <strong>Download your report now!</strong> It will be available for the next{' '}
                    <span className="font-semibold tabular-nums">{formatTime(timeLeft)}</span>. After this time, the session will expire.
                </p>
            </div>

            <div id="report-content" className="bg-white p-8 rounded-lg border border-slate-200 shadow-inner">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900">Emigration Pro Report</h1>
                    <p className="text-lg text-slate-600 mt-2">For: {userInput.destinationCity}, {userInput.destinationCountry}</p>
                    <p className="text-sm text-slate-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                </div>

                <div className="mb-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Table of Contents</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        {sortedReportData.map(section => (
                            <li key={`toc-${section.id}`}>
                                <a 
                                    href={`#section-${section.id}`} 
                                    className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.getElementById(`section-${section.id}`);
                                        if (element) {
                                            element.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    }}
                                >
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
                
                {sortedReportData.map(section => (
                    <ReportSection key={section.id} section={section} />
                ))}

                <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 text-justify">
                    <p>
                        This report has been generated with the assistance of artificial intelligence. While efforts are made to provide accurate and useful information, the content may contain errors, omissions, or unintended inaccuracies. It should not be relied upon as professional, legal, financial, medical, or other expert advice. We provide links to our sources in each section of our report. Users are responsible for independently verifying the information before making decisions or taking action. Neither emigrationpro.com nor its affiliates assume liability for any reliance placed on this report.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportPreview;