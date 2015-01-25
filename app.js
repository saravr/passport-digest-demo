var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var http = require('http');
var morgan = require('morgan');
var util = require('util');

var app = express();

app.use(express.static(__dirname + '/public'));
//app.use(express.cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan('combined'));

passport.serializeUser(function(user, done) {
    done(null, 'foo');
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    done(null, 'foo');
});

passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        if (username === 'foo' && password === 'bar') {
            done(null, 'foo');
        } else {
            done(null, false, {message : 'Bad username or password'});
        }
    }
));

passport.use('digest-auth', new DigestStrategy(
    {qop: 'auth'},
    function (username, done) {
        console.log("Digest auth req, username: " + username);
        if (username === 'foo') {
            done(null, 'foo', 'bar'); // done() will compute/compare hash
        } else {
            done(null, false);
        }
    },
    function (params, done) {
        console.log('DIGEST AUTH PARAMS: ' + util.inspect(params));
        done(null, true);
    }
));

app.get('/', function(req, res) {
    res.redirect(302, '/login.html');
});

app.post('/login', passport.authenticate('local-login', {
             successRedirect: '/login-success.html',
             failureRedirect: '/login-failure.html'
         }));

app.get('/api/me', passport.authenticate('digest-auth', {session: false}),
    function(req, res) {
        res.json(req.user);
    }
);

var port = 3001;
app.listen(port);
console.log('Listening on port ' + port + ' ...');
