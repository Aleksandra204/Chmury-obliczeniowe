import { useState } from "react";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";

type Tab = "products" | "users";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div>
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Shopping Assistant</h1>
        </div>
      </header>

      <div className="app-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>

          <button
            className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        {activeTab === "products" && <ProductsPage />}
        {activeTab === "users" && <UsersPage />}
      </div>
    </div>
  );
}

export default App;