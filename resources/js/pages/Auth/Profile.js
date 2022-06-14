import { useState } from "react";
import { useUserContext } from "../../contexts/user-context";
import { Form, Button } from "react-bootstrap";

export default function Profile() {
    const { user } = useUserContext();
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
        alert("Form Sumitted!");
    };

    return (
        <>
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
                                    Login
                                </Button>
                            </fieldset>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
