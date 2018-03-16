const dao          = require('../dao/access.js');
const express      = require('express');
const eventRepo    = require('../dao/eventRepository.js');
const router       = express.Router();
const sanitizer    = require('sanitizer');
const stringifier  = require('stringifier');
const stringify    = stringifier({maxDepth: 3});
const bodyParser   = require('body-parser');

router.use(auth);

router.get("/home", (req, res) => {
    eventRepo.findByOrgId(req.session.userId, function(errors, results) {
        if (errors) {
            res.send("An error occurred: " + errors);
        } else {
            res.render('home', { username: req.session.username, events: results });
        }
    });
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
    dao.allUsers(function(errors, users) {
        if (errors) {
            res.send('An error occured: ' + errors);
        } else {
            dao.getSubscribed(req.session.userId, function(errors, results) {
                if (errors) {
                    res.send('An error occured: ' + errors);
                } else {
                    console.log(results);
                    res.render("users", { users: users, subscribed: results });
                }
            });
        }
    });
});

router.get("/feed", (req, res) => {
    dao.allPosts((errors, results) => {
        res.render("feed", { posts: results });
    });
});

router.post("/post", (req, res) => {

    dao.createPost(
        req.session.username,
        req.body.content,
        req.body.media,
        req.body.id,
        req.body.has_replies,

        function(errors, results) {
            if (errors) {
                res.send("An error occurred: " + errors);
            } else {
                let post    = results;
                let msg_str = "";

                if (req.body.has_replies === "0") {
                    msg_str += "commented, ";
                } else {
                    msg_str += "posted, ";
                }

                msg_str += "\"" + req.body.content.substring(0, 14) + "...\"";
                console.log(msg_str);

                eventRepo.save(req.session.userId, msg_str, function(errors, results) {
                    if (errors) {
                        res.send("An error occurred: " + errors);
                    } else {
                        res.redirect("/app/feed");
                    }
                })
            }
        })
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

router.post("/unsubscribe", (req, res) => {
    const id = req.body.id;
    console.log(id + ", " + req.session.userId);
    eventRepo.unsubscribe(req.session.userId, id, function(errors, results) {
        if (errors) {
            res.send("An error occurred: " + errors);
        } else {
            res.send(results);
        }
    });
});

router.post("/subscribe", (req, res) => {
    const id = req.body.id;
    eventRepo.subscribe(req.session.userId, id, function(errors, results) {
        if (errors) {
            res.send("An error occurred: " + errors);
        } else {
            res.send(results);
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
