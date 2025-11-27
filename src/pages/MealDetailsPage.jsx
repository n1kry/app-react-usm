import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert, Card, Badge, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaEdit, FaTrash, FaYoutube, FaMapMarkerAlt, FaUtensils, FaListUl } from "react-icons/fa";
import { useMeals } from "../context/MealsContext";

function MealDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getById, deleteMeal, loading } = useMeals();

    const meal = getById(id);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            deleteMeal(id);
            navigate("/");
        }
    };

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    const getIngredients = () => {
        if (!meal) return [];
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push({ ingredient, measure });
            }
        }
        return ingredients;
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading...</p>
            </Container>
        );
    }

    if (!meal) {
        return (
            <Container className="my-5">
                <Alert variant="warning">
                    <h4>Recipe Not Found</h4>
                    <p>The recipe you're looking for doesn't exist.</p>
                    <Button variant="primary" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Alert>
            </Container>
        );
    }

    const ingredients = getIngredients();

    return (
        <Container className="my-4">
            <Button
                variant="outline-secondary"
                onClick={() => navigate("/")}
                className="mb-4"
            >
                <FaArrowLeft className="me-2" />
                Back to List
            </Button>

            <Card className="meal-details-card shadow-sm">
                <Card.Img
                    variant="top"
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{ height: "400px", objectFit: "cover" }}
                />
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="meal-detail-title mb-3">{meal.strMeal}</h2>
                            <div className="mb-3">
                                <Badge bg="success" className="me-2">
                                    <FaUtensils className="me-1" />
                                    {meal.strCategory}
                                </Badge>
                                <Badge bg="info">
                                    <FaMapMarkerAlt className="me-1" />
                                    {meal.strArea}
                                </Badge>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="primary" onClick={handleEdit}>
                                <FaEdit className="me-2" />
                                Edit
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                <FaTrash className="me-2" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    <Row>
                        <Col md={6} className="mb-4">
                            <div className="ingredients-section">
                                <h4 className="section-title mb-3">
                                    <FaListUl className="me-2" />
                                    Ingredients
                                </h4>
                                <div className="ingredients-list">
                                    {ingredients.map((item, index) => (
                                        <div key={index} className="ingredient-item mb-2">
                                            <Badge bg="secondary" className="ingredient-badge me-2">
                                                {item.measure}
                                            </Badge>
                                            <span className="ingredient-name">{item.ingredient}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>

                        <Col md={6} className="mb-4">
                            <div className="instructions-section">
                                <h4 className="section-title mb-3">Instructions</h4>
                                <p className="instructions-text">
                                    {meal.strInstructions}
                                </p>

                                {meal.strYoutube && (
                                    <div className="mt-4">
                                        <Button
                                            variant="danger"
                                            href={meal.strYoutube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="youtube-btn"
                                        >
                                            <FaYoutube className="me-2" />
                                            Watch Video Tutorial
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MealDetailsPage;
