const express = require('express'),
      router  = express.Router(),
      dao     = require('../db/access.js'),
      sanitizer = require('sanitizer');

const stringifier  = require('stringifier'),
      stringify    = stringifier({maxDepth: 3});


router.use(auth);

router.get("/home", (req, res) => {
    res.render('home', { username: req.session.username });
});

router.get("/logout", (req, res) => {
    req.session.destroy(errors => {
        if (errors) {
            res.send('An error occured: ' + errors);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/users", (req, res) => {
    dao.allUsers().then(results => {
        res.render("users", { users: results });
    }).catch(errors => {
        res.send('An error occurred: ' + errors);
    });
});

router.get("/feed", (req, res) => {
    dao.allPosts((errors, results) => {
        res.render("feed", { posts: results });
    });
});

router.post("/post", (req, res) => {
    const content = sanitizer.sanitize(req.body.content),
          media   = req.body.media;

    if (content) {
        dao.createPost(
            req.session.username,
            sanitizer.sanitize(req.body.content),
            media,
            req.body.id,
            req.body.has_replies,
            function(errors, results) {
                if (errors) {
                    res.send(errors);
                } else {
                    res.redirect("/app/feed");
                }
            });
    } else {
        res.send('Improper use of form');
    }
});

router.get("/getComments", (req, res) => {
    const postId = req.query.postId;
    dao.getComments(postId, function(errors, results) {
        if (errors) {
            res.send(errors);
        } else {
            res.render('partials/post', {comments: results});
        }
    });
});

// MIDDLEWARE
function auth(req, res, next) {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = router;
