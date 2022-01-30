const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config()

let users = [];

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  let user = {_id: users.length, username: req.body.username};
  users.push(req.body.username);
  res.json(user);
});

app.get('/api/users', (req, res) => {
  res.json(users.map((username, index) => {return {_id: index, username: username}}));
});






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
