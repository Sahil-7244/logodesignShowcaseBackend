const nodemailer = require('nodemailer');

async function SendMail(req, res){
    const { name, email, phone, message } = req.body;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM, // Replace with your email from which every email will be sent
            pass: process.env.EMAIL_PASSKEY,       // Replace with your email password or app password
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_TO, // Your target email
        subject: `New Contact Form Submission from ${name}`,
        text: `You have received a new message:
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
}

module.exports={SendMail};