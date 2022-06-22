import { Form, Button } from "react-bootstrap";
import GuestWrapper from "../../../components/Guest/GuestWrapper";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            reset_url: `${process.env.MIX_APP_URL}/auth/reset-password`,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("The email field is required.")
                .email("The email must be a valid email address."),
        }),
        onSubmit: async (values, formikHelpers) => {
            try {
                const response = await axios.post(
                    "/auth/forgot-password",
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                process.env.MIX_AUTH_TOKEN_NAME
                            )}`,
                        },
                    }
                );
                let resetPasswordUrl = `/auth/reset-password?email=${values.email}`;
                formikHelpers.resetForm();
                formikHelpers.setSubmitting(false);
                toast.success(response.data.message);
                navigate(resetPasswordUrl);
            } catch (error) {
                formikHelpers.setErrors(error.response?.data?.errors);
                formikHelpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Loading loadingIs={formik.isSubmitting} />
            <GuestWrapper title="Find Your Account">
                <Form onSubmit={formik.handleSubmit}>
                    <fieldset disabled={formik.isSubmitting}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>
                                Please enter your email address
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Email address"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger">
                                    {formik.errors.email}
                                </div>
                            ) : (
                                ""
                            )}
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                        >
                            Search
                        </Button>
                    </fieldset>
                </Form>
                <div className="mt-2">
                    <Link to="/auth/login">Back to login</Link>
                </div>
            </GuestWrapper>
        </>
    );
}
