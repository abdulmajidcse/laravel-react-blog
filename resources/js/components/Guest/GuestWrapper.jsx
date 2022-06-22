import Styled from "styled-components";
import { Card } from "react-bootstrap";

const FormDiv = Styled.div`
        min-width: 90vw;

        @media (min-width: 550px) {
            min-width: 500px;
        }
    `;

export default function GuestWrapper({ title = "Your account", children }) {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: "100%", height: "100vh" }}
        >
            <Card>
                <Card.Header className="text-center">
                    <h3>{process.env.MIX_APP_NAME}</h3>
                </Card.Header>
                <Card.Body>
                    <Card.Title className="text-center">{title}</Card.Title>
                    <FormDiv>{children}</FormDiv>
                </Card.Body>
            </Card>
        </div>
    );
}
