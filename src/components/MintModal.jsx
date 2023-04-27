import "./MintModal.scss";
import loading from "../assets/loading7.svg";
import { useEffect } from "react";
function MintModal(props) {
  return (
    <div className="Modal">
      <div className="modalMintBody">
        Please wait just few seconds <br />
        during creating an account.
        <div className="modalLoading">
          <img src={loading} />
        </div>
      </div>
    </div>
  );
}

export default MintModal;
