const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("this is api root page");
});

// /api/goods/. app.js 에서 goodsRouter 정의를 /api로 했으니 디폴트 경로임.
router.get("/goods", (req, res) => {
    res.send("this is goods page");
});

module.exports = router; // 다른 페이지에서 사용할 수 있도록 모듈로서 내보내기