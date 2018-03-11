const express = require('express'),
      router  = express.Router(),
      dao     = require('../db/access.js');


router.use(auth);

router.get("/home", (req, res) => {
    res.render('home', { username: req.session.username });
})

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
    dao.allPosts().then(results => {
        res.render("feed", { posts: results });
    }).catch(errors => {
        res.send('An error occurred: ' + errors);
    });
});

router.post("/post", (req, res) => {
    dao.savePost(req.session.username, req.body.content).then(results => {
        res.redirect("/profile/feed");
    }).catch(errors => {
        res.send('An error occurred: ' + errors);
    });
});


// MIDDLEWARE
function auth(req, res, next) {
    if (!req.session.username) {
        res.render('begin');
    } else {
        next();
    }
};

module.exports = router;
