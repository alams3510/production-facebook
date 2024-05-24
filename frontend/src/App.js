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
            element={user !== null ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user !== null ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user !== null ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile/:username"
            element={user !== null ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/msg"
            element={user !== null ? <Msg /> : <Navigate to="/login" />}
          />
          <Route
            path="/userMsgPage/:_id"
            element={user !== null ? <MessageBox /> : <Navigate to="/login" />}
          />
          <Route
            path="/logout"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="*"
            element={
              user !== null ? <PageNotFound /> : <Navigate to="/login" />
            }
          />
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
