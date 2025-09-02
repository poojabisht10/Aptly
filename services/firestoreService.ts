
import { FullAnalysis } from '../types';

// This is a mock service to simulate Firestore interactions for development.
// In a real application, you would use the Firebase SDK here.

const MOCK_DB_KEY = 'aptly_history';

export const saveAnalysisToHistory = async (userId: string, analysisData: Omit<FullAnalysis, 'id'>): Promise<FullAnalysis> => {
    console.log("Simulating save to mock database for user:", userId);
    const newEntry: FullAnalysis = { ...analysisData, id: new Date().getTime().toString() };
    
    try {
        const history = await getHistory(userId);
        history.unshift(newEntry); // Add to the beginning
        localStorage.setItem(`${MOCK_DB_KEY}_${userId}`, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save to mock DB", error);
    }
    
    return newEntry;
};

export const getHistory = async (userId: string): Promise<FullAnalysis[]> => {
    console.log("Simulating fetch from mock database for user:", userId);
    try {
        const storedHistory = localStorage.getItem(`${MOCK_DB_KEY}_${userId}`);
        return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
        console.error("Failed to fetch from mock DB", error);
        return [];
    }
};
