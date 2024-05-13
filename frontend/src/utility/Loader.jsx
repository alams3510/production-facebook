import React from "react";

const Loader = () => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <div
        style={{ zIndex: 999 }}
        class="spinner-border text-dark d-flex gap-2"
        role="status"
      ></div>
      <span className="fw-bold">Loading...</span>
    </div>
  );
};

export default Loader;
