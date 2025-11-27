/**
 * Глубокое клонирование объекта через JSON
 * @param obj - объект для клонирования
 * @returns клонированный объект
 */
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
