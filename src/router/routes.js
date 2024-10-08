import DefaultLayout from "components/layout/DefaultLayout";
import { ROUTES } from "constants/routerWeb";
import Login from "pages/Login";
import ManagerData from "pages/ManagerData";
import PageNotFound from "pages/NotFoundPage";

export const publicRoutes = [
  {
    path: ROUTES.HOME_PAGE,
    name: "Default Layout",
    element: <DefaultLayout />,
    children: [
      { isRoot: true, name: "ManagerData", element: <ManagerData /> },
      {
        path: ROUTES.MANAGER_DATA,
        name: "ManagerData",
        element: <ManagerData />,
      },
    ],
  },
  {
    path: ROUTES.LOGIN,
    name: "LOGIN",
    element: <Login />,
  },
  { path: "*", name: "Not Found Page", element: <PageNotFound /> },
];
