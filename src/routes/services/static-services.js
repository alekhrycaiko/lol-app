const axios = require('axios');
const API_KEY = process.env.RIOT_API;


// TODO: Setup service that grabs and caches the JSON Files the solution is using. 
/**
 * Performs service call to lol api and gets a champions name based on ID.
 * Requires a region name and summoner name.
 */
getChampionName = function (region, id) {
    const link = "https://" + region + ".api.riotgames.com/lol/static-data/v3/champions/" + id + "?locale=en_US";
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: link,
            params: {'api_key' : API_KEY}
        }).then( result => {
            resolve(result.data.name);
        }).catch( err => {
            reject(err); 
        });
    });
}

module.exports = {
    getChampionName : getChampionName
}
