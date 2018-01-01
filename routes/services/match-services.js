// Responsible for performing lookup of a summoner and obtaining account information. 
const axios = require('axios');
const API_KEY = require('../../../keys.js')();
const itemJsonData = require('../../data/item.json');
const runeJsonData = require('../../data/rune.json');
const championJsonData = require('../../data/champion.json');
/**
 *  Performs service call to LoL API for an account ID and gets latest matches.
 *  Requires an account ID and platform ID.
 */
getSummonersMatchHistory = function (region, accountId) {
    const link = "https://" + region + ".api.riotgames.com/lol/match/v3/matchlists/by-account/" + accountId + "/recent"
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: link, 
            params: {'api_key': API_KEY}
        }).then( result => {
            let matchHistoryArr = [];
            result.data.matches.forEach(item => {
                matchHistoryArr.push(item.gameId);
            });
            resolve(matchHistoryArr);
        }).catch( err => {
            reject(err); 
        });
    });
}




/**
 * Helper function that reduces match data object down to relevant information.
 * Returns: outcome, game-length, summoner-name, summoner-spells, champ played, KDA,
 * item [codes] purchased, level, creep score, creep score per min.
 **/
truncateDataSet = function (playerDataSet) { 
   // playerDataSet should be an array of objects.
}

/**
 * Build Item output to include CDN and item id
 */
buildItemOutput = function (itemId) { 
    return {
        itemId : itemId,
        name : itemJsonData.data.name,
        url : "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" + itemId + ".png"
    }
}

buildRuneOutput = function (runeArray) {
    let runeArrOut = [];
    runeArray.forEach( runeId => {
        runeArrOut.push({
         runeId : runeId,
         name : runeJsonData.data.runeId,
         url: "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/rune/" + runeId + ".png"

        })
    });
    return runeArrOut;
}

buildSpellOutput = function (spellId) { 
    return { 
        runeId : spellId,
        url: "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/" + spellId + ".png"
    }
}

// Filter JSON for target 
buildChampionOutput = function(championId) {
    const data = championJsonData.data;
    for (var key in data) { 
        if (data[key].key == championId) { 
                return data[key].id;
            }
    }
}


/**
 * Performs service call to LoL API for game data.
 * Requires region and games array containing gameId's
 * Returns an array of objects [ordered] containing relevant game information. 
 * */
getLatestGamesData = function (region, gamesArr, summonerName)  {
    let gamePromiseArr = [];
    gamesArr.forEach( gameId=> {
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
                const playerMatchOutput = {
                    championName: buildChampionOutput(playerData.championId),
                    spell1Id: buildSpellOutput(playerData.spell1Id),
                    spell2Id : buildSpellOutput(playerData.spell2Id),
                    runes : buildRuneOutput(playerData.runes), 
                    gameDuration : length,
                    win : playerData.stats.win,
                    item0 : buildItemOutput(playerData.stats.item0),
                    item1 : buildItemOutput(playerData.stats.item1),
                    item2 : buildItemOutput(playerData.stats.item2),
                    item3 : buildItemOutput(playerData.stats.item3),
                    item4 : buildItemOutput(playerData.stats.item4),
                    item5 : buildItemOutput(playerData.stats.item5),
                    item6 : buildItemOutput(playerData.stats.item6),
                    kills: playerData.stats.kills,
                    deaths: playerData.stats.deaths,
                    assists: playerData.stats.assists,
                    totalMinionsKilled: playerData.stats.totalMinionsKilled,
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

module.exports = {
    getLatestGamesData : getLatestGamesData,
    getSummonersMatchHistory : getSummonersMatchHistory
}
