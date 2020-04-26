const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoHW";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const Schema = mongoose.Schema;

let ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;