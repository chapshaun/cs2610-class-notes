var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var session = require('express-session')

var db = require('./db')
var Users = require('./models/users')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  cookieName: 'session',
  secret: 'a;sfdas8f()asdfsa{}asfdsa',
  resave: false,
  saveUninitialized: true
}))

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/', function(req, res) {
  var user = req.body
  Users.insert(user, function(result) {
    req.session.userId = result.ops[0]._id
    res.redirect('/update')
  })
})

app.get('/update', function(req, res) {
  if (req.session.userId) {
    //Find user
    Users.find(req.session.userId, function(document) {
      if (!document) return res.redirect('/')
      //Render the update view
      res.render('update', {
        user: document
      })
    })
  } else {
    res.redirect('/')
  }
})

app.post('/update', function(req, res) {
  var user = req.body
  //Update the user
  Users.update(user, function() {
    //Render the update view again
    res.render('update', {
      user: user,
      success: 'Successfully updated the user!'
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
