import { useEffect, useState } from "react";
import { type User } from "../pages/UsersPage";
import { CheckCircle, XCircle, UserRound } from "lucide-react";
import { API_URL } from "../api";

type Conflict = {
  type: "DIET" | "ALLERGEN";
  diet?: string;
  allergen?: string;
  ingredient: string;
  category?: string;
};

type ProductAnalysis = {
  product: string;
  price: number;
  safe: boolean;
  reasons: Conflict[];
};

type Props = {
  user: User;
};

export default function UserPreferences({ user }: Props) {
  const [products, setProducts] = useState<ProductAnalysis[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  useEffect(() => {
    setExpandedProducts([]);
  }, [user.username]);

  function toggle(productName: string) {
    setExpandedProducts(prev =>
      prev.includes(productName)
        ? prev.filter(p => p !== productName)
        : [...prev, productName]
    );
  }

  useEffect(() => {
    fetch(`${API_URL}/products/analysis/${user.username}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [user]);

  const safeProducts = products.filter(p => p.safe);
  const unsafeProducts = products.filter(p => !p.safe);

  return (
    <div className="user-preferences">
      <h3 className="user-header">
        <span className="user-avatar">
          <UserRound size={16} />
        </span>
        <span className="user-name">{user.username}</span>
      </h3>

      <p>
        <strong>Diet:</strong> {user.diet ?? "none"}
      </p>

      <p>
        <strong>Allergies:</strong>{" "}
        {user.allergens.length ? user.allergens.join(", ") : "none"}
      </p>

      <h4 className="section-title">
        <CheckCircle size={18} className="icon-safe" />
        Safe products
      </h4>
      {safeProducts.map(p => (
        <div key={p.product} className="card">
          <div className="card-header" onClick={() => toggle(p.product)}>
            <div>
              <div className="card-title">{p.product}</div>
              <div className="card-price">{p.price} zł</div>
            </div>
            <div className="badge badge-safe">SAFE</div>
          </div>

          {expandedProducts.includes(p.product) && (
            <div className="card-details">
              Compatible with selected diet and allergies.
            </div>
          )}
        </div>
      ))}

      <h4 className="section-title">
        <XCircle size={18} className="icon-unsafe" />
        Unsafe products
      </h4>
      {unsafeProducts.map(p => (
        <div key={p.product} className="card">
          <div className="card-header" onClick={() => toggle(p.product)}>
            <div>
              <div className="card-title">{p.product}</div>
              <div className="card-price">{p.price} zł</div>
            </div>
            <div className="badge badge-unsafe">UNSAFE</div>
          </div>

          {expandedProducts.includes(p.product) && (
            <div className="card-details">
              <ul>
                {p.reasons.map((r, i) => (
                  <li key={i}>
                    {r.type === "ALLERGEN" && (
                      <>
                        Contains allergen <strong>{r.allergen}</strong>
                        (ingredient: {r.ingredient})
                      </>
                    )}
                    {r.type === "DIET" && (
                      <>
                        Not compatible with diet <strong>{r.diet}</strong>
                        (category: {r.category})
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}