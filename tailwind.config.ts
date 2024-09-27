import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    },
    fontFamily:{
      sans:['Arial', 'sans-serif']
    },
    colors:{
      background:{
        800:'#1b1e20',
        900:'#1d2123',
      },
      fontColor:{
      900:'#ED145B'
      }
    }
  },
  plugins: [],
};
export default config;
