import React, {useEffect, useCallback} from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Form, Input, Button, FormFeedback, InputGroup, Label } from 'reactstrap';
import { Link, useSearchParams } from 'react-router-dom';

import withRouter from "../../components/withRouter";
import { connect, useDispatch } from 'react-redux';


//Import action
import { verifyUser, apiError } from '../../redux/actions';
//i18n
import { useTranslation } from 'react-i18next';

//Import Images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import avatar1 from "../../assets/images/users/avatar-1.jpg";

function OtpVerification(props) {

    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const ref = searchParams.get("ref");
    const dispatch = useDispatch();

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
   
    const payload = {
        otp: code,
        ref: ref
    }


    const clearError = useCallback(() => {
        dispatch(apiError(""));
     },[dispatch])

    useEffect( () => {
        props.verifyUser(payload, props.router.navigate)
        clearError();
    }, [clearError]);


    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-sm-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <div className="text-center mb-4">
                            <Link to="/" className="auth-logo mb-5 d-block">
                                <img src={logodark} alt="" height="30" className="logo logo-dark"/>
                                <img src={logolight} alt="" height="30" className="logo logo-light" />
                            </Link>

                            <h4>{t('Account Verification')}</h4>
                            <p className="text-muted mb-4">{t('Enter the 6 digit otp sent to you via email or sms!')}</p>
                            
                        </div>

                        <Card>
                            <CardBody className="p-4">
                                <div className="p-3">
                                    <div className="user-thumb text-center mb-4">
                                        <img src={avatar1} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                                        <h5 className="font-size-15 mt-3">{t('Patricia Smith')}</h5>
                                    {/* </div>
                                    <Form onSubmit={formik.handleSubmit}>

                                        <FormGroup className="mb-4">
                                            <Label className="form-label">{t('OTP')}</Label>
                                            <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                <Input
                                                    type="password"
                                                    id="otp"
                                                    name="otp"
                                                    className="form-control form-control-lg bg-soft-light"
                                                    placeholder="Enter OTP"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.otp}
                                                    invalid={formik.touched.otp && formik.errors.otp ? true : false}
                                                />
                                                {formik.touched.otp && formik.errors.otp ? (
                                                    <FormFeedback type="invalid">{formik.errors.otp}</FormFeedback>
                                                ) : null}
                                                
                                            </InputGroup>
                                        </FormGroup>

                                        <div className="d-grid">
                                            <Button color="primary" block className=" waves-effect waves-light" type="submit">Verify</Button>
                                        </div>

                                    </Form> */}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="mt-5 text-center">
                            <p>{t('Not you')} ? {t('return')} <Link to="login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
                            <p>© {new Date().getFullYear()} {t('Chatvia')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i> {t('by Themesbrand')}</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
        </React.Fragment>
    );
}

    const mapStateToProps = (state) => {
        const { user, loading, error } = state.Auth;
        return { user, loading, error };
    };
    
    export default withRouter(connect(mapStateToProps, { verifyUser, apiError })(OtpVerification));