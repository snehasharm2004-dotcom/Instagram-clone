const TOKEN_KEY = 'instagram_auth_token';
const USER_KEY = 'instagram_user';

/**
 * Save authentication token to localStorage
 */
const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Save user data to localStorage
 */
const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user data from localStorage
 */
const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Logout user
 */
const logout = () => {
  removeToken();
  removeUser();
};

module.exports = {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  isAuthenticated,
  logout
};
