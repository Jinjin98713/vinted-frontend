import { Link } from "react-router-dom";
import Logo from "../assets/Vinted_logo.png";
import DefaultAvatar from "../assets/avatar_elmo.png";
import Cookie from "js-cookie";
import { useState } from "react";

const Header = (props) => {
  const { token, setToken, setVisible, setActiveTab, search, setSearch } =
    props;
  //console.log("Recherche :", search);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const searchOnChange = (event) => {
    // Récupère le texte saisi sans déclencher de recherche
    const value = event.target.value;
    setSearchInput(value);
  };

  const handleSearch = (event) => {
    // Empêche le rechargement de la page lors de la soumission
    event.preventDefault();

    // Met à jour le state search dans App.jsx pour lancer la recherche
    setSearch(searchInput);
  };

  return (
    <header>
      <div className="header-container">
        {/* Logo Vinted */}
        <div className="logo-container">
          <Link to="/">
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
                  className="avatar-button"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  <img src={DefaultAvatar} alt="Avatar utilisateur" />
                </button>

                {isMenuOpen && (
                  <div className="user-dropdown">
                    <p>Vends tes articles</p>

                    <button
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
                  onClick={() => {
                    setActiveTab("signup");
                    setVisible(true);
                  }}
                >
                  S'inscrire
                </button>

                <button
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

          <button className="sell-button">Vends tes articles</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
