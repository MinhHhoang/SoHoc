
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Row,
  Table,
  Col,
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import axios from "axios";

const DEFAUL_OBJECT = {
  value: "",
  money: 0.0
};

const ManagerCategory = () => {
  const [object, setObject] = useState(DEFAUL_OBJECT);
  const [list, setList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateList, setUpdateList] = useState();
  

  const handleChangeData = (e) => {
    const { name } = e.currentTarget;
    const value = e.currentTarget.value;
    setObject({
      ...object,
      [name]: value,
    });
  };

  const handleAddCaregory = (e) => {
    setObject(DEFAUL_OBJECT);
    setIsUpdate(false);
  };

  const handleSubmit = async () => {

    if (isUpdate) {
      axios
        .put("http://localhost:5000/api/dande/"+object.id, {...object,money:Number(object.money)})
        .then((response) => {
          if (response.data.status) {
            alert(response.data.message);
            setIsUpdate(false);
            setUpdateList(!updateList);
            setObject(DEFAUL_OBJECT);
          } else {
            alert(response.data.message);
            return;
          }
        })
        .catch(console.log);
    } else {
      axios
        .post("http://localhost:5000/api/dande/create", {...object,money:Number(object.money)})
        .then((response) => {
         
          if (response.data.status) {
            setIsUpdate(false);
            alert(response.data.message);
            setUpdateList(!updateList);
            setObject(DEFAUL_OBJECT);
          } else {
            alert(response.data.message);
            return;
          }
        })
        .catch(console.log);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dande/", )
      .then((response) => {
        const listnew = response.data.data;
        console.log(listnew)
          setList(listnew);
      })
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateList]);

  const deleteObject = (IDCategory) => {
    axios
      .delete("http://localhost:5000/api/dande/" + IDCategory)
      .then((response) => {
       
        if (response.data.status) {
          alert(response.data.message);
          setUpdateList(!updateList);
        } else {
          alert(response.data.message);
        }
      })
      .catch(console.log);
  };

  const updateObject = (data) => {
    window.scrollTo(0, 0)
    setIsUpdate(true);
    setObject(data);
  };

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Thông tin nhập liệu
                  </h6>

                  <div className="pl-lg-4">
                    
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Dàn đề
                          </label>
                          <Input
                            name="value"
                            className="form-control-alternative"
                            value={object.value}
                            onChange={handleChangeData}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Giá tiền
                          </label>
                          <Input
                            name="money"
                            className="form-control-alternative"
                            value={object.money}
                            onChange={handleChangeData}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="1">
                        <FormGroup>
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            color="primary"
                          >
                            {" "}
                            {!isUpdate ? "Bổ sung" : "Cập nhật"}
                          </Button>
                        </FormGroup>
                      </Col>
                      <Col lg="2"><Button
                        type="button"
                        onClick={handleAddCaregory}
                        color="success"
                        outline
                      >
                        {" "}
                        Thêm Mới Dàn đề
                      </Button></Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Danh sách dàn đề
                  </h6>
                  <div className="col">
                  <Card className="shadow">
                      <Table
                        className="align-items-center table-flush"
                        responsive
                      >
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">ID</th>
                            <th style={{'font-weight': '700','color':'#000000'}} scope="col">Dàn đề</th>
                            <th style={{'font-weight': '700','color':'#000000'}} scope="col">Gía tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map((data) => (
                            <tr key={data.id}>
                              <td>{data.id}</td>
                              <td style={{
                                fontWeight: '700',
                                color: '#000000',
                                maxWidth: '300px', // Set the maximum width
                                overflow: 'hidden', // Prevent overflow
                                wordBreak: 'break-word', // Break long words onto the next line
                                whiteSpace: 'normal' // Allow wrapping
                              }}>{data.value}</td>
                              <td>{data.money}</td>
                              <td className="text-right">
                              <UncontrolledDropdown>
                                      <DropdownToggle
                                        className="btn-icon-only text-light"
                                        href="#pablo"
                                        role="button"
                                        size="sm"
                                        color=""
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <i className="fas fa-ellipsis-v" />
                                      </DropdownToggle>
                                      <DropdownMenu
                                        className="dropdown-menu-arrow"
                                        right
                                      >
                                        <DropdownItem
                                          onClick={() => deleteObject(data.id)}
                                        >
                                          Xóa 
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() => updateObject(data)}
                                        >
                                          Chỉnh sửa
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ManagerCategory;
