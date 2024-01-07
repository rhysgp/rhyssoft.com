// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
      '@nuxtjs/tailwindcss',
      [ '@nuxtjs/google-fonts', {
        families: {
          Poppins: true
        }
      }]
  ],
  devtools: { enabled: true }
})
