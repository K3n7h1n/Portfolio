/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'primary-pink': '#D019D0',
				'primary-blue': '#1974D1',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				portfolio: {
					"primary": "#D019D0",
					"secondary": "#1974D1",
					"accent": "#D019D0",
					"neutral": "#000000",
					"base-100": "#000000",
					"base-200": "#0a0a0a",
					"base-300": "#1a1a1a",
					"info": "#1974D1",
					"success": "#36D399",
					"warning": "#FBBD23",
					"error": "#F87272",
				},
			},
		],
	},
}
