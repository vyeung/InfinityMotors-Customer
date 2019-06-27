var bodyParser = require('body-parser')
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

//cors stuff 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

//register the controllers
app.use(require("./controller/CustomerController"));

app.listen(3000, () => {
  console.log("Server Running at port 3000");
});