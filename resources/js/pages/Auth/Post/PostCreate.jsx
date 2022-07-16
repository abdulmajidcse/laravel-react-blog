import axios from "../../../utils/axios-instance";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import useGetModel from "../../../hooks/useGetModel";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function PostCreate() {
    const editorRef = useRef(null);
    const photoRef = useRef(null);
    const categories = useGetModel(
        "/auth/categories?paginate=100",
        localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
    );
    const initialValues = {
        category_id: "",
        title: "",
        photo: null,
        content: "",
    };
    const validationSchema = Yup.object({
        category_id: Yup.number()
            .required("The category field is required.")
            .positive()
            .integer(),
        title: Yup.string().required("The title field is required."),
        photo: Yup.mixed()
            .nullable()
            .test("fileSize", "File is too large. Max size 1MB.", (value) =>
                value?.size ? value?.size <= 1024 * 1024 : true
            )
            .test(
                "fileType",
                "Not a valid image. Supported only jpg, jpeg and png format.",
                (value) =>
                    value?.type ? SUPPORTED_FORMATS.includes(value?.type) : true
            ),
        content: Yup.string().required("The content field is required."),
    });
    const onSubmit = async (values, formikHelpers) => {
        try {
            const response = await axios.post("/auth/posts", values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        process.env.MIX_AUTH_TOKEN_NAME
                    )}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            formikHelpers.resetForm();
            photoRef.current.value = "";
            formikHelpers.setSubmitting(false);
            toast.success(response.data.message);
        } catch (error) {
            formikHelpers.setErrors(error.response?.data?.errors);
            formikHelpers.setSubmitting(false);
        }
    };
    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSubmit,
    });

    return (
        <>
            <Loading loadingIs={formik.isSubmitting} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">New Post</h3>
                        <div>
                            <Link
                                to="/auth/posts"
                                className="btn btn-sm btn-primary"
                            >
                                Post List
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={formik.handleSubmit}>
                            <fieldset disabled={formik.isSubmitting}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="category_id"
                                >
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        name="category_id"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.category_id}
                                    >
                                        <option value="">None</option>
                                        {categories?.data?.map((category) => (
                                            <option
                                                value={category.id}
                                                key={`category_id_${category.id}`}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {formik.touched.category_id &&
                                    formik.errors.category_id ? (
                                        <div className="text-danger">
                                            {formik.errors.category_id}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.title}
                                    />
                                    {formik.touched.title &&
                                    formik.errors.title ? (
                                        <div className="text-danger">
                                            {formik.errors.title}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="photo">
                                    <Form.Label>Photo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="photo"
                                        className="mb-2"
                                        ref={photoRef}
                                        onChange={(event) =>
                                            formik.setFieldValue(
                                                "photo",
                                                event.target.files[0]
                                            )
                                        }
                                        onBlur={formik.handleBlur}
                                    />
                                    {SUPPORTED_FORMATS.includes(
                                        formik.values.photo?.type ?? "None"
                                    ) && (
                                        <img
                                            src={URL.createObjectURL(
                                                formik.values.photo
                                            )}
                                            alt="Preview"
                                            height={100}
                                        />
                                    )}
                                    {formik.touched.photo &&
                                    formik.errors.photo ? (
                                        <div className="text-danger">
                                            {formik.errors.photo}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="content"
                                >
                                    <Form.Label>Content</Form.Label>
                                    <Editor
                                        apiKey="9czntgsnr11uo22iibcgtn0l128vwm7f2ku0cebs3y0m7zap"
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        name="content"
                                        id="content"
                                        onBlur={(event) => {
                                            formik.setFieldValue(
                                                "content",
                                                editorRef.current.getContent()
                                            );
                                            setTimeout(
                                                () => formik.handleBlur(event),
                                                3000
                                            );
                                        }}
                                        initialValue={formik.values.content}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                "advlist",
                                                "autolink",
                                                "lists",
                                                "link",
                                                "image",
                                                "charmap",
                                                "preview",
                                                "anchor",
                                                "searchreplace",
                                                "visualblocks",
                                                "code",
                                                "fullscreen",
                                                "insertdatetime",
                                                "media",
                                                "table",
                                                "code",
                                                "help",
                                                "wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | blocks | " +
                                                "bold italic forecolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist outdent indent | " +
                                                "removeformat | help",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                    {formik.touched.content &&
                                    formik.errors.content ? (
                                        <div className="text-danger">
                                            {formik.errors.content}
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
