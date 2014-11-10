var express = require('express'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    util = require('util'),
    bodyParser = require('body-parser'),
    routes = require('./routes');

var app = express();


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser('random secret passphrase'));
    app.use(express.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

//*************************************************
//**************Handle UI routes ******************
//*************************************************

app.get('/',function(req,res){
    res.render('mfLayout');
});


app.get('/partials/:name', routes.partials);

app.get('*', routes.index);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
