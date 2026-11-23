import "./App.css";
import axios from "axios";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Modal from "./components/Modal";
import Publish from "./pages/Publish";
import LoginPage from "./pages/LoginPage";

function App() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Affiche ou masque la modale de connexion / inscription.
  const [visible, setVisible] = useState(false);

  // Texte validé dans le Header : déclenche le chargement des annonces filtrées.
  const [search, setSearch] = useState("");

  // Détermine si Login ou Signup est visible, dans la modale et sur /login.
  const [activeTab, setActiveTab] = useState("login");

  // Initialise la session React avec le token enregistré dans les cookies.
  const [token, setToken] = useState(Cookie.get("token") || null);

  useEffect(() => {
    const fetchData = async () => {
      // Une nouvelle recherche déclenche un nouvel affichage de chargement.
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://lereacteur-vinted-api.herokuapp.com/offers?title=" +
            encodeURIComponent(search),
        );
        // Le backend renvoie notamment { count, offers }.
        setOffers(response.data.offers);
      } catch (error) {
        console.log("Erreur lors du chargement des annonces :", error.message);
        setOffers([]);
      } finally {
        // Arrête le chargement aussi si l'API est indisponible.
        setIsLoading(false);
      }
    };

    fetchData();
    // Le tableau [search] relance la récupération à chaque recherche validée.
  }, [search]);

  return (
    <Router>
      <Header
        token={token}
        setToken={setToken}
        setVisible={setVisible}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        search={search}
        setSearch={setSearch}
      />

      {/* Les routes restent disponibles même pendant le chargement des annonces. */}
      <Routes>
        <Route
          path="/"
          element={
            isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Chargement des annonces...</p>
              </div>
            ) : (
              <Home offers={offers} search={search} />
            )
          }
        />
        <Route path="/offers/:id" element={<Offer />} />

        {/* Le formulaire est réservé aux utilisateurs avec un token. */}
        <Route
          path="/publish"
          element={
            token ? (
              <Publish token={token} />
            ) : (
              <Navigate to="/login?ref_url=%2Fpublish" replace />
            )
          }
        />

        {/* Réutilise les formulaires Login / Signup dans une page dédiée. */}
        <Route
          path="/login"
          element={
            <LoginPage
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setToken={setToken}
              setVisible={setVisible}
            />
          }
        />
      </Routes>

      {/* Les boutons du Header peuvent toujours ouvrir la modale. */}
      {visible && (
        <Modal
          setVisible={setVisible}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setToken={setToken}
        />
      )}
    </Router>
  );
}

export default App;
