import React from "react";
import "./profileForm.css";

const Form = ({ setUpdatedDetails, updatedDetails }) => {
  const handleChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="rowAlign">
        <label htmlFor="username" className="form-label">
          User Name
        </label>
        <input
          disabled
          value={updatedDetails.username}
          onChange={handleChange}
          name="username"
          id="username"
          placeholder="username"
          className="form-control"
        />
      </div>

      <div className="rowAlign">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          value={updatedDetails.email}
          onChange={handleChange}
          name="email"
          id="email"
          placeholder="email"
          className="form-control"
        />
      </div>
      <div className="rowAlign">
        <label htmlFor="city" className="form-label">
          City
        </label>
        <input
          value={updatedDetails.city}
          onChange={handleChange}
          name="city"
          id="city"
          placeholder="city"
          className="form-control"
        />
      </div>
      <div className="rowAlign">
        <label htmlFor="from" className="form-label">
          Locality
        </label>
        <input
          value={updatedDetails.from}
          onChange={handleChange}
          name="from"
          id="from"
          placeholder="locality"
          className="form-control"
        />
      </div>
      <div className="rowAlign">
        <label htmlFor="relationship" className="form-label">
          RelationShip
        </label>
        <select
          placeholder="relationship"
          onChange={handleChange}
          name="relationship"
          id="relationship"
          value={updatedDetails.relationship}
        >
          <option value="1">Single</option>
          <option value="2">InRelationship</option>
          <option value="3">Complex</option>
        </select>
      </div>

      <div className="rowAlign">
        <label htmlFor="desc" className="form-label">
          Description
        </label>
        <textarea
          value={updatedDetails.desc}
          onChange={handleChange}
          name="desc"
          id="desc"
          rows="4"
          cols="35"
          placeholder="description"
        />
      </div>
    </div>
  );
};

export default Form;
