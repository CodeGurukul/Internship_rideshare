var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var app =express();

app.set('views', __dirname + '/server/views');
app.set('view engine','jade');

//app.use is used to use middlewares
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'Codegurukul',
  store: new MongoStore({ url: 'mongodb://localhost/rideshare', autoReconnect: true })
}));


app.use(express.static('public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Mongoose Connection with MongoDB
mongoose.connect('mongodb://localhost/rideshare');
console.log('local mongodb opened');

app.listen(3000);
console.log("Express server is listening at port 3000");