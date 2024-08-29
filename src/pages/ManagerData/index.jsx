/* eslint-disable react-hooks/exhaustive-deps */
import ActionTable from "components/common/ActionTable";
import CustomTooltip from "components/common/CustomTooltip";
import TemplateContent from "components/layout/TemplateContent";
import { formatCurrencyToK } from "helper/functions";
import _map from "lodash/map";
import _size from "lodash/size";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  ListGroup,
  OverlayTrigger,
  Popover,
  Spinner,
} from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import {
  actionAdd,
  actionDelete,
  actionEdit,
  actionGetList,
  actionResetMoney,
  actionSettingLimit,
  getStatistic,
  resetData,
} from "store/ManagerData/action";
import listRecommend from "./data.json";

function ManagerData(props) {
  const {
    list,
    params,
    limitSetting,
    sumTotalMoney,
    listStatus: { isLoading },
    actionStatus: { isLoading: actionLoading, isSuccess: actionSuccess },
    listStatistic,
    statisticStatus,
    resetMoneyStatus,
    settingStatus,
  } = useSelector((state) => state.managerDataReducer);

  const dispatch = useDispatch();
  const onGetList = (body) => dispatch(actionGetList(body));
  const onGetStatistic = (body) => dispatch(getStatistic(body));
  const onAdd = (body) => dispatch(actionAdd(body));
  const onEdit = (body) => dispatch(actionEdit(body));
  const onDelete = (body) => dispatch(actionDelete(body));
  const onResetMoney = () => dispatch(actionResetMoney());
  const onResetData = () => dispatch(resetData());
  const onSettingLimit = (body) => dispatch(actionSettingLimit(body));

  const [tooltip, setTooltip] = useState({
    target: null,
    visible: false,
    info: null,
    type: "",
  });
  const [data, setData] = useState({ name: "", value: "", money: "" });
  const [visible, setVisible] = useState(false);
  const [visibleSetting, setVisibleSetting] = useState(false);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      onGetList(params);
      onGetStatistic();
    }
    return () => {
      onResetData();
    };
  }, []);

  useEffect(() => {
    if (actionSuccess) {
      onCloseTooltip();
      setData({ name: "", value: "", money: "" });
      onGetStatistic();
      setVisible(false);
    }
  }, [actionSuccess]);

  useEffect(() => {
    if (settingStatus.isSuccess) {
      setVisibleSetting(false);
    }
  }, [settingStatus.isSuccess]);

  const onCloseTooltip = () => {
    setTooltip({
      visible: false,
      target: null,
      info: null,
      type: "",
    });
  };

  const handleSubmit = (type) => {
    if (type === "reset") {
      setData({ name: "", value: "", money: "" });
    } else {
      if (!!data.value) {
        const newData = {
          name: data.name.trim() || "_",
          value: data.value,
          money: data.money || "0",
        };
        newData.value = (data.value.match(/\d{2}/g) || []).join(", ");
        if (data?.id) onEdit(newData);
        else onAdd(newData);
      }
    }
  };

  const handleDelete = () => {
    if (tooltip.type === "delete") onDelete(tooltip.info.id);
  };

  const sortData = (data) => {
    const entries = Object.entries(data);
    entries.sort(([, a], [, b]) => b.totalMoney - a.totalMoney);
    return entries.map(([key, value]) => ({ label: key, value }));
  };

  const toggleVisible = () => setVisible(!visible);
  const toggleVisibleSetting = () => {
    setVisibleSetting(!visibleSetting);
    setLimit(limitSetting?.limit || 0);
  };

  const handleSettingLimit = () => {
    onSettingLimit({ limit });
  };

  return (
    <div>
      <TemplateContent
        title="HỆ THỐNG NHẬP DỮ LIỆU"
        headerProps={{ className: "col-12 my-2" }}
        filter={
          <div>
            <h6>THÔNG TIN NHẬP LIỆU</h6>
            <div className="d-flex align-items-end gap-2 flex-wrap">
              <div style={{ width: "100%", maxWidth: 250 }}>
                <Form.Control
                  id="value-data"
                  aria-label="Tên"
                  placeholder="Tên"
                  name="name"
                  value={data.name}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                ></Form.Control>
              </div>
              <div style={{ width: "100%", maxWidth: 250 }}>
                <InputGroup>
                  <Form.Control
                    id="value-data"
                    aria-label="Dàn đề"
                    placeholder="Dàn đề"
                    name="value"
                    value={data.value}
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  ></Form.Control>
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    show={visible}
                    overlay={
                      <Popover
                        id="chat-popover"
                        style={{ maxWidth: "500px", width: "97%" }}
                      >
                        <Popover.Body className="p-0 border-0">
                          <ListGroup
                            className="overflow-auto"
                            style={{ maxHeight: 500 }}
                          >
                            {listRecommend.map((item, index) => (
                              <ListGroup.Item
                                action
                                key={index}
                                onClick={() => {
                                  setData(item);
                                  toggleVisible();
                                }}
                              >
                                {item.name}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button variant="outline-secondary" onClick={toggleVisible}>
                      <i className="fas fa-chevron-down"></i>
                    </Button>
                  </OverlayTrigger>
                </InputGroup>
              </div>
              <div style={{ width: "100%", maxWidth: 250 }}>
                <NumericFormat
                  value={data.money}
                  displayType={"input"}
                  className="form-control"
                  id="money-data"
                  aria-label="Giá tiền"
                  placeholder="Giá tiền"
                  name="money"
                  onValueChange={({ floatValue }) =>
                    setData((prev) => ({
                      ...prev,
                      money: floatValue,
                    }))
                  }
                  allowNegative={false} // Không cho phép số âm
                  decimalScale={0} // Không sử dụng dấu thập phân
                  fixedDecimalScale={false} // Không cố định số chữ số thập phân
                  thousandSeparator=","
                />
              </div>
              <Button
                disabled={actionLoading && !tooltip.visible}
                onClick={() => handleSubmit("filter")}
              >
                {actionLoading && !tooltip.visible && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {data?.id ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                disabled={actionLoading && !tooltip.visible}
                variant="outline-secondary"
                onClick={() => handleSubmit("reset")}
              >
                Đặt lại
              </Button>

              <Button
                className="ms-auto"
                variant="outline-dark"
                onClick={() => onResetMoney()}
              >
                {resetMoneyStatus.isLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Đặt lại giá tiền
              </Button>
            </div>
          </div>
        }
      >
        <div className="d-grid">
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="d-flex flex-wrap align-items-center mb-1">
                <h6 className="mb-0">THỐNG KÊ SỐ 00-99</h6>
                <div className="ms-auto d-flex align-items-center gap-1">
                  <span> Hạn mức:</span>
                  <b>
                    {statisticStatus.isLoading && _size(listStatistic) === 0
                      ? "loading..."
                      : formatCurrencyToK(limitSetting?.limit, 1)}
                  </b>
                  {!(
                    statisticStatus.isLoading && _size(listStatistic) === 0
                  ) && (
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom"
                      show={visibleSetting}
                      overlay={
                        <Popover
                          id="chat-popover"
                          style={{ maxWidth: "400px", width: "97%" }}
                        >
                          <Popover.Body>
                            <div className="d-flex gap-2">
                              <NumericFormat
                                value={limit}
                                displayType={"input"}
                                className="form-control"
                                id="limit-data"
                                aria-label="Hạn mức"
                                placeholder="Hạn mức"
                                name="limit"
                                onValueChange={({ floatValue }) =>
                                  setLimit(floatValue)
                                }
                                allowNegative={false} // Không cho phép số âm
                                decimalScale={0} // Không sử dụng dấu thập phân
                                fixedDecimalScale={false} // Không cố định số chữ số thập phân
                                thousandSeparator=","
                              />
                              <Button
                                disabled={settingStatus.isLoading}
                                className="ms-auto flex-shrink-0"
                                onClick={handleSettingLimit}
                              >
                                {settingStatus.isLoading && (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                )}
                                Cập nhật
                              </Button>
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <button
                        className="btn rounded-circle d-flex justify-content-center align-items-center"
                        style={{ width: 30, height: 30 }}
                        onClick={toggleVisibleSetting}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    </OverlayTrigger>
                  )}
                </div>
              </div>
              <div
                className="d-flex w-100 overflow-auto h-100"
                style={{ maxHeight: "calc(100vh - 280px)" }}
              >
                <table className="table table-hover table-striped">
                  <thead className="sticky-top">
                    <tr>
                      <th scope="col" className="align-middle">
                        GIÁ TRỊ
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: "33%" }}
                      >
                        TỔNG TIỀN
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: "33%" }}
                      >
                        TRẠNG THÁI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticStatus.isLoading &&
                      _size(listStatistic) === 0 && (
                        <tr>
                          <td colSpan={3}>
                            <div
                              className="d-flex justify-content-center align-items-center w-100"
                              style={{ height: 400 }}
                            >
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                          </td>
                        </tr>
                      )}
                    {_map(sortData(listStatistic), (item, key) => (
                      <tr key={key}>
                        <td className="align-middle">
                          <b style={{ fontSize: 20 }}>{item?.label}</b>
                        </td>
                        <td className="align-middle">
                          <b>{formatCurrencyToK(item?.value?.totalMoney, 1)}</b>
                        </td>
                        <td
                          className="align-middle"
                          style={{
                            color:
                              item?.value?.status === "Bình Thường"
                                ? "green"
                                : "red",
                          }}
                        >
                          <Badge
                            className="py-2 px-3"
                            pill
                            bg={
                              item?.value?.status === "Bình Thường"
                                ? "success"
                                : "danger"
                            }
                          >
                            {item?.value?.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!(statisticStatus.isLoading && _size(listStatistic) === 0) && (
                <div className="text-end pt-2">
                  Tổng tiền: <b>{formatCurrencyToK(sumTotalMoney, 1)}</b>
                </div>
              )}
            </div>
            <div className="col-12 col-md-8">
              <h6>DANH SÁCH DÀN ĐỀ</h6>
              <div
                className="d-flex w-100 overflow-auto mb-3"
                style={{ maxHeight: "calc(100vh - 280px)" }}
              >
                <table className="table table-hover table-striped">
                  <thead className="sticky-top">
                    <tr>
                      <th scope="col" className="align-middle">
                        #
                      </th>
                      <th scope="col" className="align-middle">
                        TÊN
                      </th>
                      <th scope="col" className="align-middle">
                        DÀN ĐỀ
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: 150 }}
                      >
                        GIÁ TIỀN
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: 120 }}
                      >
                        HÀNH ĐỘNG
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && _size(list) === 0 && (
                      <tr>
                        <td colSpan={5}>
                          <div
                            className="d-flex justify-content-center align-items-center w-100"
                            style={{ height: 400 }}
                          >
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </div>
                        </td>
                      </tr>
                    )}
                    {list.map((item, index) => (
                      <tr key={item.updatedAt + index}>
                        <th scope="row" className="align-middle">
                          {index + 1}
                        </th>
                        <td className="align-middle">
                          <b>{item.name || "_"}</b>
                        </td>
                        <td className="align-middle">
                          <b>{item.value}</b>
                        </td>
                        <td className="align-middle">
                          {formatCurrencyToK(item.money, 1)}
                        </td>
                        <td className="align-middle">
                          <ActionTable
                            onEdit={(e) =>
                              setData({
                                value: item.value,
                                money: item.money,
                                name: item?.name,
                                id: item.id,
                              })
                            }
                            onDelete={(e) =>
                              setTooltip((prev) => {
                                return {
                                  visible:
                                    prev.target === e.target
                                      ? !tooltip.visible
                                      : true,
                                  target: e.target,
                                  info: item,
                                  type: "delete",
                                };
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <CustomTooltip
          content={`Bạn có chắc muốn xóa dàn đề "${tooltip.info?.value}" này không?`}
          tooltip={tooltip}
          loading={actionLoading}
          onClose={onCloseTooltip}
          onDelete={handleDelete}
        />
      </TemplateContent>
    </div>
  );
}

export default ManagerData;
