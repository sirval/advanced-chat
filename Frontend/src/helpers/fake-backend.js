import { APIClient, setAuthorization } from "./apiClient";


const fakeBackend = () => {
    const register = (user) => {
        return APIClient.post('/auth/register', user)
          .then(response => {
            return response;
          })
          .catch(error => {
            // Handle registration error
            throw error;
          });
      };

      const login = (credentials) => {
        return APIClient.post('/auth/login', credentials)
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
    
      const verifyUser = (id, otp) => {
        return APIClient.post(`/auth/verify-code/${id}?otp=${otp}`)
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
        verifyUser,
        login,
        // Add other methods as needed
      };

}

export default fakeBackend;