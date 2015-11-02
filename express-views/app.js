var express = require('express')
var exphbs  = require('express-handlebars');

var app = express()

expressConfig = {
  defaultLayout: 'base'
}

app.engine('handlebars', exphbs(expressConfig));
app.set('view engine', 'handlebars');

app.get('/', function(req,res) {
  var locals = {}
  locals.title = 'This is a Title'
  locals.message = 'This is a Message'

  res.render('index', locals)
})

app.get('/new', function(req,res) {
  var locals = {}
  locals.title = 'This is a new Title'
  locals.message = 'This is a new Message'

  res.render('index', locals)
})

app.listen(3000)
