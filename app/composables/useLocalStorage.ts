/**
 * Composable для работы с localStorage
 * @param key - ключ в localStorage
 * @param defaultValue - значение по умолчанию
 */
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const storedValue = ref<T>(defaultValue);

  const load = (): void => {
    if (import.meta.client) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          storedValue.value = JSON.parse(item);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
          console.error(`LocalStorage quota exceeded for key: ${key}`);
        } else {
          console.error(`Failed to load ${key} from storage:`, e);
        }
      }
    }
  };

  const save = (): void => {
    if (import.meta.client) {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue.value));
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
          console.error(`LocalStorage quota exceeded for key: ${key}`);
          // Можно показать уведомление пользователю
        } else {
          console.error(`Failed to save ${key} to storage:`, e);
        }
      }
    }
  };

  return {
    storedValue,
    load,
    save,
  };
};
