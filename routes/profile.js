const express = require('express'),
      router  = express.Router();


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


// MIDDLEWARE
function auth(req, res, next) {
    if (!req.session.username) {
        res.render('begin');
    } else {
        next();
    }
};

module.exports = router;
