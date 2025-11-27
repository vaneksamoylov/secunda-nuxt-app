export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/fonts"],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  imports: {
    dirs: ["types/**"],
  },
  css: ["./app/styles/main.scss"],
});
