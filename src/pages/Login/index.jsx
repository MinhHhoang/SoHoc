import _capitalize from "lodash/capitalize";
import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EnumHome } from "router";
import { actionClearError, actionLogin } from "store/Login/action";
import BackgroundImage from "../../assets/images/bg.jpg";
import Logo from "../../assets/images/reactlogo.png";
import "./index.scss";

const Login = () => {
  const loginState = useSelector((state) => state.loginReducer);
  // action store
  const dispatch = useDispatch();
  const onLogin = (body, isRemember) => dispatch(actionLogin(body, isRemember));
  const onClearError = () => dispatch(actionClearError());
  const {
    loginStatus: { isLoading, isSuccess, isFailure },
    data,
  } = loginState;

  const { user } = data;

  // state local
  const navigate = useNavigate();
  const [isRemember, setRemember] = useState(false);
  const [formdata, setData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isSuccess) {
      navigate(EnumHome[user?.role_id]);
    }
  }, [navigate, isSuccess]);

  // function local
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" }));
    if (isFailure) setError((prevError) => ({ ...prevError, password: "" }));
  };

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
      }
    });
    if (validates) {
      // dispatch
      onLogin(
        { email: formdata.username, password: formdata.password },
        isRemember
      );
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
        <div className="h4 mb-2 text-center">Sign In</div>
        {/* ALert */}
        {data?.error && (
          <Alert variant="danger" onClose={() => onClearError()} dismissible>
            <span>{data?.error}</span>
          </Alert>
        )}

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </Form.Group>
        {!!error.username && (
          <small className="d-block text-danger -mt-1 mb-2">
            {error.username}
          </small>
        )}

        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </Form.Group>
        {!!error.password && (
          <small className="d-block text-danger -mt-1 mb-2">
            {error.password}
          </small>
        )}
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check className="mb-1 ps-0">
            <Form.Check.Label
              className="ps-4"
              onChange={() => setRemember((prev) => !prev)}
            >
              <Form.Check.Input type="checkbox"></Form.Check.Input>
              <span className="form-check-sign"></span>
              Remember me
            </Form.Check.Label>
          </Form.Check>
        </Form.Group>

        <Button
          disabled={isLoading}
          className="w-100 btn-fill"
          variant="primary"
          type="submit"
        >
          {isLoading ? " Logging In..." : "LOGIN"}
        </Button>

        <div className="d-flex justify-content-end">
          <Button
            className="text-muted px-0 border-white text-decoration-none"
            variant="link"
          >
            Forgot password?
          </Button>
        </div>
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hatoa | &copy;2024
      </div>
    </div>
  );
};

export default Login;
