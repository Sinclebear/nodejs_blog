const express = require("express"); // express 모듈 가져오기
const app = express();
const port = 3000;

const goodsRouter = require("./routes/goods");

// 미들웨어는 순서가 중요..
const requestMiddleware = (req, res, next) => {
    console.log("Request URL: ", req.originalUrl, " - ", new Date());
    next(); // 하단의 라우터로 이동
}

app.use(requestMiddleware);

app.use("/api", goodsRouter);

app.get("/", (req, res) => {
    res.send("Hello World!!@");
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜짐");
});

