const express = require('express'),
      router  = express.Router(),
      dao     = require('../db/access.js'),
      sanitizer = require('sanitizer');


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
    dao.allPosts(results => {
        res.render("feed", { posts: results });
    });
});

router.post("/post", (req, res) => {
    const content = sanitizer.sanitize(req.body.content),
          media   = req.body.media;

    if (content) {
        dao.createPost(req.session.username,
                        sanitizer.sanitize(req.body.content),
                        media, function(post) {
                            console.log(post);
                            res.redirect("/app/feed");
                        });
    } else {
        res.send('Improper use of form');
    }
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
