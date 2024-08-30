import { ENDPOINT } from "constants/routerApi";
import { DELETE, GET, POST, PUT } from "helper/ajax";
import { all, call, put, takeLatest, takeLeading } from "redux-saga/effects";
import { addToast } from "store/Toast/action";
import {
  actionAddFailed,
  actionAddSuccess,
  actionDeleteFailed,
  actionDeleteSuccess,
  actionEditFailed,
  actionEditSuccess,
  actionGetListFailed,
  actionGetListSuccess,
  actionResetMoneyFailed,
  actionResetMoneySuccess,
  actionSettingLimitFailed,
  actionSettingLimitSuccess,
  actionUpdateMoneyFailed,
  actionUpdateMoneySuccess,
  getStatisticFailed,
  getStatisticSuccess,
} from "./action";
import * as ActionTypes from "./constant";
function* callApiList({ params }) {
  try {
    const response = yield call(GET, ENDPOINT.LIST_MANAGER_DATA, params);
    if (response.status === 200) {
      yield put(actionGetListSuccess(response.data));
    } else {
      yield put(actionGetListFailed());
    }
  } catch (error) {
    yield put(actionGetListFailed(error.response.data.error));
  }
}
function* callApiListStatistic({ params }) {
  try {
    const response = yield call(GET, ENDPOINT.STATISTIC_MANAGER_DATA, params);
    if (response.status === 200) {
      yield put(getStatisticSuccess(response.data));
    } else {
      yield put(getStatisticFailed());
    }
  } catch (error) {
    yield put(getStatisticFailed(error.response.data.error));
  }
}

function* callApiAdd({ params }) {
  try {
    const response = yield call(POST, ENDPOINT.CREATE_MANAGER_DATA, params);
    if (response.status === 200) {
      yield put(actionAddSuccess(response.data.data));
      yield put(
        addToast({
          text: response.data.message,
          type: "success",
          title: "",
        })
      );
    } else {
      yield put(actionAddFailed());
      yield put(
        addToast({
          text: response.message || "Thêm dàn đề thất bại",
          type: "danger",
          title: "",
        })
      );
    }
  } catch (error) {
    yield put(actionAddFailed(error.response.data.error));
    yield put(
      addToast({
        text: "Thêm dàn đề thất bại",
        type: "danger",
        title: "",
      })
    );
  }
}

function* callApiEdit({ params }) {
  try {
    const { id } = params;
    const response = yield call(
      PUT,
      ENDPOINT.LIST_MANAGER_DATA + "/" + id,
      params
    );

    if (response.status === 200) {
      yield put(actionEditSuccess(response.data.data));
      yield put(
        addToast({
          text: response.data.message,
          type: "success",
          title: "",
        })
      );
    } else {
      yield put(actionEditFailed());
      yield put(
        addToast({
          text: "Cập nhật dàn đề thất bại",
          type: "danger",
          title: "",
        })
      );
    }
  } catch (error) {
    yield put(actionEditFailed(error.response.data.error));
    yield put(
      addToast({
        text: "Cập nhật dàn đề thất bại",
        type: "danger",
        title: "",
      })
    );
  }
}

function* callApiDelete({ id }) {
  try {
    const response = yield call(DELETE, ENDPOINT.LIST_MANAGER_DATA + "/" + id);
    if (response.status === 200) {
      yield put(actionDeleteSuccess(id));
      yield put(
        addToast({
          text: response.data.message,
          type: "success",
          title: "",
        })
      );
    } else {
      yield put(actionDeleteFailed());
      yield put(
        addToast({
          text: "Xóa dàn đề thất bại",
          type: "danger",
          title: "",
        })
      );
    }
  } catch (error) {
    yield put(actionDeleteFailed(error.response.data.error));
    yield put(
      addToast({
        text: "Xóa dàn đề thất bại",
        type: "danger",
        title: "",
      })
    );
  }
}
function* callApiSettingLimit({ params }) {
  try {
    const response = yield call(PUT, ENDPOINT.SETTING_LIMIT, params);
    if (response.status === 200) {
      yield put(actionSettingLimitSuccess(params));
      yield put(
        addToast({
          text: "Cập nhật hạn mức thành công",
          type: "success",
          title: "",
        })
      );
    } else {
      yield put(actionSettingLimitFailed());
      yield put(
        addToast({
          text: "Cập nhật hạn mức thất bại",
          type: "danger",
          title: "",
        })
      );
    }
  } catch (error) {
    yield put(actionSettingLimitFailed(error.response.data.error));
    yield put(
      addToast({
        text: "Cập nhật hạn mức thất bại",
        type: "danger",
        title: "",
      })
    );
  }
}

function* callApiResetMoney() {
  try {
    const response = yield call(GET, ENDPOINT.RESET_MONEY);
    if (response.status === 200) {
      yield put(actionResetMoneySuccess());
      yield put(
        addToast({
          text: "Đặt lại giá tiền thành công",
          type: "success",
          title: "",
        })
      );
    } else {
      yield put(actionResetMoneyFailed());
      yield put(
        addToast({
          text: "Đặt lại giá tiền thất bại",
          type: "danger",
          title: "",
        })
      );
    }
  } catch (error) {
    yield put(actionResetMoneyFailed(error.response.data.error));
    yield put(
      addToast({
        text: "Đặt lại giá tiền thất bại",
        type: "danger",
        title: "",
      })
    );
  }
}

function* callApiUpdateMoney({ params }) {
  try {
    const { list, money } = params;
    const callEffects = list.map((data) =>
      call(PUT, ENDPOINT.LIST_MANAGER_DATA + "/" + data.id, { ...data, money })
    );

    const response = yield all(callEffects);

    if (response.every((res) => res.status === 200)) {
      yield put(actionUpdateMoneySuccess(params));
      yield put(
        addToast({
          text: "Cập nhật giá tiền thành công",
          type: "success",
          title: "",
        })
      );
    } else {
      yield put(actionUpdateMoneyFailed());
      yield put(
        addToast({
          text: "Cập nhật giá tiền thất bại",
          type: "danger",
          title: "",
        })
      );
    }
  } catch (error) {
    console.log("function*callApiUpdateMoney  error:", error);
    yield put(actionUpdateMoneyFailed(error.response.data.error));
    yield put(
      addToast({
        text: "Cập nhật giá tiền thất bại",
        type: "danger",
        title: "",
      })
    );
  }
}
export default function* employeeSaga() {
  yield all([
    yield takeLeading(ActionTypes.LIST, callApiList),
    yield takeLeading(ActionTypes.STATISTIC, callApiListStatistic),
    yield takeLatest(ActionTypes.ADD, callApiAdd),
    yield takeLatest(ActionTypes.EDIT, callApiEdit),
    yield takeLatest(ActionTypes.DELETE, callApiDelete),
    yield takeLatest(ActionTypes.RESET, callApiResetMoney),
    yield takeLatest(ActionTypes.SETTING, callApiSettingLimit),
    yield takeLatest(ActionTypes.UPDATE_MONEY, callApiUpdateMoney),
  ]);
}
