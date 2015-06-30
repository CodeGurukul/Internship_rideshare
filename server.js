var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

app.get('/auth/google',
  passport.authenticate('google', { 
  	scope: 'https://www.googleapis.com/auth/plus.login'
  	 }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect Ride share home.
    res.redirect('/');
  });

app.use(express.static('public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Mongoose Connection with MongoDB
mongoose.connect('mongodb://localhost/rideshare');
console.log('local mongodb opened');

app.listen(3000);
console.log("Express server is listening at port 3000");
