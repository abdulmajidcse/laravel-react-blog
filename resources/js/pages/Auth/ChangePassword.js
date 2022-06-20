import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "../../utils/axios-instance";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setData((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.put(
                "/auth/user/change-password",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            process.env.MIX_AUTH_TOKEN_NAME
                        )}`,
                    },
                }
            );
            setLoading(false);
            setData({});
            toast.success(response.data.message);
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
            setLoading(false);
        }
    };

    return (
        <>
            <Loading loadingIs={loading} />
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header d-block d-md-flex">
                        <h3 className="flex-md-grow-1">Change Your Password</h3>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={handleSubmit}>
                            <fieldset disabled={loading}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="old_password"
                                >
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="old_password"
                                        onChange={handleChange}
                                        value={data.old_password ?? ""}
                                    />
                                    <div className="text-danger">
                                        {errors.old_password?.[0]}
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
                                        onChange={handleChange}
                                        value={data.new_password ?? ""}
                                    />
                                    <div className="text-danger">
                                        {errors.new_password?.[0]}
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
                                        onChange={handleChange}
                                        value={
                                            data.new_password_confirmation ?? ""
                                        }
                                    />
                                    <div className="text-danger">
                                        {errors.new_password_confirmation?.[0]}
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
