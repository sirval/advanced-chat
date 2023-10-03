import { APIClient, setAuthorization } from "./apiClient";

// API endpoints
const REGISTER_API = '/auth/register';
const LOGIN_API = '/auth/login';

const authService = () => {
  const register = (user) => {
    return APIClient.post(REGISTER_API, user)
      .then(response => {
        // Handle successful registration
        console.log(response);
        return response;
      })
      .catch(error => {
        // Handle registration error
        throw error;
      });
  };

  const login = (credentials) => {
    return APIClient.post(LOGIN_API, credentials)
      .then(response => {
        // Get token from API upon successful login
        const token = response.token;
        setAuthorization(token);
        // Handle successful login here
        return response;
      })
      .catch(error => {
        // Handle login error
        throw error;
      });
  };

  // Add other authentication-related methods here

  return {
    register,
    login,
    // Add other methods as needed
  };
};

export default authService();
