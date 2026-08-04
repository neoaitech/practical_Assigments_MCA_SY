import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Login.css";

function Login() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/message")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="login-container">
      <h1>Attendance Management System</h1>

      {/* Backend Message */}
      <h3 style={{ color: "green" }}>{message}</h3>

      <div className="login-box">
        <input type="text" placeholder="Enter username" />
        <input type="password" placeholder="Enter password" />

        <button>Login</button>

        <div className="links">
          <Link to="/admin">Admin</Link>
          <Link to="/teacher">Teacher</Link>
          <Link to="/student">Student</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;