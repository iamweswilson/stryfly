const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/colors/themes")["[data-theme=light]"],
          primary: "blue",
          "primary-focus": "mediumblue",
        },
        dark: {
          ...require("daisyui/colors/themes")["[data-theme=dark]"],
          primary: "blue",
          "primary-focus": "mediumblue",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
