import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

// Initialise Stripe avec la clé publique de test fournie par Le Réacteur.
// Cette déclaration reste en dehors du composant pour éviter de la recréer.
const stripePromise = loadStripe(
  "pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP",
);

const Payment = () => {
  // Récupère les informations de l'annonce transmises depuis Offer.jsx.
  const location = useLocation();
  const { title, price } = location.state || {};

  // Empêche d'afficher le paiement si les données sont absentes ou invalides.
  if (!title || !Number.isFinite(Number(price)) || Number(price) <= 0) {
    return <p>Aucune annonce valide sélectionnée pour le paiement.</p>;
  }

  // Configure Stripe avec le montant en centimes et la devise en euros.
  const options = {
    mode: "payment",
    amount: Math.round(Number(price) * 100),
    currency: "eur",

    // Permet de personnaliser l'apparence du formulaire Stripe.
    appearance: {
      /*...*/
    },
  };

  return (
    <main className="payment-page-background">
      <div className="payment-page">
        <h1>Finaliser ta commande</h1>
        <p className="payment-page-intro">
          Vérifie le récapitulatif de ton achat avant de procéder au paiement.
        </p>

        <div className="payment-page-content">
          {/* Les champs bancaires sont entièrement gérés par Stripe. */}
          <section className="payment-form-section">
            <h2>Paiement sécurisé</h2>
            <p>Choisis ton moyen de paiement puis valide ta commande.</p>

            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm title={title} price={Number(price)} />
            </Elements>
          </section>

          {/* Récapitulatif de l'annonce transmise depuis Offer.jsx. */}
          <section className="payment-summary-section">
            <h2>Récapitulatif de la commande</h2>
            <p className="payment-summary-label">Article</p>
            <p className="payment-summary-title">{title}</p>
            <div className="payment-summary-price">
              <span>Prix de l'article</span>
              <span>{Number(price).toFixed(2)} €</span>
            </div>
            <div className="payment-summary-total">
              <span>Total à payer</span>
              <span>{Number(price).toFixed(2)} €</span>
            </div>
            <p className="payment-summary-note">
              Paiement de test réalisé avec Stripe. Aucun achat réel n'est
              débité.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Payment;
