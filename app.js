var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var bodyParser = require("body-parser");
var config = require('./config/default');
var routes = require('./routes');
var pkg = require('./package');

// mongodb
var MongoStore = require('connect-mongo')(session);

var app = express();

// 设置 ejs来渲染views中的页面文件
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({url: config.mongodb})
}));
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    encoding: 'utf-8',
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true, // 保留后缀
    multiples: true
}));

app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
routes(app);
app.listen(config.port, function () {
    console.log(pkg.name + ' listening on port ' + config.port);
});

module.exports = app;
