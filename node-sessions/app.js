var express = require('express')
var exphbs = require('express-handlebars')
var request = require('request')
var querystring = require('querystring')
var session = require('express-session')
var cfg = require('./config')
var db = require('./db')
var Users = require('./models/users')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function(req, res) {
  res.render('index')
})

app.get('/authorize', function(req, res) {
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }
  // client_id=f88fbc76f52b441292ad333e135733d8&redirect_uri=http://localhost:3000/auth/finalize&response_type=code
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
    var user = data.user
    req.session.access_token = data.access_token
    req.session.userId = data.user.id

    user._id = user.id
    delete user.id

    Users.find(user._id, function(document) {
      if(!document) {
        Users.insert(user, function(result){
          res.redirect('/feed')
        })
      }
    })
  })
})

app.get('/feed', function(req, res) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + req.session.access_token
  }

  request.get(options, function(error, response, body) {
    var feed = JSON.parse(body)
    res.render('feed', {
      feed: feed.data
    })
  })
})

db.connect('mongodb://dbuser:password@ds055574.mongolab.com:55574/testing', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})
