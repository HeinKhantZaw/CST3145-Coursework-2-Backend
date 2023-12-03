let express = require('express');
let logger = express.Router();

logger.use((req, res, next) => {
    console.log("[LOGGER] Request URL: " + req.url);
    next();
});

module.exports = logger
