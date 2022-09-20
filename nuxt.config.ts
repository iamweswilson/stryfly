// @ts-ignore
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },
  target: 'static',
  ssr: false,
  alias: {
    '~/*': './*',
  },
  modules: [
    [
      'unplugin-icons/nuxt',
      {
        defaultClass: 'w-7 h-7 inline-block',
      },
    ],
    './modules/alert/module',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    preference: 'system', // default theme
    fallback: 'dark', // fallback value if not system preference found
    dataValue: 'theme', // activate data-theme in <html> tag
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    public: {
        publicUrl: process.env.PUBLIC_URL,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY
    }
  },
  srcDir: './',
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
})
