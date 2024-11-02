const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send a message
router.post('/send', async (req, res) => {
    const { sender, recipient, content } = req.body;

    const newMessage = new Message({ sender, recipient, content });
    try {
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get messages for a recipient
router.get('/messages/:recipient', async (req, res) => {
    const recipient = req.params.recipient;

    try {
        const messages = await Message.find({ recipient });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

module.exports = router;
