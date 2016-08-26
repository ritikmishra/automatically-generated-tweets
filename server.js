//Lets require/import the HTTP module
var express = require('express');
var app = express();
var markovtweet = require('./markovtweet');
var fs = require('fs')

//forces HTTPS by checking if the user is on the http version and redirecting to https if so
//also activates HSTS for about 16 hours
var forceHTTP = function(req, res, next){
  console.log("Request made to " + req.originalUrl);
  res.set('Strict-Transport-Security', ['max-age=60000', 'includeSubDomains']);
  console.log("Connection secure?" + req.secure.toString())
  console.log(req.protocol)
  console.log(req.)
  if(req.secure){
    console.log("attempting redirect to " + ['http://' + req.hostname + req.originalUrl].join(""))
    res.redirect(['http://' + req.hostname + req.originalUrl].join(""))
  }
  else{
    next();
  }
}
app.use(forceHTTP)
//returns ./index.html
app.get('/',  function (req, res) {
  var file = fs.readFile('index.html', 'utf8', function callback(err, html){
    if (err) return console.error(err);
    res.send(html)
  });
});

app.get('/tweet',  function (req, res) {
  if(req.query.usernames){
    if(typeof req.query.usernames == "string"){
      markovtweet([req.query.usernames], function(error, tweet){

        if(error) throw error;
        res.send(tweet)
        res.end()

      });
    }
    else{
      markovtweet(req.query.usernames, function(error, tweet){

        if(error) console.log(error);
        res.json({'tweet': tweet})
        res.end()

      });
    }
  }
});
//returns ./index.css
app.get('/index.css',  function (req, res) {
  var file = fs.readFile('index.css', 'utf8', function callback(err, css){
    if (err) return console.error(err);
    res.type('text/css')
    res.send(css)
  });
});
//returns ./index.js
app.get('/index.js',  function (req, res) {
  var file = fs.readFile('index.js', 'utf8', function callback(err, js){
    if (err) return console.error(err);
    res.type('application/javascript')
    res.send(js)
  });
});
//initiate the server :D
app.listen(process.env.PORT || 5000, function () {
  console.log("Server listening on: http://localhost:%s", process.env.PORT || 5000);
});
