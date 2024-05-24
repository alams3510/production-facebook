import { lazy } from "react";

const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/login/Login"));
const Register = lazy(() => import("../pages/register/Register"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const Msg = lazy(() => import("../pages/msg/Msg"));
const MessageBox = lazy(() => import("../pages/msg/MessageBox"));
const PageNotFound = lazy(() => import("../pages/pageNotFound/PageNotFound"));

const authProtectedRoutes = [
  { path: "/", component: <Home /> },
  { path: "/profile/:username", component: <Profile /> },
  { path: "/msg", component: <Msg /> },
  { path: "/userMsgPage/:_id", component: <MessageBox /> },
];

const authPublicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "*", component: <PageNotFound /> },
  ,
];

export { authProtectedRoutes, authPublicRoutes };
