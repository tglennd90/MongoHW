const express = require("express");
const router = express.Router();
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const colors = require("colors");
const db = require("../models");

// const Comment = require("../models/Comments.js");
// const Article = require("../models/Articles.js");



router.get("/", function(req, res) {
    db.Articles.find({})
            .then(article => res.render("index", { article }))
            .catch(function(err){
                res.json(err)
            })
});

router.get("/scrape", function(req,res) {
    request("http://www.theverge.com", function(error, response, html) {
        let $ = cheerio.load(html);
        let titlesArray = [];

        $(".c-entry-box--compact__title").each(function(i, element) {
            let result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");   
            
            if(result.title !== "" && result.link !== ""){
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);

                    db.Articles.count({ title: result.title }, function(err, test) {
                        if (test === 0) {
                            let entry = new db.Articles(result);

                            entry.save(function(err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            })
                        }
                    })
                } else {
                    console.log("Article already exists.".bgYellow.black);
                }
            } else {
                console.log("Not saved to DB, missing data".bgRed.white);
            }
        });
        res.redirect("/");
        // res.json();
    });
});

router.get("/articles", function(req, res) {
    db.Articles.find({})
            .then(article => res.render("articles", { article }))
            .catch(function(err){
                res.json(err)
            })
});

router.get("/articles-json", function(req, res) {
    db.Articles.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

router.get("/clearAll", function(req, res) {
    db.Articles.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all Articles".yellow);
        }
    });
    res.redirect("/");
});

router.get("/readArticle/:id", function(res, res) {
    let articleId = req.params.id;
    let hbsObj = {
        article: [],
        body: []
    };

    db.Articles.findOne({ _id: articleId }).populate("comment").exec(function(err, doc) {
        if (err) {
            console.log("Error: ".red + err);
        } else {
            hbsObj.article = doc;
            let link = doc.link;

            request(link, function(error, response, html) {
                let $ = cheerio.load(html);

                $(".l-col__main").each(function(i, element) {
                    hbsObj.body = $(this).children(".c-entry-content").children("p").text();

                    res.render("article", hbsObj);
                    return false;
                })
            })
        }
    })
});

router.post("/comment/:id", function(req, res) {
    let user = req.body.name;
    let content =  req.body.comment;
    let articleId = req.params.id;

    let commentObj = {
        name: user,
        body: content
    };

    let newComment = new Comment(commentObj);

    newComment.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc._id);
            conosole.log(articleId);

            db.Articles.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: doc._id } }, { new: true }).exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/readArticle/" + articleId);
                }
            })
        }
    })
});

module.exports = router;