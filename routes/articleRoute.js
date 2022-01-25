const express = require("express");
const Articles = require("../schemas/blog"); // schemas 내에 있는 모델
const Users = require("../schemas/user");
const router = express.Router();

// router.get("/", (req, res) => {
// 	res.send("this is blog api root page");
// });

// /recent 에 get 요청 시, 블로그 글 최신 작성 순으로 전체 목록 조회. timestamp 어떻게?
router.get("/", async (req, res) => {
	const articles = await Articles.find().sort({createdAt: 'desc'}); // 작성시간 순으로, 최신부터 불러오도록 역순 정렬

	res.status(200).render('index', { articles: articles } );
    // res
    // .status(200)
    // .json({
    //     articles,
    // });
});

router.get("/write", (req, res) => {
	const article = ""; // write.ejs는 modify 부분과 같이 쓰므로, 
						//새 글 쓰기 일 경우 !article 이 true 로 넘길 수 있도록 빈 스트링값 전달
	res.status(200).render('write', {article: article});
});

// articleId 무작위 생성용 함수. min ~ max-1 사이 정수 반환
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

// 글 생성, 입력
router.post("/write", async (req, res) => {
	const { title, content, authorName, articlePassword } = req.body;
	console.log(req.body);
	let articleId = getRandomInt(1,100000); // 얘도 데이터베이스에서 자동부여여야 할거같은데.. auto increment 같은
	let authorId = 1; // 현재 개인 블로그라고 가정했으므로 사용자 = 1 로 고정
    
    // const article = await Articles.find({ articleId }); // articleId는 auto_increment 등 사용하여 겹칠일이 없으므로 불필요하지만, 선언

	const postArticle = await Articles.create({ articleId, title, content, authorId, authorName, articlePassword });
	// res.json({ article: postArticle });
	res.status(201).json({'result': 'success', 'msg': '글이 등록되었습니다.'})
});

router.get("/:articleId", async (req, res) => {
	const { articleId } = req.params; // localhost:3000/api/articles/1, 2, ... <- 여기서 req.params는 { articleId : '1' }, articleId = 1
	const [article] = await Articles.find({ articleId: Number(articleId) });
	res.status(200).render('read', { article: article } ); // read.ejs 의 내용 render, articleId 값이 일치하는 article 내용 전달
});

// 블로그 글 수정 페이지.
router.get("/:articleId/modify", async (req, res) => {
	const { articleId } = req.params;

	const [article] = await Articles.find({ articleId: Number(articleId) });
	res.status(200).render('write', {article:article} );
});

router.patch("/:articleId/modify", async (req, res) => {
	const { title, content, authorName, articlePassword, articleId } = req.body;
	const [article] = await Articles.find({ articleId: Number(articleId) });
	console.log(article.articlePassword);
	console.log(articlePassword);
	if (article.articlePassword !== articlePassword){
		res.status(400).json({'result': 'error', 'msg': '비밀번호가 일치하지 않습니다.'}) // 이거 대체 뭘로 줌? response? error?
	} else {
		const modifyArticle = await Articles.updateOne({ articleId: Number(articleId)}, {$set: {title:title, content:content, authorName:authorName }});
		res.status(201).json({'result': 'success', 'msg': '글이 수정되었습니다.'})
	}	
});

// 장바구니 삭제
router.delete("/:articleId/modify", async (req, res) => {
	const { articleId } = req.params;
	const existsArticle = await Articles.find({ articleId: Number(articleId) });
	if (existsArticle.length) { // existsArticle 배열의 길이가 0이 아닌 경우 = 쿼리 결과가 있는 경우
		await Articles.deleteOne({ articleId: Number(articleId) });
	}

	res.status(200).json({'result': 'success', 'msg': '글이 삭제되었습니다.'});
});

module.exports = router;