/**
 * Created by pro on 15/4/16.
 */

var db_config = require('../../config/db_config.json');

var mongoose = require('mongoose');

mongoose.connect(db_config.mongodb.hostDB);

var db = mongoose.connection;

//连接错误
db.on('error',function(err){
  console.log('err');
});

//链接成功
db.on('success', function(err){
    console.log('mongodb connection success');
})

module.exports = {
    db : db,
    mongoose : mongoose
}
