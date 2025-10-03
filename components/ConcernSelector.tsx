
import React from 'react';
import { CONCERNS } from '../constants';
import { Concern } from '../types';

interface ConcernSelectorProps {
  onSubmit: (selectedConcerns: string[]) => void;
  onBack: () => void;
  error: string | null;
}

const ConcernCard: React.FC<{ concern: Concern }> = ({ concern }) => {
    const { title, description, Icon } = concern;
    return (
        <div 
            className="p-4 border border-indigo-300 rounded-lg bg-indigo-50"
        >
            <div className="flex items-center mb-2">
                <Icon className="w-6 h-6 mr-3 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            </div>
            <p className="text-sm text-slate-600 ml-9">{description}</p>
        </div>
    );
};

const ConcernSelector: React.FC<ConcernSelectorProps> = ({ onSubmit, onBack, error }) => {

  const handleSubmit = () => {
    const allConcernIds = CONCERNS.map(c => c.id);
    onSubmit(allConcernIds);
  };

  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Report Will Cover The Below Subjects</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
        </div>}

        <div className="space-y-4 mb-8">
            {CONCERNS.map(concern => (
                <ConcernCard 
                    key={concern.id} 
                    concern={concern} 
                />
            ))}
        </div>
        
        <div className="flex justify-between items-center">
            <button onClick={onBack} className="text-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition">
                Back
            </button>
            <button 
                onClick={handleSubmit} 
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
                Proceed to Payment
            </button>
        </div>
    </div>
  );
};

export default ConcernSelector;