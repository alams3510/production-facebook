import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../services/instance";
import { enqueueSnackbar } from "notistack";

const PasswordUpdateModal = () => {
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const { user, dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setPasswords((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOADER", payload: true });
    try {
      await axiosInstance.put("/users/" + user._id + "/updatePassword", {
        passwords,
      });
      setPasswordModal(false);
      dispatch({ type: "LOADER", payload: false });
      enqueueSnackbar({
        variant: "success",
        message: "Password Updated Successfully",
      });
      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.log("error", error);
      dispatch({ type: "LOADER", payload: false });
      enqueueSnackbar({
        variant: "error",
        message: error.response.data,
      });
    }
  };
  return (
    <div
      className="modal fade"
      id="passwordModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Update Your Password
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          {/* ////////////////// */}
          <div className="modal-body">
            <form onSubmit={handleUpdatePassword}>
              <div className="d-flex flex-column m-3">
                <label className="form-label">Old Password</label>
                <input
                  required
                  className="form-control"
                  type="password"
                  name="oldPassword"
                  placeholder="please enter old password"
                  value={passwords.oldPassword}
                  onChange={handleChange}
                />
                <label className="form-label">New Password</label>
                <input
                  required
                  className="form-control"
                  type="password"
                  name="newPassword"
                  placeholder="please enter new password"
                  value={passwords.newPassword}
                  onChange={handleChange}
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
                  //   data-bs-dismiss="modal"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdateModal;
