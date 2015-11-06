var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var request = require('request')
var querystring = require('querystring')
var session = require('express-session')
var cfg = require('./config')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}))
app.set('view engine', 'handlebars')

app.use(session({
  cookieName: 'session',
  secret: 'a;slkdjf;alsdkjf',
  resave: false,
  saveUninitialized: true
}))

app.get('/authorize', function(req, res) {
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }

// client_id = 1c1c18cbde554eaba91bee06ff3b5921&redirect_uri=bb6731b3f7784bbfb5027418e17b2a1e&response_type=http://localhost:3000/auth/finalize
  var query = querystring.stringify(qs)

  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res) {
var post_data = {
  client_id: cfg.client_id,
  client_secret: cfg.client_secret,
  redirect_uri: cfg.redirect_uri,
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
    req.session.access_token = data.access_token
    res.redirect('/feed')
    // res.send('It Worked')
  })
})




// app.use(bodyParser.urlencoded({extended: false}))

app.get('/feed', function(req, res) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed/?access_token=' + req.session.access_token
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
