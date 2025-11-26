import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Switch,
} from '@mui/material';
// import { type ChangeEvent } from 'react';
import { useState } from 'react';
import { UseTheme } from '../theme/ThemeContext';

interface SettingModalProps {
	open: boolean;
	close: () => void;
}

export const SettingsModal = ({ open, close }: SettingModalProps) => {
	const { isDarkMode, toggleTheme } = UseTheme();

	const [darkModeLocal, setDarkModeLocal] = useState<boolean>(isDarkMode);

	return (
		<Dialog open={open} onClose={close} fullWidth maxWidth="sm" className="rounded-2xl p-2">
			<DialogTitle className="text-xl font-semibold">Page Settings</DialogTitle>

			<DialogContent className="space-y-6">
				{/* Website Settings */}
				<div>
					<h3 className="text-lg font-medium mb-2">Website Settings</h3>
					<div className="flex flex-col gap-2">
						<FormControlLabel
							control={
								<Switch
									checked={darkModeLocal}
									onChange={() => {
										setDarkModeLocal((prev) => !prev);
										toggleTheme();
									}}
								/>
							}
							label="Dark Mode"
						/>
					</div>
				</div>

				<Divider />

				{/* Map Settings */}
				<div>
					<h3 className="text-lg font-medium mb-2">Map Settings</h3>
					<div className="flex flex-col gap-2">
						<FormControlLabel control={<Switch />} label="Leaflet Map Backdrop" />
					</div>
				</div>
			</DialogContent>

			<DialogActions className="px-6 pb-4">
				<Button onClick={close} variant="contained" className="rounded-xl">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
