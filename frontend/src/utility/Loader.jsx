import React from "react";

const Loader = () => {
  return (
    <>
      <div
        style={{
          backgroundColor: "green",
          width: "300px",
          padding: "10px 20px",
          position: "fixed",
          top: 55,
          right: 0,
          left: 0,
          margin: "0px auto",
          zIndex: 999,
        }}
      >
        <h2 style={{ textAlign: "center", color: "white" }}>
          Loading Please wait....
        </h2>
      </div>
    </>
  );
};

export default Loader;
