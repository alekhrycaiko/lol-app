// Express server. 

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware  = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const config = require('./webpack.config.js');
const app = express();
// Routes
const summonerMatchHistory = require("./src/routes/summoner");
if (isDeveloping) { 
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, { 
        publicPath: config.output.publicPath,
        contentBase: 'src'
    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('/', function response (req, res) { 
        res.sendFile(path.join(__dirname, "dist/index.html"));
    });
} else { 
    app.use(express.static(__dirname + '/dist'));
}
app.use("/summoner", summonerMatchHistory);

app.listen(port, '0.0.0.0', function onStart(err) { 
    if (err) { 
        console.log(err);
    }
    console.info("🎄 🎄 🎄 Merrily Listening on port %s. Open up http://0.0.0.0:%s/ to view the server.", port, port); 
});

