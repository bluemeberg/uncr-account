import "./ModalBody.scss";

function MintBody(props) {
  function closeModal() {
    props.closeModal();
  }

  return (
    <div className="ModalBody">
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        <button id="modalCloseBtn" onClick={closeModal}>
          ✖
        </button>
        {props.children}
      </div>
    </div>
  );
}

export default MintBody;
