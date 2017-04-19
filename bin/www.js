#!/usr/bin/env node

var debug = require('debug')('blog');
var app = require('../app');

app.set('port', process.env.PORT || 3088);

var server = app.listen(app.get('port'), function () {
    debug('PORT ' + server.address().port);
});
