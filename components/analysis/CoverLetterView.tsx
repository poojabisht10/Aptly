import React from 'react';

// Declare global variables from CDN scripts to satisfy TypeScript
declare const jspdf: any;

interface CoverLetterViewProps {
    coverLetterText: string;
    showToast: (message: string, type: 'success' | 'error') => void;
    triggerPayment: (callback: () => void) => void;
}

const CoverLetterView: React.FC<CoverLetterViewProps> = ({ coverLetterText, showToast, triggerPayment }) => {
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(coverLetterText).then(
            () => showToast('Cover letter copied to clipboard!', 'success'),
            () => showToast('Failed to copy text.', 'error')
        );
    };
    
    const handleDownload = () => {
        const downloadAction = () => {
            try {
                const { jsPDF } = jspdf;
                const doc = new jsPDF();
                const lines = doc.splitTextToSize(coverLetterText, 180);
                doc.setFont("Helvetica", "normal");
                doc.setFontSize(11);
                doc.text(lines, 10, 10);
                doc.save("Aptly_Cover_Letter.pdf");
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
            <div>
                <h3 className="text-lg font-semibold mb-2">Generated Cover Letter</h3>
                <pre className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg whitespace-pre-wrap font-sans text-sm h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                    {coverLetterText}
                </pre>
            </div>
        </div>
    );
};

export default CoverLetterView;