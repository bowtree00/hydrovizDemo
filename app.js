const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

const d3 = require('d3');

// MIDDLEWARE

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// LISTENERS

app.get('/', function (req, res) {
  res.render('home')
})





app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})