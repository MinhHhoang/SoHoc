import produce from "immer";
import * as ActionTypes from "./constant";

// DEFAULT STATE
const status = { isLoading: false, isSuccess: false, isFailure: false };
const initialState = {
  listStatus: { ...status },
  statisticStatus: { ...status },
  resetMoneyStatus: { ...status },
  actionStatus: { ...status },
  settingStatus: { ...status },
  updateMoneyStatus: { ...status },
  list: [],
  listStatistic: {},
  params: { limit: 10, page: 1 },
  meta: {
    total: 0,
  },
  limitSetting: {},
  sumTotalMoney: 0,
};

const managerDataReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.LIST:
        draft.listStatus.isLoading = true;
        draft.listStatus.isSuccess = false;
        draft.listStatus.isFailure = false;
        draft.params.page = action.params.page;
        break;

      case ActionTypes.LIST_SUCCESS:
        draft.listStatus.isLoading = false;
        draft.listStatus.isSuccess = true;
        draft.list = action.payload.data;
        draft.meta.total = action.payload.total;
        break;

      case ActionTypes.LIST_FAILED:
        draft.listStatus.isLoading = false;
        draft.listStatus.isFailure = true;
        draft.list = [];
        break;

      case ActionTypes.STATISTIC:
        draft.statisticStatus.isLoading = true;
        draft.statisticStatus.isSuccess = false;
        draft.statisticStatus.isFailure = false;
        break;

      case ActionTypes.STATISTIC_SUCCESS:
        draft.statisticStatus.isLoading = false;
        draft.statisticStatus.isSuccess = true;
        draft.listStatistic = action.payload.data;
        draft.limitSetting = action.payload.limitSetting;
        draft.sumTotalMoney = action.payload.sumTotalMoney;
        break;

      case ActionTypes.STATISTIC_FAILED:
        draft.statisticStatus.isLoading = false;
        draft.statisticStatus.isFailure = true;
        draft.listStatistic = {};
        draft.limitSetting = {};
        draft.sumTotalMoney = 0;
        break;

      case ActionTypes.ADD:
        draft.actionStatus.isLoading = true;
        draft.actionStatus.isSuccess = false;
        draft.actionStatus.isFailure = false;
        break;

      case ActionTypes.ADD_SUCCESS:
        draft.actionStatus.isLoading = false;
        draft.actionStatus.isSuccess = true;
        draft.list = [action.payload, ...state.list];
        break;

      case ActionTypes.ADD_FAILED:
        draft.actionStatus.isLoading = false;
        draft.actionStatus.isFailure = true;
        break;

      case ActionTypes.EDIT:
        draft.actionStatus.isLoading = true;
        draft.actionStatus.isSuccess = false;
        draft.actionStatus.isFailure = false;
        break;

      case ActionTypes.EDIT_SUCCESS:
        draft.actionStatus.isLoading = false;
        draft.actionStatus.isSuccess = true;
        draft.list = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        break;

      case ActionTypes.EDIT_FAILED:
        draft.actionStatus.isLoading = false;
        draft.actionStatus.isFailure = true;
        break;

      case ActionTypes.DELETE:
        draft.actionStatus.isLoading = true;
        draft.actionStatus.isSuccess = false;
        draft.actionStatus.isFailure = false;
        break;

      case ActionTypes.DELETE_SUCCESS:
        draft.actionStatus.isLoading = false;
        draft.actionStatus.isSuccess = true;
        draft.list = state.list.filter((item) => item.id !== action.id);
        break;

      case ActionTypes.DELETE_FAILED:
        draft.actionStatus.isLoading = false;
        draft.actionStatus.isFailure = true;
        break;

      case ActionTypes.RESET:
        draft.resetMoneyStatus.isLoading = true;
        draft.resetMoneyStatus.isSuccess = false;
        draft.resetMoneyStatus.isFailure = false;
        break;

      case ActionTypes.RESET_SUCCESS:
        draft.resetMoneyStatus.isLoading = false;
        draft.resetMoneyStatus.isSuccess = true;
        Object.keys(state.listStatistic).forEach((key) => {
          draft.listStatistic[key].totalMoney = 0;
          draft.listStatistic[key].status = "Bình Thường";
        });
        draft.list = state.list.map((item) => ({ ...item, money: 0 }));
        draft.sumTotalMoney = 0;
        break;

      case ActionTypes.RESET_FAILED:
        draft.resetMoneyStatus.isLoading = false;
        draft.resetMoneyStatus.isFailure = true;
        break;

      case ActionTypes.SETTING:
        draft.settingStatus.isLoading = true;
        draft.settingStatus.isSuccess = false;
        draft.settingStatus.isFailure = false;
        break;

      case ActionTypes.SETTING_SUCCESS:
        draft.settingStatus.isLoading = false;
        draft.settingStatus.isSuccess = true;
        draft.limitSetting = action.payload;
        break;

      case ActionTypes.SETTING_FAILED:
        draft.settingStatus.isLoading = false;
        draft.settingStatus.isFailure = true;
        break;

      case ActionTypes.UPDATE_MONEY:
        draft.updateMoneyStatus.isLoading = true;
        draft.updateMoneyStatus.isSuccess = false;
        draft.updateMoneyStatus.isFailure = false;
        break;

      case ActionTypes.UPDATE_MONEY_SUCCESS:
        draft.updateMoneyStatus.isLoading = false;
        draft.updateMoneyStatus.isSuccess = true;
        draft.list = state.list.map((item) =>
          action.payload.list.findIndex((ele) => ele.id === item.id) > -1
            ? { ...item, money: action.payload.money }
            : item
        );
        break;

      case ActionTypes.UPDATE_MONEY_FAILED:
        draft.updateMoneyStatus.isLoading = false;
        draft.updateMoneyStatus.isFailure = true;
        break;

      case ActionTypes.RESET_DATA:
        return initialState;

      default:
        return state;
    }
  });
};

export default managerDataReducer;
