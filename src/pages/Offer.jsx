import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Offer = () => {
  // Récupérer l'identifiant ici
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    console.log("useEffect");

    const fetchData = async () => {
      const response = await axios.get(
        "https://lereacteur-vinted-api.herokuapp.com/offer/" + params.id,
      );

      console.log(response.data);

      // On récupère les informations de l'annonce
      setData(response.data);

      // Une fois les données récupérées, on arrête le chargement
      setIsLoading(false);
    };

    fetchData();
    // Le deuxième argument du useEffect est appelé tableau de dépendances !
  }, [params.id]);

  return (
    <main className="offer-page-background">
      {isLoading ? (
        <p>Chargement...</p>
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
                <img
                  src={data.owner.account.avatar.secure_url}
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
