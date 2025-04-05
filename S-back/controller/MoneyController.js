const db = require('../models'); // 모델 가져오기

const Customer = db.Customer; // 고객 모델
const Owner = db.Owner; // 점주 모델
const Wallet = db.Wallet; // 고객 지갑 모델
const OwnerWallet = db.OwnerWallet; // 점주 지갑 모델

// 머니 충전 메서드
exports.chargeMoney = async (req, res) => {
  const { amount, userId, type } = req.body;

  // 금액 유효성 검사
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: '유효한 금액을 입력하세요.' });
  }

  try {
    let wallet;

    // 사용자 유형에 따라 처리
    if (type === 'individual') {
      const user = await Customer.findOne({ where: { user_id: userId } });
      console.log('user.id:', user.id);
      wallet = await Wallet.findOne({ where: { customer_id: user.id } });
    } else if (type === 'business') {
      const user = await Customer.findOne({ where: { userid: userId } });

      wallet = await OwnerWallet.findOne({ where: { owner_id: user.id } });
    }
    console.log('wallet:', wallet);
    if (!wallet) {
      return res
        .status(402)
        .json({ message: '사용자의 지갑을 찾을 수 없습니다.' });
    }

    // 금액 충전
    wallet.chargedMoney += amount;
    wallet.totalMoney += amount;
    wallet.chargeTime = new Date();
    await wallet.save();

    return res.status(200).json({
      message: '머니 충전이 완료되었습니다.',
      balance: wallet.totalMoney, // 총 잔액 반환
    });
  } catch (error) {
    console.error('머니 충전 오류:', error.message);
    return res
      .status(500)
      .json({ message: '머니 충전 중 오류가 발생했습니다.' });
  }
};
