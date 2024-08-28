/* quy phạm khai báo rootReducer */
import { combineReducers } from "redux";

import loginReducer from "./Login/reducer";
import managerDataReducer from "./ManagerData/reducer";
import toastReducer from "./Toast/reducer";

const rootReducer = combineReducers({
  loginReducer,
  toastReducer,
  managerDataReducer,
});

export default rootReducer;
