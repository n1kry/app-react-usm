import { useState, useEffect, useRef, useCallback } from "react";
import {
    Container,
    Button,
    Navbar,
    Alert,
    Spinner,
    Form,
    InputGroup,
} from "react-bootstrap";
import { FaSearch, FaPlus, FaUtensils } from "react-icons/fa";
import MealList from "./components/MealList";
import MealModal from "./components/MealModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    const [meals, setMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState("pasta");
    const [displayCount, setDisplayCount] = useState(12);
    const observerTarget = useRef(null);

    useEffect(() => {
        fetchMeals("pasta");
    }, []);

    const loadMoreMeals = useCallback(() => {
        setLoadingMore(true);
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 12, allMeals.length));
            setLoadingMore(false);
        }, 500);
    }, [allMeals.length]);

    useEffect(() => {
        const currentTarget = observerTarget.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && displayCount < allMeals.length) {
                    loadMoreMeals();
                }
            },
            { threshold: 0.5 }
        );

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [displayCount, allMeals, loadingMore, loadMoreMeals]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const fetchMeals = async (query) => {
        try {
            setLoading(true);
            const queries = [query, "chicken", "beef", "dessert", "vegetarian"];
            const promises = queries.map((q) =>
                fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`)
                    .then((res) => res.json())
            );

            const results = await Promise.all(promises);
            const allMealsData = results
                .flatMap((data) => data.meals || [])
                .filter((meal, index, self) => 
                    index === self.findIndex((m) => m.idMeal === meal.idMeal)
                );

            if (allMealsData.length > 0) {
                const shuffledMeals = shuffleArray(allMealsData);
                setAllMeals(shuffledMeals);
                setMeals(shuffledMeals.slice(0, 12));
                setDisplayCount(12);
                setError(null);
            } else {
                setAllMeals([]);
                setMeals([]);
                setError("No recipes found");
            }
        } catch (err) {
            setError("Error loading data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchMeals(searchQuery);
        }
    };

    const handleCreateMeal = (mealData) => {
        const newMeal = {
            ...mealData,
            idMeal: Date.now().toString(),
            strMealThumb: mealData.strMealThumb || 'https://placehold.co/300x220/1a1f35/667eea?text=No+Image',
        };
        setAllMeals((prev) => [newMeal, ...prev]);
        setMeals((prev) => [newMeal, ...prev]);
    };

    const handleUpdateMeal = (mealData) => {
        setAllMeals((prev) =>
            prev.map((m) => (m.idMeal === mealData.idMeal ? mealData : m))
        );
        setMeals((prev) =>
            prev.map((m) => (m.idMeal === mealData.idMeal ? mealData : m))
        );
    };

    const handleDeleteMeal = (mealId) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) {
            return;
        }
        setAllMeals((prev) => prev.filter((m) => m.idMeal !== mealId));
        setMeals((prev) => prev.filter((m) => m.idMeal !== mealId));
    };

    const handleMealClick = (meal) => {
        setSelectedMeal(meal);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setSelectedMeal(null);
        setIsEdit(false);
        setShowModal(true);
    };

    const handleSave = (mealData) => {
        if (isEdit) {
            handleUpdateMeal(mealData);
        } else {
            handleCreateMeal(mealData);
        }
        setShowModal(false);
        setSelectedMeal(null);
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" className="mb-4 shadow">
                <Container>
                    <Navbar.Brand className="d-flex align-items-center">
                        <FaUtensils className="me-2" size={24} />
                        <span className="brand-text">Recipe Book</span>
                    </Navbar.Brand>
                    <Button
                        variant="success"
                        onClick={handleCreateClick}
                        className="d-flex align-items-center"
                    >
                        <FaPlus className="me-2" />
                        Create Recipe
                    </Button>
                </Container>
            </Navbar>

            <Container>
                <Form onSubmit={handleSearch} className="mb-4">
                    <InputGroup size="lg">
                        <Form.Control
                            type="text"
                            placeholder="Search recipes (e.g., chicken, pasta, cake)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="primary" type="submit">
                            <FaSearch className="me-2" />
                            Search
                        </Button>
                    </InputGroup>
                </Form>

                {error && (
                    <Alert
                        variant="warning"
                        onClose={() => setError(null)}
                        dismissible
                    >
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
                ) : meals.length > 0 ? (
                    <>
                        <MealList
                            meals={allMeals.slice(0, displayCount)}
                            onMealClick={handleMealClick}
                            onDeleteMeal={handleDeleteMeal}
                        />
                        
                        {displayCount < allMeals.length && (
                            <div ref={observerTarget} className="text-center my-5">
                                {loadingMore && (
                                    <>
                                        <Spinner
                                            animation="border"
                                            role="status"
                                            variant="primary"
                                            size="sm"
                                        >
                                            <span className="visually-hidden">
                                                Loading more...
                                            </span>
                                        </Spinner>
                                        <p className="mt-2 text-muted">
                                            Loading more recipes...
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                        {displayCount >= allMeals.length && allMeals.length > 12 && (
                            <div className="text-center my-5">
                                <p className="text-muted">
                                    All {allMeals.length} recipes loaded
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <Alert variant="info">
                        No recipes found. Try a different search term.
                    </Alert>
                )}
            </Container>

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
        </>
    );
}

export default App;
