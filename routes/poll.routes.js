const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const { sendWhatsAppMessage } = require('../utils/send');


// Create Poll
router.post('/create', async (req, res) => {
 const { question, options } = req.body;

 const poll = new Poll({
  question,
  options: options.map((opt) => ({ name: opt })),
 });

 await poll.save();
 res.status(201).send(poll);
});

// Handle Incoming WhatsApp Votes
router.post('/vote', async (req, res) => {
 const incomingMsg = req.body.Body.trim().toUpperCase();
 const voterNumber = req.body.From; // WhatsApp number
 const poll = await Poll.findOne(); // Assuming a single active poll

 // Check if voter has already voted
 if (poll.participants.includes(voterNumber)) {
  // send a message to the user via whatsapp
  await sendWhatsAppMessage(voterNumber, 'You have already voted!');
 }

 // Find and update vote count
 const option = poll.options.find(
  (opt) => opt.name.toUpperCase() === incomingMsg
 );
 if (option) {
  option.votes += 1;
  poll.participants.push(voterNumber); // Mark the user as voted
  await poll.save();
  await sendWhatsAppMessage(voterNumber, 'Thank you for voting!');
 } else {
  await sendWhatsAppMessage(
   voterNumber,
   'Invalid option. Please vote with the correct option!'
  );
 }
});

// SSE for Real-time Updates
router.get('/:id/stream', async (req, res) => {
 const poll = await Poll.findById(req.params.id);

 res.setHeader('Content-Type', 'text/event-stream');
 res.setHeader('Cache-Control', 'no-cache');
 res.setHeader('Connection', 'keep-alive');

 const intervalId = setInterval(async () => {
  const updatedPoll = await Poll.findById(req.params.id);
  res.write(`data: ${JSON.stringify(updatedPoll)}\n\n`);
 }, 2000);

 req.on('close', () => clearInterval(intervalId));
});

module.exports = router;
