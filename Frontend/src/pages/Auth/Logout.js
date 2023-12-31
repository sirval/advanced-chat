import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import withRouter from "../../components/withRouter";

//redux store
import { logoutUser } from '../../redux/actions';
import { getLoggedInUser } from '../../helpers/authUtils';
import { setAuthorization } from '../../helpers/apiClient';

/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
    const dispatch = useDispatch();
    const { isUserLogout } = useSelector((state) => ({
        isUserLogout: state.Auth.isUserLogout,
      }));
    const user = getLoggedInUser();

    useEffect(() => {
        setAuthorization(user?.data?.authorization?.token);
        dispatch(logoutUser(props.router.navigate));
    }, [dispatch, props.router.navigate]);

    if (isUserLogout) {
        console.log("isUserLogout",isUserLogout)
        return <Navigate to="/login" />;
      }

    return (<React.Fragment></React.Fragment>)
}

export default withRouter(connect(null, { logoutUser })(Logout));