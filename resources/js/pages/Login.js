import { Card, Form, Button } from "react-bootstrap";
import { useState } from "react";
import Styled from "styled-components";
import axios from "../utils/axios-instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/storage-manage";
import Loading from "../components/Loading";

const FormDiv = Styled.div`
        min-width: 90vw;

        @media (min-width: 550px) {
            min-width: 500px;
        }
    `;

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
            const response = await axios.post("/login", state);

            toast.success("You are logged in!");
            setAuthToken(response.data?.data?.token);
            setErrors({});
            navigate("/");
        } catch (error) {
            toast.error("Error occurred!");
            setErrors(error.response?.data?.errors ?? {});
        }

        setLoading(false);
    };

    return (
        <>
            <Loading loadingIs={loading} />
            <div className="d-flex justify-content-center mt-5">
                <Card>
                    <Card.Header className="text-center">
                        <h3>React Blog</h3>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title className="text-center">
                            Login to your account
                        </Card.Title>
                        <FormDiv>
                            <Form onSubmit={handleSubmit}>
                                <fieldset disabled={loading}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="email"
                                    >
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

                                    <Form.Group
                                        className="mb-3"
                                        controlId="password"
                                    >
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
                        </FormDiv>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Login;
