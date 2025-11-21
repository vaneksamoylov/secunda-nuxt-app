const STORAGE_KEY = "settings";

export const settingsStore = defineStore(STORAGE_KEY, () => {
  const appTheme = ref<AppTheme>("light");

  // загружает заметки из localStorage при инициализации
  function loadFromStorage(): void {
    // Всегда проверяем client-side
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          appTheme.value = parsed.appTheme || "light";
        }
      } catch (e) {
        console.error("Failed to load settings from storage:", e);
      }
    }
  }

  function saveToStorage(): void {
    if (import.meta.client) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          appTheme: appTheme.value,
        })
      );
    }
  }

  function changeTheme(theme: AppTheme): void {
    if (appTheme.value === theme) return;
    appTheme.value = theme;
    saveToStorage();
  }

  return {
    appTheme,
    loadFromStorage,
    changeTheme,
  };
});
