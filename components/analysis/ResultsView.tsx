import React, { useState, useEffect } from 'react';
import { FullAnalysis } from '../../types';
import TailoredResume from './TailoredResume';
import AnalysisReport from './AnalysisReport';
import CoverLetterView from './CoverLetterView';

interface ResultsViewProps {
    analysis: FullAnalysis;
    showToast: (message: string, type: 'success' | 'error') => void;
    triggerPayment: (callback: () => void) => void;
}

type ActiveTab = 'resume' | 'report' | 'coverLetter';

const TabButton: React.FC<{
    tabName: ActiveTab,
    activeTab: ActiveTab,
    setActiveTab: (tab: ActiveTab) => void,
    children: React.ReactNode
}> = ({ tabName, activeTab, setActiveTab, children }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
        >
            {children}
        </button>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({ analysis, showToast, triggerPayment }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('resume');

    // When a new analysis comes in, reset to the resume tab.
    // If a cover letter was just generated, switch to that tab.
    useEffect(() => {
        if (analysis.coverLetterText && activeTab !== 'coverLetter') {
             // A simplistic check to see if the cover letter was just added.
             // A more robust solution might involve comparing timestamps or a dedicated flag.
            const previousAnalysisHadCoverLetter = sessionStorage.getItem('hasCoverLetter') === analysis.id;
            if (!previousAnalysisHadCoverLetter) {
                 setActiveTab('coverLetter');
                 sessionStorage.setItem('hasCoverLetter', analysis.id);
            }
        } else if (!analysis.coverLetterText && activeTab === 'coverLetter') {
            setActiveTab('resume');
        }
    }, [analysis]);


    return (
        <div className="mt-8 bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton tabName="resume" activeTab={activeTab} setActiveTab={setActiveTab}>
                        Tailored Resume
                    </TabButton>
                    <TabButton tabName="report" activeTab={activeTab} setActiveTab={setActiveTab}>
                        Analysis Report
                    </TabButton>
                    {analysis.coverLetterText && (
                         <TabButton tabName="coverLetter" activeTab={activeTab} setActiveTab={setActiveTab}>
                            Cover Letter
                        </TabButton>
                    )}
                </nav>
            </div>
            <div>
                {activeTab === 'resume' && <TailoredResume analysis={analysis} showToast={showToast} triggerPayment={triggerPayment} />}
                {activeTab === 'report' && <AnalysisReport analysis={analysis} />}
                {activeTab === 'coverLetter' && analysis.coverLetterText && (
                    <CoverLetterView 
                        coverLetterText={analysis.coverLetterText}
                        showToast={showToast}
                        triggerPayment={triggerPayment}
                    />
                )}
            </div>
        </div>
    );
};

export default ResultsView;