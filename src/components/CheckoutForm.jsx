import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

const CheckoutForm = ({ title, price }) => {
  // Permet de communiquer avec Stripe pour confirmer le paiement.
  const stripe = useStripe();

  // Permet d'accéder aux éléments du formulaire de paiement Stripe.
  const elements = useElements();

  // Enregistre les éventuels messages d'erreur.
  const [errorMessage, setErrorMessage] = useState(null);

  // Indique si le paiement a été effectué.
  const [completed, setCompleted] = useState(false);

  // Indique si un paiement est en cours pour désactiver le bouton.
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    // Empêche le rechargement de la page lors de la soumission.
    event.preventDefault();

    // Démarre le chargement et efface l'ancienne erreur éventuelle.
    setIsLoading(true);
    setErrorMessage(null);

    // Vérifie que Stripe et les éléments du formulaire sont disponibles.
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    try {
      // Vérifie les informations renseignées dans le formulaire Stripe.
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message);
        return;
      }

      // Demande à l'API du Réacteur de créer une intention de paiement.
      // Le montant envoyé correspond au prix en euros de l'annonce.
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/v2/payment",
        {
          title: title,
          amount: price,
        },
      );

      // Récupère la valeur nécessaire pour confirmer ce paiement.
      const clientSecret = response.data.client_secret;

      // Demande à Stripe de confirmer le paiement.
      const stripeResponse = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          // Adresse utilisée si Stripe doit rediriger l'utilisateur.
          return_url: "http://localhost:5173/",
        },
        // Évite une redirection lorsque Stripe n'en a pas besoin.
        redirect: "if_required",
      });

      // Affiche une erreur si Stripe refuse ou ne peut pas confirmer le paiement.
      if (stripeResponse.error) {
        setErrorMessage(stripeResponse.error.message);
      } else if (stripeResponse.paymentIntent?.status === "succeeded") {
        // Affiche le message de confirmation si le paiement a réussi.
        setCompleted(true);
      } else {
        // Gère les autres états possibles du paiement.
        setErrorMessage("Le paiement n'a pas encore été confirmé.");
      }
    } catch (error) {
      // Gère notamment les erreurs de l'API ou de communication avec Stripe.
      console.log("Erreur lors du paiement :", error.message);
      setErrorMessage("Une erreur est survenue pendant le paiement.");
    } finally {
      // Réactive le bouton, même en cas d'erreur ou de retour anticipé.
      setIsLoading(false);
    }
  };

  return completed ? (
    <div className="payment-success">
      <h3>Paiement effectué !</h3>
      <p>Ton paiement de test a bien été confirmé par Stripe.</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="checkout-form">
      {/* Affiche les moyens de paiement proposés par Stripe. */}
      <PaymentElement />

      {/* Empêche plusieurs soumissions pendant le paiement. */}
      <button
        className="payment-submit"
        type="submit"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? "Paiement en cours..." : "Payer"}
      </button>

      {/* Affiche un message uniquement lorsqu'une erreur existe. */}
      {errorMessage && <p className="payment-error">{errorMessage}</p>}
    </form>
  );
};

export default CheckoutForm;
