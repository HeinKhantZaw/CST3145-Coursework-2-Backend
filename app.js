const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const app = express();

const logger = require('./logs/logger');
const staticFileMiddleware = require('./files/staticFileMiddleware');
const apiRouter = require('./routes/apiRouter');
const {init} = require("./db_util");

const PORT = 3000;

app.use(connectLiveReload());

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

(async () => {
    await init();

    app.listen(PORT, (err) => {
        console.log(`Server is up at localhost ${PORT}`);
    });
})();


// app.get("/collection/:collectionName", (req, res, next) => {
//     req.collection.find({}).toArray((e, results) => {
//         if (e) return next(e);
//         res.send(results);
//     });
// });

app.use(logger);

app.use(staticFileMiddleware);

app.use("/api", apiRouter);

// just for development
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});



