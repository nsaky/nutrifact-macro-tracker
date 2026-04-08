export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadData(key, defaultData) {
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultData;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return defaultData;
  }
}
