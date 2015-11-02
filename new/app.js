var express = require('express')
var exphbs  = require('express-handlebars');
var request = require('request')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  res.render('index')
})

app.get('/user', function(req, res){
  var options = {
    url: 'https://api.github.com/users/chapshaun',
    headers: {
      'User-Agent': 'request'
    }
  }
  request(options, function(error, response, body){
    var user = JSON.parse(body)

    res.render('user', {
      user: user
    })
  })

})



app.listen(3000)
