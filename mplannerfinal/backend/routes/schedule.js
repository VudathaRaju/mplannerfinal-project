const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const transporter = require("../shared/mail");

const Event = require("../models/schedule");
const User = require("../models/user");

const router = express.Router();

router.post("/save", (req, res, next) => {
  console.log( "req");
  console.log( req.body );
    if (req.body.meta && req.body.meta.r._id) {
        Event.findOneAndUpdate({ _id: req.body.meta.r._id }, (req.body), (err, event) => {
            if (!err) {
                setNotificationMail(req.body, 'updated', req.body.meta.r.id);
                return res.status(200).json(event);
            }
        });
    } else {
        Event.create(req.body, (err, event) => {
            // event.meta.r._id = event._id;
            event.save((err) => {
                if (!err) {
                    setNotificationMail(req.body, 'added', req.body.id);
                    return res.status(200).json({ msg: 'okay' });
                }
            });
        })
    }

});

router.post("/delete", (req, res, next) => {
    Event.findOneAndRemove({ _id: req.body.meta.r._id }, (err, result) => {
        if (!err) {
            setNotificationMail(req.body, 'added', req.body.meta.r.id);
            return res.status(200).json({ msg: 'Successfully Removed.' });
        }

    })
});

router.get("/:id", (req, res, next) => {
    Event.find({ id: req.params.id }, (err, events) => {
        if (!err) {
            return res.status(200).json({ results: events });
        }
    })
});


const setNotificationMail = async (info, type, userId) => {

    User.findOne({ _id: userId })
        .then(user => {
            transporter.sendMail({
                from: `mPlanner`, // sender address
                to: user.email, // list of receivers
                subject: `Event ${type}`, // Subject line
                text: `Event ${type}`, // plain text body
                html: `<b>Event ${type}</b>` // html body
            }).then((messageInfo) => {
                console.log('Mail send successfully.');

                console.log("Message sent: %s", messageInfo.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(messageInfo));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });

}

module.exports = router;
