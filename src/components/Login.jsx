import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

// redirectTo est fourni uniquement depuis LoginPage ; la modale conserve
// ainsi son comportement de fermeture sans changer de page.
const Login = ({ setToken, setVisible, redirectTo = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Gestion de la validation du formulaire */
  const handleSubmit = async (event) => {
    // Empêche le rechargement de la page lors de la soumission
    event.preventDefault();

    try {
      // Envoie les données du formulaire à l'API avec une requête POST
      // await attend la réponse du serveur avant de continuer
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/login",
        {
          email: email,
          password: password,
        },
      );

      // Récupère le token renvoyé par l'API
      const token = response.data.token;

      // Enregistre le token dans un cookie pendant 7 jours
      Cookie.set("token", token, { expires: 7 });

      // Met à jour le state token dans App.jsx
      // Le Header pourra alors afficher l'état connecté
      setToken(token);

      // Ferme la modale si elle est ouverte.
      setVisible(false);

      // Après connexion, redirige vers la page demandée en conservant les données transmises.
      if (redirectTo) {
        navigate(redirectTo, {
          replace: true,
          state: location.state,
        });
      }
    } catch (error) {
      // Si la requête échoue, affiche le message d'erreur
      console.log("Erreur Axios :", error.message);
    }
  };

  const emailOnChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const passwordOnChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={emailOnChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          id="password"
          value={password}
          onChange={passwordOnChange}
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
