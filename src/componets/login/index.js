import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginStyles from "./Login.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { signinGoogle, signin } from "../../redux/actions/auth";
import OAuth2Login from "react-simple-oauth2-login";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleGoogleLoginSuccess(tokenResponse) {
    const accessToken = tokenResponse.access_token;

    dispatch(signinGoogle(accessToken, navigate));
  }
  const login = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });
  const loginFb = async (e) => {
    const accessToken = e.access_token;
    const typeLogin = "facebook";
    const callApi = await axios
      .post(
        // "https://ecom-z3we.onrender.com/api/users/register",
        "https://ecom-z3we.onrender.com/api/users/login",
        {
          accessToken,
          typeLogin,
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.status == 404) {
          alert("Ú sờ đã tồn tại vui lòng đăng nhập dùm");
        }
      });
  };

  const onFailure = (e) => {
    console.log(e);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (email !== "" && password !== "") {
      dispatch(signin({ email, password }, navigate));
    }
  }

  return (
    <div className={LoginStyles.loginContainer}>
      <div className={LoginStyles.loginContainerv2}>
        <h1>Welcome back</h1>

        <div className={LoginStyles.inputContainer}>
          <label>EMAIL</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
            type="email"
          />
        </div>

        <div className={LoginStyles.inputContainer}>
          <label>PASSWORD</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            type="password"
          />
        </div>
        <div className={LoginStyles.forgetmeContainer}>
          <div>
            Remember Me <input type="checkbox" />
          </div>
          <div>
            <Link to="/account/forgotpassowrd">Forgot password?</Link>
          </div>
        </div>
        <div>
          {/* Đem đống shit này vô env nhen ní */}
          <OAuth2Login
            buttonText="Login with Facebook"
            authorizationUrl="https://www.facebook.com/dialog/oauth"
            responseType="token"
            clientId="203369009102213"
            redirectUri="http://localhost:3000/"
            scope="public_profile"
            onSuccess={loginFb}
            onFailure={onFailure}
          />
        </div>

        <button onClick={handleSubmit} className={LoginStyles.loginBTN}>
          LOGIN
        </button>
        <span className={LoginStyles.or}>or</span>
        <button onClick={() => login()} className={LoginStyles.googleBTN}>
          <i class="fa-brands fa-google"></i> Sign in with google
        </button>

        <button onClick={() => loginFb()} className={LoginStyles.googleBTN}>
          <i class="fa-brands fa-google"></i> Sign in with facebook
        </button>
        <span className={LoginStyles.notreg}>
          Not registered yet?{" "}
          <Link className={LoginStyles.singupBTN} to="/account/signup">
            Signup
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
