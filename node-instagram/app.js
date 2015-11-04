var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var request = require('request')
var querystring = require('querystring')

var app = express()
var ACCESS_TOKEN = ''
var CLIENT_ID = '1c1c18cbde554eaba91bee06ff3b5921'
var CLIENT_SECRET = 'bb6731b3f7784bbfb5027418e17b2a1e'
var REDIRECT_URI = 'http://localhost:3000/auth/finalize'


app.engine('handlebars', exphbs({defaultLayout: 'base'}))
app.set('view engine', 'handlebars')

app.get('/authorize', function(req, res) {
  var qs = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code'
  }

// client_id = 1c1c18cbde554eaba91bee06ff3b5921&redirect_uri=bb6731b3f7784bbfb5027418e17b2a1e&response_type=http://localhost:3000/auth/finalize
  var query = querystring.stringify(qs)

  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res) {
var post_data = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  grant_type: 'authorization_code',
  code: req.query.code
}

  var options = {
    url: 'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body) {
    var data = JSON.parse(body)
    // console.log(data)
    ACCESS_TOKEN = data.access_token
    res.redirect('/feed')
    // res.send('It Worked')
  })
})




// app.use(bodyParser.urlencoded({extended: false}))

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
