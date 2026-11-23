import Login from "../components/Login";
import Signup from "../components/Signup";
import { useLocation } from "react-router-dom";

// Réutilise Login et Signup sans réouvrir la modale sur la page /login.
const LoginPage = ({ activeTab, setToken, setVisible, setActiveTab }) => {
  // Lit le paramètre ref_url de /login?ref_url=%2Fpublish.
  const location = useLocation();
  const requestedPage = new URLSearchParams(location.search).get("ref_url");

  // On accepte uniquement cette destination interne pour notre exercice.
  const redirectTo = requestedPage === "/publish" ? "/publish" : null;

  return (
    <main className="login-page">
      <div className="login-page-card">
        <h1>Prêt à vendre ton article ?</h1>

        <p>Connecte-toi ou crée un compte pour publier ton annonce.</p>

        {/* Les onglets changent le formulaire sans ouvrir la modale. */}
        <div className="login-page-tabs">
          <button
            type="button"
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Se connecter
          </button>

          <button
            type="button"
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Créer un compte
          </button>
        </div>
        {activeTab === "login" ? (
          <Login
            setToken={setToken}
            setVisible={setVisible}
            redirectTo={redirectTo}
          />
        ) : (
          <Signup
            setToken={setToken}
            setVisible={setVisible}
            redirectTo={redirectTo}
          />
        )}
      </div>
    </main>
  );
};

export default LoginPage;
