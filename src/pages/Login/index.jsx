import { ROUTES } from "constants/routerWeb";
import _capitalize from "lodash/capitalize";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../../assets/images/bg.jpg";
import Logo from "../../assets/images/reactlogo.png";
import "./index.scss";

const Login = () => {
  // state local
  const navigate = useNavigate();
  const [isRemember, setRemember] = useState(true);
  const [noti, setNoti] = useState("");
  const [formdata, setData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  // function local
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" }));
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
      if (
        process.env.REACT_APP_USERNAME === formdata.username &&
        process.env.REACT_APP_PASSWORD === formdata.password
      ) {
        localStorage.setItem(
          "exprired_1",
          new Date().getTime() + 3 * 60 * 60 * 1000
        ); // 3h
        setTimeout(() => {
          navigate(ROUTES.HOME_PAGE);
        }, 1000);
      } else {
        setNoti("Tài khoản mật khẩu không đúng");
      }
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
        {noti && (
          <Alert variant="danger" onClose={() => setNoti("")} dismissible>
            <span>{noti}</span>
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
              <Form.Check.Input
                checked={isRemember}
                type="checkbox"
                // onChange={() => setRemember((prev) => !prev)}
              ></Form.Check.Input>
              Remember me
            </Form.Check.Label>
          </Form.Check>
        </Form.Group>

        <Button
          // disabled={isLoading}
          className="w-100 btn-fill"
          variant="primary"
          type="submit"
        >
          {false ? " Logging In..." : "LOGIN"}
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
    </div>
  );
};

export default Login;
