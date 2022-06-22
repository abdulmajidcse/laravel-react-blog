import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import Loading from "../Loading";
import { useState } from "react";
import { useUserContext } from "../../contexts/user-context";

export default function AuthHeader() {
    const [loading, setLoading] = useState(false);
    const { user, logout } = useUserContext();

    const logoutConfirm = async () => {
        setLoading(true);
        try {
            const response = await logout(
                localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
            );
            setLoading(response ? false : true);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <Loading loadingIs={loading} />
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Link to="/auth" className="navbar-brand">
                        React Blog
                    </Link>
                    <Navbar.Toggle aria-controls="auth-navbar-header" />
                    <Navbar.Collapse id="auth-navbar-header">
                        <Nav className="ms-auto">
                            <NavLink to="/auth" className="nav-link">
                                Dashboard
                            </NavLink>
                            <NavLink to="/auth/categories" className="nav-link">
                                Category
                            </NavLink>
                            <NavDropdown
                                title={user.name}
                                id="auth-header-profile"
                            >
                                <NavLink
                                    to="/auth/profile"
                                    className="dropdown-item"
                                >
                                    Profile
                                </NavLink>
                                <NavLink
                                    to="/auth/change-password"
                                    className="dropdown-item"
                                >
                                    Change Password
                                </NavLink>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    href="#"
                                    onClick={logoutConfirm}
                                >
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
