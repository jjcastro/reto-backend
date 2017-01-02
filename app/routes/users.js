var jwt     = require('jsonwebtoken');
var bcrypt  = require('bcrypt-nodejs');
var config  = require('../../config');
var express = require('express');
var User    = require('../models/user');

// super secret for creating tokens
var superSecret = config.secret;

var router = express.Router();

// route to generate sample user
router.post('/', function(req, res) {

  var newUser = new User();

  newUser.name = req.body.name;  
  newUser.username = req.body.username; 
  newUser.password = req.body.password;

  newUser.save(function(err) {
    if (err) {
      // duplicate entry
      if (err.code == 11000) 
        return res.json({ success: false, message: 'A user with that username already exists.'});
      else 
        return res.send(err);
    }

    // return a message
    res.json({ success: true, message: 'User created!' });
  });
    
});

// route to authenticate a user (POST http://localhost:8080/api/auth)
// ----------------------------------------------------
router.post('/auth', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {

    if (err) throw err;

    // no user with that username was found
    if (!user) {
      res.json({ 
        success: false, 
        message: 'Authentication failed. User not found.' 
      });
    } else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({ 
          success: false, 
          message: 'Authentication failed. Wrong password.' 
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecret, {
          expiresIn: '24h' // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }  
    }
  });
});

module.exports = router;