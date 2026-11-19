import Signup from "./Signup";
const Modal = ({ setVisible, activeTab, setActiveTab, setToken }) => {
  return (
    <div
      className="modal-root"
      onClick={() => {
        setVisible(false);
      }}
    >
      <div
        className="modal"
        onClick={(event) => {
          //évite de fermer la modal au clic dans le cadre blanc
          event.stopPropagation();
        }}
      >
        <button
          onClick={() => {
            setActiveTab("signup");
          }}
        >
          S'inscrire
        </button>
        <button
          onClick={() => {
            setActiveTab("login");
          }}
        >
          Se connecter
        </button>
        {activeTab === "login" ? (
          <h2>Formulaire de connexion</h2>
        ) : (
          <Signup setToken={setToken} setVisible={setVisible} />
        )}
      </div>
    </div>
  );
};

export default Modal;
