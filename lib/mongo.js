var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

mongolass.connect(config.mongodb);

mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFndOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
})

exports.User = mongolass.model('User', {
    name: {
        type: 'string'
    },
    password: {
        type: 'string'
    },
    // avatar: {
    //     type: 'string'
    // },
    gender: {
        type: 'string',
        enum: ['male', 'female', 'secret']
    },
    introduce: {
        type: 'string'
    }
})

exports.User.index({
    name: 1
}, {unique: true}).exec();
