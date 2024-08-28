/* eslint-disable react-hooks/exhaustive-deps */
import ActionTable from "components/common/ActionTable";
import CustomTooltip from "components/common/CustomTooltip";
import TemplateContent from "components/layout/TemplateContent";
import { formatCurrency, formatCurrencyToK } from "helper/functions";
import _map from "lodash/map";
import _size from "lodash/size";
import { useEffect, useState } from "react";
import { Badge, Button, Form, Spinner } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import {
  actionAdd,
  actionDelete,
  actionEdit,
  actionGetList,
  getStatistic,
  resetData,
} from "store/ManagerData/action";

function ManagerData(props) {
  const {
    listStatus: { isLoading },
    actionStatus: { isLoading: actionLoading, isSuccess: actionSuccess },
    listStatistic,
    statisticStatus,
    list,
    params,
  } = useSelector((state) => state.managerDataReducer);

  const dispatch = useDispatch();
  const onGetList = (body) => dispatch(actionGetList(body));
  const onGetStatistic = (body) => dispatch(getStatistic(body));
  const onAdd = (body) => dispatch(actionAdd(body));
  const onEdit = (body) => dispatch(actionEdit(body));
  const onDelete = (body) => dispatch(actionDelete(body));
  const onResetData = () => dispatch(resetData());

  const [tooltip, setTooltip] = useState({
    target: null,
    visible: false,
    info: null,
    type: "",
  });
  const [data, setData] = useState({ value: "", money: "" });

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
      setData({ value: "", money: "" });
    }
  }, [actionSuccess]);

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
      setData({ value: "", money: "" });
    } else {
      if (!!data.value && !!data.money) {
        const newData = { ...data };
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
                <Form.Label htmlFor="value-data">Dàn đề</Form.Label>
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
              </div>
              <div style={{ width: "100%", maxWidth: 250 }}>
                <Form.Label htmlFor="money-data">Giá tiền</Form.Label>
                <NumericFormat
                  value={data.money}
                  displayType={"input"}
                  className="form-control"
                  id="money-data"
                  aria-label="Giá tiền"
                  placeholder="Giá tiền"
                  name="money"
                  onValueChange={({ value }) =>
                    setData((prev) => ({
                      ...prev,
                      money: value,
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
            </div>
          </div>
        }
      >
        <div className="d-grid">
          <div className="row">
            <div className="col-12 col-md-4">
              <h6>THỐNG KÊ SỐ 00-99</h6>
              <div
                className="d-flex w-100 overflow-auto h-100 mb-3"
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        <td colSpan={4}>
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
