const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'vrajmg@gmail.com', //testAccount.user, // generated ethereal user
        pass: 'vrajmg123' //'testAccount.pass' // generated ethereal password
    }
});

module.exports = transporter