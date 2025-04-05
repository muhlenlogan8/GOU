import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: "0.0.0.0", // Allow access from other devices on the same network
		port: 5173, // Custom port
		proxy: {
			"/api": "http://127.0.0.1:5000", // Flask default port
		},
	},
});
