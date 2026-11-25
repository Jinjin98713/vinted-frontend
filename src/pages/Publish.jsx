import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Publish = ({ token }) => {
  // State qui regroupe les champs texte du formulaire
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    brand: "",
    size: "",
    color: "",
    condition: "",
    city: "",
  });

  const [price, setPrice] = useState("");
  // La checkbox reste dans l'interface ; l'API ne prévoit pas ce champ.
  const [exchangesCheckBox, setExchangesCheckBox] = useState(false);

  // States pour le fichier sélectionné et son aperçu
  const [picture, setPicture] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  // Permet de réinitialiser le champ fichier lorsque la photo est supprimée.
  const [fileInputKey, setFileInputKey] = useState(0);

  const navigate = useNavigate();

  // Fonction commune pour gérer les champs texte
  const formValuesOnChange = (event) => {
    const { name, value } = event.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Récupère la valeur du prix
  const priceOnChange = (event) => {
    const value = event.target.value;
    setPrice(value);
  };

  // Récupère l'état de la checkbox (true ou false)
  const onExchangesCheckBoxChange = (event) => {
    const value = event.target.checked;
    setExchangesCheckBox(value);
  };

  // Récupère le fichier sélectionné
  const pictureOnChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Enregistre le fichier dans le state picture
      setPicture(file);

      // Libère l'ancien aperçu si une autre photo est choisie.
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      // Crée une URL temporaire pour afficher l'image.
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // FormData permet d'envoyer les champs et le fichier en une requête.
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("description", formValues.description);
      formData.append("price", price);
      formData.append("brand", formValues.brand);
      formData.append("size", formValues.size);
      formData.append("color", formValues.color);
      formData.append("condition", formValues.condition);
      formData.append("city", formValues.city);
      formData.append("picture", picture);

      // Le backend reçoit le token dans le header Authorization.
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/offer/publish",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
      // L’API renvoie l’identifiant de l’annonce créée : on affiche sa page.
      if (response.data._id) {
        navigate("/offers/" + response.data._id);
      }
    } catch (error) {
      // Si la requête échoue, affiche le message d'erreur
      console.log("Erreur Axios :", error.message);
    }
  };

  return (
    <div className="publish-background">
      <h1 className="publish-title">Vends ton article</h1>

      {/* Un seul formulaire pour toutes les informations de l'annonce */}
      <form onSubmit={handleSubmit} className="publish-page">
        {/* Section Photos */}
        <div className="publish-section">
          <h2>Photos</h2>

          {/* Permet de sélectionner une image */}

          {/* Permet de sélectionner une image */}
          <input
            key={fileInputKey}
            type="file"
            id="picture"
            className="publish-picture-input"
            accept="image/*"
            onChange={pictureOnChange}
          />

          <label htmlFor="picture" className="publish-picture-label">
            {picture ? "Changer la photo" : "Ajouter une photo"}
          </label>

          {/* Affiche l'aperçu uniquement si une image a été sélectionnée */}
          {picture && (
            <div className="preview-img">
              <img
                className="publish-preview"
                src={imageUrl}
                alt="Aperçu de l'article"
              />

              {/* Supprime l'aperçu sans soumettre le formulaire */}
              <button
                type="button"
                className="delete-images"
                onClick={() => {
                  // Libère l'URL temporaire
                  URL.revokeObjectURL(imageUrl);

                  // Réinitialise les states de l'image
                  setPicture(null);
                  setImageUrl(null);
                  // Recrée l'input pour retirer aussi le nom du fichier sélectionné.
                  setFileInputKey(fileInputKey + 1);
                }}
              >
                X
              </button>
            </div>
          )}
        </div>

        {/* Présentation de l'article */}
        <div className="publish-section">
          <h2>Présentation de ton article</h2>

          <h3>Titre</h3>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Dis aux acheteurs ce que tu vends"
            value={formValues.title}
            onChange={formValuesOnChange}
          />

          <h3>Description</h3>
          <textarea
            name="description"
            id="description"
            placeholder="Ajoute des informations utiles"
            value={formValues.description}
            onChange={formValuesOnChange}
          />
        </div>

        {/* Détails de l'article */}
        <div className="publish-section">
          <h2>Détails de l'article</h2>

          <h3>Marque</h3>
          <input
            type="text"
            name="brand"
            id="brand"
            placeholder="ex : Adidas"
            value={formValues.brand}
            onChange={formValuesOnChange}
          />

          <h3>Taille</h3>
          <input
            type="text"
            name="size"
            id="size"
            placeholder="ex : L / 40 / 12"
            value={formValues.size}
            onChange={formValuesOnChange}
          />

          <h3>Couleur</h3>
          <input
            type="text"
            name="color"
            id="color"
            placeholder="ex : DarkMagenta"
            value={formValues.color}
            onChange={formValuesOnChange}
          />

          <h3>État</h3>
          <input
            type="text"
            name="condition"
            id="condition"
            placeholder="ex : Neuf"
            value={formValues.condition}
            onChange={formValuesOnChange}
          />

          <h3>Lieu</h3>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="ex : Paris"
            value={formValues.city}
            onChange={formValuesOnChange}
          />
        </div>

        {/* Prix et échanges */}
        <div className="publish-section">
          <h2>Prix</h2>

          <h3>Prix de l'article</h3>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="0,00 €"
            min="0"
            value={price}
            onChange={priceOnChange}
          />

          <div className="publish-checkbox">
            <input
              type="checkbox"
              id="checkbox"
              name="checkbox"
              checked={exchangesCheckBox}
              onChange={onExchangesCheckBoxChange}
            />

            <label htmlFor="checkbox">
              Je suis intéressé(e) par les échanges
            </label>
          </div>
        </div>

        {/* Validation du formulaire */}
        <button type="submit" className="publish-submit">
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default Publish;
