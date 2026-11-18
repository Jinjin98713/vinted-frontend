import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Offer from "./pages/Offer";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    console.log("useEffect");

    const fetchData = async () => {
      const response = await axios.get(
        "https://lereacteur-vinted-api.herokuapp.com/offers",
      );

      //console.log(response.data); //{count: 32, offers: Array(32)}

      // On récupère le tableau des annonces
      setOffers(response.data.offers);

      // Une fois les données récupérées, on arrête le chargement
      setIsLoading(false);
    };

    fetchData();
    // Le deuxième argument du useEffect est appelé tableau de dépendances !
  }, []);

  return (
    <Router>
      <Header />

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <Routes>
          <Route path="/" element={<Home offers={offers} />} />
          <Route path="/offers/:id" element={<Offer />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
