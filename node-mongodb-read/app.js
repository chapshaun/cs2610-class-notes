var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/', function(req, res) {
  // Connection URL
  var url = 'mongodb://dbuser:password@ds055574.mongolab.com:55574/testing'
  //Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err)
    console.log('Connected correctly to server')

    var user = req.body
    insertUser(db, user, function() {
      db.close()
      res.send('It worked!')
    })
  })
})


var insertUser = function(db, user, callback) {
  // Get the users collection
  var collection = db.collection('users')
  // Insert a user
  collection.insert(user, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log('Inserted 1 document into the users collection')
    callback(result)
  })
}

app.listen(3000)
