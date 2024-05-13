import { useEffect } from "react";
import { useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/instance";

const Feed = ({ username, postUpdateLike }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isfetching, setIsfetching] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsfetching(true);
        const res = username
          ? await axiosInstance.get("/posts/profile/" + username)
          : await axiosInstance.get(`posts/timeline/${user._id}`);
        setPosts(res.data);
        setIsfetching(false);
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
      } catch (error) {
        setIsfetching(false);
        console.error(error);
      }
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feedContainer">
      {username ? "" : <Share />}
      {posts.length > 0 ? (
        posts.map((posts) => {
          return (
            <Post
              posts={posts}
              key={posts._id}
              postUpdateLike={postUpdateLike}
            />
          );
        })
      ) : (
        <h5 style={{ textAlign: "center", color: "grey", marginTop: "20px" }}>
          {isfetching ? "" : "You have No post yet"}
        </h5>
      )}
    </div>
  );
};

export default Feed;
