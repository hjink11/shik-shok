import "../../../styles/ownerOrderAllHistory.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../../components/Header/Header";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CustomerOrderAllhistoryProps {}
//주문목록 interface (수정함)
// interface data {
//   //-- 기본 주문 목록
//   id: number;
//   cus_order_id: number;
//   shop_order_id: number;
//   user_id: string;
//   menuName: string;
//   price: string;
//   totalPrice: string;
//   visitors: number;
//   isTakeout: boolean;
//   orderTime: string;
//   option?: string;
//   progress?: string;
//   visitTime: string;
// }

// ----- 추가
interface orderSum {
  id: number;
  sum_cus_id: number;
  sum_shop_id: number;
  orderSum: { menuNames: string };
  sumTotal: number;
  sumOrderTime: number;
}
//--------

const CustomerOrderAllhistory: React.FC<CustomerOrderAllhistoryProps> = () => {
  //-- 추가
  const id = useSelector((state: RootState) => state.login.id);
  const loginId = useSelector((state: RootState) => state.login.loginId);
  console.log("---------id?", id);
  console.log("---------id?", loginId);
  const navigate = useNavigate();

  //----------------------- 처음 조회
  // const [orders, setOrders] = useState<data[] | null>(null); // --- Order테이블 조회
  const [oSum, setOSum] = useState<orderSum[] | null>(null);
  async function getData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/customerOrderAllHistory`,
        {
          params: {
            id: id,
          },
        }
      );
      // console.log("받은", response.data.orderList);
      // const orderList = response.data.orderList;
      // setOrders(orderList);
      //--- 추가
      console.log("주문Sum", response.data.orderSum);
      //----OSum---------
      setOSum(response.data.orderSum);
      //--------------------
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  }
  // console.log("주문들", orders);
  console.log("orderSum!!!!!!!!", oSum);

  useEffect(() => {
    getData();
  }, []);

  //--

  const nowOrder = () => {
    navigate("/customerOrderHistory");
  };
  return (
    <>
      <Header />
      <div className="wrap-container-all">
        <div>
          <section className="order-history-container-all">
            <div className="menu-tab-container-all">
              <div className="menu-tab-1-all" onClick={nowOrder}>
                <p>현재 주문</p>
              </div>
              <div className="menu-tab-2-all">
                <p>전체 주문</p>
              </div>
            </div>
            <hr className="border-2 opacity-75 black" />

            <div className="receipt-card-container-all">
              {/*  ----- 추가--------- */}
              {oSum &&
                oSum.map((el) => {
                  return (
                    <>
                      <div key={el.id} className="receipt-card-all">
                        <ul className="receipt-card-list-all">
                          <li>
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="custom-icon-all"
                            />
                          </li>
                          <li>주문시간</li>
                          <li>{el.sumOrderTime}</li>
                          <li>주문번호</li>
                          <li>{el.id}</li>
                          <li></li>
                          <li>메뉴이름</li>

                          {el.orderSum.menuNames
                            .split(",")
                            .map((menu, index) => (
                              <li key={index}>{menu.trim()}</li>
                            ))}
                          <br />
                          <li>합계: {el.sumTotal}</li>
                        </ul>
                        <div className="mt-2">
                          {window.innerWidth >= 480 ? (
                            <div>
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  navigate("/review", {
                                    state: { orderId: el.id }, //---------- OrderList 수정
                                  });
                                }}
                              >
                                리뷰
                              </button>
                            </div>
                          ) : (
                            <div>
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => {
                                  navigate("/review", {
                                    state: { orderId: el.sum_cus_id },
                                  });
                                }}
                              >
                                리뷰
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
              {/* -------------------------- */}
            </div>
          </section>
          <nav className="pagination-container-all">
            <ul className="pagination-number-container-all">
              <li>
                <a href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li>
                <a href="#">1</a>
              </li>
              <li>
                <a href="#">2</a>
              </li>
              <li>
                <a href="#">3</a>
              </li>
              <li>
                <a href="#">4</a>
              </li>
              <li>
                <a href="#">5</a>
              </li>
              <li>
                <a href="#">6</a>
              </li>
              <li>
                <a href="#">7</a>
              </li>
              <li>
                <a href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default CustomerOrderAllhistory;
