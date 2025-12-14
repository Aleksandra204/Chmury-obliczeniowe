import { useEffect, useState } from "react";
import { type User } from "../pages/UsersPage";
import { API_URL } from "../api";

type Props = {
    user: User;
    onUpdated: () => void;
};

export default function EditUserForm({ user, onUpdated }: Props) {
    const [diet, setDiet] = useState<string>(user.diet ?? "Basal");
    const [allergens, setAllergens] = useState<string[]>(user.allergens);
    const [availableDiets, setAvailableDiets] = useState<string[]>([]);
    const [availableAllergens, setAvailableAllergens] = useState<string[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/meta/diets`)
            .then(res => res.json())
            .then(setAvailableDiets);

        fetch(`${API_URL}/meta/allergens`)
            .then(res => res.json())
            .then(setAvailableAllergens);
    }, []);

    function toggleAllergen(value: string) {
        setAllergens(prev =>
            prev.includes(value)
                ? prev.filter(a => a !== value)
                : [...prev, value]
        );
    }

    useEffect(() => {
        setDiet(user.diet ?? "Basal");
        setAllergens(user.allergens);
    }, [user]);

    function handleUpdate() {
        fetch(`${API_URL}/users/${user.username}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                diet,
                allergens
            })
        }).then(onUpdated);
    }

    return (
        <div className="form">
            <h3>Edit user: {user.username}</h3>

            <div className="form-group">
                <label>Diet</label>
                <select
                    value={diet}
                    onChange={e => setDiet(e.target.value)}
                >
                    {availableDiets.map(d => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Allergies</label>
                {availableAllergens.map(a => (
                    <label key={a} className="checkbox">
                        <input
                            type="checkbox"
                            checked={allergens.includes(a)}
                            onChange={() => toggleAllergen(a)}
                        />
                        {a}
                    </label>
                ))}
            </div>

            <button className="primary-btn" onClick={handleUpdate}>
                Save changes
            </button>
        </div>
    );
}