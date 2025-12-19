// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  VERIFY: '/auth/verify',

  // Users
  GET_USER: (username) => `/users/${username}`,
  UPDATE_PROFILE: '/users/profile',
  GET_FOLLOWERS: (userId) => `/users/${userId}/followers`,
  GET_FOLLOWING: (userId) => `/users/${userId}/following`,
  FOLLOW_USER: (userId) => `/users/${userId}/follow`,
  UNFOLLOW_USER: (userId) => `/users/${userId}/follow`,
  SEARCH_USERS: '/users/search',

  // Posts
  GET_FEED: '/posts/feed',
  GET_POST: (postId) => `/posts/${postId}`,
  CREATE_POST: '/posts',
  DELETE_POST: (postId) => `/posts/${postId}`,
  GET_USER_POSTS: (userId) => `/posts/user/${userId}`,
  LIKE_POST: (postId) => `/posts/${postId}/like`,
  UNLIKE_POST: (postId) => `/posts/${postId}/like`,

  // Comments
  GET_COMMENTS: (postId) => `/posts/${postId}/comments`,
  CREATE_COMMENT: (postId) => `/posts/${postId}/comments`,
  DELETE_COMMENT: (commentId) => `/comments/${commentId}`,
  LIKE_COMMENT: (commentId) => `/comments/${commentId}/like`,
  UNLIKE_COMMENT: (commentId) => `/comments/${commentId}/like`
};

module.exports = { API_BASE_URL, API_ENDPOINTS };
