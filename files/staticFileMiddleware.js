const express = require('express');
const path = require('path');
const staticFileMiddleware = express.Router();

const imagesDirectory = path.resolve(__dirname, '../static/images');

const imagesMiddleware = express.static(imagesDirectory, {fallthrough: true}); // if the file is not found, continue to next middleware

staticFileMiddleware.use("/images", imagesMiddleware, (req, res, next) => {
    next();
});
module.exports = staticFileMiddleware;
