
import React, { useMemo } from 'react';
import { FullAnalysis } from '../../types';

// Declare global variables from CDN scripts to satisfy TypeScript
declare const jspdf: any;
declare const Diff: any;

interface TailoredResumeProps {
    analysis: FullAnalysis;
    showToast: (message: string, type: 'success' | 'error') => void;
    triggerPayment: (callback: () => void) => void;
}

const TailoredResume: React.FC<TailoredResumeProps> = ({ analysis, showToast, triggerPayment }) => {
    const { originalResume, tailoredResumeText } = analysis;

    const diff = useMemo(() => {
        if (typeof Diff !== 'undefined') {
            return Diff.diffLines(originalResume, tailoredResumeText);
        }
        // Fallback if diff library isn't loaded
        return [{ value: tailoredResumeText, added: true }];
    }, [originalResume, tailoredResumeText]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(tailoredResumeText).then(
            () => showToast('Resume copied to clipboard!', 'success'),
            () => showToast('Failed to copy resume.', 'error')
        );
    };
    
    const handleDownload = () => {
        const downloadAction = () => {
            try {
                const { jsPDF } = jspdf;
                const doc = new jsPDF();
                const lines = doc.splitTextToSize(tailoredResumeText, 180);
                doc.setFont("Helvetica", "normal");
                doc.setFontSize(11);
                doc.text(lines, 10, 10);
                doc.save("Aptly_Tailored_Resume.pdf");
                showToast('PDF download started!', 'success');
            } catch (error) {
                console.error("PDF Generation Error:", error);
                showToast('Failed to generate PDF.', 'error');
            }
        };
        triggerPayment(downloadAction);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-end gap-3 mb-4">
                <button onClick={handleCopyToClipboard} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Copy Text</button>
                <button onClick={handleDownload} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Download PDF</button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Original Resume</h3>
                    <pre className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg whitespace-pre-wrap font-sans text-sm h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700">{originalResume}</pre>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Tailored Resume (Changes Highlighted)</h3>
                    <pre className="bg-white dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap font-sans text-sm h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        {diff.map((part, index) => (
                            <span key={index} className={part.added ? 'highlight-added' : ''}>{part.value}</span>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TailoredResume;
