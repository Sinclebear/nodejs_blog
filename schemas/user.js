const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        authorId: {
            type: Number,
            required: true,
            unique: true,
        },
        authorName: {
            type:String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);