require('dotenv').config()

var express = require('express');
var router = express.Router();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://127.0.0.1:27017/quiz';
const jsonexport = require('jsonexport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

router.get('/mojeankety', authenticateToken, (req,res) =>{
  res.render('quiz-ankety');
});

router.get('/create', authenticateToken, (req, res)=>{
  
});

function authenticateToken(req, res, next) {
  console.log(req.cookies);

  const token = req.cookies['accessToken'];
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = router;
