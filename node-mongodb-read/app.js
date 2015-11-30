var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var db = require('./db')

var Users = require('./models/users')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/', function(req, res) {
  var user = req.body
  Users.insert(user, function() {
  res.send('It worked!')
    })
})

db.connect('mongodb://dbuser:password@ds055574.mongolab.com:55574/testing', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000.....')
    })
  }
})
