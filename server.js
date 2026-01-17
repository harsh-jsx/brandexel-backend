require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to send email
const sendEmail = async (subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("Email credentials not found. simulating email send:", subject);
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sending to self/admin for now
        subject: subject,
        text: text
    };

    return transporter.sendMail(mailOptions);
};

// Route: Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, company, goal, timeline, budget, email, details } = req.body;
        const text = `
      Name: ${name}
      Company: ${company}
      Goal: ${goal}
      Timeline: ${timeline}
      Budget: ${budget}
      Email: ${email}
      Details: ${details}
    `;
        await sendEmail('New Project Inquiry', text);
        res.status(200).json({ message: 'Contact form submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

// Route: Collaborate Form
app.post('/api/collaborate', async (req, res) => {
    try {
        const { name, contact, role, portfolio, details } = req.body;
        const text = `
      Name: ${name}
      Contact: ${contact}
      Role: ${role}
      Portfolio: ${portfolio}
      Details: ${details}
    `;
        await sendEmail('New Collaboration Request', text);
        res.status(200).json({ message: 'Collaboration form submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

// Route: Apply Form
app.post('/api/apply', async (req, res) => {
    try {
        const { name, email, role, portfolio } = req.body;
        const text = `
      Name: ${name}
      Email: ${email}
      Applying for: ${role}
    `;
        await sendEmail('New Job Application', text);
        res.status(200).json({ message: 'Application submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
