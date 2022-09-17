require("dotenv").config();
const EmailTemplates = require("swig-email-templates");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.API_KEY);
const nodemailer = require("nodemailer");

const templates = new EmailTemplates({
  root: "src/server/view/emailers/",
  swig: {
    cache: false,
  },
});

async function sendMail(email, subjectName, mailTemplateName, mailData) {
  return new Promise(async (resolve, reject) => {
    templates.render(mailTemplateName, mailData, async (err, html) => {
      if (err) {
        // return new Error(err);
        reject(err);
      } else {
        const msg = {
          from: `Movie Playlist <${process.env.EMAIL}>`,
          to: [email],
          subject: subjectName,
          html,
        };
        let transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
        let info = await transporter.sendMail(msg);

        resolve(info.messageId);

        // sgMail
        //   .send(msg)
        //   .then((res) => {
        //     resolve(res);
        //   })
        //   .catch((err) => {
        //     reject("Send mail error ", err);
        //   });
      }
    });
  });
}

module.exports = {
  sendMail,
};
