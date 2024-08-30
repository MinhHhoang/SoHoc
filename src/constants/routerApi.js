export const ENDPOINT = {
  LOGIN: "/api/login",
  REGISTER: "/register",
  LIST_MANAGER_DATA: "/api/dande",
  CREATE_MANAGER_DATA: "/api/dande/create",
  STATISTIC_MANAGER_DATA: "/api/static",
  RESET_MONEY: "/api/reset",
  SETTING_LIMIT: "/api/setting",
  MONEY_ADVANCE: (id, tienung) => `/api/ungtien/${id}/${tienung}`,
};
