module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      content: ['./src/**/*.{html,ts}'],
    }),
  ],
};