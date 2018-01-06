// Responsible for performing lookup of a summoner and obtaining account information. 
const express = require('express');
const router = express.Router();
const accountServices = require('./services/account-services.js');
const matchServices = require('./services/match-services.js');
const staticServices = require('./services/static-services.js');
/**
 * Route '/summoner' consumes a region code (e.g. NA1) and a username (e.g. Bob)
 * Outputs a summoners latest match history.
 * */
router.get('/', async (req, res) => { 
    // Gets latest match history/
    try {
        const {query : {name : summonerName}, query: {region : region}} = req;
        const accountId = await accountServices.getSummonerAccountInfo(region, summonerName);
        let dataSet = await matchServices.getSummonersMatchHistory(region, accountId);
        const truncatedDataSet = dataSet.slice(0, 10);
        let gameData = await matchServices.getLatestGamesData(req.query.region, truncatedDataSet, summonerName);
        const output = { 
            name: summonerName,
            data: gameData,
        }
        res.json(output);
    } catch (err) {
        res.status(500).send("Error resolving match history for summoner: " + err);
    }
});

module.exports = router; 
