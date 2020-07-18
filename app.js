const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const Article = require('./model/article');

const app = express();
const port = process.env.PORT || 3000;

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//using single routes with all targeting article
app.route('/api/articles')
.get((req, res) => {

    Article.find((err, success) => {
        if(err) {
            res.json({ message: err });
        }else {
            res.json(success);
        }
    });

})
.post((req, res) => {
    // console.log(req.body.title);
    //for post u can catch it with body (bcs we have import a parser) and params like e.g title

    try {
        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });

        newArticle.save();
    } catch (error) {
        res.json({ message : error });
    }
});

//using specific route

app.route('/api/articles/:articleTitle')
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, success) => {
        if(success) {
            res.json(success);
        } else {
            res.json({ message: err });
        }
    });
})
.put((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}, (err) => {
            if(!err) {
                res.send("Success Update !");
            } else {
                res.json({ message: err });
            }
        });
})
.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if(!err) {
                res.send("Success Update Field");
            } else {
                res.json({ message: err });
            }
        });
})
.delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err) => {
            if(!err) {
                res.send("Succes Delete Field");
            } else {
                res.json({ message: err });
            }
        })
});



//listen me babe
app.listen(port, () => {
    console.log("Starting server 🦊 on " + port);
});