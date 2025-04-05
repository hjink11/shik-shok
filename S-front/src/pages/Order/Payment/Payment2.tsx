import { use, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Header from "../../../components/Header/Header";
import { RootState } from "../../../store/rootReducer";
import "../../../styles/payment2.scss";
import io from "socket.io-client";
import * as O from "../../../store/order";
import { faL } from "@fortawesome/free-solid-svg-icons";
interface Payment2Props {}

const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);
const Payment2: React.FC<Payment2Props> = () => {
  const loginId2 = useSelector((state: RootState) => state.login.loginId);
  const loginId3 = useSelector((state: RootState) => state.login.id);
  const shopId = useSelector((state: RootState) => state.login.shopId);

  const [showInput, setShowInput] = useState(false);
  const [amount, setAmount] = useState("");
  const [order, setOrder] = useState<any>(null); //
  const [orderInfo, setOrderInfo] = useState<O.Order[]>([]);
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: boolean }>();
  const [cookingCompleted, setCookingCompleted] = useState<{
    [key: string]: boolean;
  }>();
  const [orderApproved, setOrderApproved] = useState<{
    [key: string]: boolean;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const total = location.state?.total || 0; // 실제 합계
  const sum = (location.state?.total ?? 0).toLocaleString(); // 실제 합계 , 표시시
  const orderData = useSelector((state: RootState) => state.order.orders);

  console.log("토탈값 = ", total);
  console.log("오더데이터 = ", orderData);
  console.log("진짜 order = ", order);

  const Date2: any = orderData[0].visitDate;
  const formattedDate = new Date(Date2).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const Hour = orderData[0].visitHour;
  const Minute = orderData[0].visitMinute;
  const Guests = orderData[0].guests;
  const OrderType = orderData[0].orderType;
  const loginId = orderData[0].loginId;
  const orderTime = orderData[0].orderTime;
  const orderNumber = orderData[0].orderNumber;
  const contactNumber = orderData[0].contactNumber;
  const shopLoginId = orderData[0].shopLoginId;
  const shopName = orderData[0].shopName;
  const items: string[] = orderData[0].items;
  const prices: number[] = orderData[0].price;
  const data = { loginId: loginId2, socketId: socket.id };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("소켓 연결 성공");
    });

    socket.emit(
      "connectCustomer",
      data,
      orderStatus,
      cookingCompleted,
      orderApproved
    );

    socket.on(
      "customerOrderSync",
      (
        data: O.Order[],
        customerApprovedOrders: any,
        customerCookingStatus: any,
        customerCookingCompleted: any
      ) => {
        console.log("고객 주문 동기화 = ", data);
        if (Array.isArray(data)) {
          setOrderInfo(data); // 배열로 설정
        } else {
          setOrderInfo((prevOrderInfo) => [data, ...prevOrderInfo]); // 배열이 아닐 경우 추가
        }

        if (customerApprovedOrders) {
          setOrderApproved(customerApprovedOrders);
        }
        if (customerCookingStatus) {
          setOrderStatus(customerCookingStatus);
        }
        if (customerCookingCompleted) {
          setCookingCompleted(customerCookingCompleted);
        }
      }
    );
  }, [socket]);

  const findShopLoginId = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/getOwner/${shopLoginId}`
      );
      console.log("Payment response:", res.data.owner);
      const ownerLoginId = res.data.owner.userid;
      const shopPhone = res.data.owner.shopPhone;
      console.log("Owner Login Id = ", ownerLoginId);
      console.log("Shop Phone = ", shopPhone);

      interface MenuItem {
        menuName: string;
        price: number;
      }
      if (Array.isArray(items) && Array.isArray(prices)) {
        const combined: MenuItem[] = items.map((item, index) => ({
          menuName: item,
          price: prices[index],
        }));
        console.log("합친거 = ", combined);

        const newOrder = {
          loginId: loginId,
          orderTime: orderTime,
          orderNumber: orderNumber,
          orderType: OrderType,
          guests: Guests,
          visitDate: Date2,
          visitHour: Hour,
          visitMinute: Minute,
          contactNumber: contactNumber,
          shopName: shopName,
          shopPhone: shopPhone,
          shopLoginId: ownerLoginId,
          items: combined,
          total: total,
        };

        setOrder(newOrder); // ✅ order2 상태 업데이트
        let isTakeout2;
        if (OrderType === "매장") {
          isTakeout2 = true;
        } else {
          isTakeout2 = false;
        }

        for (let i = 0; i < combined.length; i++) {
          const items = combined[i].menuName;
          const price = combined[i].price;
          //  cus_order_id;
          //  shop_order_id;
          //  menuName;
          //  price;
          //  totalPrice;
          //  visitors;
          //  isTakeout;
          //  orderTime;
          //  option;
          //  progress;
          //  visitTime;
          const createOrder = {
            cus_order_id: loginId3,
            shop_order_id: shopId,
            menuName: items,
            price: price,
            totalPrice: total,
            visitors: Guests,
            isTakeout: isTakeout2,
            orderTime: orderTime,
            option: "맛잇게해줘",
            progress: "수락",
            visitTime: orderTime,
          };
          const res2 = await axios.post(
            `${process.env.REACT_APP_API_SERVER}/addOrder`,
            createOrder
          );
          console.log("주문 추가 결과 = ", res2);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    findShopLoginId();
  }, []);

  const handlePaymentClick = () => {
    socket.emit("order", order);
    navigate("/customerOrderHistory", { state: { order: order } });
  };

  return (
    <>
      <Header />
      <div className="wrap-container-payment2">
        <div className="wrap-content-payment2-1">
          <ul>
            <li>현재 잔액:</li>
            <li>
              쇽페이 충전:
              <button
                onClick={() => setShowInput(!showInput)}
                className="px-3 py-1 mt-2 font-bold text-black bg-orange-400 rounded hover:bg-orange-700"
              >
                충전
              </button>
            </li>
            {showInput && (
              <div className="flex items-center mt-1 input-container-payment2">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="금액 입력"
                  className="mr-2 input-class"
                />
                <button
                  onClick={() => console.log(`Deposit amount: ${amount}`)}
                  className="px-2 py-1 mt-2 font-bold text-black bg-blue-400 rounded hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            )}
          </ul>
        </div>

        <div className="wrap-content-payment2-2">
          <ul>
            <li>{OrderType}</li>
            <li>방문날짜: {formattedDate}</li>
            <li>
              방문시간: {Hour}시 {Minute}분
            </li>
            <li>인원: {Guests} 명</li>
            <li>요청사항:</li>
          </ul>

          <ul>
            <li>총 금액: {sum} 원</li>
            <li>결제 수단: 쇽페이 </li>
          </ul>
        </div>

        <div className="wrap-content-payment2-3">
          <div className="wrap-content-payment2-3-1">
            <button
              className="btn btn-warning btn-lg"
              onClick={handlePaymentClick}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment2;
