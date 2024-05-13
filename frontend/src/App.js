import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Loader from "../src/utility/Loader";
import Msg from "./pages/msg/Msg";
import MessageBox from "./pages/msg/MessageBox";
import { socket } from "./utility/socket";
import PageNotFound from "./pages/pageNotFound/PageNotFound";

function App() {
  const { user, loader } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("socket connected ---->>>", isConnected);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("socket disconnected ---->>>", isConnected);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/register" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/msg" element={<Msg />} />
          <Route path="/userMsgPage/:_id" element={<MessageBox />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      {loader && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "lightGrey",
            opacity: 0.7,
            width: "100%",
            height: "100%",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
    </>
  );
}

export default App;
