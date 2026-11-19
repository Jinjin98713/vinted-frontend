import { Link } from "react-router-dom";
import Logo from "../assets/Vinted_logo.png";
import Cookie from "js-cookie";

const Header = (props) => {
  const { token, setToken, setVisible, activeTab, setActiveTab } = props;
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
        <div className="search-container">
          <input
            type="search"
            name="search_text"
            id="search_text"
            placeholder="Rechercher des articles"
          />
        </div>

        {/* Boutons du compte */}
        <div className="header-buttons">
          <div className="account-buttons">
            {token ? (
              <button
                onClick={() => {
                  //je change l'état du token à false
                  setToken(null);
                  //je supprime le token
                  Cookie.remove("token");
                }}
              >
                Se déconnecter
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    //console.log("Clic sur S'inscrire"); ok
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
