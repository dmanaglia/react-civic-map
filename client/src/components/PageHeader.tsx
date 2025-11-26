import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { LoginModal } from './LoginModal';
import { SettingsModal } from './SettingsModal';

export const PageHeader = () => {
	const [settings, setSettings] = useState<boolean>(false);
	const [login, setLogin] = useState<boolean>(false);

	return (
		<>
			<AppBar position="sticky" color="default" className="shadow-md">
				<Toolbar className="flex justify-between items-center px-4">
					<Button variant="text" onClick={() => setLogin(true)}>
						Login /Sign Up
					</Button>

					<IconButton onClick={() => setSettings(true)}>
						<SettingsIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			<SettingsModal open={settings} close={() => setSettings(false)} />
			<LoginModal open={login} close={() => setLogin(false)} />
		</>
	);
};
