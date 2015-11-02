var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
  res.render('index')
})

app.post('/', function(res, res) {
  var form = req.body
  if (form.username == 'chapshaun' && form.password == 'fake') {
    res.redirect('/dashboard')
  } else {
    res.render('index', {
      error: 'Incorrect login details'
    })
  }
})

app.get('/dashboard', function(req, res) {
  res.send('Welcome')
})

app.listen(3000)
