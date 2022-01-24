const express = require("express");
const Goods = require("../schemas/goods"); // schemas 내에 있는 모델
const Cart = require("../schemas/cart");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("this is api root page");
});

// const goods = [
//     {
//       goodsId: 4,
//       name: "상품 4",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
//       category: "drink",
//       price: 0.1,
//     },
//     {
//       goodsId: 3,
//       name: "상품 3",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
//       category: "drink",
//       price: 2.2,
//     },
//     {
//       goodsId: 2,
//       name: "상품 2",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
//       category: "drink",
//       price: 0.11,
//     },
//     {
//       goodsId: 1,
//       name: "상품 1",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
//       category: "drink",
//       price: 6.2,
//     },
//   ];

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
// /goods/:abcd <- :이하는 아무거나 받겠다는 것
// 특정 goodsId를 가진 것만 조회. findOne
router.get("/goods/:goodsId", async (req, res) => {
	//const goodsId = req.params.goodsId;
	const { goodsId } = req.params; // localhost:3000/api/goods/1, 2, ... <- 여기서 req.params는 { goodsId : '1' }, goodsId = 1
	console.log(req.params);
	console.log(goodsId);

	/* 어떻게 저렇게 줄여썼나요?????
	 * 
	 *
	 * 
	구현 1, filter는 리턴값으로 늘 배열을 주고 그 중 [0] 번째 항목만 필요
	res.json({
	    detail: goods.filter((item) => item.goodsId === Number(goodsId))
	})[0];

	구현 2, detail: 내의 함수를 별도 const 변수로 빼냄
	const filteredItems = goods.filter((item) => item.goodsId === Number(goodsId))
	res.json({
	    detail: filteredItems[0],
	});

	구현 3, 배열의 [0]번째 값만 필요하므로, filteredItems -> []로 배열을 풀어낸다. -> 비구조화 (destructuring)

	let x = [1,2,3,4,5]
	let [y, z] = x; // y === 1, z === 2  -> 구조 분해 할당

	const [detail] = goods.filter((item) => item.goodsId === Number(goodsId))
	res.json({
	    detail: detail,
	});

	구현 4, detail: detail, <-- 두 변수명이 같을경우 하나를 생략하여 객체 초기자를 이용한 약식 표기
	상단 json 데이터를 가지고 테스트 한 것.
	const [detail] = goods.filter((item) => item.goodsId === Number(goodsId)) 
	
	*
	*
	*/


	// 데이터베이스에서 goods 정보 찾아오기
	// const goods = await Goods.find({ goodsId: Number(goodsId) });

	// .find() 의 결과는 값 하나가 아닐 수 있으므로 배열로 처리. 변수를 destructuring. 
	//const [goods] = await Goods.find({ goodsId: Number(goodsId) });

	// const [goods] ... res.json ({ detail: goods }); 형태로 다시 넣는 것보다, 상하단의 변수 이름 일치시켜서 두번 작업하는걸 줄임. 약식
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
	// const goodsId = req.body.goodsId; 
	// const name = req.body.name;
	// const thumbnailUrl = req.body.thumbnailUrl;
	// 비구조화 - destructuring 하면 한번에 다 가져올 수 있음.
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

router.get("/goods/cart", async (req, res) => {
    const carts = await Carts.find();
    const goodsIds = carts.map((cart) => cart.goodsId);
    // 위 내용을 풀어쓰면..
    // const goodsIds = carts.map((cart) => {
    //     return cart.goodsId;
    // });

    // console.log(carts.map((cart) => {
    //     return {
    //         goods : cart.goodsId,
    //         quantity : cart.quantity
    //     };
    // }));

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

    // 위 내용 약식으로 표현 시, object를 return 하기 위해 {}이 겹치므로 object를 () 로 감싸준다.
    // res.json({
    //     carts : carts.map((cart) => ({
    //         quantity: cart.quantity,
    //         goods: goods.find((item) => item.goodsId === cart.goodsId),
    //     })), 
    // })
});

module.exports = router; // 다른 페이지에서 사용할 수 있도록 모듈로서 내보내기