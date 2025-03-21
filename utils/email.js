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
