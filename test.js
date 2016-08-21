var markovtweet = require('./markovtweet');
markovtweet(process.argv[2], function(error, tweet){
  if (error) return error
  console.log(tweet);
})
