export const ENDPOINT = {
  LOGIN: "/api/login",
  REGISTER: "/register",
  LIST_MANAGER_DATA: "/api/dande",
  PLUS_MONEY: "/api/dande/add",
  CREATE_MANAGER_DATA: "/api/dande/create",
  STATISTIC_MANAGER_DATA: "/api/static",
  RESET_MONEY: "/api/reset",
  SETTING_LIMIT: "/api/setting",
  COPY: "/api/ungcopy",
  MONEY_ADVANCE: (id, tienung) => `/api/ungtien/${id}/${tienung}`,
};
