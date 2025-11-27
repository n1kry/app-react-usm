import {
    Form,
    Row,
    Col,
    Button,
    Card,
    Badge,
    InputGroup,
} from "react-bootstrap";
import { FaSearch, FaUndo, FaFilter } from "react-icons/fa";

function Filters({
    searchQuery,
    onSearchChange,
    selectedCategories,
    onCategoriesChange,
    selectedAreas,
    onAreasChange,
    onReset,
    availableCategories,
    availableAreas,
    foundCount,
}) {
    const handleCategorySelectChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        onCategoriesChange(selected);
    };

    const handleAreaSelectChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        onAreasChange(selected);
    };

    return (
        <Card className="mb-4 shadow-sm filter-card">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 filter-title">
                        <FaFilter className="me-2" />
                        Filters & Search
                    </h5>
                    <div className="d-flex align-items-center gap-3">
                        <Badge bg="primary" pill className="fs-6 found-badge">
                            Found: {foundCount}
                        </Badge>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onReset}
                            className="reset-btn"
                        >
                            <FaUndo className="me-2" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Search Input */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Search by name or description</Form.Label>
                    <InputGroup>
                        <InputGroup.Text className="input-group-icon">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Enter dish name or ingredient..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>

                <Row>
                    {/* Category Filter */}
                    <Col md={6} className="mb-3">
                        <Form.Label className="fw-bold">Category</Form.Label>
                        <Form.Select
                            multiple
                            value={selectedCategories}
                            onChange={handleCategorySelectChange}
                            className="multi-select"
                            size={6}
                        >
                            {availableCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted d-block mt-2">
                            Hold Ctrl (Cmd on Mac) to select multiple
                        </Form.Text>
                    </Col>

                    {/* Area Filter */}
                    <Col md={6} className="mb-3">
                        <Form.Label className="fw-bold">Cuisine</Form.Label>
                        <Form.Select
                            multiple
                            value={selectedAreas}
                            onChange={handleAreaSelectChange}
                            className="multi-select"
                            size={6}
                        >
                            {availableAreas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted d-block mt-2">
                            Hold Ctrl (Cmd on Mac) to select multiple
                        </Form.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default Filters;
