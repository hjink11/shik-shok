const { Shop } = require("../models");

exports.getIndex = (req, res) => {
  res.send("response from api-server: [GET /api-server]");
};

exports.getOwner = async (req, res) => {
  try {
    console.log(req.query.userId); // 사용자 id number

    const shops = await Shop.findAll({
      where: { owner_id: req.query.userId },
      attributes: ["id", "shopName"], //가게아이디와 가게이름만 조회
    });

    res.status(200).json({ shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
