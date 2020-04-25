const bodyParser = require("body-parser");
const colors = require("colors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const express = require("express");
const app = express();

app.use(morgan("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static(process.cwd() + "/public"));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/MongoHW");

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error: ".bgRed.white));
db.once("open", function() {
    console.log(" ");
    console.log("You're an animal baby! (Connected to Mongoose)".green);
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(" ");
    console.log("Like, let's go Scoob! ".green + "http://localhost:".green + PORT)
});