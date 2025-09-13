// frontend/postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'tailwindcss': {}, // <-- This is the correct modern syntax
    'autoprefixer': {},
  },
};

export default config;