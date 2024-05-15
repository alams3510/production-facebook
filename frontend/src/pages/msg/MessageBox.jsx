import React, { useContext, useEffect, useRef, useState } from "react";
import TopBar from "../../components/topbar/TopBar";
import "./msg.css";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/instance";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { socket } from "../../utility/socket";
import { format } from "timeago.js";
import { PiPaperPlaneRightBold } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import DeleteModal from "../../utility/deleteModal";

const MessageBox = () => {
  const ref = useRef(null);
  const { user, chatSelectedUser, dispatch } = useContext(AuthContext);
  const param = useParams();
  const [messages, setMesseges] = useState([]);
  const [messag, setMesseg] = useState({
    senderId: user._id,
    recieverId: param._id,
    message: "",
  });
  const handleChange = (e) => {
    const data = e.target.value;
    setMesseg((prev) => {
      return { ...prev, message: data };
    });
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messag.message) {
      enqueueSnackbar({
        variant: "error",
        message: "Message can not be empty",
      });
      return;
    }
    let res;
    try {
      res = await axiosInstance.post(`/msg`, messag);
    } catch (error) {
      enqueueSnackbar({
        variant: "error",
        message: "Please select a person to Message",
      });
    }
    setMesseges((prev) => [...prev, messag]);
    setMesseg({
      senderId: user._id,
      recieverId: param._id,
      message: "",
    });
  };

  const getAllMessages = async () => {
    const allMessages = await axiosInstance.post(`/msg/all_msg`, {
      senderId: user._id,
      recieverId: param._id,
    });
    setMesseges(allMessages.data);
  };

  useEffect(() => {
    getAllMessages();
  }, [param]);
  useEffect(() => {
    socket.on("messageSend", getAllMessages);
    return () => {
      socket.off("messageSend", getAllMessages);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  });

  const deleteChats = async () => {
    try {
      if (!messages.length) {
        return enqueueSnackbar({
          variant: "warning",
          message: "Nothing to Delete",
        });
      }
      dispatch({ type: "LOADER", type: true });
      await axiosInstance.delete(`msg/delete_chats/${user._id}/${param._id}`);
      await getAllMessages();
      dispatch({ type: "LOADER", type: false });
      enqueueSnackbar({
        variant: "success",
        message: "Chats have been deleted Successfully",
      });
    } catch (error) {
      dispatch({ type: "LOADER", type: false });
      enqueueSnackbar({
        variant: "error",
        message: "There is some error occured while deleting Chats ",
      });
    }
  };
  return (
    <div className=" msg-main-containers ">
      <div ref={ref}>
        <TopBar />

        <div className="sender-chat w-100">
          <div className="d-flex align-items-center justify-content-between w-100">
            <h6 className="fw-bold">{chatSelectedUser?.username}</h6>

            <div data-bs-toggle="tooltip">
              <button
                type="button"
                data-bs-placement="bottom"
                title="Delete All Chats"
                className="delete-msg"
                data-bs-toggle="modal"
                data-bs-target="#chatDeleteModal"
              >
                <MdDelete className="text-danger text-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="msg-container p-3 mb-5">
          {messages && messages.length
            ? messages.map((item) => {
                if (item.recieverId === user._id)
                  return (
                    <>
                      <div className="sender">{item.message}</div>
                      <span className="align-self-start">
                        {format(item.createdAt)}
                      </span>
                    </>
                  );
                else
                  return (
                    <>
                      <div className="reciever">{item.message}</div>
                      <span className="align-self-end">
                        {format(item.createdAt)}
                      </span>
                    </>
                  );
              })
            : ""}
          <form
            onSubmit={handleSend}
            className="input-group mt-5  bottom-input"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Write Yours Messages"
              onChange={handleChange}
              value={messag.message}
            />
            <button
              type="submit"
              className="btn btn-primary"
              id="button-addon2"
            >
              <PiPaperPlaneRightBold />
            </button>
          </form>
        </div>
      </div>

      <DeleteModal deleteChats={deleteChats} />
    </div>
  );
};

export default MessageBox;
