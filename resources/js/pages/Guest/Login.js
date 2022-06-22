import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "../../utils/axios-instance";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import GuestWrapper from "../../components/Guest/GuestWrapper";

const Login = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setState((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/auth/login", state);

            if (response) {
                toast.success("You are logged in!");
                localStorage.setItem(
                    process.env.MIX_AUTH_TOKEN_NAME,
                    response.data?.data?.token
                );
                navigate("/auth");
            }
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
            setLoading(false);
        }
    };

    return (
        <>
            <Loading loadingIs={loading} />
            <GuestWrapper title="Login to your account">
                <Form onSubmit={handleSubmit}>
                    <fieldset disabled={loading}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="Enter email"
                                value={state.email}
                            />
                            <div className="text-danger">
                                {errors.email?.[0]}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="Password"
                                value={state.password}
                            />
                            <div className="text-danger">
                                {errors.password?.[0]}
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
                <div className="mt-2">
                    <Link to="/auth/forgot-password">Forgotten password?</Link>
                </div>
            </GuestWrapper>
        </>
    );
};

export default Login;
