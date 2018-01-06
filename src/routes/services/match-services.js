// Responsible for performing lookup of a summoner and obtaining account information. 
const axios = require('axios');
const API_KEY = process.env.RIOT_API;
const itemJsonData = require('../../data/item.json');
const runeJsonData = require('../../data/rune.json');
const championJsonData = require('../../data/champion.json');
const summonerAbilityJsonData = require('../../data/summoner.json');
const R = require('ramda');
/**
 *  Performs service call to LoL API for an account ID and gets latest matches.
 *  Requires an account ID and platform ID.
 */
module.exports = { 
    async getSummonersMatchHistory (region, accountId) {
        const link = "https://" + region + ".api.riotgames.com/lol/match/v3/matchlists/by-account/" + accountId + "/recent";
        const {data : {matches}} = await axios.get(link, { params: {'api_key' : API_KEY}});
        return matches.map( item => item.gameId);      
    },

    /**
     * Build Item output to include CDN and item id
     */
    buildItemOutput (stats) {
        const itemArr = [ stats.item0, stats.item1, stats.item2, stats.item3, stats.item4, stats.item5, stats.item6];
        const {data} = itemJsonData;
        return itemArr.filter( id => id !== undefined && id > 0 && data[id] !== undefined)
            .map(id => {
                const {name, image: {full : imageName}} = data[id];
                return ({ 
                    name: name,
                    url: "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" + imageName
                });
            });
    },

    buildRuneOutput (runeArray = []) {
        const {data} = runeJsonData;
        return runeArray.map( rune => {
            const {runeId} = rune;
            const {name, image : {full : imageName}} = data[runeId];
            return ({ 
                runeId: runeId, 
                name: name,
                url: "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/rune/" + imageName
            });
        });
    },

    buildSpellOutput (spellId) {
        const {data}  = summonerAbilityJsonData;
        const spellName = R.find((item => data[item].key == spellId))(R.keys(data));
        return { 
            runeId : spellId,
            name : spellName, 
            url: "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/" + spellName  + ".png"
        }
    },

    // Filter JSON for target 
    buildChampionOutput (championId) {
        const {data} = championJsonData;
        const championName = R.find((item => data[item].key == championId))(R.keys(data));
        return { 
            url : "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + championName + ".png",
            name: championName
        }
    },

    /**
     * Performs service call to LoL API for game data.
     * Requires region and games array containing gameId's
     * Returns an array of objects [ordered] containing relevant game information. 
    * */
    getLatestGamesData (region, gamesArr, summonerName)  {
        let gamePromiseArr = [];
        gamesArr.forEach( gameId => {
            let gamePromise = new Promise( (resolve, reject) => {
                const link = "https://" + region + ".api.riotgames.com/lol/match/v3/matches/" + gameId;
                axios({
                    method: "GET", 
                    url: link,
                    params: {'api_key': API_KEY}
                }).then(gameObject => {
                    // save duration and data for specific participant
                    let length = gameObject.data.gameDuration;
                    let ids = gameObject.data.participantIdentities;
                    let playerNumber = "";
                    ids.forEach(idObj => {
                        if (idObj.player.summonerName === summonerName) { 
                            playerNumber = idObj.participantId; 
                        }
                    });
                    const participantsObj  = gameObject.data.participants;
                    let playerData; 
                    participantsObj.forEach( player => { 
                        if (player.participantId === playerNumber) { 
                            playerData = player;
                        }
                    });
                    // TODO: Move to sprite sheets rather than external URL
                    const minutes = Math.floor(length / 60);
                    const minionPerMin = Math.round((playerData.stats.totalMinionsKilled / minutes 
                        + 0.00001) * 100) / 100
                    const playerMatchOutput = {
                        champion: this.buildChampionOutput(playerData.championId),
                        spell1: this.buildSpellOutput(playerData.spell1Id),
                        spell2 : this.buildSpellOutput(playerData.spell2Id),
                        runes : this.buildRuneOutput(playerData.runes), 
                        gameDuration : length,
                        win : playerData.stats.win,
                        itemArr : this.buildItemOutput(playerData.stats),
                        kills: playerData.stats.kills,
                        deaths: playerData.stats.deaths,
                        assists: playerData.stats.assists,
                        totalMinionsKilled: playerData.stats.totalMinionsKilled,
                        minionPerMin: minionPerMin,
                        champLevel : playerData.stats.champLevel
                    }
                    resolve(playerMatchOutput);
                }).catch( err => {
                    reject(err);
                });
            });
            gamePromiseArr.push(gamePromise);
        });
        return Promise.all(gamePromiseArr);
    }
}
