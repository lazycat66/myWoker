module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {title: 'Home'});
    });

    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'login',
            content: 'test list',
            list: [
                1,
                2,
                3,
                4,
                5,
                6
            ]
        });
    });
};
