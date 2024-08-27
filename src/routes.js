
import ManagerCategory from "views/screen/ManagerCategory";

var routes = [

 

  {
    path: "/manager-category",
    name: "Nhập dữ liệu",
    icon: "ni ni-circle-08 text-pink",
    component: <ManagerCategory />,
    layout: "/admin",
    hidden: false,
    permison: "0",
  },
];
export default routes;
