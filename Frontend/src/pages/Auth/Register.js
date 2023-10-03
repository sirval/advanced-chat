import React, { useCallback, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from "../../components/withRouter";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';

//Import action
import { registerUser, apiError } from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

//Import Images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";

/**
 * Register component
 * @param {*} props 
 */
const Register = (props) => {
    const dispatch = useDispatch();
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const clearError = useCallback(() => {
        dispatch(apiError(""));
     },[dispatch])
 
     useEffect(() => {
         clearError();
     }, [clearError])

    // validation
    const emailSchema = Yup.string()
    .email('Invalid email address')
    .required('Required');

    const phoneSchema = Yup.string()
    .matches(/^\+\d+$/, 'Invalid phone number')
    .required('Required');

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        username: Yup.string()
          .test('emailOrPhone', 'Invalid email or phone number', function (value) {
            if (!value) {
              return false;
            } else if (value.match(/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
              return true; // It's a valid email
            } else if (value.match(/^\+\d+$/)) {
              return true; // It's a valid phone number starting with '+'
            } else {
              return false;
            }
          })
          .required('Required'),
        password: Yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: values => {
          console.log(values);
          props.registerUser(values);
        },
    });

    return (
        <React.Fragment>

            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <div className="text-center mb-4">
                                <Link to="/" className="auth-logo mb-5 d-block">
                                    <img src={logodark} alt="" height="30" className="logo logo-dark" />
                                    <img src={logolight} alt="" height="30" className="logo logo-light" />
                                </Link>

                                <h4>{t('Sign up')}</h4>
                                <p className="text-muted mb-4">{t('Get your Chatvia account now')}.</p>

                            </div>

                            <Card>
                                <CardBody className="p-4">
                                    {
                                        props?.user?.response === "Error" && <Alert variant="danger" style={{ backgroundColor: '#f76262', color: '#F7F7FF' }}>{props?.user?.message}</Alert>
                                    }
                                    {
                                        props?.user?.response === "Success" && <Alert variant="success">{props?.user?.message}</Alert>
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={formik.handleSubmit}>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Username')}</Label>
                                                <InputGroup className="input-group bg-soft-light rounded-3 mb-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-mail-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter username"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.username}
                                                        invalid={formik.touched.username && formik.errors.username ? true : false}
                                                    />
                                                    {formik.touched.username && formik.errors.username ? (
                                                        <FormFeedback type="invalid">{formik.errors.username}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Full name')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Full name"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.name}
                                                        invalid={formik.touched.name && formik.errors.name ? true : false}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Password"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.password}
                                                        invalid={formik.touched.password && formik.errors.password ? true : false}
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                                                    ) : null}

                                                </InputGroup>
                                            </FormGroup>


                                            <div className="d-grid">
                                                <Button color="primary" block className=" waves-effect waves-light" type="submit">Sign up</Button>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <p className="text-muted mb-0">{t('By registering you agree to the Chatvia')} <Link to="#" className="text-primary">{t('Terms of Use')}</Link></p>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t('Already have an account')} ? <Link to="/login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
                                <p>© {new Date().getFullYear()} {t('Chatvia')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i> {t('by Themesbrand')}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default withRouter(connect(mapStateToProps, { registerUser, apiError })(Register));