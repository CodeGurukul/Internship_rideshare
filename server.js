var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app =express();

//Require models
var User = require('./server/models/User');
var Course = require('./server/models/Viewport');
var passportConf = require('./server/config/passport')

//Require Controllers
var userController = require('./server/controllers/user');
var viewportController = require('./server/controllers/viewport');
//var homeController = require('./server/controllers/home');

app.set('views', __dirname + '/server/views');
app.set('view engine','jade');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'Codegurukul',
  store: new MongoStore({ url: 'mongodb://localhost/rideshare', autoReconnect: true })
}));

app.use(express.static('public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

var drivers = [];

var passengers = [{name: 'Pratham'}, {name: 'Prabhu'}];


app.get('/', viewportController.getIndex);
// app.get('/addcourse', courseController.getAddCourse);
// app.post('/addcourse', courseController.postAddCourse);
// app.get('/viewcourses', courseController.getViewCourses);
// app.post('/deletecourse/:id', courseController.postDeleteCourse);
app.get('/signup', userController.getSignUp);
app.post('/signup', userController.postSignUp);
app.post('/signin', userController.postSignIn);
app.get('/signout', userController.getSignOut);
//app.use is used to use middlewares

//facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


// integrted google login--check
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

app.get('/driver',function(req,res){
        res.render('driver');
    });
app.get('/passenger',function(req,res){
        res.render('passenger');
    });
app.get('/output',function(req,res){
        res.render('output');
        console.log(passengers)
    });
app.post('/passenger',function(req,res){
        var user = new User({profile:{name:req.body.uname},
    	type:"passenger",
    	phone_no:req.body.contact,
    	origin:{city:req.body.pick},
    	destination:{city:req.body.drop}
      //  email:req.body.email,
    //    password:req.body.password
    })
         user.save();
        res.redirect('output');
    });   

app.post('/driver', function(req, res) {
  var driver = {
    name: req.body.uname,
    email:req.body.email
  };

  drivers.push(driver);

  var data = {
    driver: driver,
    passengers: passengers
  };

  res.render('passenger', data);
});

app.get('/result', function(req, res) {
  var data = {
    driverName: '',
    passengerNames: []
  };

  data.driverName = req.query.driverName;
  data.passengerNames = data.passengerNames.concat(req.query.passengerNames);

  res.render('result', data);
});

app.post('/api/passengers', function(req, res) {
  var data = {
    passengerNames: req.body.passengerNames,
    driverName: req.body.driverName
  };

  var qs = querystring.stringify(data);
  res.redirect('/result?' + qs);
});


// app.post('/driver',function(req,res){
//         var user = new User({profile:{name:req.body.uname},
//     	type:"driver",
//     	phone_no:req.body.contact,
//     	origin:{city:req.body.pick},
//     	destination:{city:req.body.drop}
//       //  email:req.body.email,
//     //    password:req.body.password
//     })
//             user.save();
//             console.log("heyyyy")
//   			res.redirect('/select');
        
//     });

// // getting issues with connecting for dashboard
//  drivers.push(driver);

//   var data = {
//     driver: driver,
//     passengers: passengers
//   };

//   res.render('passengers', data);
// });

app.get('/result', function(req, res) {
  var data = {
    driverName: '',
    passengerNames: []
  };

  data.driverName = req.query.driverName;
  data.passengerNames = data.passengerNames.concat(req.query.passengerNames);

  res.render('result', data);
});

app.post('/api/passengers', function(req, res) {
  var data = {
    passengerNames: req.body.passengerNames,
    driverName: req.body.driverName
  };

  var qs = querystring.stringify(data);
  res.redirect('/result?' + qs);
});


//To be done .. edit to connect two users
//app.post('/postData',function(req,res){
    // var index =req.user.eventsCreated.indexOf(req.params.id)
    // console.log(index);
    //         if(index!=-1)
    //          {       
    //             console.log(index);
    //             User.find({email:req.body.eventInvite},function(err,user){
    //                 if(user[0])
    //                 {
    //                     User.findByIdAndUpdate(user[0]._id,{$push: {"invites": req.params.id}},
    //                     function(err, model)
    //                      {
    //                         res.redirect('/view-event');
    //                     });
    //                 }
    //                 else
    //                 {
    //                     console.log('User not found');
    //                     res.redirect('/view-event');
    //                 }



    //             });
    //         }
    //         else
    //         {
    //             console.log("Not Authorized to Invite");
    //             res.redirect('/view-event');
    //         }

    // });

//Mongoose Connection with MongoDB
mongoose.connect('mongodb://localhost/rideshare');
console.log('local mongodb opened');

app.listen(3000);
console.log("Express server is listening at port 3000");
