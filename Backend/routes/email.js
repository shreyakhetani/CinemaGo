const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Email and QR Code sending logic
router.post('/send-ticket-email', async (req, res) => {
    const { movieName, hallName, showtime, duration, language, seat, userEmail } = req.body;

    // Generate QR code from ticket information
    const ticketInfo = JSON.stringify({
        movieName,
        hallName,
        showtime,
        duration,
        language,
        seat,
        userEmail,
    });

    try {
        const qrCodeDataURL = await QRCode.toDataURL(ticketInfo);

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // You can change this to your preferred email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Your Movie Ticket',
            text: `Here are the details of your ticket:\n
                   Movie: ${movieName}\n
                   Hall: ${hallName}\n
                   Showtime: ${showtime}\n
                   Duration: ${duration}\n
                   Language: ${language}\n
                   Seat: ${seat}`,
            attachments: [
                {
                    filename: 'ticket_qrcode.png',
                    content: qrCodeDataURL.split("base64,")[1],
                    encoding: 'base64'
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully with QR code' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send the email' });
    }
});

module.exports = router;
