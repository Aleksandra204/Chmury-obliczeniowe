import { useEffect, useState } from "react";
import CreateUserForm from "../forms/CreateUserForm";
import EditUserForm from "../forms/EditUserForm";
import Modal from "../components/Modal";
import UserAnalysis from "../components/UserPreferences";
import "../styles/users.css";
import { UserRound, Plus, Pencil, Trash2 } from "lucide-react";
import { API_URL } from "../api";

export type User = {
    username: string;
    diet: string | null;
    allergens: string[];
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [activeUser, setActiveUser] = useState<User | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    function reloadUsers(): Promise<User[]> {
        return fetch(`${API_URL}/users`)
            .then(res => res.json())
            .then((data: User[]) => {
                setUsers(data);
                return data;
            });
    }

    useEffect(() => {
        reloadUsers();
    }, []);

    return (
        <div>
            <h2 className="section-title">Users</h2>

            <div className="users-layout">
                <div className="users-sidebar">

                    <button
                        className="primary-btn add-user-btn btn-with-icon"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={16} />
                        Add user
                    </button>

                    <div className="sidebar-divider" />

                    {users.map(u => (
                        <div
                            key={u.username}
                            className={`user-item ${activeUser?.username === u.username ? "active" : ""}`}
                            onClick={() => setActiveUser(u)}
                        >
                            <div className="user-label">
                                <span className="user-avatar">
                                    <UserRound size={16} />
                                </span>
                                <span className="username">{u.username}</span>
                            </div>

                            <div className="user-actions">
                                <button
                                    className="icon-btn icon-edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setUserToEdit(u);
                                        setShowEditModal(true);
                                    }}
                                >
                                    <Pencil size={14} />
                                </button>

                                <button
                                    className="icon-btn icon-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fetch(`${API_URL}/users/${u.username}`, {
                                            method: "DELETE"
                                        }).then(() => {
                                            reloadUsers();
                                            if (activeUser?.username === u.username) {
                                                setActiveUser(null);
                                            }
                                        });
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>

                            </div>
                        </div>
                    ))}
                </div>

                <div className="users-content">
                    {activeUser ? (
                        <UserAnalysis user={activeUser} />
                    ) : (
                        <p style={{ color: "#6b7280" }}>
                            Select user to see details
                        </p>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <Modal onClose={() => setShowCreateModal(false)}>
                    <CreateUserForm
                        onCreated={() => {
                            setShowCreateModal(false);
                            reloadUsers();
                        }}
                    />
                </Modal>
            )}

            {showEditModal && userToEdit && (
                <Modal onClose={() => {
                    setShowEditModal(false);
                    setUserToEdit(null);
                }}>
                    <EditUserForm
                        user={userToEdit}
                        onUpdated={async () => {
                            setShowEditModal(false);
                            setUserToEdit(null);

                            const updatedUsers = await reloadUsers();

                            if (activeUser) {
                                const refreshedActiveUser = updatedUsers.find(
                                    u => u.username === activeUser.username
                                );

                                setActiveUser(refreshedActiveUser ?? null);
                            }
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}