//Lets require/import the HTTP module
var express = require('express');
var app = express();
var fs = require('fs')

//forces HTTPS by checking if the user is on the http version and redirecting to https if so
//also activates HSTS for about 16 hours
var forceHTTP = function(req, res, next){
  console.log("Request made to " + req.originalUrl);
  res.set('Strict-Transport-Security', ['max-age=60000', 'includeSubDomains']);
  console.log("Connection secure?")
  console.log(req.headers['x-forwarded-proto'])
  if(req.headers['x-forwarded-proto']!='https'){
    res.redirect('https://automatically-generated-tweets.herokuapp.com'+req.url)
  }
  else{
    next() /* Continue to other routes if we're not redirecting */
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
    console.log(req.query.usernames)
    if(typeof req.query.usernames == "string"){
      var markovtweet = require('./markovtweet');
      markovtweet([req.query.usernames], function(error, tweet){
        if(error) throw error;
        res.send(tweet)
        res.end()

      });
    }
    else{
      var markovtweet = require('./markovtweet');
      markovtweet(req.query.usernames, function(error, tweet){

        if(error) console.log(error);
        res.send(tweet)
        res.end()

      });
    }
  }
  else{
    res.send("Type a twitter username in the textbox!")
    res.end()
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
