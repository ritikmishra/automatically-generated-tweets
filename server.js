//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var markovtweet = require('./markovtweet');

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
    console.log("Server listening on: http://localhost:%s", process.env.PORT);
});

//A sample GET request
dispatcher.onGet("/", function(req, res) {
  markovtweet(["realDonaldTrump","HillaryClinton"], function(err, data){
    if(err) return err
    console.log(data)
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(data);
  })

});
