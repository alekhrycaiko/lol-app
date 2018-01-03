// Responsible for performing lookup of a summoner and obtaining account information. 
const axios = require('axios');
const API_KEY = process.env.RIOT_API;

/**
 * Performs service call to LoL API and obtains an account ID.
 * Requires a region name and summoner name.
 */
getSummonerAccountInfo = function (region, name) {
    const link = "https://" +  region + ".api.riotgames.com/lol/summoner/v3/summoners/by-name/" + name;
    return new Promise((resolve, reject) => {
        debugger;
        axios({
            method: "GET",
            url: link,
            params: {'api_key' : API_KEY}
        }).then( result => {
            debugger;
            resolve(result.data.accountId);
        }).catch( err => {
            reject(err); 
        });
    });
}

module.exports = {
    getSummonerAccountInfo : getSummonerAccountInfo
}
