import { useContext, useEffect, useState } from "react";
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import SideBar from "../../components/sideBar/SideBar";
import TopBar from "../../components/topbar/TopBar";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [postUpdateLike, setPostUpdateLike] = useState(0);
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);
  return (
    <>
      <TopBar setPostUpdateLike={setPostUpdateLike} />
      <div className="maincontainer">
        <SideBar />
        <Feed postUpdateLike={postUpdateLike} />
        <RightBar />
      </div>
    </>
  );
};

export default Home;
