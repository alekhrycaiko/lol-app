const axios = require('axios');
const API_KEY = process.env.RIOT_API;


// TODO: Setup service that grabs and caches the JSON Files the solution is using. 
/**
 * Performs service call to lol api and gets a champions name based on ID.
 * Requires a region name and summoner name.
 */
module.exports = { 
    async getChampionName (region, id) {
        const link = "https://" + region + ".api.riotgames.com/lol/static-data/v3/champions/" + id + "?locale=en_US";
        const {data : {name}} =  await axios.get(link, {params: { 'api_key' : API_KEY }});
        return name;
    }
}
