const express = require('express');
const path = require('path');
const staticFileMiddleware = express();

const imagesDirectory = path.resolve(__dirname, '../images');

const imagesMiddleware = express.static(imagesDirectory);

staticFileMiddleware.use('/images', imagesMiddleware);

module.exports = staticFileMiddleware;
