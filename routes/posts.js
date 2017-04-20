var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
    res.render('posts', {title: 'Six Blog'});
});

router.post('/', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/create', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postID', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postID/edit', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postID/remove', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postID/comment', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postID/comment/:commentID/remove', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

module.exports = router;
