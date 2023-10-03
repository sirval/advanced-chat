import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { apiClient, setAuthorization } from '../../helpers/apiClient';

import {
   FETCH_CONTACTS_REQUEST
} from './constants';

import { fetchContactsSuccess, fetchContactsFailure } from './actions';
import { getLoggedInUser } from '../../helpers/authUtils';

const user = getLoggedInUser();
function* fetchContactsSaga() {
    try {
        setAuthorization(user?.data?.authorization?.token);
        const response = yield call(apiClient.get, '/contact/my-contacts');
        if (response?.response === 'Success') {
            yield put(fetchContactsSuccess(response.data));
        } else {
            yield put(fetchContactsFailure('API request failed.'));
        }
    } catch (error) {
        yield put(fetchContactsFailure(error.message));
    }
}


export function* watchFetchContacts() {
    yield takeEvery(FETCH_CONTACTS_REQUEST, fetchContactsSaga);
}