import { createContext, useState, useEffect, useContext } from "react";

const MealsContext = createContext(null);

export function MealsProvider({ children }) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMeals("pasta");
    }, []);

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
            setError(null);

            const queries = [query, "chicken", "beef", "dessert", "vegetarian", "seafood"];
            const uniqueQueries = [...new Set(queries)];

            const promises = uniqueQueries.map((q) =>
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
                setMeals(shuffledMeals);
                setError(null);
            } else {
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

    const getById = (id) => {
        return meals.find((meal) => meal.idMeal === String(id));
    };


    const addMeal = (newMeal) => {
        const mealWithId = {
            ...newMeal,
            idMeal: Date.now().toString(),
            strMealThumb: newMeal.strMealThumb || 'https://placehold.co/300x220/1a1f35/667eea?text=No+Image',
        };
        setMeals((prev) => [mealWithId, ...prev]);
        return mealWithId;
    };

    const updateMeal = (updatedMeal) => {
        setMeals((prev) =>
            prev.map((meal) =>
                meal.idMeal === updatedMeal.idMeal ? updatedMeal : meal
            )
        );
    };

    const deleteMeal = (id) => {
        setMeals((prev) => prev.filter((meal) => meal.idMeal !== String(id)));
    };

    const value = {
        meals,
        loading,
        error,
        fetchMeals,
        getById,
        addMeal,
        updateMeal,
        deleteMeal,
    };

    return (
        <MealsContext.Provider value={value}>
            {children}
        </MealsContext.Provider>
    );
}

export function useMeals() {
    const context = useContext(MealsContext);
    if (!context) {
        throw new Error("useMeals must be used within a MealsProvider");
    }
    return context;
}
