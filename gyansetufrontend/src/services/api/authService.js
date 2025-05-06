// src/services/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Step 1: Send verification OTP to email
  preSignup: async (email, role) => {
    try {
      const response = await api.post('/pre-signup', { email, role });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Error occurred during pre-signup.' };
      }
    }
  },

  // Step 2: Verify email OTP
  verifyEmailOTP: async (email, otp) => {
    try {
      const response = await api.post('/verify-email-otp', { email, otp });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Error occurred during OTP verification.' };
      }
    }
  },

  // Step 3: Complete registration with verified token
  completeSignup: async (userData, verifiedToken) => {
    try {
      // Map frontend field names to backend field names
      const mappedData = {
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        role: userData.role,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        verified_token: verifiedToken
      };

      const response = await api.post('/complete-signup', mappedData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Error occurred during signup completion.' };
      }
    }
  },

  // Combined method for backwards compatibility
  signup: async (userData) => {
    try {
      // Map frontend field names to backend field names
      const mappedData = {
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        role: userData.role,
        first_name: userData.firstName || '',
        last_name: userData.lastName || ''
      };

      const response = await api.post('/signup', mappedData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        throw error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        throw { message: 'No response from server. Please try again.' };
      } else {
        // Something happened in setting up the request
        throw { message: 'Error occurred during signup.' };
      }
    }
  },

  login: async (credentials) => {
    try {
      // Map frontend field names to backend field names if needed
      const mappedData = {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role
      };

      // Handle Google token if present
      if (credentials.googleToken) {
        return authService.googleLogin(credentials);
      }

      // Handle Apple token if present
      if (credentials.appleToken) {
        return authService.appleLogin(credentials);
      }

      const response = await api.post('/login', mappedData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        // Check for role mismatch
        if (error.response.status === 403 && error.response.data.detail === "Role mismatch") {
          const user = await authService.getUserByEmail(credentials.email);
          if (user) {
            error.response.data = {
              actualRole: user.role
            };
          }
        }
        throw error.response;
      } else if (error.request) {
        throw { message: 'No response from server. Please try again.' };
      } else {
        throw { message: 'Error occurred during login.' };
      }
    }
  },

  // Method to get user by email (for handling role mismatch errors)
  getUserByEmail: async (email) => {
    try {
      // This endpoint would need to be implemented on the backend
      const response = await api.get(`/user-by-email?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  googleLogin: async (credentials) => {
    try {
      const response = await api.post('/google-login', {
        email: credentials.email,
        role: credentials.role,
        googleToken: credentials.googleToken,
        first_name: credentials.firstName || '',
        last_name: credentials.lastName || '',
        phone: credentials.phone || ''
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        // Handle role mismatch for Google login
        if (error.response.status === 403 && error.response.data.detail === "Role mismatch") {
          error.response.data = {
            actualRole: error.response.data.actualRole || "unknown"
          };
        }
        throw error.response;
      } else {
        throw { message: 'Error occurred during Google login.' };
      }
    }
  },

  appleLogin: async (credentials) => {
    try {
      const response = await api.post('/apple-login', {
        email: credentials.email,
        role: credentials.role,
        appleToken: credentials.appleToken,
        first_name: credentials.firstName || '',
        last_name: credentials.lastName || '',
        phone: credentials.phone || ''
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        // Handle role mismatch for Apple login
        if (error.response.status === 403 && error.response.data.detail === "Role mismatch") {
          error.response.data = {
            actualRole: error.response.data.actualRole || "unknown"
          };
        }
        throw error.response;
      } else {
        throw { message: 'Error occurred during Apple login.' };
      }
    }
  },

  // Password reset methods
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Error occurred during password reset request.' };
      }
    }
  },

  verifyResetOTP: async (email, otp) => {
    try {
      const response = await api.post('/verify-reset-otp', { email, otp });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Error occurred during OTP verification.' };
      }
    }
  },

  resetPassword: async (email, newPassword, token) => {
    try {
      const response = await api.post('/reset-password', {
        email,
        new_password: newPassword,
        token
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Error occurred during password reset.' };
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Verify if user has required role
  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user?.role === requiredRole;
  },

  // Verify if token is still valid
  verifyToken: async () => {
    try {
      const response = await api.get('/verify');
      return response.data;
    } catch (error) {
      authService.logout();
      throw error;
    }
  }
};

export default authService;