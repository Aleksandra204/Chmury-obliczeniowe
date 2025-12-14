import { useState, useEffect } from "react";
import { API_URL } from "../api";

type Props = {
    onCreated: () => void;
};

export default function CreateUserForm({ onCreated }: Props) {
    const [username, setUsername] = useState("");
    const [diet, setDiet] = useState<string>("Basal");
    const [allergens, setAllergens] = useState<string[]>([]);
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

    function handleCreate() {
        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                diet,
                allergens
            })
        }).then(() => {
            setUsername("");
            setDiet("Basal");
            setAllergens([]);
            onCreated();
        });
    }

    return (
        <div className="form">
            <h3>Add new user</h3>

            <div className="form-group">
                <label>Username</label>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Diet</label>
                <select value={diet} onChange={e => setDiet(e.target.value)}>
                    {availableDiets.map(d => (
                        <option key={d} value={d}>{d}</option>
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

            <button className="primary-btn" onClick={handleCreate}>
                Add user
            </button>
        </div>
    );
}