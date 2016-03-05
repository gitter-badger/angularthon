/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
var _ = require('lodash');
var path = require('path');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var jwtDecode = require('jwt-decode');
var request = require('request');
/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to Database.
 */
var db = mysql.createConnection({
  host     : secrets.db.host,
  user     : secrets.db.user,
  password : secrets.db.password,
  database : secrets.db.databaseName
});
db.connect(function(err) {
  if (err) {
    console.error('DB error connecting: ' + err.stack);
    return;
  }

  console.log('DB connected as id ' + db.threadId);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8042);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/default' });
// app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'eg[ishd-8yF9-7wo315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
}));

app.use(function(req, res, next) {
    //console.log("Cookies :  ", req.cookies);
    if (req.cookies && req.cookies.ISITHIS8) {
        if (req.session && req.session.user) {
            res.locals.user = req.session.user;
            req.user = req.session.user;
            return next();
         } else {
             var t = req.cookies['ISITHIS8'];
             var dt = t.split('~');
             var jwt = dt[1]
             var options = {
                 url: 'http://meqasa.com/verify-s',
                 headers: {
                     'Authorization': 'Bearer '+ jwt
                 }
             }
             request(options, function(error, response, body){
                 var body = JSON.parse(body);
                 if (!error && response.statusCode == 200 && body.status === 'Authenticated') {
                     console.log('Authorized');
                     var decoded = jwtDecode(jwt);

                     if (decoded && decoded.id) {
                         db.query('SELECT * FROM brokerregistered LEFT JOIN developerregistered ON brokerregistered.first=developerregistered.developerid WHERE brokerregistered.first=' + decoded.id, function(err, rows, fields) {
                 			if (err) {
                 			   console.log(error);
                 			   return next();

                 		   } else if (rows && rows.length > 0) {
                 			   	// Assgin user info to  locals
                                 req.user = rows[0];
                                 req.session.user = rows[0];
                                 res.locals.user = rows[0];
                                 return next();
                 		   }
                 	   });
                   } else {
                       return next();
                   }
                } else {
                    console.log('Unauthorized');
                    return next();
                }
             });
         }
    } else {
        req.session.reset();
        next();
    }

});

app.use(express.static(path.join(__dirname, 'assets'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(function(req, res, next) {
    req.header('Access-Control-Allow-Headers', 'X-Requested-With');
    req.header('Access-Control-Expose-Headers', 'meqasa-register-jwt');
    next();
});

/**
 * Primary app routes.
 */
require('./controllers/index')(app, db);

/**
 * Error Handler.
 */
 // Handle 404
app.use(function(req, res) {
    res.status(400);
    res.render('errors/404', {title: '404', message: 'The Resource Cannot Be Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    console.log(error);
    res.render('errors/500', {title: '500', message:'Internal Server Error', error: error});
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('meQasa Developer server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
