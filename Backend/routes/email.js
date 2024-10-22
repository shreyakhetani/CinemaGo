const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

router.post('/send-ticket-email', async (req, res) => {
    const { movieName, hallName, showtime, duration, language, seat, userEmail } = req.body;

    // Convert showtime to Helsinki timezone
    const helsinkiTime = new Date(showtime).toLocaleString('en-US', {
        timeZone: 'Europe/Helsinki',
        hour12: false
    });

    // Generate QR code for this specific ticket
    const ticketInfo = JSON.stringify({
        movieName,
        hallName,
        showtime: helsinkiTime,
        duration,
        language,
        seat,
        userEmail,
    });

    try {
        const qrCodeDataURL = await QRCode.toDataURL(ticketInfo);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Your Movie Ticket',
            html: `
                <h2>Your Movie Ticket Details</h2>
                <p><strong>Movie:</strong> ${movieName}</p>
                <p><strong>Hall:</strong> ${hallName}</p>
                <p><strong>Showtime:</strong> ${helsinkiTime}</p>
                <p><strong>Duration:</strong> ${duration}</p>
                <p><strong>Language:</strong> ${language}</p>
                <p><strong>Seat:</strong> ${seat}</p>
            `,
            attachments: [
                {
                    filename: `ticket_qrcode_${seat.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
                    content: qrCodeDataURL.split("base64,")[1],
                    encoding: 'base64'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully with QR code' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send the email' });
    }
});

module.exports = router;