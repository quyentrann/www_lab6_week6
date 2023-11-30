import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import bcrypt from "bcryptjs";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClickLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/by-email/${email}`);
      const userData = response.data;

      if (userData !== "") {
        const isPasswordCorrect = await bcrypt.compareSync(password, userData.passwordHash);

        if (isPasswordCorrect) {
          navigate("/home", {
            state: {
              user: userData,
            },
          });
        } else {
          showErrorToast("Mật khẩu không đúng!");
        }
      } else {
        showErrorToast("Email hoặc Mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error.message);
      showErrorToast("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  const showErrorToast = (message) => {
    toast.error(`🦄 ${message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="container login-container">
      <div className="row justify-content-center">
        <div className="col-md-6 login-form">
          <h2 className="text-center mb-4">Đăng Nhập</h2>
          <form>
            <div className="form-group">
              <label htmlFor="login-email">Email:</label>
              <input
                type="email"
                value={email}
                id="login-email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Mật khẩu:</label>
              <input
                type="password"
                value={password}
                id="login-password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={handleClickLogin}>
              Đăng Nhập
            </button>
            <p className="text-center mt-3">
              Bạn chưa có tài khoản? <Link to="/sign-up">Đăng ký</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;