import logo from "assets/images/logo192.png";
import { MENU_PUBLIC } from "constants/routerMenu";
import { ROUTES } from "constants/routerWeb";
import { useCallback, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./menu.scss";
function Menu({ collapsed }) {
  const [list, setList] = useState(MENU_PUBLIC);
  const [prevIndex, setPrevIndex] = useState(0);
  const activeSubItem = useCallback(
    (index) => {
      const newList = [...list];

      if (prevIndex !== index) {
        newList[prevIndex].isVisible = false;
        newList[index].isVisible = true;
      } else {
        const isVisible = newList[index].isVisible;
        newList[index].isVisible = !isVisible;
      }
      setPrevIndex(index);
      setList(newList);
    },
    [list, prevIndex]
  );

  return (
    <div className={`menu ${collapsed ? "active" : ""}`}>
      {/* Logo header */}
      <div className="logo-header d-flex justify-content-center align-items-center gap-2 h-60px border-bottom">
        <Link to={ROUTES.HOME_PAGE}>
          <img className="logo-header-img" src={logo} alt="logo apple-icon" />
        </Link>
        <Link to={ROUTES.HOME_PAGE}>
          <h4 className="brand-header mb-1 text-white">THỐNG KÊ SỐ HỌC</h4>
        </Link>
      </div>
      <ul className="d-flex flex-column gap-2 list-unstyled box-menu pt-2">
        {list.map((item, idx) => {
          if (item.sub) {
            return (
              <li className="px-3" key={idx}>
                <Link
                  className="d-flex align-items-center"
                  onClick={() => activeSubItem(idx)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-center" style={{ width: "24px" }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {item.isVisible ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </Link>
                <ul
                  className={`${
                    !item.isVisible ? "d-none" : "sub-menu"
                  } d-flex flex-column gap-2 list-unstyled mt-2 p-2`}
                >
                  {item.sub.map((sub, index) => {
                    return (
                      <li className="sub-list" key={index}>
                        <NavLink to={`${sub.src}`}>{sub.label}</NavLink>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          return (
            <li className="px-3" key={idx}>
              <NavLink to={`${item.src}`}>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-center" style={{ width: "24px" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Menu;
