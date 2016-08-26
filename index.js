var httpGetAsync = function (theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(null, xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

var httpGetCallback = function(error, tweet){
	if(error){console.log(error);}
	document.getElementById("result").innerHTML = tweet;

}

var btnclick = function(){
  var usernames = document.getElementById('username').value.split(" ");
  var url = 'https://automatically-generated-tweets.herokuapp.com/tweet?'
  for(var i = 0; i < usernames.length; i++){
    url = url + "usernames=" + usernames[i] + "&"
  }
  httpGetAsync(url,function(error, tweet){
    if(error){console.log(error);}
    console.log(tweet)
    document.getElementById('result').innerHTML = tweet;
  } )
}
