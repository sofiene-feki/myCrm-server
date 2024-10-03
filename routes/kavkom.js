// routes/callRoutes.js
const express = require('express');
const { initiateCall } = require('../controllers/kavkom');
const router = express.Router();

// Define the POST route for initiating a call
router.post('/call', initiateCall);

module.exports = router;
