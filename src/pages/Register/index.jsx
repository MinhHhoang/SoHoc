import { Alert } from "bootstrap";
import _capitalize from "lodash/capitalize";
import _omit from "lodash/omit";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { actionClearError, actionRegister } from "store/Login/action";
import BackgroundImage from "../../assets/images/bg.jpg";
import Logo from "../../assets/images/reactlogo.png";
import "../Login/index.scss";

const initialData = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
};

function Register(props) {
  // state store
  const loginState = useSelector((state) => state.loginReducer);
  // action store
  const dispatch = useDispatch();
  const onRegister = (body) => dispatch(actionRegister(body));
  const onClearError = () => dispatch(actionClearError());
  const {
    registerStatus: { isLoading, isSuccess, isFailure },
    data,
  } = loginState;

  const [formdata, setData] = useState(initialData);
  const [error, setError] = useState(initialData);

  useEffect(() => {
    if (isSuccess) setData(initialData);
  }, [isSuccess]);

  // Hàm để kiểm tra tính hợp lệ của email
  const isEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Hàm để kiểm tra mật khẩu và mật khẩu nhập lại có khớp nhau không
  const isPasswordMatching = () => {
    return formdata.password === formdata.confirm_password;
  };

  // Hàm xử lý sự thay đổi trường dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => {
      const newError = { ...prevError, [name]: "" };
      if (data?.error) newError.confirm_password = "";
      return newError;
    });
  };

  // Hàm xử lý khi người dùng nhấn nút đăng nhập
  const handleSubmit = (event) => {
    event.preventDefault();
    const tmpKey = Object.keys(formdata);
    let validates = true;

    tmpKey.forEach((key) => {
      if (formdata[key] === "") {
        setError((prevError) => ({
          ...prevError,
          [key]: `${_capitalize(key)} required`,
        }));
        validates = false;
      } else if (key === "email" && !isEmailValid(formdata.email)) {
        setError((prevError) => ({
          ...prevError,
          email: "Invalid email format",
        }));
        validates = false;
      } else if (key === "confirm_password" && !isPasswordMatching()) {
        setError((prevError) => ({
          ...prevError,
          confirm_password: "Password do not match",
        }));
        validates = false;
      }
    });

    if (validates) {
      const newData = _omit(formdata, ["confirm_password"]);
      onRegister({
        ...newData,
        role_id: "MANAGER",
        image: "",
      });
    }
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign Up</div>
        {data?.error && (
          <Alert variant="danger" onClose={() => onClearError()} dismissible>
            <span>{data?.error}</span>
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            className={!!error.username && "is-invalid"}
            name="username"
            placeholder="Username"
            value={formdata.username}
            onChange={handleChange}
          />
          {!!error.username && (
            <small className="d-block text-danger -mt-3">
              {error.username}
            </small>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            className={!!error.email && "is-invalid"}
            placeholder="Email"
            value={formdata.email}
            onChange={handleChange}
          />
          {!!error.email && (
            <small className="d-block text-danger -mt-3">{error.email}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-2" controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            className={!!error.phone && "is-invalid"}
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formdata.phone}
            onChange={handleChange}
          />
          {!!error.phone && (
            <small className="d-block text-danger -mt-3">{error.phone}</small>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className={!!error.password && "is-invalid"}
            type="password"
            name="password"
            placeholder="Password"
            value={formdata.password}
            onChange={handleChange}
          />
          {!!error.password && (
            <small className="d-block text-danger -mt-3">
              {error.password}
            </small>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="confirm_password">
          <Form.Label>Comfirm Password</Form.Label>
          <Form.Control
            className={!!error.confirm_password && !isFailure && "is-invalid"}
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formdata.confirm_password}
            onChange={handleChange}
          />
          {error.confirm_password && (
            <small className="d-block text-danger -mt-3">
              {_capitalize(error.confirm_password)}
            </small>
          )}
        </Form.Group>
        <Button
          disabled={isLoading}
          className="w-100 btn-fill"
          variant="primary"
          type="submit"
        >
          {isLoading ? " Registering ..." : "REGISTER"}
        </Button>

        <div className="d-flex justify-content-between flex-wrap">
          <Button
            className="text-muted px-0 border-white text-decoration-none"
            variant="link"
          >
            Forgot password?
          </Button>
          <Link to={"/login"} role="button">
            <Button
              className="text-primary px-0 border-white text-decoration-none"
              variant="link"
            >
              Login!
            </Button>
          </Link>
        </div>
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hatoa | &copy;2024
      </div>
    </div>
  );
}

export default Register;
