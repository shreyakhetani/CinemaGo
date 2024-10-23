const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

router.post('/send-ticket-email', async (req, res) => {
    const { movieName, hallName, showtime, duration, language, seat, userEmail } = req.body;

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${day}.${month}.${year}`;
    };
    const todayDate = getTodayDate();

    // Format time exactly like ticket confirmation
    const helsinkiTime = new Date(new Date(showtime).getTime() + 3 * 60 * 60 * 1000).toLocaleString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Helsinki'
    });

    // Generate QR code for this specific ticket
    const ticketInfo = JSON.stringify({
        movieName,
        hallName,
        showtime: `${todayDate} - ${helsinkiTime}`,
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
                <p><strong>Showtime:</strong> ${todayDate} - ${helsinkiTime}</p>
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