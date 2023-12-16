const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const logger = require('./logging/logger');
const staticFileMiddleware = require('./files/staticFileMiddleware');
const apiRouter = require('./routes/apiRouter');
const errorMiddleware = require('./errors/errorMiddleware');
const {init} = require("./db_util");

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

(async () => {
    await init();

    app.listen(process.env.PORT, (err) => {
        console.log(`Server is up at localhost ${process.env.PORT}`);
    });
})();

app.use(logger);

app.use("/", staticFileMiddleware);

app.use("/api", apiRouter);

app.use(errorMiddleware);
