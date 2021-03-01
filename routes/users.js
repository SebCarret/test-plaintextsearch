var express = require('express');
var router = express.Router();
var usersModel = require('../models/users');
var uid2 = require('uid2');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user', {title: "page user"});
});

router.post('/sign-up', async (req, res) => {

  var hash = bcrypt.hashSync(req.body.password, 10)

  var newUser = new usersModel({
    name: req.body.name,
    email: req.body.email,
    pwd: hash,
    token: uid2(32)
  });

  var userSaved = await newUser.save();

  userSaved ? res.json({login: true, userSaved}) : res.json({login: false})
  // if (userSaved){
  //   res.json({login: true, userSaved})
  // } else {
  //   res.json({login: false})
  // }
});

router.post('/sign-in', async (req, res) => {
 var user = await usersModel.findOne({email: req.body.email});

 if (user){
  if (bcrypt.compareSync(req.body.password, user.pwd)){
    res.json({login: true, user})
  } else {
    res.json({login: false, error: 'password invalid'})
  }
 } else {
   res.json({login: false, error: 'no user found'})
 }

})

module.exports = router;
