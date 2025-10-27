import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(30px)', opacity: '0.1' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
};

export default config;
