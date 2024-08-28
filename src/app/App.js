/* eslint-disable react-hooks/exhaustive-deps */
import ImagePopup from "components/common/ImagePopup";
import ToastSnackbar from "components/common/ToastSnackbar";
import CheckTokenMiddleware from "middleware/checkToken";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "router";
import "./index.scss";

function App() {
  const { popup } = useSelector((state) => state.toastReducer);

  const listRouter = useCallback(() => {
    return publicRoutes;
  }, []);

  const renderRoutes = useCallback((routes) => {
    return routes?.map((route, index) => {
      if (route.children?.length > 0) {
        return (
          <Route path={route.path} element={route.element} key={index}>
            {renderRoutes(route.children)}
          </Route>
        );
      }

      if (route.isRoot) {
        return <Route index element={route.element} key={index} />;
      }
      return <Route path={route.path} element={route.element} key={index} />;
    });
  }, []);

  return (
    <>
      <CheckTokenMiddleware>
        <Routes>{renderRoutes(listRouter())}</Routes>
      </CheckTokenMiddleware>
      <ToastSnackbar />
      {popup?.visible && <ImagePopup />}
    </>
  );
}

export default App;
