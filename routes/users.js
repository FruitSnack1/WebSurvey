var express = require('express');
var router = express.Router();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://127.0.0.1:27017/quiz';
const jsonexport = require('jsonexport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

router.get('/users', (req, res) => {
  res.send({
    'count': 1
  })
});

router.get('/login', (req, res) => {
  MongoClient.connect(url, async (err, client) => {
    if (err) return console.log('Unable to connect to the Server', err);
    const db = client.db("quiz");
    const users = await db.collection('users').find({}, {
      projection: {
        password: 0
      }
    }).toArray();
    res.render('login', {
      users
    });
  });
});

router.post('/login', (req,res) =>{
  const id = mongodb.ObjectId(req.body.id);
  const password = req.body.password;

  const hash = crypto.createHash('md5').update(password).digest('hex');

  MongoClient.connect(url, async (err, client) => {
    if (err) return console.log('Unable to connect to the Server', err);
    const db = client.db("quiz");
    await db.collection('users').find({'_id': id}).toArray((err, result) =>{
      if(err) console.log(err);
      const user = result[0];
      console.log(user);
      if(hash === user.password){
        res.send('logged in');
      }else{
        res.send('wrong password');
      }
    });
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmed_password = req.body.confirmed_password;

  const hash = crypto.createHash('md5').update(password).digest('hex');

  MongoClient.connect(url, async (err, client) => {
    if (err) return console.log('Unable to connect to the Server', err);
    const db = client.db("quiz");
    db.collection('users').insertOne(
      {
        'username' : username,
        'password' : hash
      }
    );
    res.redirect('/users/login');
  });
});


function getUser(id) {
  MongoClient.connect(url, async (err, client) => {
    if (err) return console.log('Unable to connect to the Server', err);
    const db = client.db("quiz");
    const user = await db.collection(`users`).find({
      '_id': mongodb.ObjectId(id)
    });
    return user;
  });
}

module.exports = router;
