const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

const d3 = require('d3');

// MIDDLEWARE

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
 

// LISTENERS

app.get('/', function (req, res) {
  
  // var y_accessor = ['1931', '1932', '1933', '1934', '1935', '1936'];
  
  // var test = require('./public/scripts/scripts.js');
  // console.log('test', test);

  // var myModule = require('./public/scripts/scripts.js');
  // var y_accessor = myModule.y_accessor;

  // console.log('y_accessor_required', y_accessor);
  // const templateVars = { y_accessor: y_accessor };

  // res.render('home', templateVars)
  res.render('home');
})





app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})