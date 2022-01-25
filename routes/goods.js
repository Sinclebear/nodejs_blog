const express = require("express");
const Goods = require("../schemas/goods"); // schemas 내에 있는 모델
const Cart = require("../schemas/cart");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("this is api root page");
});

// /api/goods/. app.js 에서 goodsRouter 정의를 /api로 했으니, /api 가 디폴트 경로임.
// /goods 에 get 요청 시, 전체 목록 조회
router.get("/goods", async (req, res) => {
	// req.query ..  웹 접근 주소 이하 '?' 로 시작하는 query string 의 값을 객체로 가져옴.
	const { category } = req.query;

	console.log("category?", category);

	const goods = await Goods.find({ category });

	res.json({
		goods, // goods:goods (javascript shorthand property, 객체 초기자 .. 같은 이름의 key:value 를 참조하는 경우 생략 가능)
	});
});

router.get("/goods/cart", async (req, res) => {
    const carts = await Cart.find();
    const goodsIds = carts.map((cart) => cart.goodsId);
    const goods = await Goods.find({ goodsId: goodsIds})

    console.log(goods);

    res.json({
        carts : carts.map((cart) => {
            return {
                quantity: cart.quantity,
                goods: goods.find((item) => item.goodsId === cart.goodsId),
            };
        }), 
    })
});

// 특정 goodsId를 가진 것만 조회. findOne
router.get("/goods/:goodsId", async (req, res) => {
	//const goodsId = req.params.goodsId;
	const { goodsId } = req.params; // localhost:3000/api/goods/1, 2, ... <- 여기서 req.params는 { goodsId : '1' }, goodsId = 1
	console.log(req.params);
	console.log(goodsId);

	const [detail] = await Goods.find({ goodsId: Number(goodsId) });

	res.json({
		detail,
	});
});

// goodsId를 quantity와 함께 장바구니에 담는 기능
router.post("/goods/:goodsId/cart", async (req, res) => {
	const { goodsId } = req.params;
	const { quantity } = req.body;

	const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
	if (existsCarts.length) {
		return res.status(400).json ({ success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다." });
	}

	await Cart.create({ goodsId: Number(goodsId), quantity });
	res.json({ success: true });

});

// 장바구니 삭제
router.delete("/goods/:goodsId/cart", async (req, res) => {
	const { goodsId } = req.params;

	const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
	if (existsCarts.length) {
		await Cart.deleteOne({ goodsId: Number(goodsId) });
	}

	res.json({ success: true });
});

// 장바구니 수량 업데이트
router.put("/goods/:goodsId/cart", async (req, res) => {
	const { goodsId } = req.params;
	const { quantity } = req.body;

	const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
	if (!existsCarts.length) { // 장바구니에 상품이 없는 경우
		return res.status(400).json({ success: false, errorMessage: "장바구니에 해당 상품이 없습니다." });
	}

	if(quantity < 1) { // 장바구니 수량을 1 미만으로 작성한 경우
		return res.status(400).json({ success: false, errorMessage: "상품 수량은 1 이상이어야 합니다."});
	}

	await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });

	res.json({ success: true });
});


// 제품 생성, 입력
router.post("/goods", async (req, res) => {
	const { goodsId, name, thumbnailUrl, category, price } = req.body;

	const goods = await Goods.find({ goodsId }); // Goods.find(); 는 promise 를 반환하므로, await 을 사용하여 비동기 함수 형태로 처리. 상단에도 async
	if (goods.length) {
		return res
		.status(400)
		.json({ success: false, errorMessage: "이미 있는 데이터입니다." });
	}
	const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });
	res.json({ goods: createdGoods });
});



module.exports = router; // 다른 페이지에서 사용할 수 있도록 모듈로서 내보내기