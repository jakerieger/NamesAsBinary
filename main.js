const fs = require('fs')
const Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

var nameArray = fs.readFileSync('names.txt').toString().split("\n")

setInterval(function() {

  var name = nameArray[Math.floor(Math.random() * nameArray.length)].toString()
  var index = nameArray.indexOf(name)
  nameArray.splice(index, 1)

  // Pad binary output for consistency; i.e. 1101 -> 00001101
  function pad(n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }

  var nameCharArray = []
  for (var i = 0; i < name.length; i++) {
    nameCharArray.push(name[i])
  }

  nameCharArray.pop() // removes return carriage

  var binaryCharArray = []
  for (x in nameCharArray) {
    asciiCode = nameCharArray[x].charCodeAt()
    binaryCode = asciiCode.toString(2)
    binaryCharArray.push(pad(binaryCode, 8))
  }

  var nameAsBinary = binaryCharArray.join(' ')

  var Tweet = `${name}\n${nameAsBinary}`

  client.post('statuses/update', {status: Tweet}, (err, tweet, res) => {
    console.log(Tweet)
  })
}, 6000);
