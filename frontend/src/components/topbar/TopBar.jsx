import "./topbar.css";
import { FiSearch } from "react-icons/fi";
import { BsPersonFill, BsFillChatLeftDotsFill } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Form from "../profileForm/Form";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../services/instance";
import { socket } from "../../utility/socket";
import ProfileModal from "../../utility/ProfileModal";
import PasswordUpdateModal from "../../utility/PasswordUpdateModal";

const TopBar = ({ setPostUpdateLike }) => {
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [openProfile, setOpenProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showReqNotification, setShowReqNotification] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const [msgcount, setMsgCount] = useState(0);
  const [noticount, setNotiCount] = useState(0);
  const [likeMessage, setLikeMessage] = useState([]);
  const [reqMessage, setReqMessage] = useState([]);
  const [followReqNotiCount, setFollowReqNotiCount] = useState(0);

  document.addEventListener("mousedown", () => {
    if (showNotification || showReqNotification) {
      setShowNotification(false);
      setShowReqNotification(false);
    }
  });

  const handleLogout = () => {
    dispatch({ type: "LOADER", payload: true });
    // setLoading(true);
    localStorage.removeItem("user");
    navigate("/login");
    // setLoading(false);
    dispatch({ type: "LOADER", payload: false });
    enqueueSnackbar({
      variant: "success",
      message: "you have successfully Logged Out",
    });
    window.location.reload();
  };

  const deleteAccount = async () => {
    try {
      alert("Are you Sure to delete Your Account Permanently??");
      // setLoading(true);
      dispatch({ type: "LOADER", payload: true });
      await axiosInstance.delete("/users/" + user._id);
      await axiosInstance.delete("/posts/" + user._id);
      localStorage.removeItem("user");
      navigate("/");
      // window.location.reload();
      // setLoading(false);
      dispatch({ type: "LOADER", payload: false });
      enqueueSnackbar({
        variant: "success",
        message: "you have deleted Permanently",
      });

      window.location.reload();
    } catch (error) {
      // console.error(error);
      enqueueSnackbar({
        variant: "error",
        message: "Some error Occured",
      });
    }
  };

  const handleIconClick = (val) => {
    if (val === "msg") {
      navigate("/msg");
    } else if (val === "notification") {
      setShowNotification((prev) => !prev);
      setNotiCount(0);
    } else {
      setShowReqNotification((prev) => !prev);
      setFollowReqNotiCount(0);
    }
  };

  useEffect(() => {
    socket.on("messageSend", (data) => {
      if (user._id === data.recieverId) setMsgCount((prev) => prev + 1);
    });

    return () => {
      socket.off("messageSend");
    };
  }, []);

  const handleNotificationMessage = ({ type, data }) => {
    if (type === "like") {
      setLikeMessage((prev) => ["Your Post is Liked", ...prev]);
    } else if (type === "dislike") {
      setLikeMessage((prev) => ["Your Post is disLiked", ...prev]);
    } else if (type === "follow") {
      setLikeMessage((prev) => ["Your are being followed by " + data, ...prev]);
    } else {
      setLikeMessage((prev) => ["Your are  UnFollowed by " + data, ...prev]);
    }
  };
  const handleNotificationReq = ({ type, data }) => {
    if (type === "follow") {
      setReqMessage((prev) => ["Your have a Follow Req by " + data, ...prev]);
    } else {
      setReqMessage((prev) => ["Your are  UnFollowed by " + data, ...prev]);
    }
  };

  useEffect(() => {
    socket.on("postLiked", (data) => {
      if (user._id === data.likedToId) {
        setNotiCount((prev) => prev + 1);
        handleNotificationMessage({ type: "like", data: null });
      }
      setPostUpdateLike((prev) => prev + 1);
    });
    return () => {
      socket.off("postLiked");
    };
  }, []);
  useEffect(() => {
    socket.on("postDisLiked", (data) => {
      if (user._id === data.likedToId) {
        setNotiCount((prev) => prev + 1);
        handleNotificationMessage({ type: "dislike", data: null });
      }
      setPostUpdateLike((prev) => prev - 1);
    });
    return () => {
      socket.off("postDisLiked");
    };
  }, []);
  useEffect(() => {
    const notiCleaner = setInterval(() => {
      if (likeMessage.length > 1 && showNotification) {
        setLikeMessage([]);
        setNotiCount(0);
        setReqMessage([]);
        setFollowReqNotiCount(0);
      }
    }, 60000);
    return () => clearInterval(notiCleaner);
  }, [likeMessage, reqMessage]);

  useEffect(() => {
    socket.on("follow", (data) => {
      if (data.followed._id === user._id) {
        setNotiCount((prev) => prev + 1);
        setFollowReqNotiCount((prev) => prev + 1);
        handleNotificationMessage({
          type: "follow",
          data: data.follower.username,
        });
        handleNotificationReq({
          type: "follow",
          data: data.follower.username,
        });
      }
    });
    return () => {
      socket.off("follow");
    };
  }, []);
  useEffect(() => {
    socket.on("unfollow", (data) => {
      if (data.followed._id === user._id) {
        setNotiCount((prev) => prev + 1);
        handleNotificationMessage({
          type: "unfollow",
          data: data.follower.username,
        });
        handleNotificationReq({
          type: "unfollow",
          data: data.follower.username,
        });
      }
    });
    return () => {
      socket.off("unfollow");
    };
  }, []);
  return (
    <>
      <div className="topbarContainer">
        <div
          className="tobarLeft"
          data-toggle="tooltip"
          data-placement="left"
          title="Go Home"
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">facebook</span>
          </Link>
        </div>

        <div className="topbarMid">
          <div className="searchBar">
            <FiSearch className="searchIcon" />
            <input
              placeholder="Search for friends or videos"
              type="text"
              className="search"
            />
          </div>
        </div>
        <div className="topRight">
          <div className="topRightwrapper">
            <div className="textLink">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active text" : "text"
                }
                to={`/`}
              >
                HomePage
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active text" : "text"
                }
                to={`/profile/${user.username}`}
              >
                Timeline
              </NavLink>
            </div>
            <div className="linkIcons">
              <div
                onClick={() => handleIconClick("freinfRequest")}
                className="icon"
              >
                <BsPersonFill
                  data-toggle="tooltip"
                  data-placement="left"
                  title="Follow and Unfollow Notification"
                />
                {followReqNotiCount !== 0 ? (
                  <span className="num">{followReqNotiCount}</span>
                ) : (
                  ""
                )}
                <div className="btn-group">
                  {showReqNotification && (
                    <ul className="noti-dropdown">
                      {reqMessage && reqMessage.length
                        ? reqMessage.map((item, i) => (
                            <li key={i}>
                              <Link className="dropdown-item">{item}</Link>
                            </li>
                          ))
                        : ""}
                    </ul>
                  )}
                </div>
              </div>

              <div onClick={() => handleIconClick("msg")} className="icon">
                <BsFillChatLeftDotsFill
                  data-toggle="tooltip"
                  data-placement="left"
                  title="Message Notification"
                />
                {msgcount !== 0 ? <span className="num">{msgcount}</span> : ""}
              </div>

              <div
                onClick={() => handleIconClick("notification")}
                className="icon"
              >
                {noticount && noticount > 0 ? (
                  <span className="num">{noticount}</span>
                ) : (
                  ""
                )}
                <div className="btn-group">
                  <IoMdNotifications
                    data-toggle="tooltip"
                    data-placement="left"
                    title="Like, dislike,follow and unfollow Notification"
                  />
                  {showNotification && (
                    <ul className="noti-dropdown">
                      {likeMessage && likeMessage.length
                        ? likeMessage.map((item, i) => (
                            <li key={i}>
                              <a className="dropdown-item" href="#">
                                {item}
                              </a>
                            </li>
                          ))
                        : ""}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div
              className="profileLink dropdown"
              data-toggle="tooltip"
              data-placement="left"
              title="Settings"
            >
              {/* <Link to={`/profile/${user.username}`}> */}
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt="img"
                className="profileImgbar dropdown-toggle"
                onClick={() => setOpenProfile(!openProfile)}
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              {/* </Link> */}
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  data-bs-whatever="@mdo"
                >
                  Profile setting
                </li>
                {/* <hr /> */}
                <li
                  // onClick={() => {
                  //   setPasswordModal(!passwordModal);
                  //   setOpenProfile(false);
                  // }}
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#passwordModal"
                >
                  Update Password
                </li>
                {/* <hr /> */}
                <li onClick={handleLogout} className="dropdown-item">
                  Logout
                </li>
                {/* <hr /> */}
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li
                  style={{ color: "red", fontWeight: "500" }}
                  onClick={deleteAccount}
                  className="dropdown-item"
                >
                  Delete Account
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal user={user} />
      <PasswordUpdateModal />
    </>
  );
};

export default TopBar;
