var markovtweet = require('./markovtweet');
  var result = []
markovtweet(['ritmish', 'rishmishra'], function(error, tweet){
  if (error) return error
  console.log(tweet)
})
