import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useMeals } from "../context/MealsContext";

function MealFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getById, addMeal, updateMeal } = useMeals();

    const isEditMode = Boolean(id);
    const existingMeal = isEditMode ? getById(id) : null;

    const [formData, setFormData] = useState({
        strMeal: "",
        strCategory: "",
        strArea: "",
        strInstructions: "",
        strMealThumb: "",
        strYoutube: "",
        strIngredient1: "",
        strIngredient2: "",
        strIngredient3: "",
        strMeasure1: "",
        strMeasure2: "",
        strMeasure3: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditMode && existingMeal) {
            setFormData({
                strMeal: existingMeal.strMeal || "",
                strCategory: existingMeal.strCategory || "",
                strArea: existingMeal.strArea || "",
                strInstructions: existingMeal.strInstructions || "",
                strMealThumb: existingMeal.strMealThumb || "",
                strYoutube: existingMeal.strYoutube || "",
                strIngredient1: existingMeal.strIngredient1 || "",
                strIngredient2: existingMeal.strIngredient2 || "",
                strIngredient3: existingMeal.strIngredient3 || "",
                strMeasure1: existingMeal.strMeasure1 || "",
                strMeasure2: existingMeal.strMeasure2 || "",
                strMeasure3: existingMeal.strMeasure3 || "",
            });
        }
    }, [isEditMode, existingMeal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!formData.strMeal.trim()) {
            setError("Recipe name is required");
            return;
        }

        if (!formData.strCategory.trim()) {
            setError("Category is required");
            return;
        }

        if (isEditMode) {
            updateMeal({
                ...existingMeal,
                ...formData,
            });
        } else {
            addMeal(formData);
        }

        navigate("/");
    };

    if (isEditMode && !existingMeal) {
        return (
            <Container className="my-5">
                <Alert variant="warning">
                    <h4>Recipe Not Found</h4>
                    <p>The recipe you're trying to edit doesn't exist.</p>
                    <Button variant="primary" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Alert>
            </Container>
        );
    }

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

            <Card className="meal-form-card shadow-sm">
                <Card.Body>
                    <h2 className="mb-4">
                        {isEditMode ? "Edit Recipe" : "Create New Recipe"}
                    </h2>

                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError("")}>
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Recipe Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="strMeal"
                                        value={formData.strMeal}
                                        onChange={handleChange}
                                        placeholder="Enter recipe name"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="strCategory"
                                        value={formData.strCategory}
                                        onChange={handleChange}
                                        placeholder="e.g., Dessert, Beef, Chicken"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cuisine</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="strArea"
                                        value={formData.strArea}
                                        onChange={handleChange}
                                        placeholder="e.g., Italian, Chinese, Mexican"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image URL</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="strMealThumb"
                                        value={formData.strMealThumb}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>YouTube Video URL</Form.Label>
                            <Form.Control
                                type="url"
                                name="strYoutube"
                                value={formData.strYoutube}
                                onChange={handleChange}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </Form.Group>

                        <h5 className="mt-4 mb-3">Ingredients</h5>
                        <Row>
                            {[1, 2, 3].map((num) => (
                                <Col md={4} key={num}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ingredient {num}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name={`strIngredient${num}`}
                                            value={formData[`strIngredient${num}`]}
                                            onChange={handleChange}
                                            placeholder={`Ingredient ${num}`}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Measure {num}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name={`strMeasure${num}`}
                                            value={formData[`strMeasure${num}`]}
                                            onChange={handleChange}
                                            placeholder={`e.g., 1 cup, 2 tbsp`}
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                name="strInstructions"
                                value={formData.strInstructions}
                                onChange={handleChange}
                                placeholder="Enter cooking instructions..."
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                <FaSave className="me-2" />
                                {isEditMode ? "Save Changes" : "Create Recipe"}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => navigate("/")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MealFormPage;
