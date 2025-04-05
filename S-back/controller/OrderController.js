const { Order, OrderSummaryMenu, sequelize } = require("../models");

//추가 전역적으로 관리
// let menuString = "";
// let total = 0; // 주문 누적 금액
//----

exports.addOrder = async (req, res) => {
  //------ 트랜잭션 시작
  const t = await sequelize.transaction();

  try {
    const reqData = req.body;
    console.log("reqData", reqData);
    //---- 변수 초기화
    // let menuString = "";
    // let total = 0; // 주문 누적 금액
    let menuString = reqData.menuName; // 현재 메뉴 초기화
    // let total = reqData.price; // 현재 금액 초기화
    let total = 0; // 총 금액이 이상함

    // ------
    console.log("현재 메뉴 ", menuString);

    // Ordersum에 넣을 메뉴 id, sum_cus_id, sum_shop_id, orderSum, SumTotal ,sumOrderTime
    // function processReqData(data) {
    //   if (menuString) {
    //     menuString += `, ${data.menuName}`;
    //   } else {
    //     menuString = data.menuName;
    //   }
    //   total += data.price;
    //   console.log("현재 메뉴 ", menuString);
    // }

    // processReqData(reqData);
    // console.log("누적된 메뉴 ", menuString);

    //------------

    const addedOrder = await Order.create(
      {
        cus_order_id: reqData.cus_order_id,
        shop_order_id: reqData.shop_order_id,
        menuName: reqData.menuName,
        user_id: "as", // ??????????? 여기 id???
        price: reqData.price,
        totalPrice: reqData.totalPrice,
        visitors: reqData.visitors,
        isTakeout: reqData.isTakeout,
        orderTime: reqData.orderTime,
        option: reqData.option,
        progress: reqData.progress,
        visitTime: reqData.visitTime,
      },
      { transaction: t } //---- 트랜잭션 추가
    );

    //---  ㅌ코ㅗ
    // 기존 OrderSummaryMenu에서 sumOrderTime이 같은 데이터 확인
    const existingSummary = await OrderSummaryMenu.findOne({
      where: {
        sumOrderTime: reqData.orderTime, // 동일한 주문 시간 기준
      },
      transaction: t,
    });
    if (existingSummary) {
      // 기존 데이터가 있으면 업데이트
      menuString = `${existingSummary.orderSum.menuNames}, ${menuString}`;
      total += existingSummary.sumTotal;

      await OrderSummaryMenu.update(
        {
          orderSum: { menuNames: menuString },
          sumTotal: total,
          sumOrderTime: reqData.orderTime, // 최신 주문 시간 유지
        },
        {
          where: {
            id: existingSummary.id,
          },
          transaction: t,
        }
      );

      console.log("OrderSummary 업데이트 완료:", menuString);
    } else {
      // 기존 데이터가 없으면 새로 생성
      await OrderSummaryMenu.create(
        {
          sum_cus_id: reqData.cus_order_id,
          sum_shop_id: reqData.shop_order_id,
          orderSum: { menuNames: menuString },
          sumTotal: reqData.totalPrice,
          sumOrderTime: reqData.orderTime,
        },
        { transaction: t }
      );

      console.log("OrderSummary 생성 완료:", menuString);
    }
    //=====

    //------------OrderSummary 추가
    // if (total == reqData.totalPrice)
    // if (reqData.totalPrice) {
    //   const addOrderSum = await OrderSummaryMenu.create(
    //     {
    //       sum_cus_id: reqData.cus_order_id,
    //       sum_shop_id: reqData.shop_order_id,
    //       orderSum: { menuNames: menuString },
    //       sumTotal: reqData.totalPrice,
    //       sumOrderTime: reqData.orderTime,
    //     },
    //     { transaction: t } //--- 트랜잭션 추가
    //   );
    //   console.log("OrderSummary 저장 완료:", addOrderSum);
    //   console.log("---------ordersum---------");
    // } else {
    //   console.log(
    //     "조건 불일치: total =",
    //     total,
    //     "totalPrice =",
    //     reqData.totalPrice
    //   );
    // }
    //---------------------

    await t.commit(); // ---- 트랜잭션 커밋
    //------------

    res.status(200).json({ message: "주문이 완료되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
