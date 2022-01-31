const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config()

let users = [];
let exercises = [];

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// Logger middleware
app.use((req, res, next) => {
  console.log('--------------------------------------------------------------------------------------');
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  console.log(`params:`);
  console.log(req.params);
  console.log(`query:`);
  console.log(req.query);
  console.log(`body:`);
  console.log(req.body);
  console.log('--------------------------------------------------------------------------------------');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  let user = {_id: users.length, username: req.body.username};
  users.push(req.body.username);
  res.json(user);
});

app.get('/api/users', (req, res) => {
  res.json(users.map((username, index) => {return {_id: index.toString(), username: username}}));
});

app.post('/api/users/:uid/exercises', (req, res) => {
  let index = Number.parseInt(req.params.uid);
  if (isNaN(index))
    res.json({ error: 'Invalid user id'});
  else if (index >= users.length)
    res.json({ error: 'User not found'});
  else if (req.body.description === undefined || req.body.description == '')
    res.json({ error: 'Invalid description'});
  else if (req.body.duration === undefined || isNaN(Number(req.body.duration)))
    res.json({ error: 'Invalid duration'});
  else if (req.body.date && isNaN(Date.parse(req.body.date)))
    res.json({ error: 'Invalid date'});
  else {
    let exercise = {
      _id: index,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req.body.date ? Date.parse(req.body.date) : new Date().getTime()
    };
    exercises.push(exercise);
    // Formatting exercise to output
    exercise.date = new Date(exercise.date).toDateString();
    exercise.username = users[index];
    res.json(exercise);
  }
});

app.get('/api/users/:uid/logs', (req, res) => {
  let index = Number.parseInt(req.params.uid);
  if (isNaN(index))
    res.json({ error: 'Invalid user id'});
  else if (index >= users.length)
    res.json({ error: 'User not found'});
  else {
    let result = {
      username: users[index],
      count:0,
      id: index.toString(),
      log: []
    };
    exercises.forEach((exercise) => {
      if (exercise._id == index)
        result.log.push({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date
        });
        result.count++;
    });
    res.json(result);
  }
});







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
