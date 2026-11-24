import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

// Le même formulaire sert à la modale et à la page de connexion.
const Signup = ({ setToken, setVisible, redirectTo = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // States pour stocker les informations saisies dans le formulaire
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  /* Gestion de la validation du formulaire */
  const handleSubmit = async (event) => {
    // Empêche le rechargement de la page lors de la soumission
    event.preventDefault();

    try {
      // Envoie les données du formulaire à l'API avec une requête POST
      // await attend la réponse du serveur avant de continuer
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/signup",
        {
          email: email,
          username: username,
          password: password,
          newsletter: newsletter,
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

      // Après inscription, revient vers la page demandée avec les données de l'annonce.
      if (redirectTo) {
        navigate(redirectTo, {
          replace: true,
          state: location.state,
        });
      }
    } catch (error) {
      // Si la requête échoue, affiche le message d'erreur
      console.log("Réponse du serveur :", error.response?.data);
      // L'API peut par exemple signaler des champs manquants.
    }
  };

  /* Gestion des changements dans les champs du formulaire */

  // Récupère le pseudo saisi et met à jour le state username
  const onUserNameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
  };

  // Récupère l'email saisi et met à jour le state email
  const onEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  // Récupère le mot de passe saisi et met à jour le state password
  const onPasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  // Récupère l'état de la checkbox (true ou false)
  const onNewsletterChange = (event) => {
    const value = event.target.checked;
    setNewsletter(value);
  };

  /* Affichage du formulaire d'inscription */
  return (
    <div>
      <h2>S'inscrire</h2>

      {/* Déclenche handleSubmit lors de la soumission */}
      <form onSubmit={handleSubmit}>
        {/* Champ pseudo */}
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={onUserNameChange}
        />

        {/* Champ email */}
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
        />

        {/* Champ mot de passe */}
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          value={password}
          onChange={onPasswordChange}
        />

        <div>
          {/* Newsletter : checked dépend du state newsletter */}
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={newsletter}
            onChange={onNewsletterChange}
          />
          <label htmlFor="newsletter">S'inscrire à notre newsletter</label>

          <p>
            En m'inscrivant je confirme avoir lu et accepté les Termes &
            Conditions et Politique de Confidentialité de Vinted. Je confirme
            avoir au moins 18 ans.
          </p>
        </div>

        {/* Déclenche la soumission du formulaire */}
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Signup;
