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
  updateAdvanceStatus: { ...status },
  copyStatus: { ...status },
  plusMoneyStatus: { ...status, type: null },
  list: [],
  listStatistic: {},
  params: { limit: 10, page: 1 },
  meta: {
    total: 0,
  },
  limitSetting: {},
  sumTotalMoney: 0,
  sumTotalAfterUng: 0,
  copyData: null,
};

const managerDataReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.LIST:
        draft.listStatus.isLoading = true;
        draft.listStatus.isSuccess = false;
        draft.listStatus.isFailure = false;
        break;

      case ActionTypes.LIST_SUCCESS:
        draft.listStatus.isLoading = false;
        draft.listStatus.isSuccess = true;
        draft.list = action.payload.data;
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
        draft.sumTotalAfterUng = action.payload.sumTotalAfterUng;
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
        // draft.list = [action.payload, ...state.list];
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
          draft.listStatistic[key].tienung = 0;
          draft.listStatistic[key].total = 0;
          draft.listStatistic[key].status = "Bình Thường";
        });
        draft.list = state.list.map((item) => ({ ...item, money: 0 }));
        draft.sumTotalMoney = 0;
        draft.sumTotalAfterUng = 0;
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

      case ActionTypes.UPDATE_MONEY_ADVANCE:
        draft.updateAdvanceStatus.isLoading = true;
        draft.updateAdvanceStatus.isSuccess = false;
        draft.updateAdvanceStatus.isFailure = false;
        break;

      case ActionTypes.UPDATE_MONEY_ADVANCE_SUCCESS:
        draft.updateAdvanceStatus.isLoading = false;
        draft.updateAdvanceStatus.isSuccess = true;
        draft.listStatistic = action.payload.data;
        draft.limitSetting = action.payload.limitSetting;
        draft.sumTotalMoney = action.payload.sumTotalMoney;
        draft.sumTotalAfterUng = action.payload.sumTotalAfterUng;
        break;

      case ActionTypes.UPDATE_MONEY_ADVANCE_FAILED:
        draft.updateAdvanceStatus.isLoading = false;
        draft.updateAdvanceStatus.isFailure = true;
        break;

      case ActionTypes.PLUS_MONEY:
        draft.plusMoneyStatus.isLoading = true;
        draft.plusMoneyStatus.isSuccess = false;
        draft.plusMoneyStatus.isFailure = false;
        draft.plusMoneyStatus.type = action.params?.type || "single";
        break;

      case ActionTypes.PLUS_MONEY_SUCCESS:
        draft.plusMoneyStatus.isLoading = false;
        draft.plusMoneyStatus.isSuccess = true;
        break;

      case ActionTypes.PLUS_MONEY_FAILED:
        draft.plusMoneyStatus.isLoading = false;
        draft.plusMoneyStatus.isFailure = true;
        draft.plusMoneyStatus.type = null;
        break;

      case ActionTypes.COPY:
        draft.copyStatus.isLoading = true;
        draft.copyStatus.isSuccess = false;
        draft.copyStatus.isFailure = false;
        draft.copyData = null;
        break;

      case ActionTypes.COPY_SUCCESS:
        draft.copyStatus.isLoading = false;
        draft.copyStatus.isSuccess = true;
        draft.actionStatus.isSuccess = true;
        draft.copyData = action.payload.copyTarget || "Chưa có dữ liệu để copy";
        console.log("returnproduce  action.payload:", action.payload);
        break;

      case ActionTypes.COPY_FAILED:
        draft.copyStatus.isLoading = false;
        draft.copyStatus.isFailure = true;
        
        
        break;

      case ActionTypes.RESET_DATA:
        return initialState;

      default:
        return state;
    }
  });
};

export default managerDataReducer;
