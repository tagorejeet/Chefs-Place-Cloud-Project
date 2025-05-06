import React, { useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import AppID from 'ibmcloud-appid-js';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const loginWithAppID = async () => {
    try {
      const appID = new AppID();
      await appID.init({
        clientId: "3fdd086a-7ea1-4732-91f3-8f211feea577",
        discoveryEndpoint: "https://eu-de.appid.cloud.ibm.com/oauth/v4/b839377b-e3a7-4f85-9b5d-223e7c18712c/.well-known/openid-configuration",
        redirectUri: window.location.origin // e.g., http://localhost:5173
      });

      const tokens = await appID.signin();
      const jwt = tokens.idToken;

      setToken(jwt);
      localStorage.setItem("token", jwt);
      setShowLogin(false);
      navigate('/');
    } catch (err) {
      console.error("App ID Login Error:", err);
      alert("Login failed or was cancelled.");
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>Login</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='' />
        </div>
        <button onClick={loginWithAppID} className='login-btn'>
          Login with IBM App ID
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
