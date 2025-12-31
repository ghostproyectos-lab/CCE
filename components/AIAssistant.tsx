
import React, { useState } from 'react';
import { generateProjectTasks } from '../services/geminiService';

interface AIAssistantProps {
  onSuggestTasks: (tasks: any[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSuggestTasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!projectName.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await generateProjectTasks(projectName);
      onSuggestTasks(response.tasks);
      setProjectName('');
      setIsOpen(false);
    } catch (err) {
      setError('Failed to generate tasks. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-bold">Gemini Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-white/80 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <p className="text-sm text-slate-600">
              Enter a project name and Gemini will generate initial tasks for your backlog.
            </p>
            <div>
              <input 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
            <button 
              disabled={isLoading || !projectName}
              onClick={handleGenerate}
              className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isLoading || !projectName 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : 'Generate Tasks'}
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold pr-2">Ask Gemini</span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
