import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ position: "fixed", height: "100vh", width: "100%" }}
            >
                <div className="text-center">
                    <p
                        className="text-uppercase mb-0"
                        style={{ fontSize: "1.125rem" }}
                    >
                        404 | Not Found
                    </p>
                    <Link to="/">Back to Home</Link>
                </div>
            </div>
        </>
    );
}
