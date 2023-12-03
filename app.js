const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const logger = require('./logging/logger');
const staticFileMiddleware = require('./files/staticFileMiddleware');
const apiRouter = require('./routes/apiRouter');
const errorMiddleware = require('./errors/errorMiddleware');
const {init} = require("./db_util");

app.use(connectLiveReload());

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

app.use("/api", staticFileMiddleware);

app.use("/api", apiRouter);

app.use(errorMiddleware);

// just for development
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});



