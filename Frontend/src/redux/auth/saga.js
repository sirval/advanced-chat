import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { APIClient, setAuthorization } from '../../helpers/apiClient';
import { getFirebaseBackend } from "../../helpers/firebase";


import {
    LOGIN_USER,
    LOGOUT_USER,
    REGISTER_USER,
    FORGET_PASSWORD,
    VERIFY_USER
} from './constants';


import {
    loginUserSuccess,
    registerUserSuccess,
    forgetPasswordSuccess,
    apiError,
    logoutUserSuccess,
    verifyUserSuccess
} from './actions';


//Initilize firebase
const fireBaseBackend = getFirebaseBackend();


/**
 * Sets the session
 * @param {*} user 
 */

const create = new APIClient().create;

/**
 * Login the user
 * @param {*} payload - username and password 
 */
function* login({ payload: { username, password, history } }) {
    try {
        if(process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = yield call(fireBaseBackend.loginUser, username, password);
            yield put(loginUserSuccess(response));
            
        } else {
            const response = yield call(create, '/auth/login', { username, password });
            if (response?.response === 'Success') {
                localStorage.setItem("authUser", JSON.stringify(response));
                yield put(loginUserSuccess(response));
                history('/dashboard');
            }else{
                yield put(apiError(response?.message));
            }
        }
    } catch (error) {
        yield put(apiError(error));
    }
}


/**
 * Logout the user
 * @param {*} param0 
 */
function* logout({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");
        if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
            yield call(fireBaseBackend.logout);
        }else {
            const response = yield call(create, '/auth/logout');
            if (response?.response === 'Success') {
                setAuthorization('')
                yield put(logoutUserSuccess(true));
                history('/login')
            }else{
                yield put(logoutUserSuccess(true));
                console.error(response?.message);
            }
        }

    } catch (error) { }
}

/**
 * Register the user
 */
function* register({ payload: { user } }) {
    try {
        const email = user.email;
        const password = user.password;
        if(process.env.REACT_APP_DEFAULTAUTH === "firebase"){
            const response = yield call(fireBaseBackend.registerUser, email, password);
            yield put(registerUserSuccess(response));
        } else {
            const response = yield call(create, '/auth/register', user);
            yield put(registerUserSuccess(response));
        }
        
    } catch (error) {
        yield put(apiError(error));
    }
}

/**
 * Verify the user OTP
 */
function* verifyOtp({ payload: { payload, history } }) {
    try {
        if(process.env.REACT_APP_DEFAULTAUTH === "firebase"){
            // const response = yield call(fireBaseBackend.registerUser, email, password);
            // yield put(registerUserSuccess(response));
        } else {
            const response = yield call(create, '/auth/verify-code', payload);
            if (response?.response === 'Success') {
                yield put(verifyUserSuccess(response));
                setTimeout(() => {
                    history('/login');
                }, 1000);
            }else{
                yield put(apiError(response?.message));
            }
        }
        
    } catch (error) {
        yield put(apiError(error));
    }
}

/**
 * forget password
 */
function* forgetPassword({ payload: { email } }) {
    try {
        if(process.env.REACT_APP_DEFAULTAUTH === "firebase"){
            const response = yield call(fireBaseBackend.forgetPassword, email);
            if (response) {
              yield put(
                forgetPasswordSuccess(
                  "Reset link are sent to your mailbox, check there first"
                )
              );
            }
        } else {
            const response = yield call(create, '/forget-pwd', { email });
            yield put(forgetPasswordSuccess(response));
        }
    } catch (error) {
        yield put(apiError(error));
    }
}


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

export function* watchVerifyUser() {
    yield takeEvery(VERIFY_USER, verifyOtp);
}

function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
        fork(watchVerifyUser),
    ]);
}

export default authSaga;