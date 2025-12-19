/**
 * Save data to localStorage
 */
const setItem = (key, value) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

/**
 * Get data from localStorage
 */
const getItem = (key) => {
  const value = localStorage.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

/**
 * Remove data from localStorage
 */
const removeItem = (key) => {
  localStorage.removeItem(key);
};

/**
 * Clear all localStorage
 */
const clear = () => {
  localStorage.clear();
};

/**
 * Check if key exists
 */
const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

module.exports = {
  setItem,
  getItem,
  removeItem,
  clear,
  hasItem
};
