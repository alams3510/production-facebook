import React from "react";
import { Link } from "react-router-dom";
import "./pageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-heading">404 - Page Not Found</h1>
      <p className="not-found-text">
        Oops! Looks like you've stumbled upon a page that doesn't exist.
      </p>
      <Link to="/" className="not-found-link">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default PageNotFound;
