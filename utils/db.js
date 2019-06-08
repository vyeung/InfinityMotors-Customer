var mysql = require('mysql');
var config = require('./config.json');

var connection = mysql.createConnection({
  host     : config.DB_HOST,
  user     : config.DB_USER,
  password : config.DB_PASSWORD,
  database : config.DB_DATABASE
});

module.exports = connection;