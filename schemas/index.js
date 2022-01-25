const mongoose = require("mongoose");

const connect = () => {
    // ignoreUndefined: .. undefined로 넘어오는 값은무시 하도록 설정
    // mongoose.connect("mongodb://localhost:27017/spa_database", { ignoreUndefined: true }).catch((err) => {
        mongoose.connect("mongodb://localhost:27017/blog_database", { ignoreUndefined: true }).catch((err) => {
        console.error(err)
    });
};

module.exports = connect;