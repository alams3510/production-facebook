// import "./login.css";
import { useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import loginCalls from "../../apiCalls";
import { Link, useNavigate } from "react-router-dom";
import "../register/register.css";

const Login = () => {
  const { isFetching, dispatch } = useContext(AuthContext);
  const email = useRef();
  const password = useRef();

  const handleclick = (e) => {
    e.preventDefault();
    loginCalls(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="registerContainer">
      <div className="registerWrapper">
        <div className="textRegister">
          <span className="texts">Facebook</span>
          <span className="desc">connect with friends and people</span>
        </div>

        <form className="registerform" onSubmit={handleclick}>
          <input
            ref={email}
            required
            placeholder="Email"
            type="email"
            className="registerInput"
          />
          <input
            required
            ref={password}
            minLength="6"
            placeholder="Password"
            type="password"
            className="registerInput"
          />
          <button
            type="submit"
            disabled={isFetching}
            className="registerInput"
            id="signup"
          >
            {isFetching ? "loading..." : "Log In"}
          </button>

          <div className="bottom-link">
            <span className="link">Forgot Password</span>
            <Link className="link" to="/register">
              Create a New account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
