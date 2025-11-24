import { createContext, useContext, useState, ReactNode } from 'react';

interface CMSContextType {
    isSidebarHidden: boolean;
    toggleSidebar: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
    const [isSidebarHidden, setSidebarHidden] = useState(false);

    const toggleSidebar = () => setSidebarHidden((prev) => !prev);

    return (
        <CMSContext.Provider value={{ isSidebarHidden, toggleSidebar }}>
            {children}
        </CMSContext.Provider>
    );
}

export function useCMS() {
    const context = useContext(CMSContext);
    if (context === undefined) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
}
