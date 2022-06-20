import { useState } from "react";
import { useUserContext } from "../../contexts/user-context";
import { Form, Button } from "react-bootstrap";
import axios from "../../utils/axios-instance";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

export default function Profile() {
    const { user, login } = useUserContext();
    const [profileEdit, setProfileEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ name: user.name, email: user.email });
    const [errors, setErrors] = useState({});

    const profileEditFormToggle = () => {
        setProfileEdit((prevState) => !prevState);
    };

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
            const response = await axios.put("/auth/user/profile", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        process.env.MIX_AUTH_TOKEN_NAME
                    )}`,
                },
            });

            const updateUserContext = login(
                localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
            );

            if (updateUserContext) {
                setLoading(false);
                profileEditFormToggle();
                toast.success(response.data.message);
            }
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
                        <h3 className="flex-md-grow-1">
                            {profileEdit
                                ? "Edit Profile"
                                : "Profile Information"}
                        </h3>
                        <div>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={profileEditFormToggle}
                            >
                                {profileEdit ? "View" : "Edit"} Profile
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div
                            className={`table-responsive ${
                                profileEdit && "d-none"
                            }`}
                        >
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Full Name:</th>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email Address:</th>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Updated:</th>
                                        <td>{user.updated_at}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Form
                            onSubmit={handleSubmit}
                            className={!profileEdit && "d-none"}
                        >
                            <fieldset disabled={loading}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        value={data.name}
                                    />
                                    <div className="text-danger">
                                        {errors.name?.[0]}
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={data.email}
                                    />
                                    <div className="text-danger">
                                        {errors.email?.[0]}
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
