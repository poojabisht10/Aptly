
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface MockUser {
    uid: string;
    isAnonymous: boolean;
    email: string | null;
}

interface AuthContextType {
    user: MockUser | null;
    loading: boolean;
    // Mock db/auth objects for component compatibility
    db: any | null; 
    auth: { signOut: () => void } | null;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    db: null,
    auth: null,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate an anonymous sign-in process
        const timer = setTimeout(() => {
            const mockUser: MockUser = {
                uid: 'mock-user-' + new Date().getTime(),
                isAnonymous: true,
                email: null
            };
            setUser(mockUser);
            setLoading(false);
        }, 1000); // 1-second delay to simulate auth check

        return () => clearTimeout(timer);
    }, []);

    const signOut = () => {
        setLoading(true);
        setUser(null);
        // In a real app, this would also clear tokens etc.
        setTimeout(() => setLoading(false), 500);
    };

    const value = {
        user,
        loading,
        db: {}, // Mock Firestore instance
        auth: { signOut }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
