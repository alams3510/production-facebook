import React, { useContext, useState } from "react";
import Form from "../components/profileForm/Form";
import axiosInstance from "../services/instance";
import { AuthContext } from "../context/AuthContext";
import { enqueueSnackbar } from "notistack";

const ProfileModal = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [updatedDetails, setUpdatedDetails] = useState({
    username: user.username,
    email: user.email,
    city: user.city,
    from: user.from,
    desc: user.desc,
    relationship: user.relationship,
    userId: user._id ? user._id : user.userId,
  });
  const submit = async (e) => {
    e.preventDefault();
    const Id = user._id ? user._id : user.userId;
    const response = await axiosInstance.put("/users/" + Id, updatedDetails);
    dispatch({ type: "DETAILS_UPDATED", payload: response.data });
    // window.location.reload();
    enqueueSnackbar({
      variant: "success",
      message: "Successfully updated Your Details",
    });
  };
  return (
    <div
      className="modal fade"
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Update Your Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={submit}>
            <div className="modal-body">
              <Form
                user={user}
                updatedDetails={updatedDetails}
                setUpdatedDetails={setUpdatedDetails}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                data-bs-dismiss="modal"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
