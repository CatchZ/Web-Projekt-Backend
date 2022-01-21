const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport( {
    service: "hotmail",
    auth: {
        user: "wad2122@outlook.de",
        pass: "hunter2aberrueckwaerts"
    }
});

const options = {
    from: "wad2122@outlook.de",
    to: "carolinatrack@googlemail.com",
    subject: "Pls klapp",
    text: "Klappt "
};

transporter.sendMail(options, function (err, info) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Sent:" + info.response);
});