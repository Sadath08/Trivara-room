/**
 * API service for backend communication
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Get auth token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Get refresh token from localStorage
 */
const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

/**
 * Store tokens in localStorage
 */
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

/**
 * Clear tokens from localStorage
 */
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Make API request with authentication
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
      if (token) {
        // Token expired or invalid
        clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      } else {
        // No token provided
        throw new Error('Not authenticated. Please login to continue.');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));

      // Handle validation errors (422)
      if (response.status === 422 && error.detail) {
        if (Array.isArray(error.detail)) {
          // FastAPI validation errors are arrays
          const messages = error.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          throw new Error(messages);
        }
      }

      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async () => {
  // Not implemented in backend
  return false;
};

// API Methods

export const authAPI = {
  register: async (userData) => {
    try {
      return await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      // Check if it's a network error (backend not running)
      if (error instanceof TypeError || error.message === 'Failed to fetch') {
        throw new Error('Backend server is not running. Please start the backend server by running start_backend.bat in the backend folder.');
      }
      throw error;
    }
  },

  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  login: async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Invalid email or password');
      }

      const data = await response.json();
      setTokens(data.access_token, null);
      return data;
    } catch (error) {
      // Check if it's a network error (backend not running)
      if (error instanceof TypeError || error.message === 'Failed to fetch') {
        throw new Error('Backend server is not running. Please start the backend server by running start_backend.bat in the backend folder.');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  getCurrentUser: async () => {
    return apiRequest('/users/me');
  },

  refreshToken: async () => {
    return refreshAccessToken();
  },
};

export const propertiesAPI = {
  getAll: async (filters = {}) => {
    // Build query string from filters
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (Array.isArray(value) && value.length > 0) {
        // For arrays, join with commas
        params.append(key, value.join(','));
      } else if (typeof value === 'boolean') {
        params.append(key, value.toString());
      } else if (typeof value === 'number' || typeof value === 'string') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    return apiRequest(`/rooms${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/rooms/${id}`);
  },

  create: async (propertyData) => {
    // If propertyData is FormData, apiRequest handles it.
    // Frontend needs to send FormData for image upload.
    return apiRequest('/rooms/', {
      method: 'POST',
      body: propertyData,
    });
  },

  update: async (id, propertyData) => {
    // propertyData can be FormData (for image uploads) or regular object
    return apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: propertyData,  // Let apiRequest handle FormData vs JSON
    });
  },

  delete: async (id) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

export const bookingsAPI = {
  getAll: async () => {
    return apiRequest('/bookings');
  },

  getById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  create: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  cancel: async (id, cancellation_reason) => {
    return apiRequest(`/bookings/modifications/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancellation_reason }),
    });
  },
};

export const usersAPI = {
  getProfile: async () => {
    return apiRequest('/users/me');
  },

  updateProfile: async (userData) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Export utility functions
export { getToken, setTokens, clearTokens };

