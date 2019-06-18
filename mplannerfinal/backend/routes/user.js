const express = require('express');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.get("/allUsers", (req, res, next) => {
  // res.send("Hello from express");
  User.find()
    .then(users => {
      res.status(200).json({
        message: 'Users fetched properly',
        users: users
      });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      let roleIndex = fetchedUser.username.indexOf('-admin');
      let role = 'user';
      if (roleIndex != -1) role = 'admin';
      res.status(200).json({
        token: token,
        user: fetchedUser,
        role: role,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});


router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).
    then(hash => {
      const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        countrycode: req.body.countrycode,
        phone: req.body.phone,
        username: req.body.username,
        if_online: '0',
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'Normal User Created',
            result: result
          });
          localStorage.setItem('users', JSON.stringify(result));
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });

});

router.post("/reset-password", (req, res, next) => {
  console.log("sd");
  res.status(200).json({ 'message': 'Response' });
});
module.exports = router;
