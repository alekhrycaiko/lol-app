// Express server. 

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware  = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const port = 3000; // TODO: Add a dev tag.
const config = require('./webpack.config.js');
const app = express();

// Routes
const summonerMatchHistory = require("./src/routes/summoner");

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, { 
    publicPath: config.output.publicPath,
    contentBase: 'src'
});
app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use("/summoner", summonerMatchHistory);
app.get("/", function response(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(port, '0.0.0.0', function onStart(err) { 
    if (err) { 
        console.log(err);
    }
    console.info("🎄 🎄 🎄 Merrily Listening on port %s. Open up http://0.0.0.0:%s/ to view the server.", port, port); 
});

