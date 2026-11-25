import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ElmoAvatar from "../assets/avatar_elmo.png";
import DefaultAvatar from "../assets/avatard_3D.png";
import Pagination from "../components/Pagination";

const Home = ({
  offers,
  search,
  priceMin,
  priceMax,
  sort,
  updateFilters,
  count,
  page,
  limit,
  changePage,
}) => {
  // Valeurs saisies dans le formulaire des filtres.
  const [minInput, setMinInput] = useState(priceMin);
  const [maxInput, setMaxInput] = useState(priceMax);
  const [sortInput, setSortInput] = useState(sort);

  // Met les champs à jour lors de la navigation dans l'historique.
  useEffect(() => {
    setMinInput(priceMin);
    setMaxInput(priceMax);
    setSortInput(sort);
  }, [priceMin, priceMax, sort]);

  const handleFilters = (event) => {
    event.preventDefault();

    updateFilters(minInput, maxInput, sortInput);
  };

  const handleReset = () => {
    setMinInput("");
    setMaxInput("");
    setSortInput("");

    updateFilters("", "", "");
  };

  return (
    <main>
      {/* Affiche la bannière uniquement lorsqu'aucune recherche n'est active */}
      {!search && (
        <section className="hero">
          <h1>Prêts à faire du tri dans vos placards ?</h1>
        </section>
      )}

      <section className="home-offers">
        <h2>Annonces récentes</h2>

        {/* Filtres de prix et tri des annonces */}
        <form className="home-filters" onSubmit={handleFilters}>
          <div className="home-filter-field">
            <label htmlFor="price-min">Prix minimum</label>
            <input
              id="price-min"
              type="number"
              min="0"
              step="0.01"
              placeholder="Min €"
              value={minInput}
              onChange={(event) => setMinInput(event.target.value)}
            />
          </div>

          <div className="home-filter-field">
            <label htmlFor="price-max">Prix maximum</label>
            <input
              id="price-max"
              type="number"
              min="0"
              step="0.01"
              placeholder="Max €"
              value={maxInput}
              onChange={(event) => setMaxInput(event.target.value)}
            />
          </div>

          <div className="home-filter-field">
            <label htmlFor="price-sort">Trier par prix</label>
            <select
              id="price-sort"
              value={sortInput}
              onChange={(event) => setSortInput(event.target.value)}
            >
              <option value="">Sans tri</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <button type="submit" className="home-filter-submit">
            Appliquer
          </button>

          <button
            type="button"
            className="home-filter-reset"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
        </form>

        <p className="home-results-count">
          {count} annonce{count > 1 ? "s" : ""} trouvée{count > 1 ? "s" : ""}
        </p>

        <div className="offers-container">
          {offers.map((offer) => {
            // Recherche la marque et la taille parmi les caractéristiques.
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
                      {/* Avatar du vendeur, sinon image de secours selon son pseudo. */}
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

        {offers.length === 0 && (
          <p className="home-no-results">
            Aucune annonce ne correspond à ta recherche.
          </p>
        )}

        {/* Navigation entre les pages */}
        <Pagination
          count={count}
          page={page}
          limit={limit}
          changePage={changePage}
        />
      </section>
    </main>
  );
};

export default Home;
