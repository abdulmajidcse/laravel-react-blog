import { Form, Button } from "react-bootstrap";
import GuestWrapper from "../../../components/Guest/GuestWrapper";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { toast } from "react-toastify";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            token: searchParams.has("token") ? searchParams.get("token") : "",
            email: searchParams.has("email") ? searchParams.get("email") : "",
            password: "",
            password_confirmation: "",
        },
        validationSchema: Yup.object({
            token: Yup.string().required("The code field is required."),
            email: Yup.string()
                .required("The email field is required.")
                .email("The email must be a valid email address."),
            password: Yup.string().required("The password field is required."),
            password_confirmation: Yup.string().required(
                "The confirm password field is required."
            ),
        }),
        onSubmit: async (values, formikHelpers) => {
            try {
                const response = await axios.post(
                    "/auth/reset-password",
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                process.env.MIX_AUTH_TOKEN_NAME
                            )}`,
                        },
                    }
                );
                formikHelpers.resetForm();
                formikHelpers.setSubmitting(false);
                toast.success(response.data.message);
                navigate("/auth/login");
            } catch (error) {
                formikHelpers.setErrors(error.response?.data?.errors);
                formikHelpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Loading loadingIs={formik.isSubmitting} />
            <GuestWrapper title="Recover Your Account">
                <Form onSubmit={formik.handleSubmit}>
                    <fieldset disabled={formik.isSubmitting}>
                        <Form.Group className="mb-3" controlId="token">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="token"
                                placeholder="Code"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.token}
                            />
                            {formik.touched.token && formik.errors.token ? (
                                <div className="text-danger">
                                    {formik.errors.token}
                                </div>
                            ) : (
                                ""
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Email"
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
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password &&
                            formik.errors.password ? (
                                <div className="text-danger">
                                    {formik.errors.password}
                                </div>
                            ) : (
                                ""
                            )}
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="password_confirmation"
                        >
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password_confirmation}
                            />
                            {formik.touched.password_confirmation &&
                            formik.errors.password_confirmation ? (
                                <div className="text-danger">
                                    {formik.errors.password_confirmation}
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
                            Reset Password
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
