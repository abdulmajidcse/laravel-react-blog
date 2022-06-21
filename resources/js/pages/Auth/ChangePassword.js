import { Form, Button } from "react-bootstrap";
import axios from "../../utils/axios-instance";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ChangePassword() {
    const formik = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            new_password_confirmation: "",
        },
        validationSchema: Yup.object({
            old_password: Yup.string().required("Required"),
            new_password: Yup.string()
                .min(8, "Must be 8 characters or less")
                .required("Required"),
            new_password_confirmation: Yup.string()
                .min(8, "Must be 8 characters or less")
                .required("Required"),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const response = await axios.put(
                    "/auth/user/change-password",
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                process.env.MIX_AUTH_TOKEN_NAME
                            )}`,
                        },
                    }
                );
                helpers.resetForm();
                helpers.setSubmitting(false);
                toast.success(response.data.message);
            } catch (error) {
                helpers.setErrors(error.response?.data?.errors);
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Loading loadingIs={formik.isSubmitting} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">Change Your Password</h3>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={formik.handleSubmit}>
                            <fieldset disabled={formik.isSubmitting}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="old_password"
                                >
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="old_password"
                                        onChange={formik.handleChange}
                                        value={formik.values.old_password}
                                    />
                                    <div className="text-danger">
                                        {formik.errors.old_password}
                                    </div>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="new_password"
                                >
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="new_password"
                                        onChange={formik.handleChange}
                                        value={formik.values.new_password}
                                    />
                                    <div className="text-danger">
                                        {formik.errors.new_password}
                                    </div>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="new_password_confirmation"
                                >
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="new_password_confirmation"
                                        onChange={formik.handleChange}
                                        value={
                                            formik.values
                                                .new_password_confirmation
                                        }
                                    />
                                    <div className="text-danger">
                                        {
                                            formik.errors
                                                .new_password_confirmation
                                        }
                                    </div>
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100"
                                >
                                    Save
                                </Button>
                            </fieldset>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
