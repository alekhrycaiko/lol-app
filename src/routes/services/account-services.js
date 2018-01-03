// Responsible for performing lookup of a summoner and obtaining account information. 
const axios = require('axios');
const API_KEY = require('../../../keys.js')();

/**
 * Performs service call to LoL API and obtains an account ID.
 * Requires a region name and summoner name.
 */
getSummonerAccountInfo = function (region, name) {
    const link = "https://" +  region + ".api.riotgames.com/lol/summoner/v3/summoners/by-name/" + name;
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: link,
            params: {'api_key' : API_KEY}
        }).then( result => {
            resolve(result.data.accountId);
        }).catch( err => {
            reject(err); 
        });
    });
}

module.exports = {
    getSummonerAccountInfo : getSummonerAccountInfo
}
