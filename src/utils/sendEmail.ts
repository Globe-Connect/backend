import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    // Create a transporter
    const transporter: Transporter = nodemailer.createTransport({
        // For Gmail
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'Souvik Mukherjee <souvikmukherjee150@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: `<h1>${options.subject}</h1>`
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
