var util = require('util');
const express = require('express');
const app = express();
var passport = require('passport');

var fs = require('fs');
var request = require('request');
var pool = require('./db').pool;
const bcrypt = require('bcrypt');

//TODO
//Add forgot password functionality
//Add email confirmation functionality
//Add edit account page

// app.use(express.static('public'));
// let router = express.Router(); //added
// app.use(router); //added

const LocalStrategy = require('passport-local').Strategy;
//const connectionString = process.env.DATABASE_URL;

var currentAccountsData = [];

var User = require('./appModel').User;
var Login = require('./appModel').Login;
let Listing = require('./appModel').Listing;
let Item = require('./appModel').Item;

pool.connect(function (err) {
  if (err) throw err;
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Checks if user email has already been registered
//if not registered it gets registered
module.exports = function (app) {
  app.post('/signup', async function (req, res) {
    try {
      var pwd = await bcrypt.hash(req.body.password, 5);
      await JSON.stringify(
        User.getUserByEmail([req.body.email], function (err, result) {
          if (result.rows[0]) {
            console.log('email already registered');
            res.status(409).send('Email already exists');
          } else {
            Login.createLogin(req.body.email, pwd, function (err, result) {
              if (err === 0) {
                console.log('Error email exists redirecting now');
                res.status(409).send('Login email already exists');
              } else {
                User.createUser(req.body, function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('inserted into users');
                    res.status(200).send('Inserted into users');
                    return;
                  }
                });
              }
            });
          }
        })
      );
    } catch (e) {
      throw e;
    }
  });

  //checks if user is authenticated in the profile route
  app.get('/profile', function (req, res, next) {
    console.log('checking profile get req', req.isAuthenticated());
    if (req.isAuthenticated()) {
      res
        .status(200)
        .send(JSON.stringify(User.getUserByEmail([req.session.email])));
    } else {
      res.status(403).send('Error: PLease login');
    }
  });
  //checks if user is authenticated in the login route
  app.get('/login', function (req, res, next) {
    console.log('checking login get req', req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      res.redirect('/');
    }
  });

  //redirects user at logout
  app.get('/logout', function (req, res) {
    console.log(req.isAuthenticated());
    req.logout();
    console.log(req.isAuthenticated());
    req.flash('success', 'Logged out. See you soon!');
    res.redirect('/');
  });

  //checks if user is authenticated at login
  //failure redirects them into login
  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true,
    }),
    function (req, res) {
      console.log('post login auth');
      if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
      } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
      }
      res.redirect('/');
    }
  );
};

passport.use(
  'local',
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      loginAttempt();
      async function loginAttempt() {
        console.log('Login attempt');
        try {
          console.log('local passport use email', username);
          Login.findByEmail([username], function (err, result) {
            if (err) {
              return done(err);
            }
            if (result.rows[0] == null) {
              console.log('Error: PLease login');
              return done(null, false);
            } else {
              bcrypt.compare(password, result.rows[0].password, function (
                err,
                check
              ) {
                if (err) {
                  console.log('Error while checking password');
                  return done();
                } else if (check) {
                  req.session.email = result.rows[0].email;
                  console.log(
                    result.rows[0],
                    'session email,',
                    req.session.email
                  );
                  return done(null, [
                    {
                      email: result.rows[0].email,
                      firstName: result.rows[0].firstName,
                    },
                  ]);
                } else {
                  req.flash('danger', 'Oops. Incorrect login details.');
                  return done(null, false);
                }
              });
            }
          });
        } catch (e) {
          throw e;
        }
      }
    }
  )
);

//create route to logout user?
app.post('/logout', (req, res) => {});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
