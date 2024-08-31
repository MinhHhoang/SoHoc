import * as ActionTypes from "./constant";

export const actionGetList = (params) => ({
  type: ActionTypes.LIST,
  params,
});

export const actionGetListSuccess = (payload) => ({
  type: ActionTypes.LIST_SUCCESS,
  payload,
});

export const actionGetListFailed = (error) => ({
  type: ActionTypes.LIST_FAILED,
  error,
});

export const actionAdd = (params) => ({
  type: ActionTypes.ADD,
  params,
});

export const actionAddSuccess = (payload) => ({
  type: ActionTypes.ADD_SUCCESS,
  payload,
});

export const actionAddFailed = (error) => ({
  type: ActionTypes.ADD_FAILED,
  error,
});

export const actionEdit = (params) => ({
  type: ActionTypes.EDIT,
  params,
});

export const actionEditSuccess = (payload) => ({
  type: ActionTypes.EDIT_SUCCESS,
  payload,
});

export const actionEditFailed = (error) => ({
  type: ActionTypes.EDIT_FAILED,
  error,
});

export const actionDelete = (id) => ({
  type: ActionTypes.DELETE,
  id,
});

export const actionDeleteSuccess = (id) => ({
  type: ActionTypes.DELETE_SUCCESS,
  id,
});

export const actionDeleteFailed = (error) => ({
  type: ActionTypes.DELETE_FAILED,
  error,
});

export const getStatistic = (params) => ({
  type: ActionTypes.STATISTIC,
  params,
});

export const getStatisticSuccess = (payload) => ({
  type: ActionTypes.STATISTIC_SUCCESS,
  payload,
});

export const getStatisticFailed = (error) => ({
  type: ActionTypes.STATISTIC_FAILED,
  error,
});

export const actionResetMoney = (params) => ({
  type: ActionTypes.RESET,
  params,
});

export const actionResetMoneySuccess = (payload) => ({
  type: ActionTypes.RESET_SUCCESS,
  payload,
});

export const actionResetMoneyFailed = (error) => ({
  type: ActionTypes.RESET_FAILED,
  error,
});

export const actionSettingLimit = (params) => ({
  type: ActionTypes.SETTING,
  params,
});

export const actionSettingLimitSuccess = (payload) => ({
  type: ActionTypes.SETTING_SUCCESS,
  payload,
});

export const actionSettingLimitFailed = (error) => ({
  type: ActionTypes.SETTING_FAILED,
  error,
});

export const actionUpdateMoney = (params) => ({
  type: ActionTypes.UPDATE_MONEY,
  params,
});

export const actionUpdateMoneySuccess = (payload) => ({
  type: ActionTypes.UPDATE_MONEY_SUCCESS,
  payload,
});

export const actionUpdateMoneyFailed = (error) => ({
  type: ActionTypes.UPDATE_MONEY_FAILED,
  error,
});

export const actionUpdateMoneyAdvance = (params) => ({
  type: ActionTypes.UPDATE_MONEY_ADVANCE,
  params,
});

export const actionUpdateMoneyAdvanceSuccess = (payload) => ({
  type: ActionTypes.UPDATE_MONEY_ADVANCE_SUCCESS,
  payload,
});

export const actionUpdateMoneyAdvanceFailed = (error) => ({
  type: ActionTypes.UPDATE_MONEY_ADVANCE_FAILED,
  error,
});

export const actionPlusMoney = (params) => ({
  type: ActionTypes.PLUS_MONEY,
  params,
});

export const actionPlusMoneySuccess = (payload) => ({
  type: ActionTypes.PLUS_MONEY_SUCCESS,
  payload,
});

export const actionPlusMoneyFailed = (error) => ({
  type: ActionTypes.PLUS_MONEY_FAILED,
  error,
});

export const resetData = () => ({
  type: ActionTypes.RESET_DATA,
});
