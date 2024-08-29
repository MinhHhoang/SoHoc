/* eslint-disable react-hooks/exhaustive-deps */
import { ROUTES } from "constants/routerWeb";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const checkTimeExpired = (timeExpired) => {
  const now = new Date().getTime();
  return now > timeExpired;
};
const CheckTokenMiddleware = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const timeExpired = localStorage.getItem("exprired_1") || 0;
  useEffect(() => {
    const isLoginPage = [ROUTES.LOGIN, ROUTES.REGISTER].includes(pathname);
    if (checkTimeExpired(timeExpired)) {
      localStorage.removeItem("exprired_1");
      if (isLoginPage) return;
      return navigate(ROUTES.LOGIN);
    } else if (isLoginPage) {
      return navigate(ROUTES.HOME_PAGE);
    }
  }, [timeExpired, pathname]);

  return children;
};

export default CheckTokenMiddleware;
