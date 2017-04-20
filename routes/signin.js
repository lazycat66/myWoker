var md5 = require('md5');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin', {title: 'sigin in'});
});

router.post('/', checkNotLogin, function (req, res, next) {
    console.log(req)
    var name = req.fields.name;
    var password = req.fields.password;

    UserModel.getUserByName(name).then(function (user) {
        console.log(user)
        if (!user) {
            req.flash('error', '用户不存在')
            return res.redirect('back');
        }
        if (md5(password) !== user.password) {
            req.flash('error', '用户名或密码错误')
            return res.redirect('back');
        }
        req.flash('success', '登录成功!');
        delete user.password;
        req.session.user = user;
        res.redirect('/posts');
    }).catch(next);
});

module.exports = router;
