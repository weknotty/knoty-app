const ConnectionImage = ({ state }) => {
    if (!state) {
      return <img src="/assets/icons/waitingForPartner.svg" className="col" height="15" />;
    }
    if (state === "approved") {
      return <img src="/assets/icons/partnerApprove.svg" className="col" height="15" />;
    }
    if (state === "pending") {
      return <img src="/assets/icons/partnerApprove.svg" style={{ transform: "rotateY(180deg)" }} className="col" height="15" />;
    }
  };

  export default ConnectionImage