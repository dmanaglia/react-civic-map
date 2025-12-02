// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
	isDarkMode: boolean;
	backdropEnabled: boolean;
	toggleTheme: () => void;
	toggleBackdrop: () => void;
}

const settingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
	children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
	// Initialize from localStorage or defaults
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		const saved = localStorage.getItem('darkMode');
		return saved ? JSON.parse(saved) : false;
	});

	const [backdropEnabled, setBackdropEnabledState] = useState<boolean>(() => {
		const saved = localStorage.getItem('backdropEnabled');
		return saved ? JSON.parse(saved) : true;
	});

	// Persist dark mode to localStorage
	useEffect(() => {
		localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
		// Apply dark mode class to document if you're using that pattern
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDarkMode]);

	// Persist backdrop setting to localStorage
	useEffect(() => {
		localStorage.setItem('backdropEnabled', JSON.stringify(backdropEnabled));
	}, [backdropEnabled]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev);
	};

	const toggleBackdrop = () => {
		setBackdropEnabledState((prev) => !prev);
	};

	return (
		<settingsContext.Provider
			value={{
				isDarkMode,
				backdropEnabled,
				toggleTheme,
				toggleBackdrop,
			}}
		>
			{children}
		</settingsContext.Provider>
	);
};

// Custom hook to use the settings context
export const UseSettings = () => {
	const context = useContext(settingsContext);
	if (context === undefined) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}
	return context;
};
