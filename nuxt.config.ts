import { provide } from "vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/fonts'],
  typescript: {
    strict: true,        // Включить строгую типизацию
    typeCheck: true      // Проверка типов при разработке
  },
  imports: {
    dirs: ['types/**']   // Авто-импорт типов
  },
  css: ['./app/styles/main.scss'],
})