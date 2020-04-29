var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.send = async (to, subject, body) => {
  const msg = {
    from: process.env.EMAIL_ADRESS,
    to: to,
    subject: subject,
    html: body,
  };

  transport.sendMail(msg, function (err, info) {
    if (err) throw err;
  });
};
