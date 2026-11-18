import { Link } from "react-router-dom";
import Logo from "../assets/Vinted_logo.png";

const Header = () => {
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
            <button>S'inscrire</button>
            <button>Se connecter</button>
          </div>

          <button className="sell-button">Vends tes articles</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
