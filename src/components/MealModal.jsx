import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Badge } from "react-bootstrap";
import {
    FaEdit,
    FaUtensils,
    FaMapMarkerAlt,
    FaYoutube,
    FaListUl,
} from "react-icons/fa";

function MealModal({ show, onHide, meal, onSave, isEdit }) {
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
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (show) {
            if (meal && isEdit) {
                setFormData({
                    strMeal: meal.strMeal || "",
                    strCategory: meal.strCategory || "",
                    strArea: meal.strArea || "",
                    strInstructions: meal.strInstructions || "",
                    strMealThumb: meal.strMealThumb || "",
                    strYoutube: meal.strYoutube || "",
                    strIngredient1: meal.strIngredient1 || "",
                    strIngredient2: meal.strIngredient2 || "",
                    strIngredient3: meal.strIngredient3 || "",
                    strMeasure1: meal.strMeasure1 || "",
                    strMeasure2: meal.strMeasure2 || "",
                    strMeasure3: meal.strMeasure3 || "",
                });
                setIsEditing(false);
            } else {
                setFormData({
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
                setIsEditing(true);
            }
        }
    }, [show, meal, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...meal,
            ...formData,
            idMeal: meal?.idMeal || Date.now().toString(),
        });
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {meal && isEdit && isEditing && "Edit Recipe"}
                    {meal && isEdit && !isEditing && "Recipe Details"}
                    {!meal && !isEdit && "Create New Recipe"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isEdit && meal && !isEditing && (
                    <div>
                        <h4 className="mb-3">{meal.strMeal}</h4>
                        <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="img-fluid mb-3 rounded"
                        />
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

                        <h6 className="mt-3">
                            <FaListUl className="me-2" />
                            Instructions:
                        </h6>
                        <p className="text-muted">{meal.strInstructions}</p>

                        <h6 className="mt-3">
                            <FaUtensils className="me-2" />
                            Ingredients:
                        </h6>
                        <ul>
                            {[...Array(20)].map((_, i) => {
                                const ingredient =
                                    meal[`strIngredient${i + 1}`];
                                const measure = meal[`strMeasure${i + 1}`];
                                if (ingredient && ingredient.trim()) {
                                    return (
                                        <li key={i}>
                                            {ingredient} - {measure}
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>

                        {meal.strYoutube && (
                            <p>
                                <FaYoutube className="me-2 text-danger" />
                                <strong>Video:</strong>{" "}
                                <a
                                    href={meal.strYoutube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Watch on YouTube
                                </a>
                            </p>
                        )}
                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="primary"
                                onClick={() => setIsEditing(true)}
                                style={{ minWidth: 120 }}
                            >
                                <FaEdit className="me-2" />
                                Edit Recipe
                            </Button>
                        </div>
                    </div>
                )}

                {(isEditing || !isEdit) && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Recipe Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="strMeal"
                                value={formData.strMeal}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="strCategory"
                                        value={formData.strCategory}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cuisine *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="strArea"
                                        value={formData.strArea}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Instructions *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="strInstructions"
                                value={formData.strInstructions}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="url"
                                name="strMealThumb"
                                value={formData.strMealThumb}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>YouTube Link</Form.Label>
                            <Form.Control
                                type="url"
                                name="strYoutube"
                                value={formData.strYoutube}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <h6>Ingredients</h6>
                        {[1, 2, 3].map((i) => (
                            <Row key={i} className="mb-2">
                                <Col md={6}>
                                    <Form.Control
                                        type="text"
                                        name={`strIngredient${i}`}
                                        placeholder={`Ingredient ${i}`}
                                        value={formData[`strIngredient${i}`]}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Control
                                        type="text"
                                        name={`strMeasure${i}`}
                                        placeholder={`Measure ${i}`}
                                        value={formData[`strMeasure${i}`]}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                        ))}

                        <div className="d-flex gap-2 justify-content-end mt-4">
                            <Button variant="secondary" onClick={onHide}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Recipe
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default MealModal;
