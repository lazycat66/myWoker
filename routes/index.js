module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {title: 'Home'});
    });

    app.get('/login', function (req, res) {
        res.render('login', {title: 'Login'});
    });

    app.get('/register', function (req, res) {
        res.send('coming soon...');
    });
};
