# Node.js 와 Express 로 구현하는 미니 블로그

## 이 프로젝트에 대해
로그인 기능이 없는 나만의 항해 블로그 만들기

## 사용된 기술
```
express 4.17.2
mongoose 6.1.7
ejs 3.1.6
mongoose-sequence 5.3.1
mongodb 4.4
```

## 추가 구현 한다면?
1. 비밀번호를 평문으로 보내고, 저장도 평문으로 하고있음.
   - bcrypt 등의 해시 암호 알고리즘을 사용해 개선

2. pagination 구현?
   - 한 화면에 12~15개의 글만 보이게 하고, 나머지는 페이지로 나눠서 이동할 수 있게 변경.

