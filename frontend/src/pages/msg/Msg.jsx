import React, { useContext, useEffect, useState } from "react";
import "./msg.css";
import TopBar from "../../components/topbar/TopBar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/instance";
import { socket } from "../../utility/socket";

const Msg = () => {
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friend, setFriend] = useState([]);
  const [frndMsg, setFrndMsg] = useState([]);
  const navigate = useNavigate();

  const handlNavigate = (_id) => {
    navigate("/userMsgPage/" + _id);
  };

  const handlSelected = (selected) => {
    dispatch({ type: "CHAT_SELECTED", payload: selected });
    handlNavigate(selected._id);
  };

  const fetchFriendlist = async () => {
    try {
      dispatch({ type: "LOADER", payload: true });
      const friendList = await axiosInstance.get(
        "/users/friends/" + currentUser?._id
      );
      setFriend(friendList.data);
      dispatch({ type: "LOADER", payload: false });
    } catch (error) {
      dispatch({ type: "LOADER", payload: false });
      console.error(error);
    }
  };
  useEffect(() => {
    fetchFriendlist();
  }, [currentUser._id]);

  const activeOnMessageComes = (data) => {
    setFrndMsg((prev) => {
      if (!prev.includes(data.senderId)) {
        return [...prev, { senderId: data.senderId }];
      }
    });
  };

  useEffect(() => {
    socket.on("messageSend", (data) => {
      fetchFriendlist();
      activeOnMessageComes(data);
    });

    return () => {
      socket.off("messageSend", fetchFriendlist);
    };
  }, []);

  return (
    <div className="w-100">
      <TopBar />
      <div className="ps-3 py-2  text-dark fw-bold chat-freinds">
        <h1 className="fw-bold">Chats</h1>

        <hr />
        <ul className="d-flex flex-column gap-2 col-md-6 col-sm-12">
          {friend && friend.length
            ? friend.map((item) => {
                return (
                  <li
                    className="h-30 p-3 bg-primary msg-list"
                    onClick={() => handlSelected(item)}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="w-100 d-flex justify-content-start gap-3 align-items-center flex-row cursor">
                        <img
                          src={
                            item.profilePicture
                              ? PF + item.profilePicture
                              : PF + "person/noAvatar.png"
                          }
                          alt=""
                          className="msgImg"
                        />
                        <div className="text-white">{item.username}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {frndMsg && frndMsg.length
                          ? frndMsg.map((data) => {
                              if (item._id === data.senderId)
                                return (
                                  <div className="new-message">
                                    <span className="text-success"></span>
                                  </div>
                                );
                            })
                          : ""}
                      </div>
                    </div>
                  </li>
                );
              })
            : ""}
        </ul>
        {!friend ||
          (friend.length == 0 && (
            <h4 className="text-dark">Follow freinds to Chats here....</h4>
          ))}
      </div>
    </div>
  );
};

export default Msg;
