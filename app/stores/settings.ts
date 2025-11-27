const STORAGE_KEY = "settings";

export const settingsStore = defineStore(STORAGE_KEY, () => {
  const appTheme = ref<AppTheme>("light");

  // загружает настройки из localStorage при инициализации
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
        if (e instanceof SyntaxError) {
          console.error(
            "Failed to parse settings from storage (invalid JSON):",
            e
          );
        } else if (
          e instanceof DOMException &&
          e.name === "QuotaExceededError"
        ) {
          console.error("LocalStorage quota exceeded");
        } else {
          console.error("Failed to load settings from storage:", e);
        }
      }
    }
  }

  function saveToStorage(): void {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            appTheme: appTheme.value,
          })
        );
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
          console.error("LocalStorage quota exceeded. Cannot save settings.");
        } else {
          console.error("Failed to save settings to storage:", e);
        }
      }
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
