import { useState } from "react";
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import SideBar from "../../components/sideBar/SideBar";
import TopBar from "../../components/topbar/TopBar";
import "./home.css";

const Home = () => {
  const [postUpdateLike, setPostUpdateLike] = useState(0);
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
