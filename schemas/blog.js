const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
    {
        articleId: {
            type: Number,
            required: true,
            unique: true,
        },
        title: {
            type:String,
            required: true,
        },
        content: {
            type:String,
            required: true,
        },
        authorId: {
            type: Number,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        articlePassword: {
            type:String,
            required:true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Articles", blogSchema);