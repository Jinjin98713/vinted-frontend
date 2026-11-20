import Signup from "./Signup";
import Login from "./Login";
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
        <div className="modal-tabs">
          <button
            type="button"
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => {
              setActiveTab("signup");
            }}
          >
            S'inscrire
          </button>

          <button
            type="button"
            className={activeTab === "login" ? "active" : ""}
            onClick={() => {
              setActiveTab("login");
            }}
          >
            Se connecter
          </button>
        </div>
        {activeTab === "login" ? (
          <>
            <h2>Formulaire de connexion</h2>
            <Login setToken={setToken} setVisible={setVisible} />
          </>
        ) : (
          <Signup setToken={setToken} setVisible={setVisible} />
        )}
      </div>
    </div>
  );
};

export default Modal;
