const nodemailer = require("nodemailer");

class Email {
  async tranporter() {
    return await nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  transporter() {
    return nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 465,
      auth: {
        user: "postmaster@sandbox73560610ec8c424f9ee4435c42c6d402.mailgun.org",
        pass: "4e87beb9154937b0b9ccbad720d39ec8-7ca144d2-f80b874a",
      },
    });
  }

  async sendEmail(options) {
    const transporter = await this.tranporter();
    const mailOptions = {
      from: "Hospital Management System <temmy4jamb@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    await transporter.sendMail(mailOptions);
  }
}

module.exports = Email;
