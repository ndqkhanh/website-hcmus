const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendEmail = async (user, subject, text) => {
  const email = user.email;
  console.log('user here', user);
  const user_verification = await prisma.user_verification.create({
    data: {
      uid: user.id,
    },
  });
  console.log(user_verification);
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: {
        user: 'apikey',
        pass: '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',
      },
    });

    let mailOptions = {
      from: 'Web-HCMUS <group9notification@gmail.com>',
      to: email,
      subject: subject,
      text: '\nPlease enter your code ' + user_verification.code,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent ' + info.response);
      }
    });
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};

module.exports = sendEmail;
