const nodemailer = require('nodemailer');

const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@skumarkets.com';
const host = process.env.SMTP_HOST || 'smtp.mailtrap.io';
const port = process.env.SMTP_PORT || 2525;
const user = process.env.SMTP_USER || '2b11452c07b552';
const pass = process.env.SMTP_PASSWORD || 'e19860208384f2';

// send email to user
exports.sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass },
    });

    const message = {
        from: fromEmail,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(message);
};
