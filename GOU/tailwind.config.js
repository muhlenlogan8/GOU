// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				n: {
					1: "#FFFFFF",
					2: "#E6E8E6",
					3: "#89AAE6",
					4: "#76ABDF",
					5: "#3E8EDE",
					6: "#353839",
				},
			},
		},
	},
	plugins: [],
};
