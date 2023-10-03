import jwtDecode from 'jwt-decode';
import { APIClient } from './apiClient';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
    const user = getLoggedInUser();
    if (!user) {
        window.location.href = '/login';
    }
    
}

/**
 * Sets the logged in user
 */
const setLoggedInUser = (user) => {
    localStorage.setItem('authUser', JSON.stringify(user));
}

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
    const user = localStorage.getItem('authUser');
    return user ? (typeof (user) == 'object' ? user : JSON.parse(user)) : null;
}

export { isUserAuthenticated, setLoggedInUser, getLoggedInUser };