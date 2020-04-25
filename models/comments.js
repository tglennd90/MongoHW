const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let CommentSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    }
});

let Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;