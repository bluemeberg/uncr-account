import "./MintModal.scss";
import loading from "../assets/loading7.svg";
function MintModal(props) {
  return (
    <div className="Modal">
      <div className="modalMintBody">
        Please wait just seconds <br />
        during minting a Agent
        <div className="modalLoading">
          <img src={loading} />
        </div>
      </div>
    </div>
  );
}

export default MintModal;
