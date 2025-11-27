import { Container, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Container className="my-5 text-center">
            <Alert variant="info" className="p-5">
                <h1 className="display-1 mb-4">404</h1>
                <h2 className="mb-3">Page Not Found</h2>
                <p className="mb-4">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/")}
                >
                    <FaHome className="me-2" />
                    Go to Home
                </Button>
            </Alert>
        </Container>
    );
}

export default NotFoundPage;
