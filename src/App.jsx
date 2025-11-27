import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Container, Button, Navbar } from "react-bootstrap";
import { FaPlus, FaUtensils } from "react-icons/fa";
import { MealsProvider } from "./context/MealsContext";
import HomePage from "./pages/HomePage";
import MealDetailsPage from "./pages/MealDetailsPage";
import MealFormPage from "./pages/MealFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function NavBar() {
    const navigate = useNavigate();

    return (
        <Navbar bg="dark" variant="dark" className="mb-4 shadow">
            <Container>
                <Navbar.Brand 
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <FaUtensils className="me-2" size={24} />
                    <span className="brand-text">Recipe Book</span>
                </Navbar.Brand>
                <Button
                    variant="success"
                    onClick={() => navigate("/create")}
                    className="d-flex align-items-center"
                >
                    <FaPlus className="me-2" />
                    Create Recipe
                </Button>
            </Container>
        </Navbar>
    );
}

function App() {
    return (
        <Router>
            <MealsProvider>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/meal/:id" element={<MealDetailsPage />} />
                    <Route path="/create" element={<MealFormPage />} />
                    <Route path="/edit/:id" element={<MealFormPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </MealsProvider>
        </Router>
    );
}

export default App;
