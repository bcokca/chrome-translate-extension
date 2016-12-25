var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var jwt = require('express-jwt');
var cors = require('cors');
var _translate = require('./index');


// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cors());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

const authCheck = jwt({
    secret: new Buffer('zlcBl1xSOr6l86xD-dsUflyrC8k_hO44fKqDvphjuO68E4iDHMb6w9mqpktJ-iVH', 'base64'),
    audience: 'E9V3eNScjL3OWtvGA8eMrEF179KOOAOc'
});


//avoid cross origin problem
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    next();
});



var root = function(req, res){
    res.send('merhaba');
};

var translate = function (req, res) {
    var to = req.body.to || 'tr';
    var from = req.body.from || 'en';
    var text = req.body.text || '';

    _translate(text, {from:  from, to: to}).then(
        function (result) {
            console.log('result', result);
            res.send(result.text);
        },function (err) {
            console.log('err', err);
        });
};


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// home
app.get('/', root);

app.post('/translate', translate);

// create activity
// app.post('/garage', authCheck, garage.create);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
