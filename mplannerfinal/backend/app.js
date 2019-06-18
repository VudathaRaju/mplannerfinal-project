const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/schedule");


const User = require('./models/user');
const transporter = require('./shared/mail');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


const app = express();

app.use(cors());
const config = {
  autoIndex: false,
  useNewUrlParser: true,
};


mongoose.connect("mongodb+srv://admin_31:351gbPBM$@cluster0-kiua3.mongodb.net/node-angular", config)
  .then(() => {
    console.log(' Connected to database');
  })
  .catch(() => {
    console.log(' Connection to database failed');
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


// forget-password API
app.post('/forget-password', function (req, res) {

  User.findOne({ username: req.body.username })
    .then(user => {

      if (!user) {
        return res.status(401).json({
          message: "No User Found"
        });
      }


      const encryptedString = cryptr.encrypt(user.email);

      transporter.sendMail({
        from: `mPlanner`, // sender address
        to: user.email, // list of receivers
        subject: `Forgot your password`, // Subject line
        // text: `Event ${type}`, // plain text body
        html: `<h1>Dear User, </h1> </br>
             Click on the below link to reset the password. </br>
             <a href="http://localhost:4200/reset-password/${encryptedString}">
             http://localhost:4200/reset-password/${encryptedString}
             </a>,` // html body
      }).then((messageInfo) => {
        console.log('Mail send successfully.', messageInfo);
        console.log("Message sent: %s", messageInfo.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(messageInfo));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        return res.json({
          msg: 'Reset Password, Mail send successfully to your email.',
          success: true,
        });
      });

    }).catch(err => {
      console.log('-------err---', err);
      return res.status(400).json({
        message: "Auth failed",
        error: err
      });
    });
});

// reset-password API
app.post('/reset-password', (req, res) => {
  const decryptedString = cryptr.decrypt(req.body.token);
  User.findOne({ email: decryptedString })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No User Found"
        });
      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        // Store hash in your password DB.
        User.findOneAndUpdate(
          { _id: user._id },
          { password: hash },
          (err, event) => {
            if (!err) {
              return res.json({
                msg: 'Password Reset successfully.',
                success: true,
              });
            }
          });
      });

    }).catch(err => {

      return res.status(401).json({
        message: "Auth failed"
      });
    });
});


app.use("/api/user", userRoutes, cors);
app.use("/api/event", eventRoutes, cors);


module.exports = app;
