/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		colors: {
    			background: 'var(--background)',
    			foreground: 'var(--foreground)',
    			primary: '#0e69aa',
    			secondry: '#043c64'
    		},
    		backgroundImage: {
    			background1:"url('/background1.jpg')",
    		},
    		fontFamily: {
    			roboto: [
    				'Roboto',
    				'sans-serif'
    			]
    		},
    	}
    },
	plugins: [
	  require('tailwind-scrollbar'),
    ],
  };