import "./post.css";
import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/instance";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ posts }) => {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState([]);
  const [like, setLike] = useState(posts.likes.length);
  const [isliked, setisLiked] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?userId=${posts.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [posts.userId]);

  useEffect(() => {
    setisLiked(posts.likes.includes());
  }, [currentUser._id, posts.likes]);

  const likehandler = async () => {
    try {
      dispatch({ type: "LOADER", type: true });
      await axiosInstance.put("/posts/" + posts._id + "/like", {
        userId: currentUser._id,
      });
      dispatch({ type: "LOADER", type: false });
    } catch (error) {
      dispatch({ type: "LOADER", type: false });
      console.error(error);
    }
    setLike(isliked ? like - 1 : like + 1);
    setisLiked(!isliked);
  };

  const [visible, setVisible] = useState(false);
  const deletepost = async (id, userId) => {
    if (userId === currentUser._id) {
      try {
        dispatch({ type: "LOADER", type: true });

        await axiosInstance.delete(`/posts/${id}`);
        dispatch({ type: "LOADER", type: false });

        window.location.reload(true);
      } catch (error) {
        dispatch({ type: "LOADER", type: false });

        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="postContainer">
        <div className="mainPost">
          <div className="postTop">
            <div className="postTopLeft">
              <Link to={`/profile/${user.username}`}>
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt="img"
                  className="postImg"
                />
              </Link>
              <span className="postName">{user.username}</span>
              <span className="postDate">{format(posts.createdAt)}</span>
              {/* <span className="postDate">
                {moment(posts.createdAt, "YYYYMMDD").fromNow() === "a day ago"
                  ? moment(new Date(posts.createdAt), "hour").fromNow()
                  : moment(posts.createdAt, "YYYYMMDD").fromNow()}
              </span> */}
            </div>

            <div className="postTopRight">
              {visible && (
                <ul className="updatepost">
                  <li
                    onClick={() => {
                      deletepost(posts._id, posts.userId);
                    }}
                  >
                    delete
                  </li>
                </ul>
              )}
              <div>
                <FiMoreVertical
                  className="threedotRight"
                  onClick={() => setVisible(!visible)}
                />
              </div>
            </div>
          </div>

          <div className="postCenter">
            <div className="postdesc">{posts.desc}</div>
            <div className="postImage">
              <img src={PF + posts.img} alt="" className="img" />
            </div>
          </div>

          <div className="postBottom">
            <div className="postBottomleft">
              <img
                src={PF + "/like.png"}
                alt=""
                className="like"
                onClick={likehandler}
              />
              <img
                src={PF + "/heart.png"}
                alt=""
                className="like"
                onClick={likehandler}
              />
              <span className="likeCount">{like} people liked you</span>
            </div>
            <div className="PostComment">
              <span className="cmnt">comment</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
