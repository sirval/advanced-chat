import { APIClient, setAuthorization } from '../../helpers/apiClient';
import { getLoggedInUser } from '../../helpers/authUtils';
import {
    CHAT_USER,ACTIVE_USER,FULL_USER, ADD_LOGGED_USER, CREATE_GROUP, FETCH_CONTACTS_SUCCESS, FETCH_CONTACTS_FAILURE, FETCH_CONTACTS_REQUEST
} from './constants';

export const fetchContacts = () => {
    const apiClient = new APIClient();
    const user = getLoggedInUser();
    return (dispatch) => {
        setAuthorization(user?.data?.authorization?.token);
        apiClient.get('/contact/my-contacts')
            .then(response => {
                if (response?.response === 'Success') {
                    console.log(response?.data);
                    const contacts = response?.data;
                    dispatch(fetchContactsSuccess(contacts));
                } else {
                    dispatch(fetchContactsFailure('API request failed.'));
                }
            })
            .catch(error => {
                dispatch(fetchContactsFailure(error.message));
            });
    };
};

export const fetchContactsSuccess = (contacts) => ({
    type: FETCH_CONTACTS_SUCCESS,
    payload: contacts,
});

export const fetchContactsFailure = (error) => ({
    type: FETCH_CONTACTS_FAILURE,
    payload: error,
});

export const fetchContactsRequest = () => ({
    type: FETCH_CONTACTS_REQUEST,
});


export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload : userId
});

export const setFullUser = (fullUser) => ({
    type: FULL_USER,
    payload : fullUser
});

export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload : userData
});

export const createGroup = (groupData) => ({
    type : CREATE_GROUP,
    payload : groupData
})
