import { useState, useMemo } from "react";
import { Container, Button, Form, InputGroup, Alert, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../context/MealsContext";
import MealList from "../components/MealList";
import MealModal from "../components/MealModal";
import Filters from "../components/Filters";

function HomePage() {
    const { meals, loading, error, fetchMeals, deleteMeal, updateMeal } = useMeals();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [apiSearchQuery, setApiSearchQuery] = useState("pasta");
    const [displayCount, setDisplayCount] = useState(12);
    const [loadingMore, setLoadingMore] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);

    const availableCategories = useMemo(() => {
        const categories = new Set(
            meals.map((meal) => meal.strCategory).filter(Boolean)
        );
        return Array.from(categories).sort();
    }, [meals]);

    const availableAreas = useMemo(() => {
        const areas = new Set(meals.map((meal) => meal.strArea).filter(Boolean));
        return Array.from(areas).sort();
    }, [meals]);

    const filteredMeals = useMemo(() => {
        let result = [...meals];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (meal) =>
                    meal.strMeal?.toLowerCase().includes(query) ||
                    meal.strInstructions?.toLowerCase().includes(query) ||
                    meal.strCategory?.toLowerCase().includes(query) ||
                    meal.strArea?.toLowerCase().includes(query)
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter((meal) =>
                selectedCategories.includes(meal.strCategory)
            );
        }

        if (selectedAreas.length > 0) {
            result = result.filter((meal) => selectedAreas.includes(meal.strArea));
        }

        return result;
    }, [meals, searchQuery, selectedCategories, selectedAreas]);

    const handleApiSearch = (e) => {
        e.preventDefault();
        if (apiSearchQuery.trim()) {
            fetchMeals(apiSearchQuery);
            setDisplayCount(12);
        }
    };

    const handleMealClick = (meal) => {
        setSelectedMeal(meal);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleViewDetails = (meal) => {
        navigate(`/meal/${meal.idMeal}`);
    };

    const handleDeleteMeal = (mealId) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            deleteMeal(mealId);
        }
    };

    const handleSave = (mealData) => {
        if (isEdit) {
            updateMeal(mealData);
        }
        setShowModal(false);
        setSelectedMeal(null);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setDisplayCount(12);
    };

    const handleCategoriesChange = (categories) => {
        setSelectedCategories(categories);
        setDisplayCount(12);
    };

    const handleAreasChange = (areas) => {
        setSelectedAreas(areas);
        setDisplayCount(12);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setSelectedAreas([]);
        setDisplayCount(12);
    };

    const loadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 12, filteredMeals.length));
            setLoadingMore(false);
        }, 500);
    };

    return (
        <Container>
            <Form onSubmit={handleApiSearch} className="mb-4">
                <InputGroup size="lg">
                    <Form.Control
                        type="text"
                        placeholder="Load recipes from API (e.g., chicken, pasta, dessert)..."
                        value={apiSearchQuery}
                        onChange={(e) => setApiSearchQuery(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                        <FaSearch className="me-2" />
                        Load New Recipes
                    </Button>
                </InputGroup>
            </Form>

            {error && (
                <Alert variant="warning" dismissible>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                        style={{ width: "3rem", height: "3rem" }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3 text-muted">Loading recipes...</p>
                </div>
            ) : (
                <>
                    <Filters
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        selectedCategories={selectedCategories}
                        onCategoriesChange={handleCategoriesChange}
                        selectedAreas={selectedAreas}
                        onAreasChange={handleAreasChange}
                        onReset={handleResetFilters}
                        availableCategories={availableCategories}
                        availableAreas={availableAreas}
                        foundCount={filteredMeals.length}
                    />

                    {filteredMeals.length > 0 ? (
                        <>
                            <MealList
                                meals={filteredMeals.slice(0, displayCount)}
                                onMealClick={handleMealClick}
                                onViewDetails={handleViewDetails}
                                onDeleteMeal={handleDeleteMeal}
                            />

                            {displayCount < filteredMeals.length && (
                                <div className="text-center my-5">
                                    <Button
                                        variant="primary"
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? "Loading..." : "Load More"}
                                    </Button>
                                </div>
                            )}

                            {displayCount >= filteredMeals.length && filteredMeals.length > 12 && (
                                <div className="text-center my-5">
                                    <p className="text-muted">
                                        All {filteredMeals.length} recipes loaded
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <Alert variant="info" className="text-center">
                            <h5>Nothing Found</h5>
                            <p className="mb-0">
                                Try changing search criteria or reset filters
                            </p>
                        </Alert>
                    )}
                </>
            )}

            <MealModal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedMeal(null);
                }}
                meal={selectedMeal}
                onSave={handleSave}
                isEdit={isEdit}
            />
        </Container>
    );
}

export default HomePage;
