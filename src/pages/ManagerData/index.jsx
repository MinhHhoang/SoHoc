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
  const [data, setData] = useState({ name: "", value: "", money: "" });
  const [visible, setVisible] = useState(false);

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
      setData({ name: "", value: "", money: "" });
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

  const sortData = (data) => {
    const entries = Object.entries(data);
    entries.sort(([, a], [, b]) => b.totalMoney - a.totalMoney);
    return entries.map(([key, value]) => ({ label: key, value }));
  };

  const toggleVisible = () => setVisible(!visible);

  const listRecommend = [
    {
      name: "Chẵn lẻ",
      value:
        "01, 03, 05, 07, 09, 21, 23, 25, 27, 29, 41, 43, 45, 47, 49, 61, 63, 65, 67, 69, 81, 83, 85, 87, 89",
      money: "",
    },
    {
      name: "Lẻ chẵn",
      value:
        "10, 12, 14, 16, 18, 30, 32, 34, 36, 38, 50, 52, 54, 56, 58, 70, 72, 74, 76, 78, 90, 92, 94, 96, 98",
      money: "",
    },
    {
      name: "Chẵn chẵn",
      value:
        "00, 02, 04, 06, 08, 20, 22, 24, 26, 28, 40, 42, 44, 46, 48, 60, 62, 64, 66, 68, 80, 82, 84, 86, 88",
      money: "",
    },
    {
      name: "Lẻ lẻ",
      value:
        "11, 13, 15, 17, 19, 31, 33, 35, 37, 39, 51, 53, 55, 57, 59, 71, 73, 75, 77, 79, 91, 93, 95, 97, 99",
      money: "",
    },
    {
      name: "Tổng trên 10",
      value:
        "19, 28 - 29, 37 - 38 - 39, 46 - 47 - 48 - 49, 55 - 56 - 57 - 58 - 59, 64 - 65 - 66 - 67 - 68 - 69, 73 - 74 - 75 - 76 - 77 - 78 - 79, 82 - 83 - 84 - 85 - 86 - 87 - 88 - 89, 91 - 92 - 93 - 94 - 95 - 96 - 97 - 98 - 99",
      money: "",
    },
    {
      name: "Tổng dưới 10",
      value:
        "00 - 01 - 02 - 03 - 04 - 05 - 06 - 07 - 08 - 09, 10 - 11 - 12 - 13 - 14 - 15 - 16 - 17 - 18, 20 - 21 - 22 - 23 - 24 - 25 - 26 - 27, 30 - 31 - 32 - 33 - 34 - 35 - 36, 40 - 41 - 42 - 43 - 44 - 45, 50 - 51 - 52 - 53 - 54, 60 - 61 - 62 - 63, 70 - 71 - 72, 80 - 81, 90",
      money: "",
    },
    {
      name: "Tổng 10",
      value: "19 - 91 - 28 - 82 - 37 - 73 - 46 - 64 - 55",
      money: "",
    },
    {
      name: "To nhỏ",
      value:
        "90, 91, 92, 93, 94, 80, 81, 82, 83, 84, 70, 71, 72, 73, 74, 60, 61, 62, 63, 64, 50, 51, 52, 53, 54",
      money: "",
    },
    {
      name: "Nhỏ to",
      value:
        "05, 06, 07, 08, 09, 15, 16, 17, 18, 19, 25, 26, 27, 28, 29, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49",
      money: "",
    },
    {
      name: "To to",
      value:
        "55, 66, 77, 88, 99, 56, 65, 57, 75, 58, 85, 59, 95, 67, 76, 68, 86, 69, 96, 78, 87, 79, 97, 89, 98",
      money: "",
    },
    {
      name: "Nhỏ nhỏ",
      value:
        "00, 11, 22, 33, 44, 01, 10, 02, 20, 03, 30, 04, 40, 12, 21, 13, 31, 14, 41, 23, 32, 24, 42, 34, 43",
      money: "",
    },
    {
      name: "Tổng 0",
      value: "00 - 19 - 28 - 37 - 46 - 55 - 64 - 73 - 82 - 91",
      money: "",
    },
    {
      name: "Tổng 1",
      value: "01 - 10 - 29 - 38 - 47 - 56 - 65 - 74 - 83 - 92 ",
      money: "",
    },
    {
      name: "Tổng 2",
      value: "02 - 11 - 20 - 39 - 48 - 57 - 66 - 75 - 84 - 93",
      money: "",
    },
    {
      name: "Tổng 3",
      value: "03 - 12 - 21 - 30 - 49 - 58 - 67 - 76 - 85 - 94 ",
      money: "",
    },
    {
      name: "Tổng 4",
      value: "04 - 13 - 22 - 31 - 40 - 59 - 68 - 77 - 86 - 95",
      money: "",
    },
    {
      name: "Tổng 5",
      value: "05 - 14 - 23 - 32 - 41 - 50 - 69 - 78 - 87 - 96",
      money: "",
    },
    {
      name: "Tổng 6",
      value: "06 - 15 - 24 - 33 - 42 - 51 - 60 - 79 - 88 - 97",
      money: "",
    },
    {
      name: "Tổng 7",
      value: "07 - 16 - 25 - 34 - 43 - 52 - 61 - 70 - 89 - 98",
      money: "",
    },
    {
      name: "Tổng 8",
      value: "08 - 17 - 26 - 35 - 44 - 53 - 62 - 71 - 80 - 99",
      money: "",
    },
    {
      name: "Tổng 9",
      value: "09 - 18 - 27 - 36 - 45 - 54 - 63 - 72 - 81 - 90",
      money: "",
    },
    {
      name: "Chập",
      value:
        "01,10,12, 21, 23, 32, 34, 43, 54, 45, 65, 56, 67, 76, 78, 87, 89, 98, 09, 90",
      money: "",
    },

    {
      name: "Đầu 0",
      value: "00, 01, 02, 03, 04, 05, 06, 07, 08, 09",
      money: "",
    },
    {
      name: "Đầu 1",
      value: "10, 11, 12, 13, 14, 15, 16, 17, 18, 19",
      money: "",
    },
    {
      name: "Đầu 2",
      value: "20, 21, 22, 23, 24, 25, 26, 27, 28, 29",
      money: "",
    },
    {
      name: "Đầu 3",
      value: "30, 31, 32, 33, 34, 35, 36, 37, 38, 39",
      money: "",
    },
    {
      name: "Đầu 4",
      value: "40, 41, 42, 43, 44, 45, 46, 47, 48, 49",
      money: "",
    },
    {
      name: "Đầu 5",
      value: "50, 51, 52, 53, 54, 55, 56, 57, 58, 59",
      money: "",
    },
    {
      name: "Đầu 6",
      value: "60, 61, 62, 63, 64, 65, 66, 67, 68, 69",
      money: "",
    },
    {
      name: "Đầu 7",
      value: "70, 71, 72, 73, 74, 75, 76, 77, 78, 79",
      money: "",
    },
    {
      name: "Đầu 8",
      value: "80, 81, 82, 83, 84, 85, 86, 87, 88, 89",
      money: "",
    },
    {
      name: "Đầu 9",
      value: "90, 91, 92, 93, 94, 95, 96, 97, 98, 99",
      money: "",
    },
    {
      name: "Đuôi 0",
      value: "00, 10, 20, 30, 40, 50, 60, 70, 80, 90",
      money: "",
    },
    {
      name: "Đuôi 1",
      value: "01, 11, 21, 31, 41, 51, 61, 71, 81, 91",
      money: "",
    },
    {
      name: "Đuôi 2",
      value: "02, 12, 22, 32, 42, 52, 62, 72, 82, 92",
      money: "",
    },
    {
      name: "Đuôi 3",
      value: "03, 13, 23, 33, 43, 53, 63, 73, 83, 93",
      money: "",
    },
    {
      name: "Đuôi 4",
      value: "04, 14, 24, 34, 44, 54, 64, 74, 84, 94",
      money: "",
    },
    {
      name: "Đuôi 5",
      value: "05, 15, 25, 35, 45, 55, 65, 75, 85, 95",
      money: "",
    },
    {
      name: "Đuôi 6",
      value: "06, 16, 26, 36, 46, 56, 66, 76, 86, 96",
      money: "",
    },
    {
      name: "Đuôi 7",
      value: "07, 17, 27, 37, 47, 57, 67, 77, 87, 97",
      money: "",
    },
    {
      name: "Đuôi 8",
      value: "08, 18, 28, 38, 48, 58, 68, 78, 88, 98",
      money: "",
    },
    {
      name: "Đuôi 9",
      value: "09, 19, 29, 39, 49, 59, 69, 79, 89, 99",
      money: "",
    },
  ];

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
