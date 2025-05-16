module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
       colors: {
            'primary': '#19153c',
            'secondary': 'var(--color-secondary)',
            'tertiary': 'var(--color-tertiary)',
          },
    },
  },
  plugins: [],
}
