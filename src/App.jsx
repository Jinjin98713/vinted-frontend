import "./App.css";
import axios from "axios";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Modal from "./components/Modal";
import Publish from "./pages/Publish";
import LoginPage from "./pages/LoginPage";
import Payment from "./pages/Payment";

function AppContent() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  // Affiche ou masque la modale de connexion / inscription.
  const [visible, setVisible] = useState(false);

  // Récupère les filtres présents dans l'URL.
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("title") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const sort = searchParams.get("sort") || "";

  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = 20;

  // Détermine si Login ou Signup est visible, dans la modale et sur /login.
  const [activeTab, setActiveTab] = useState("login");

  // Initialise la session React avec le token enregistré dans les cookies.
  const [token, setToken] = useState(Cookie.get("token") || null);

  // Texte validé dans le Header : déclenche le chargement des annonces filtrées.
  const setSearch = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("title", value);
    } else {
      params.delete("title");
    }

    params.delete("page");
    setSearchParams(params);
  };

  // Met à jour les filtres de prix et le tri.
  const updateFilters = (newPriceMin, newPriceMax, newSort) => {
    const params = new URLSearchParams(searchParams);

    if (newPriceMin !== "") {
      params.set("priceMin", newPriceMin);
    } else {
      params.delete("priceMin");
    }

    if (newPriceMax !== "") {
      params.set("priceMax", newPriceMax);
    } else {
      params.delete("priceMax");
    }

    if (newSort) {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }

    params.delete("page");
    setSearchParams(params);
  };

  // Change de page en conservant les filtres.
  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams);

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    setSearchParams(params);
  };

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchData = async () => {
      // Une nouvelle recherche déclenche un nouvel affichage de chargement.
      setIsLoading(true);

      try {
        const params = {
          page: page,
          limit: limit,
        };

        if (search) {
          params.title = search;
        }

        if (priceMin !== "") {
          params.priceMin = priceMin;
        }

        if (priceMax !== "") {
          params.priceMax = priceMax;
        }

        if (sort) {
          params.sort = sort;
        }

        // Récupère les annonces correspondant aux filtres.
        const response = await axios.get(
          "https://lereacteur-vinted-api.herokuapp.com/offers",
          { params: params },
        );

        // Le backend renvoie notamment { count, offers }.
        if (isCurrentRequest) {
          setOffers(response.data.offers);
          setCount(response.data.count);
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.log(
            "Erreur lors du chargement des annonces :",
            error.message,
          );
          setOffers([]);
          setCount(0);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Ignore les résultats d'une ancienne recherche.
    return () => {
      isCurrentRequest = false;
    };
  }, [search, priceMin, priceMax, sort, page]);

  return (
    <>
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
              <Home
                offers={offers}
                search={search}
                priceMin={priceMin}
                priceMax={priceMax}
                sort={sort}
                updateFilters={updateFilters}
                count={count}
                page={page}
                limit={limit}
                changePage={changePage}
              />
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

        <Route
          path="/payment"
          element={
            token ? (
              <Payment />
            ) : (
              <Navigate to="/login?ref_url=%2Fpayment" replace />
            )
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
