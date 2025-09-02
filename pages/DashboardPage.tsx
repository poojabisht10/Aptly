import React, { useState, useRef } from "react";
import {
  generateContent,
  generateCoverLetter,
} from "../services/geminiService";
import * as firestoreService from "../services/firestoreService";
import { useAuth } from "../hooks/useAuth";
import ResultsView from "../components/analysis/ResultsView";
import Spinner from "../components/ui/Spinner";
import { FullAnalysis } from "../types";

interface DashboardPageProps {
  showToast: (message: string, type: "success" | "error") => void;
  triggerPayment: (callback: () => void) => void;
}

// Declare pdfjsLib globally to satisfy TypeScript, as it's loaded from a CDN
declare const pdfjsLib: any;

const DashboardPage: React.FC<DashboardPageProps> = ({
  showToast,
  triggerPayment,
}) => {
  const { user } = useAuth();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetterNotes, setCoverLetterNotes] = useState("");
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      showToast("Please provide both a resume and a job description.", "error");
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    setCoverLetterNotes(""); // Reset notes on new analysis
    try {
      const result = await generateContent(resume, jobDescription);
      const fullAnalysisData = {
        ...result,
        originalResume: resume,
        timestamp: new Date().toISOString(),
      };

      if (user) {
        const savedAnalysis = await firestoreService.saveAnalysisToHistory(
          user.uid,
          fullAnalysisData
        );
        setAnalysis(savedAnalysis);
      }

      showToast("Analysis complete!", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      showToast(errorMessage, "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!analysis) {
      showToast("Please analyze your resume first.", "error");
      return;
    }
    setIsGeneratingCoverLetter(true);
    try {
      const coverLetterText = await generateCoverLetter(
        analysis.tailoredResumeText,
        jobDescription,
        coverLetterNotes
      );
      setAnalysis((prev) => (prev ? { ...prev, coverLetterText } : null));
      showToast("Cover letter generated successfully!", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      showToast(errorMessage, "error");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value so the same file can be uploaded again
    event.target.value = "";

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResume(text);
        showToast("Resume uploaded successfully!", "success");
      };
      reader.onerror = () => {
        showToast("Failed to read the .txt file.", "error");
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      showToast("Processing PDF, please wait...", "success");
      try {
        if (typeof pdfjsLib === "undefined") {
          showToast("PDF library not loaded. Please refresh.", "error");
          return;
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = async (e) => {
          try {
            const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;

            const pagePromises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
              pagePromises.push(
                pdf.getPage(i).then((page: any) => page.getTextContent())
              );
            }

            const pagesTextContent = await Promise.all(pagePromises);
            const fullText = pagesTextContent
              .map((textContent: any) =>
                textContent.items.map((item: any) => item.str).join(" ")
              )
              .join("\n\n");

            setResume(fullText);
            showToast("PDF resume parsed successfully!", "success");
          } catch (error) {
            console.error("PDF Parsing Error:", error);
            showToast("Failed to parse the PDF file.", "error");
          }
        };
        fileReader.onerror = () => {
          showToast("Failed to read the PDF file.", "error");
        };
      } catch (error) {
        console.error("PDF Handling Error:", error);
        showToast("An error occurred while handling the PDF.", "error");
      }
    } else {
      showToast(
        "Unsupported file type. Please upload a .txt or .pdf file.",
        "error"
      );
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Resume Optimizer
        </h1>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 text-center mb-8">
          Paste your details, and let Gemini tailor your resume for your dream
          job.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your full resume here, or upload a file below..."
              className="w-full h-96 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            ></textarea>
            <div className="mt-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,text/plain,.pdf,application/pdf"
              />
              <button
                onClick={triggerFileSelect}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Upload Resume (.txt, .pdf)
              </button>
            </div>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-96 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          ></textarea>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto transition-all transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-3" /> Analyzing...
              </>
            ) : (
              "✨ Generate"
            )}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Cover Letter Assistant
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Optionally, add some personal notes below and generate a cover
            letter to match your new resume.
          </p>
          <textarea
            value={coverLetterNotes}
            onChange={(e) => setCoverLetterNotes(e.target.value)}
            placeholder="e.g., Mention my enthusiasm for their AI research, or my experience leading a team of 5..."
            className="w-full h-40 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          ></textarea>
          <div className="text-center mt-6">
            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCoverLetter}
              className="bg-purple-600 text-white font-bold py-3 px-8 rounded-xl text-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto transition-all transform hover:scale-105"
            >
              {isGeneratingCoverLetter ? (
                <>
                  <Spinner className="mr-3" /> Generating...
                </>
              ) : (
                "📝 Create Cover Letter"
              )}
            </button>
          </div>
        </div>
      )}

      {analysis && (
        <ResultsView
          analysis={analysis}
          showToast={showToast}
          triggerPayment={triggerPayment}
        />
      )}
    </>
  );
};

export default DashboardPage;
