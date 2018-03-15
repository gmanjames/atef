const express = require('express'),
      router  = express.Router(),
      dao     = require('../dao/access.js'),
      sanitizer = require('sanitizer');

const eventRepo = require('../dao/eventRepository.js');
const stringifier  = require('stringifier'),
      stringify    = stringifier({maxDepth: 3});


router.use(auth);

router.get("/home", (req, res) => {
    eventRepo.findAll(function(errors, results) {
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
    dao.allUsers(function(errors, results) {
        if (errors) {
            res.send('An error occured: ' + errors);
        } else {
            res.render("users", { users: results });
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
                const msg_str = "Created a new post, '" + req.body.content.substring(0, 10) + "...'";
                /* TODO: I am literally selecting an arbitrary user's id...
                 * THIS IS ONLY FOR TESTING and will need to be changed obvi.
                 */
                eventRepo.save(req.session.username, [1], msg_str, function(errors, results) {
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

// MIDDLEWARE
function auth(req, res, next) {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = router;
