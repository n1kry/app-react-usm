import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { FaEye, FaTrash, FaMapMarkerAlt, FaUtensils, FaExternalLinkAlt } from "react-icons/fa";

function MealList({ meals, onMealClick, onViewDetails, onDeleteMeal }) {
    return (
        <Container>
            <Row xs={1} md={2} lg={3} className="g-4">
                {meals.map((meal) => (
                    <Col key={meal.idMeal}>
                        <Card className="h-100 shadow-sm hover-card">
                            <Card.Img
                                variant="top"
                                src={meal.strMealThumb}
                                alt={meal.strMeal}
                                style={{
                                    height: "250px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                }}
                                onClick={() => onMealClick(meal)}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold">
                                    {meal.strMeal}
                                </Card.Title>
                                <div className="mb-2">
                                    <Badge bg="success" className="me-2">
                                        <FaUtensils className="me-1" />
                                        {meal.strCategory}
                                    </Badge>
                                    <Badge bg="info">
                                        <FaMapMarkerAlt className="me-1" />
                                        {meal.strArea}
                                    </Badge>
                                </div>
                                <div className="d-flex gap-2 mt-auto">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => onMealClick(meal)}
                                        className="flex-grow-1"
                                        size="sm"
                                    >
                                        <FaEye className="me-2" />
                                        Quick View
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => onViewDetails(meal)}
                                        size="sm"
                                    >
                                        <FaExternalLinkAlt />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => onDeleteMeal(meal.idMeal)}
                                        size="sm"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MealList;
