import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import useGetModel from "../../../hooks/useGetModel";

export default function CategoryEdit() {
    const { categoryId } = useParams();
    let category = useGetModel(
        `/auth/categories/${categoryId}`,
        localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
    );

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: category.name ?? "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("The name field is required."),
        }),
        onSubmit: async (values, formikHelpers) => {
            try {
                const response = await axios.put(
                    `/auth/categories/${categoryId}`,
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                process.env.MIX_AUTH_TOKEN_NAME
                            )}`,
                        },
                    }
                );
                category = response.data.data;
                formikHelpers.setSubmitting(false);
                toast.success(response.data.message);
            } catch (error) {
                formikHelpers.setErrors(error.response?.data?.errors);
                formikHelpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Loading loadingIs={formik.isSubmitting || !category.id} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">Edit Category</h3>
                        <div>
                            <Link
                                to="/auth/categories"
                                className="btn btn-sm btn-primary"
                            >
                                Category List
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={formik.handleSubmit}>
                            <fieldset disabled={formik.isSubmitting}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                    />
                                    {formik.touched.name &&
                                    formik.errors.name ? (
                                        <div className="text-danger">
                                            {formik.errors.name}
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
