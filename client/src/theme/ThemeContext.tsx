import { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextValue {
	isDarkMode: boolean;
	toggleTheme: () => void;
}

const themeContext = createContext<ThemeContextValue | null>(null);

export const UseTheme = () => {
	const context = useContext(themeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
};

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem('theme');
		return saved ? saved === 'dark' : false;
	});

	useEffect(() => {
		const root = document.documentElement;
		if (isDarkMode) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkMode]);

	const toggleTheme = () => setIsDarkMode((prev) => !prev);

	return (
		<themeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</themeContext.Provider>
	);
};
