module.exports = function(username, callback){
  var nlp = require('nlp_compromise')
  var twitter = require('twitter')
  var natural = require('natural')
  var randobj = require('pick-pair')
  var randitem = require('pick-item')
  //var request = require('request')

  var args = process.argv.slice(2);
  var username = args[0]

  //begining

  var tapi = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var tweets_text = []
  var mark_obj = {}
  var nouns = []
  var verbs = []
  var result = []
  tapi.get('statuses/user_timeline', {screen_name: username, count: '200', include_rts: 'false'}, function(error, tweets, response){
    if (error) return callback(error);

    for(var i = 0; i < tweets.length; i++){
      tweets_text[i] = tweets[i].text.split(" ")

    }

    for(var i = 0; i < tweets_text.length; i++){
      for(var j = 0; j < (tweets_text[i].length - 2); j++){
        if(mark_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]]){
          mark_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]].push(tweets_text[i][j+2])

        }
        else{
          mark_obj[tweets_text[i][j] + " " + tweets_text[i][j + 1]] = [tweets_text[i][j+2]]

        }
  /*
        if(nlp.text(tweets_text[i][j]).sentences[0].terms[0].pos["Noun"]){
          nouns.push(tweets_text[i][j])
        }

        else if(nlp.text(tweets_text[i][j]).sentences[0].terms[0].pos["Verb"]){
          verbs.push(tweets_text[i][j])
        }
  */
      }
    }


    for(var i = 0; i < 20; i++){
      if(result.length == 0){
        filler=randobj(mark_obj)

        filler2=Object.keys(filler)[0].split(" ")
        result.push(filler2[0])
        result.push(filler2[1])
        result.push(randitem(filler[Object.keys(filler)[0]]))
      }
      else if(result[result.length-1] == undefined){
        result.pop()
        break;
      }
      else{
        result.push(randitem( mark_obj[result[result.length-2] + " " + result[result.length-1]] ))
      }
    }
    var result_nlp = nlp.text(result.join(" "))
  /*
    if (!(result_nlp.sentences[0].terms[0].pos["Noun"])){
      result.unshift(randitem(nouns))
    }
    */
    return callback(null, result.join(" "))







  });// end of tapi.get('statuses/user_timeline' . . .
}
