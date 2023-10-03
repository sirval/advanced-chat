import axios from 'axios';
import config from "./../config";


// default
axios.defaults.baseURL = config.API_URL;

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';

// intercepting to capture errors
axios.interceptors.response.use(function (response) {
    if(response.data.status === 401){
        setAuthorization(null); // Clear the token
        localStorage.removeItem('authUser');
        window.location.href = '/login'; 
    }
    if (response.response !== "Error") {
       return response.data;
    }else{
        return response.data ? response.data : response;
    }
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.log(error);
    let message;
    switch (error.status) {
        case 500:
            message = 'Internal Server Error';
            break;
        case 404:
            message = "Sorry! the data you are looking for could not be found";
            break;
        case 409:
            message = error.message;
            break;
        default:
            message = error.message || error;
    }
    return Promise.reject(message);
});

/**
 * Sets the default authorization
 * @param {*} token 
 */
const setAuthorization = (token) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}


class APIClient {
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        return axios.get(url, params);
    }

    /**
     * post given data to url
     */
    create = (url, data) => {
        return axios.post(url, data);
    }

    /**
     * Updates data
     */
    update = (url, data) => {
        return axios.patch(url, data);
    }

    /**
     * Delete 
     */
    delete = (url) => {
        return axios.put(url);
    }
}

export { APIClient, setAuthorization };