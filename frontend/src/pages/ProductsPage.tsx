import { useEffect, useState } from "react";
import { API_URL } from "../api";

type ProductOverview = {
    product: string;
    price: number;
    ingredients: string[];
    okForDiets: string[];
    notOkForDiets: string[];
    allergens: string[];
};

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductOverview[]>([]);
    const [diet, setDiet] = useState<string | null>(null);
    const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
    const [availableDiets, setAvailableDiets] = useState<string[]>([]);
    const [availableAllergens, setAvailableAllergens] = useState<string[]>([]);
    const [excludedAllergen, setExcludedAllergen] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/meta/diets`)
            .then(res => res.json())
            .then(setAvailableDiets);

        fetch(`${API_URL}/meta/allergens`)
            .then(res => res.json())
            .then(setAvailableAllergens);
    }, []);

    function toggle(productName: string) {
        setExpandedProducts(prev =>
            prev.includes(productName)
                ? prev.filter(p => p !== productName)
                : [...prev, productName]
        );
    }

    function loadProducts() {
        const params = new URLSearchParams();

        if (diet) params.append("diet", diet);
        if (excludedAllergen) {
            params.append("excludeAllergen", excludedAllergen);
        }

        const url = `${API_URL}/products` + (params.toString() ? `?${params.toString()}` : "");

        fetch(url)
            .then(res => res.json())
            .then(data => setProducts(data));
    }

    useEffect(() => {
        loadProducts();
    }, [diet, excludedAllergen]);

    return (
        <div>
            <h2 className="section-title">Products</h2>

            <div className="product-filters">

                <div className="form-group">
                    <label>Diet</label>
                    <select
                        value={diet ?? ""}
                        onChange={e => setDiet(e.target.value || null)}
                    >
                        {availableDiets.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Exclude allergen</label>
                    <select
                        value={excludedAllergen ?? ""}
                        onChange={e => setExcludedAllergen(e.target.value || null)}
                    >
                        <option value="">None</option>
                        {availableAllergens.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>

            </div>

            {products.map(p => {
                const isExpanded = expandedProducts.includes(p.product);

                return (
                    <div key={p.product} className="card">
                        <div
                            className="card-header"
                            onClick={() => toggle(p.product)}
                        >
                            <div>
                                <div className="card-title">{p.product}</div>
                                <div className="card-price">{p.price} zł</div>
                            </div>

                            <div className="card-subtitle">
                                Click for details
                            </div>

                        </div>

                        {isExpanded && (
                            <div className="card-details">
                                <p>
                                    <strong>Ingredients:</strong>{" "}
                                    {p.ingredients?.length ? p.ingredients.join(", ") : "none"}
                                </p>

                                <p>
                                    <strong>Compatible diets:</strong>{" "}
                                    {p.okForDiets?.length ? p.okForDiets.join(", ") : "none"}
                                </p>

                                <p>
                                    <strong>Not compatible diets:</strong>{" "}
                                    {p.notOkForDiets?.length ? p.notOkForDiets.join(", ") : "none"}
                                </p>

                                <p>
                                    <strong>Allergens:</strong>{" "}
                                    {p.allergens?.length ? p.allergens.join(", ") : "none"}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}