module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: 'express',
            content: 'sdfsdfsdfsdfsdfsdf'
        });
    });

    app.get('/user', function (req, res) {
        // res.send('This User Page');
        res.render('user', {
            title: 'user',
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
