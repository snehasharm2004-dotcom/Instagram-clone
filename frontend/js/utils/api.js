const { API_BASE_URL } = require('../config');
const { getToken } = require('./auth');

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Add authorization token if available
    const token = getToken();
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      // If data is FormData, don't set Content-Type header
      if (data instanceof FormData) {
        delete options.headers['Content-Type'];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'API request failed');
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, 'GET');
  }

  async post(endpoint, data) {
    return this.request(endpoint, 'POST', data);
  }

  async put(endpoint, data) {
    return this.request(endpoint, 'PUT', data);
  }

  async delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }
}

const api = new APIClient(API_BASE_URL);
module.exports = api;
