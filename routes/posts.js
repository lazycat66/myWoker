var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
    var author = req.query.author;

    PostModel.getPosts(author).then(function (posts) {
        res.render('posts', {
            posts: posts
        });
    }).catch(next);
});

router.post('/', checkLogin, function (req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    try {
        if (!title.length) {
            throw new Error('请输入标题');
        }
        if (!content.length) {
            throw new Error('请输入内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    }

    PostModel.create(post).then(function (result) {
        post = result.ops[0];
        req.flash('success', '发表成功');
        res.redirect('/posts/' + post._id);
    }).catch(next);
});

router.get('/create', checkLogin, function (req, res, next) {
    res.render('create', { title: 'create' });
});

router.get('/:postID', checkLogin, function (req, res, next) {
    var postId = req.params.postId;

    Pomise.all([
        PostModel.getPostById(postId),
        PostModel.incPv(postId)
    ]).then(function (result) {
        var post = result[0];
        if (!post) {
            throw new Error('not here');
        }
        res.render('post', {
            post: post
        });
    }).catch(next);
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
