let express = require('express');
let path = require('path');
let error = express.Router();

error.use(express.static(path.resolve(__dirname, '../static')));
filePath = path.resolve(__dirname, "../static/404.html")

error.use(function (req, res, next) {
    res.sendFile(filePath);
});
module.exports = error
