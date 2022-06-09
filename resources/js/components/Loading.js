import { Button, Spinner } from "react-bootstrap";
import Styled from "styled-components";

const LoadingWrapper = Styled.div.attrs()`
    background: ${(props) => props.background || "none"};
    opacity: ${(props) => props.opacity || "1"};
    height: 100vh;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    &:hover {
        cursor: no-drop;
    }

    & button:disabled {
        opacity: 1;
    }
`;

export default function Loading({
    loadingIs = false,
    background = "",
    opacity = "",
    loadingText = "Please wait...",
}) {
    if (!loadingIs) return true;

    return (
        <>
            <LoadingWrapper
                className="d-flex justify-content-center align-items-center"
                background={background}
                opacity={opacity}
            >
                <Button variant="danger" disabled>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                    />
                    {loadingText}
                </Button>
            </LoadingWrapper>
        </>
    );
}
