// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  typescript: {
    strict: true,        // Включить строгую типизацию
    typeCheck: true      // Проверка типов при разработке
  },
  imports: {
    dirs: ['types/**']   // Авто-импорт типов
  }
})