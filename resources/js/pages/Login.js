import { Card, Form, Button } from "react-bootstrap";
import { useState } from "react";

const Login = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setState((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Email: ${state.email} and Password: ${state.password}`);
    };

    return (
        <>
            <div className="d-flex justify-content-center mt-5">
                <Card>
                    <Card.Header className="text-center">
                        <h3>React Blog</h3>
                        {process.env.MIX_APP_URL}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title className="text-center">
                            Login to your account
                        </Card.Title>
                        <Form
                            onSubmit={handleSubmit}
                            style={{ minWidth: "500px" }}
                        >
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                            >
                                Login
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Login;
