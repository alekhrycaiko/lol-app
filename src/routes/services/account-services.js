// Responsible for performing lookup of a summoner and obtaining account information. 
const axios = require('axios');
const API_KEY = process.env.RIOT_API;

/**
 * Performs service call to LoL API and obtains an account ID.
 * Requires a region name and summoner name.
 */
module.exports = { 
    async getSummonerAccountInfo (region, name) {
        const link = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}`;
        const {data : {accountId}} =  await axios.get(link, {params: { 'api_key' : API_KEY }});
        return accountId; 
    }
}

