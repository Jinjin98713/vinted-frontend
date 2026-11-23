import { Link } from "react-router-dom";
import ElmoAvatar from "../assets/avatar_elmo.png";
import DefaultAvatar from "../assets/avatard_3D.png";

const Home = ({ offers }) => {
  return (
    <main>
      <section className="hero">
        <h1>Prêts à faire du tri dans vos placards ?</h1>
      </section>

      <section className="home-offers">
        <h2>Annonces récentes</h2>
        <div className="offers-container">
          {offers.map((offer) => {
            const brand = offer.product_details.find((detail) => {
              return detail.MARQUE;
            });
            const size = offer.product_details.find((detail) => {
              return detail.TAILLE;
            });
            return (
              <Link to={"/offers/" + offer._id} key={offer._id}>
                <article className="offer-card">
                  <div className="offer-seller">
                    <p>
                      <img
                        src={
                          offer.owner.account.avatar
                            ? offer.owner.account.avatar.secure_url
                            : offer.owner.account.username === "Tev"
                              ? ElmoAvatar
                              : DefaultAvatar
                        }
                        alt={offer.owner.account.username}
                      />
                    </p>
                    <p>{offer.owner.account.username}</p>
                  </div>

                  <div className="offer-image">
                    <img
                      src={offer.product_pictures[0].secure_url}
                      alt={offer.product_name}
                    />
                  </div>

                  <div className="offer-details">
                    <p>{offer.product_name}</p>
                    <p>{size && size.TAILLE}</p>
                    <p>{brand && brand.MARQUE}</p>
                    <p>{offer.product_price} €</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Home;
