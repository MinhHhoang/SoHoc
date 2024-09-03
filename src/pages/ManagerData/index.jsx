/* eslint-disable react-hooks/exhaustive-deps */
import ActionTable from "components/common/ActionTable";
import CustomTooltip from "components/common/CustomTooltip";
import TemplateContent from "components/layout/TemplateContent";
import { formatCurrencyToK } from "helper/functions";
import _map from "lodash/map";
import _size from "lodash/size";
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Overlay,
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
  actionPlusMoney,
  actionResetMoney,
  actionSettingLimit,
  actionUpdateMoney,
  actionUpdateMoneyAdvance,
  getStatistic,
  resetData,
} from "store/ManagerData/action";
// import listRecommend from "./data.json";
const initialAdvance = {
  open: false,
  target: null,
  index: -1,
};

export default function ManagerData(props) {
  const {
    list,
    params,
    limitSetting,
    sumTotalMoney,
    sumTotalAfterUng,
    listStatus: { isLoading },
    actionStatus: { isLoading: actionLoading, isSuccess: actionSuccess },
    listStatistic,
    statisticStatus,
    resetMoneyStatus,
    updateMoneyStatus,
    plusMoneyStatus,
    settingStatus,
    updateAdvanceStatus,
  } = useSelector((state) => state.managerDataReducer);
  const dispatch = useDispatch();
  const onGetList = (body) => dispatch(actionGetList(body));
  const onGetStatistic = (body) => dispatch(getStatistic(body));
  const onAdd = (body) => dispatch(actionAdd(body));
  const onEdit = (body) => dispatch(actionEdit(body));
  const onDelete = (body) => dispatch(actionDelete(body));
  const onResetMoney = () => dispatch(actionResetMoney());
  const onUpdateMoney = (body) => dispatch(actionUpdateMoney(body));
  const onPlusMoney = (body) => dispatch(actionPlusMoney(body));
  const onUpdateMoneyAdvance = (body) =>
    dispatch(actionUpdateMoneyAdvance(body));
  const onResetData = () => dispatch(resetData());
  const onSettingLimit = (body) => dispatch(actionSettingLimit(body));

  const popoverRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    target: null,
    visible: false,
    info: null,
    type: "",
  });
  const [data, setData] = useState({ name: "", value: "", money: "0" });
  const [visible, setVisible] = useState(false);
  const [visibleSetting, setVisibleSetting] = useState(false);
  const [visibleMoney, setVisibleMoney] = useState(false);
  const [visibleAdvance, setVisibleAdvance] = useState(initialAdvance);
  const [limit, setLimit] = useState(0);
  const [money, setMoney] = useState(0);
  const [moneyAdvance, setMoneyAdvance] = useState(0);
  const [selected, setSelected] = useState([]);

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
    if (
      actionSuccess ||
      (plusMoneyStatus.isSuccess && plusMoneyStatus.type === "single")
    ) {
      onCloseTooltip();
      setData({ name: "", value: "", money: "0" });
      onGetStatistic();
      onGetList();
      setVisible(false);
    }
  }, [actionSuccess, plusMoneyStatus.isSuccess]);

  useEffect(() => {
    if (settingStatus.isSuccess) {
      setVisibleSetting(false);
    }
  }, [settingStatus.isSuccess]);

  useEffect(() => {
    if (
      updateMoneyStatus.isSuccess ||
      (plusMoneyStatus.isSuccess && plusMoneyStatus.type === "multi")
    ) {
      onGetStatistic();
      resetDataMoney();
      setSelected([]);
      onGetList();
    }
  }, [updateMoneyStatus.isSuccess, plusMoneyStatus.isSuccess]);

  useEffect(() => {
    if (updateAdvanceStatus.isSuccess) {
      resetDataMoneyAdvance();
    }
  }, [updateAdvanceStatus.isSuccess]);

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
      setData({ name: "", value: "", money: "0" });
    } else {
      if (!!data.value) {
        const newData = {
          name: data.name.trim(),
          value: data.value,
          money: data.money || "0",
          id: data?.id,
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

  const sortNumber = (arr) =>
    arr.sort((a, b) => {
      if (a === "00" && b !== "00") return -1; // "00" đứng trước
      if (a !== "00" && b === "00") return 1; // "00" đứng trước
      return a.localeCompare(b); // Sắp xếp bình thường cho các giá trị còn lại
    });

  const toggleVisible = () => setVisible(!visible);
  const toggleVisibleMoney = () => setVisibleMoney(!visibleMoney);
  const toggleVisibleSetting = () => {
    setVisibleSetting(!visibleSetting);
    setLimit(limitSetting?.limit || 0);
  };

  const toggleVisibleAdvance = (e, index) => {
    setVisibleAdvance((prev) => {
      resetDataMoneyAdvance();
      return {
        open: prev.index === index ? !prev.open : true,
        target: e.target,
        index,
      };
    });
  };

  const handleSettingLimit = () => {
    onSettingLimit({ limit });
  };

  const handleSelectedAll = (e) => {
    if (e.target.checked) {
      setSelected([...list]);
    } else {
      setSelected([]);
      resetDataMoney();
    }
  };

  const handleSelected = (item, status) => {
    if (status) setSelected((prev) => [...prev, item]);
    else
      setSelected((prev) => {
        const newList = [...prev].filter((ele) => ele.id !== item.id);
        if (!newList.length) {
          resetDataMoney();
        }
        return newList;
      });
  };

  const resetDataMoney = () => {
    setVisibleMoney(false);
    setMoney(0);
  };
  const resetDataMoneyAdvance = () => {
    setVisibleAdvance(initialAdvance);
    setMoneyAdvance(0);
  };

  const handleUpdateMultiple = () => {
    if (selected.length) onUpdateMoney({ list: selected, money });
  };

  const handleUpdateMoneyAdvance = () => {
    onUpdateMoneyAdvance({
      idtienung: listStatistic[visibleAdvance.index].idtienung,
      tienung: moneyAdvance,
    });
  };
  const handlePlusMoney = (type) => {
    if (type === "multi") onPlusMoney({ list: selected, money, type });
    else onPlusMoney({ list: [data], money: data.money, type });
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
                        style={{ maxWidth: "300px", width: "100%" }}
                      >
                        <Popover.Body className="p-0 border-0">
                          <ListGroup
                            className="overflow-auto"
                            style={{ maxHeight: 500 }}
                          >
                            {isLoading && (
                              <ListGroup.Item action>Loading...</ListGroup.Item>
                            )}
                            {list.map((item, index) => (
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
              {data.id && (
                <Button
                  variant="success"
                  disabled={plusMoneyStatus.isLoading}
                  className="ms-auto flex-shrink-0"
                  onClick={() => handlePlusMoney("single")}
                >
                  {plusMoneyStatus.isLoading &&
                    plusMoneyStatus.type === "single" && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                  Cộng thêm
                </Button>
              )}
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
            <div className="col-12 col-md-5">
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
                          style={{ maxWidth: "400px", width: "100%" }}
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
              {!(statisticStatus.isLoading && _size(listStatistic) === 0) && (
                <div className="text-end mb-2">
                  <span>
                    Tổng tiền: <b>{formatCurrencyToK(sumTotalMoney, 1)}</b>
                  </span>
                  {" - "}
                  <span>
                    Tổng sau ứng:{" "}
                    <b>{formatCurrencyToK(sumTotalAfterUng, 1)}</b>
                  </span>
                </div>
              )}
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
                        style={{ width: "20%" }}
                      >
                        TỔNG TIỀN
                      </th>
                         <th
                        scope="col"
                        className="align-middle"
                        style={{ width: "20%" }}
                      >
                        LỊCH SỬ ỨNG
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: "20%" }}
                      >
                        TIỀN ỨNG
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: "20%" }}
                      >
                        SỐ DƯ
                      </th>
                      <th
                        scope="col"
                        className="align-middle"
                        style={{ width: "20%" }}
                      >
                        TRẠNG THÁI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticStatus.isLoading &&
                      _size(listStatistic) === 0 && (
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
                    {_map(sortNumber(Object.keys(listStatistic)), (key) => (
                      <tr key={key}>
                        <td className="align-middle">
                          <b style={{ fontSize: 20 }}>{key}</b>
                        </td>
                        <td className="align-middle">
                          <b>
                            {formatCurrencyToK(
                              listStatistic[key].totalMoney,
                              1
                            )}
                          </b>
                        </td>
                         <td className="align-middle">
                          <b>
                            listStatistic[key].history
                          </b>
                        </td>
                        <td className="align-middle">
                          <b className="text-danger">
                            {formatCurrencyToK(listStatistic[key].tienung, 1)}
                          </b>
                        </td>
                        <td className="align-middle">
                          <b className="text-primary">
                            {formatCurrencyToK(listStatistic[key].total, 1)}
                          </b>
                        </td>
                        <td
                          className="align-middle"
                          style={{
                            color:
                              listStatistic[key].status === "Bình Thường"
                                ? "green"
                                : "red",
                          }}
                        >
                          <Badge
                            className="py-2 px-3"
                            pill
                            bg={
                              listStatistic[key].status === "Bình Thường"
                                ? "success"
                                : "danger"
                            }
                          >
                            {listStatistic[key].status}
                          </Badge>
                        </td>

                        <td className="align-middle" style={{ width: 80 }}>
                          <Button
                            variant="outline-danger"
                            onClick={(e) => toggleVisibleAdvance(e, key)}
                          >
                            Ứng
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-md-7">
              <div className="d-flex align-items-center">
                <h6 className="mb-0">DANH SÁCH DÀN ĐỀ</h6>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  show={visibleMoney}
                  overlay={
                    <Popover
                      id="chat-popover"
                      style={{ maxWidth: "500px", width: "97%" }}
                    >
                      <Popover.Body>
                        <h6>Chỉnh giá hàng loạt</h6>
                        <div className="d-flex gap-2">
                          <NumericFormat
                            value={money}
                            displayType={"input"}
                            className="form-control"
                            id="money-data"
                            aria-label="Giá tiền"
                            placeholder="Giá tiền"
                            name="money"
                            onValueChange={({ floatValue }) =>
                              setMoney(floatValue)
                            }
                            allowNegative={false} // Không cho phép số âm
                            decimalScale={0} // Không sử dụng dấu thập phân
                            fixedDecimalScale={false} // Không cố định số chữ số thập phân
                            thousand
                            Separator=","
                          />
                          <Button
                            variant="success"
                            disabled={plusMoneyStatus.isLoading}
                            className="ms-auto flex-shrink-0"
                            onClick={() => handlePlusMoney("multi")}
                          >
                            {plusMoneyStatus.isLoading &&
                              plusMoneyStatus.type === "multi" && (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              )}
                            Cộng thêm
                          </Button>
                          <Button
                            disabled={updateMoneyStatus.isLoading}
                            className="ms-auto flex-shrink-0"
                            onClick={handleUpdateMultiple}
                          >
                            {updateMoneyStatus.isLoading && (
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
                  <Button
                    disabled={!selected?.length}
                    className="ms-auto"
                    variant="outline-primary"
                    onClick={toggleVisibleMoney}
                  >
                    Chỉnh giá
                  </Button>
                </OverlayTrigger>
              </div>
              <div
                className="d-flex w-100 overflow-auto mb-3"
                style={{ maxHeight: "calc(100vh - 280px)" }}
              >
                <table className="table table-hover table-striped">
                  <thead className="sticky-top">
                    <tr>
                      <th scope="col" className="align-middle">
                        <Form.Check.Input
                          checked={
                            list?.length && selected?.length === list?.length
                          }
                          type="checkbox"
                          onChange={handleSelectedAll}
                        ></Form.Check.Input>
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
                          <Form.Check.Input
                            checked={
                              selected.findIndex(
                                (element) => element.id === item.id
                              ) > -1
                            }
                            type="checkbox"
                            onChange={(e) =>
                              handleSelected(item, e.target.checked)
                            }
                          ></Form.Check.Input>
                        </th>
                        <td className="align-middle">
                          <b className="text-danger">{item.name}</b>
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
        <Overlay
          trigger="click"
          // placement="bottom"
          show={visibleAdvance.open}
          target={visibleAdvance.target}
        >
          {(props) => (
            <Popover
              id="chat-popover"
              ref={popoverRef}
              style={{ maxWidth: "400px", width: "97%" }}
              {...props}
            >
              <Popover.Body>
                <p className="mb-1">
                  <b>Cập nhật tiền ứng</b>
                </p>
                <div className="d-flex gap-2">
                  <NumericFormat
                    value={moneyAdvance}
                    displayType={"input"}
                    className="form-control"
                    id="moneyAdvance-data"
                    aria-label="Tiền ứng"
                    placeholder="Tiền ứng"
                    name="moneyAdvance"
                    onValueChange={({ floatValue }) =>
                      setMoneyAdvance(floatValue)
                    }
                    allowNegative={false} // Không cho phép số âm
                    decimalScale={0} // Không sử dụng dấu thập phân
                    fixedDecimalScale={false} // Không cố định số chữ số thập phân
                    thousandSeparator=","
                  />
                  <Button
                    disabled={updateAdvanceStatus.isLoading}
                    className="ms-auto flex-shrink-0"
                    onClick={handleUpdateMoneyAdvance}
                  >
                    {updateAdvanceStatus.isLoading && (
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
          )}
        </Overlay>
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
