const mongoose = require("mongoose");

const connect = () => {
    // ignoreUndefined: .. undefined로 넘어오는 값은무시 하도록 설정
    // local test의 경우
    // mongoose.connect("mongodb://localhost:27017/blog_database", { ignoreUndefined: true }).catch((err) => {
    // EC2 ubuntu 의 경우
        mongoose.connect("mongodb://test:test@localhost:27017/blog_database?authSource=admin&w=1",
            { ignoreUndefined: true }).catch((err) => {
        console.error(err)
    });
};

module.exports = connect;