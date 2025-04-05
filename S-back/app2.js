/**
 *
 *
 *
 *
 *
 *
 * 고민봉 소켓 테스트용 복사본
 */
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// const AWS = require("aws-sdk");
// const multer = require("multer");
// const s3 = new AWS.S3();

const PORT = 8082;
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const serverPerfix = "/api-server";
const cors = require("cors");
const { or } = require("sequelize");
const { connect } = require("http2");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(serverPerfix, indexRouter);

//고객 점주 모든 클라이언트 저장소
const connectedClients = {};

//고객의 주문 정보 저장소
const orderInfo = {};

//주문확인, 조리시작, 조리완료 상태관리 버튼
const orderStatusStorage = {
  "주문번호가 키임": "200f4d28-5be4-4fcf-9e9b-d164a3a0ff2d",
};
const cookingCompletedStorage = {
  "주문번호가 키임": "200f4d28-5be4-4fcf-9e9b-d164a3a0ff2d",
};
const orderApprovedStorage = {
  "주문번호가 키임": "200f4d28-5be4-4fcf-9e9b-d164a3a0ff2d",
};

console.log("Connected clients:", JSON.stringify(connectedClients, null, 2));
sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("database sync 오류!");
  });

io.on("connection", (socket) => {
  console.log("클라이언트 접속", socket.id);
  const addClient = (data) => {
    console.log("data=", data);

    if (!connectedClients[data.loginId]) {
      connectedClients[data.loginId] = [];
    }

    connectedClients[data.loginId].push(socket.id);
    console.log("클라이언트 해시 맵 == ", connectedClients);
  };

  socket.on("connectCustomer", (data) => {
    console.log("Customer connected");
    console.log("고객 커넥트 아이디", data.loginId);
    const customerId = data.loginId;
    console.log("고객 아이디 확인 - ", customerId);

    const customerOrders = Object.values(orderInfo)
      .flat()
      .filter((order) => order.loginId === customerId);

    console.log("고객의 모든 주문 정보 = ", customerOrders);
    socket.emit("customerOrderSync", customerOrders);
    addClient(data);
  });

  socket.on(
    "connectOwner",
    (data, orderStatus, cookingCompleted, orderApproved) => {
      console.log("orderStatus = ", orderStatus);
      console.log("cookingCompleted = ", cookingCompleted);
      console.log("orderApproved = ", orderApproved);

      if (!orderStatusStorage[orderStatus]) {
        orderStatusStorage[orderStatus] = {};
      }
      orderStatusStorage[orderStatus] = orderStatus;
      console.log("Updated orderStatus:", orderStatus);

      if (!cookingCompletedStorage[cookingCompleted]) {
        cookingCompletedStorage[cookingCompleted] = {};
      }
      cookingCompletedStorage[cookingCompleted] = cookingCompleted;
      console.log("Updated cookingCompleted:", cookingCompleted);

      if (!orderApprovedStorage[orderApproved]) {
        orderApprovedStorage[orderApproved] = {};
      }
      orderApprovedStorage[orderApproved] = orderApproved;
      console.log("Updated orderApproved:", orderApproved);

      console.log("Owner connected");
      console.log("점주 커넥트 아이디=", data);
      const ownerId = data.loginId;
      console.log("점주 아이디확인-", ownerId);

      const ownerOrders = Object.values(orderInfo)
        .flat()
        .filter((order) => order.shopLoginId === ownerId);

      console.log("점주의 모든 주문 정보 = ", ownerOrders);
      socket.emit("ownerOrderSync", ownerOrders);
      addClient(data);
    }
  );

  socket.on("order", (data) => {
    console.log("주문이 들어왔습니다.");
    console.log("요기서 확인=", data);
    const customerId = data.loginId;
    const ownerId = data.shopLoginId;
    if (!orderInfo[customerId]) {
      orderInfo[customerId] = [];
    }
    orderInfo[customerId].push(data);

    console.log(
      "고객 주문 정보 해시 맵 = ",
      JSON.stringify(orderInfo[data.loginId], null, 2)
    );

    if (connectedClients[ownerId]) {
      connectedClients[ownerId].forEach((clientId) => {
        io.to(clientId).emit("order", data);
      });
    } else {
      console.log(`No connected clients for ownerId: ${ownerId}`);
    }

    if (connectedClients[customerId]) {
      connectedClients[customerId].forEach((clientId) => {
        io.to(clientId).emit("order", data);
      });
    } else {
      console.log(`No connected clients for ownerId: ${customerId}`);
    }
  });

  socket.on("orderApproval", (data) => {
    console.log("주문 승인되었습니다.");
    console.log("주문 승인 확인=", data);
    const customerId = data.loginId;
    console.log("customerId = ", customerId);

    if (connectedClients[customerId]) {
      connectedClients[customerId].forEach((clientId) => {
        io.to(clientId).emit("orderApproval", data);
      });
    } else {
      console.log(`2.No connected clients for customerId: ${customerId}`);
    }
  });

  socket.on("cookingStart", (data) => {
    console.log("조리 시작 되었습니다.");
    console.log("주문 정보 확인 = ", data);
    const customerId = data.loginId;
    console.log("customerId = ", customerId);
    if (connectedClients[customerId]) {
      connectedClients[customerId].forEach((clientId) => {
        io.to(clientId).emit("cookingStart", data);
      });
    } else {
      console.log(`4.No connected clients for ownerId: ${customerId}`);
    }
  });

  socket.on("cookingEnd", (data) => {
    console.log("조리 완료 되었습니다.");
    console.log("주문 정보 확인 = ", data);
    const customerId = data.loginId;
    console.log("customerId = ", customerId);
    if (connectedClients[customerId]) {
      connectedClients[customerId].forEach((clientId) => {
        io.to(clientId).emit("cookingEnd", data);
      });
    } else {
      console.log(`4.No connected clients for ownerId: ${customerId}`);
    }
  });

  /**
   *
   *
   *const orderStatusStorage = {};
const cookingCompletedStorage = {};
const orderApprovedStorage = {};
   *조리확인, 조리시작, 조리완료 상태관리 소켓
   */

  //점주가 주문 확인 버튼 눌렀을 떄떄
  socket.on("setOrderApproved", (data, shopLoginId) => {
    console.log("주문확인버튼 상태 받음 = ", data);

    // 데이터를 순회하면서 키와 값을 해시 맵에 저장
    Object.keys(data).forEach((key) => {
      orderApprovedStorage[key] = data[key];
    });

    console.log("shopLoginId = ", shopLoginId);
    console.log("주문확인 상태 해쉬 맵 = ", orderApprovedStorage);
  });

  socket.on("setOrderStatus", (data, shopLoginId) => {
    console.log("조리시작버튼 상태 받음 = ", data);

    // 데이터를 순회하면서 키와 값을 해시 맵에 저장
    Object.keys(data).forEach((key) => {
      orderStatusStorage[key] = data[key];
    });

    console.log("shopLoginId = ", shopLoginId);
    console.log("조리시작 상태 해쉬 맵 = ", orderStatusStorage);
  });

  socket.on("setCookingCompleted", (data, shopLoginId) => {
    console.log("조리완료버튼 상태 받음 = ", data);

    // 데이터를 순회하면서 키와 값을 해시 맵에 저장
    Object.keys(data).forEach((key) => {
      cookingCompletedStorage[key] = data[key];
    });

    console.log("shopLoginId = ", shopLoginId);
    console.log("조리완료 상태 해쉬 맵 = ", cookingCompletedStorage);
  });
  socket.on("disconnect", () => {
    console.log("클라이언트 접속 해제", socket.id);

    // 해시 맵에서 해당 클라이언트를 제거
    for (const loginId in connectedClients) {
      const socketIndex = connectedClients[loginId].indexOf(socket.id);
      if (socketIndex !== -1) {
        connectedClients[loginId].splice(socketIndex, 1);

        if (connectedClients[loginId].length === 0) {
          delete connectedClients[loginId];
        }

        console.log(`클라이언트 제거: socket.id = ${socket.id}`);
        console.log("제거결과확인 = ", connectedClients);
        break;
      }
    }
  });
});
