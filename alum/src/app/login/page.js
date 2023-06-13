"use client";

import { useState } from "react";
import Cookies from "universal-cookie";
import "./login.css"

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let data = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    }).then((e) => e.json());
    if (data.error) {
      setError(data.message);
      setLoading(false);
    } else {
      var expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 100);
      let cookies = new Cookies();
      cookies.set("session_id", data.key, {
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: expirationDate,
      });
      location.replace("/");
      setLoading("");
    }
  };
  return (
    <div className="login-page">
      <main className="login">
        <main className="overlay"></main>
        <div className="container">
          <div className="login-title">Login</div>
          <form onSubmit={handleSubmit} className="form">
            <input
              className="login-input"
              type="email"
              placeholder="Enter your Email ID"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.toLowerCase().replaceAll(" ", ""))
              }
            ></input>
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {error && error}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging you in...." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
