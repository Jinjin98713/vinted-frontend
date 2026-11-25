import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Vinted_logo.png";
import DefaultAvatar from "../assets/avatar_elmo.png"; // Avatar affiché dans le Header connecté
import Cookie from "js-cookie";
import { useState, useEffect } from "react";

const Header = (props) => {
  const { token, setToken, setVisible, setActiveTab, search, setSearch } =
    props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Texte saisi localement : la recherche ne part qu'à la validation du formulaire.
  const [searchInput, setSearchInput] = useState(search);

  // Synchronise le champ avec les paramètres de l'URL.
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const searchOnChange = (event) => {
    // Récupère le texte saisi
    const value = event.target.value;

    // Met à jour le texte affiché dans l'input
    setSearchInput(value);

    // Si le champ est vidé, réinitialise les résultats
    if (value === "") {
      setSearch("");
    }
  };

  const handleSearch = (event) => {
    // Empêche le rechargement de la page lors de la soumission
    event.preventDefault();

    // Lance la recherche et affiche les résultats sur la Home.
    if (location.pathname !== "/") {
      const params = new URLSearchParams(location.search);

      if (searchInput) {
        params.set("title", searchInput);
      } else {
        params.delete("title");
      }

      params.delete("page");
      navigate("/?" + params.toString());
    } else {
      setSearch(searchInput);
    }
  };

  return (
    <header>
      <div className="header-container">
        {/* Logo Vinted */}
        <div className="logo-container">
          <Link
            to="/"
            onClick={() => {
              // Réinitialise le champ de recherche et les résultats.
              setSearchInput("");
            }}
          >
            <img src={Logo} alt="Logo Vinted" />
          </Link>
        </div>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="search"
            name="search_text"
            id="search_text"
            placeholder="Rechercher des articles"
            value={searchInput}
            onChange={searchOnChange}
          />
        </form>

        {/* Boutons du compte */}
        <div className="header-buttons">
          <div
            className={token ? "account-buttons connected" : "account-buttons"}
          >
            {token ? (
              <div className="user-menu">
                <button
                  type="button"
                  className="avatar-button"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  <img src={DefaultAvatar} alt="Avatar utilisateur" />
                </button>

                {isMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/publish" onClick={() => setIsMenuOpen(false)}>
                      Vends tes articles
                    </Link>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => {
                        setToken(null);
                        Cookie.remove("token");
                        setIsMenuOpen(false);
                      }}
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setVisible(true);
                  }}
                >
                  S'inscrire
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setVisible(true);
                  }}
                >
                  Se connecter
                </button>
              </>
            )}
          </div>

          {token ? (
            <Link to="/publish" className="sell-button">
              Vends tes articles
            </Link>
          ) : (
            // La page /login mémorise qu'on souhaite accéder à /publish.
            <Link
              to="/login?ref_url=%2Fpublish"
              className="sell-button"
              onClick={() => setActiveTab("login")}
            >
              Vends tes articles
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
