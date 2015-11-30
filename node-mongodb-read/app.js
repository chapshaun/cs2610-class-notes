var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var db = require('./db')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/', function(req, res) {
  // // Connection URL
  // var url = 'mongodb://dbuser:password@ds055574.mongolab.com:55574/testing'
  // //Use connect method to connect to the Server
  // MongoClient.connect(url, function(err, db) {
  //   assert.equal(null, err)
  //   console.log('Connected correctly to server')

  var user = req.body
  insertUser(user, function() {
      // db.close()
  res.send('It worked!')
    })
  // })
})


var insertUser = function(user, callback) {
  // Get the users collection
  var collection = db.get().collection('users')
  // Insert a user
  collection.insert(user, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log('Inserted 1 document into the users collection')
    callback(result)
  })
}

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
