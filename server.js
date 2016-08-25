//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var markovtweet = require('./markovtweet');
var fs = require('fs')
//We need a function which handles requests and send response
//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        //console.log(request.url);
        //console.log(request.params);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}
//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(process.env.PORT || 5000, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", process.env.PORT || 5000);
});

//A sample GET request
dispatcher.onGet("/tweet", function(req, res) {
  console.log(req.params)
  if(req.params.usernames){
    markovtweet(req.params.usernames, function(err, data){
      if(err) return err
      console.log(data)
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    })
  }
  else{
    markovtweet(["realDonaldTrump","HillaryClinton"], function(err, data){
      if(err) return err
      console.log(data)
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    })
  }

});

//A sample GET request
dispatcher.onGet("/", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var file = fs.readFile('index.html', 'utf8', function callback(err, data){
    if (err) return console.error(err);
    var html = data
    res.write(html)
    res.end();
  });
});

dispatcher.onGet("/index.js", function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/javascript'});
  var file = fs.readFile('index.js', 'utf8', function callback(err, data){
    if (err) return console.error(err);
    var html = data
    res.write(html)
    res.end();
  });
});

dispatcher.onGet("/index.css", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/css'});
  var file = fs.readFile('index.css', 'utf8', function callback(err, data){
    if (err) return console.error(err);
    var html = data
    res.write(html)
    res.end();
  });
});
