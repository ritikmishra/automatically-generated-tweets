//var nlp = require('.node_modules/nlp_compromise')
var twitter = require('twitter')
//var natural = require('.node_modules/natural')
var randobj = require('pick-pair')
var randitem = require('pick-item')

//begining
var tapi = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});



var markovchain = function (tweets_text, mark_data){
  var markov_chain_obj = mark_data
  console.log(mark_data)


  for(var i = 0; i < tweets_text.length; i++){
    //loops through tweet-arrays split into words
    for(var j = 0; j < (tweets_text[i].length - 2); j++){
      //loops through words in said tweet arrays
      if(markov_chain_obj[ tweets_text[i][j] + " " + tweets_text[i][j + 1] ]){//if the key exists
        if(markov_chain_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]].indexOf(tweets_text[i][j+2]) == -1){
          //console.log(markov_chain_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]])
          markov_chain_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]].push(tweets_text[i][j+2])
        }
      }
      else{
        markov_chain_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]] = [tweets_text[i][j+2]]
        //console.log(tweets_text[i][j+2])
      }
    }
  }
  //console.log("Markov chained")
  return markov_chain_obj

}

var markov_to_tweet = function (mark_data) {
  var result_in = []
    while(true){
      if(result_in.length == 0){
        filler=randobj(mark_data)
        filler2=Object.keys(filler)[0].split(" ")
        result_in.push(filler2[0])
        result_in.push(filler2[1])
        result_in.push(randitem(filler[Object.keys(filler)[0]]))
      }
      else if(result_in[result_in.length-1] == undefined){
        result_in.pop()
        break;
      }
      else{
        result_in.push(randitem(mark_data[result_in[result_in.length-2] + " " + result_in[result_in.length-1]] ))
      }
    }
    if(result_in.join(" ").length > 140){
      return result_in
    }
}
//single  user markovtweet
// usernames is a list of strings, callback is a function with args (err, data), inceptions is an int
var markovtweet = function (usernames, callback){
  //gather tweets from users
  var markov_chain_obj = {}
  var tweets_text = []

  for(var i = 0; i < usernames.length; i++){
    if(usernames[i][0] == '@'){
      usernames[i] = usernames[i].substr(1);
    }
    tapi.get('statuses/user_timeline', {screen_name: usernames[i], count: '200', include_rts: 'false'}, function(error, tweets, response){
      if (error) return callback(error);

      for(var i = 0; i < tweets.length; i++){
        tweets_text.push(tweets[i].text.split(" "))
      }
      markov_chain_obj = markovchain(tweets_text, markov_chain_obj)

      var result = markov_to_tweet(markov_chain_obj)
      while(!result){
        result = markov_to_tweet(markov_chain_obj)
      }


      console.log(result.join(" "))
      return callback(null, result.join(" "))
    })
  }



}// end of function



module.exports = markovtweet
