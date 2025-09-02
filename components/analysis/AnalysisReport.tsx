
import React from 'react';
import { FullAnalysis } from '../../types';

interface AnalysisReportProps {
    analysis: FullAnalysis;
}

const KeywordPill: React.FC<{ children: React.ReactNode; color: 'green' | 'red' }> = ({ children, color }) => {
    const colors = {
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return <span className={`text-sm font-medium px-3 py-1 rounded-full ${colors[color]}`}>{children}</span>;
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis }) => {
    const scoreColor = analysis.matchScore >= 75 ? 'text-green-500' : analysis.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500';
    const scoreBgColor = analysis.matchScore >= 75 ? 'bg-green-500' : analysis.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Resume-Job Match Score</p>
                <p className={`text-7xl font-bold ${scoreColor}`}>{analysis.matchScore}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
                    <div className={`${scoreBgColor} h-4 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${analysis.matchScore}%` }}></div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Keyword Analysis</h3>
                <div className="space-y-4">
                    <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Matched Keywords:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {analysis.matchedKeywords.length > 0 ? (
                                analysis.matchedKeywords.map(k => <KeywordPill key={k} color="green">{k}</KeywordPill>)
                            ) : (
                                <p className="text-sm text-gray-500">No matched keywords identified.</p>
                            )}
                        </div>
                    </div>
                     <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Missing Keywords:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                             {analysis.missingKeywords.length > 0 ? (
                                analysis.missingKeywords.map(k => <KeywordPill key={k} color="red">{k}</KeywordPill>)
                             ) : (
                                <p className="text-sm text-gray-500">No missing keywords to add!</p>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisReport;
