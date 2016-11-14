//Lets require/import the HTTP module
var express = require('express');
var app = express();
var fs = require('fs')

//forces HTTPS by checking if the user is on the http version and redirecting to https if so
//also activates HSTS for about 16 hours
var forceHTTP = function(req, res, next){
  //logs where the request was made to
  console.log("Request made to " + req.originalUrl);
  //adds hsts header to response
  res.set('Strict-Transport-Security', ['max-age=60000', 'includeSubDomains']);
  //logs to console the user's connection scheme(http or https)
  console.log("Connection secure?")
  console.log(req.headers['x-forwarded-proto'])
  if(req.headers['x-forwarded-proto']!='https'){
    //redirects user to https website if currently using http
    res.redirect('https://automatically-generated-tweets.herokuapp.com'+req.url)
  }
  else{
    next() /* Continue to other routes if we're not redirecting */
  }
}


app.use(forceHTTP)
//sets the forceHTTP function as a default callback for all requests

//returns ./index.html
app.get('/',  function (req, res) {
  var file = fs.readFile('index.html', 'utf8', function callback(err, html){
    if (err) return console.error(err);
    res.send(html)
  });
});
//uses ./markovtweet.js to create a new tweet out of the old ones from the specified twtter account(s)
app.get('/tweet',  function (req, res) {
  //checks if a username was sent
  if(req.query.usernames){
    //logs the usernames sent to the console
    console.log(req.query.usernames)
    //checks if there are multiple usernames(multiple usernames are recieved as arrays)
    if(typeof req.query.usernames == "string"){
      var markovtweet = require('./markovtweet');
      markovtweet([req.query.usernames], function(error, tweet){
        if(error) throw error;
        res.send(tweet)
        res.end()

      });
    }
    else{
      var response;
      var markovtweet = require('./markovtweet');
      markovtweet(req.query.usernames, function(error, tweet){
        if(error) console.log(error);
        response = tweet
      });
      res.send(response)
      res.end()
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

//initiate the server(very important)
app.listen(process.env.PORT || 5000, function () {
  console.log("Server listening on http://localhost:%s", process.env.PORT || 5000);
});
