import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface LoginModalProps {
	open: boolean;
	close: () => void;
}

export const LoginModal = ({ open, close }: LoginModalProps) => {
	return (
		<Dialog open={open} onClose={close} fullWidth maxWidth="sm" className="rounded-2xl p-2">
			<DialogTitle className="text-xl font-semibold">Login</DialogTitle>

			<DialogContent className="space-y-6">{/* Login / Signup */}</DialogContent>

			<DialogActions className="px-6 pb-4">
				<Button onClick={close} variant="contained" className="rounded-xl">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
