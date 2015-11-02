var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var request = require('request')

var app = express()
// instagram.pixelunion.net
var ACCESS_TOKEN = '1548633275.1677ed0.53fa50412b8d4111abfd04aa0af36dd6'

app.engine('handlebars', exphbs({defaultLayout: 'base'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))

app.get('/feed', function(req, res) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed/?access_token=' + ACCESS_TOKEN
  }

  request.get(options, function(error, response, body) {
    // console.log(body)
    var feed = JSON.parse(body)

    res.render('feed', {
      feed: feed.data
    })
  })
})

app.listen(3000)
