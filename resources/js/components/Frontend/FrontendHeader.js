import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "../../contexts/user-context";

export default function FrontendHeader() {
    const { user } = useUserContext();

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Link to="/" className="navbar-brand">
                        React Blog
                    </Link>
                    <Navbar.Toggle aria-controls="auth-navbar-header" />
                    <Navbar.Collapse id="auth-navbar-header">
                        <Nav className="ms-auto">
                            <NavLink to="/" className="nav-link">
                                Home
                            </NavLink>
                            {user.authIs && (
                                <NavLink to="/auth" className="nav-link">
                                    Dashboard
                                </NavLink>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
