import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ElmoAvatar from "../assets/avatar_elmo.png";
import DefaultAvatar from "../assets/avatard_3D.png";

const Offer = () => {
  // Récupère l’identifiant de l’annonce depuis l’URL /offers/:id
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://lereacteur-vinted-api.herokuapp.com/offer/" + params.id,
        );
        // Enregistre les données de l'annonce reçues de l'API.
        setData(response.data);
      } catch (error) {
        console.log("Erreur lors du chargement de l'annonce :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Une nouvelle URL /offers/:id recharge les informations correspondantes.
  }, [params.id]);

  return (
    <main className="offer-page-background">
      {isLoading ? (
        <p>Chargement...</p>
      ) : !data._id ? (
        <p>Impossible de charger cette annonce.</p>
      ) : (
        <section className="offer-page">
          {/* Image du produit */}
          <div className="offer-page-image">
            <img
              src={data.product_pictures[0].secure_url}
              alt={data.product_name}
            />
          </div>

          <div className="offer-page-details">
            {/* Prix et caractéristiques */}
            <div className="offer-page-infos">
              <p className="offer-page-price">{data.product_price} €</p>

              <div className="offer-page-characteristics">
                {data.product_details.map((detail, index) => {
                  return (
                    <div key={index}>
                      {Object.entries(detail).map(([name, value]) => {
                        return (
                          <div
                            className="offer-page-characteristic-row"
                            key={name}
                          >
                            <span className="offer-page-characteristic-name">
                              {name}
                            </span>
                            <span className="offer-page-characteristic-value">
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description et vendeur */}
            <div className="offer-page-description">
              <h2>{data.product_name}</h2>
              <p>{data.product_description}</p>

              <div className="offer-page-seller">
                {/* Réutilise le même avatar de secours que sur la Home. */}
                <img
                  src={
                    data.owner.account.avatar
                      ? data.owner.account.avatar.secure_url
                      : data.owner.account.username === "Tev"
                        ? ElmoAvatar
                        : DefaultAvatar
                  }
                  alt={data.owner.account.username}
                />

                <p>{data.owner.account.username}</p>
              </div>

              <button>Acheter</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Offer;
