/* eslint-disable react/prop-types */
function Message({ text, sender }) {
  return (
    <div className={`mensajeFinal message ${sender === sessionStorage.getItem("userId") ? "outgoing" : "incoming"}`}>
      <p className="textoMensaje">{text}</p>
    </div>
  );
}

export default Message;
