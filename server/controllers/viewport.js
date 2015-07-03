var passport = require('passport');
var Course = require('../models/Viewport')

exports.getIndex = function(req,res){
        Course.find(function(err,courses){
            res.render('first');
        });
}