import "./App.css";
import axios from "axios";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Modal from "./components/Modal";

function App() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Gérer la modal
  const [visible, setVisible] = useState(false);
  //console.log("visible :", visible);

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("login");

  const [token, setToken] = useState(Cookie.get("token") || null);

  useEffect(() => {
    console.log("useEffect");

    const fetchData = async () => {
      const response = await axios.get(
        "https://lereacteur-vinted-api.herokuapp.com/offers?title=" + search,
      );

      //console.log(response.data); //{count: 32, offers: Array(32)}

      // On récupère le tableau des annonces
      setOffers(response.data.offers);

      // Une fois les données récupérées, on arrête le chargement
      setIsLoading(false);
    };

    fetchData();
    // Le deuxième argument du useEffect est appelé tableau de dépendances !
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

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des annonces...</p>
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home offers={offers} />} />
            <Route path="/offers/:id" element={<Offer />} />
          </Routes>
          {visible && (
            <Modal
              setVisible={setVisible}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setToken={setToken}
            />
          )}
        </>
      )}
    </Router>
  );
}

export default App;
