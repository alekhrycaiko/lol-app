// Responsible for performing lookup of a summoner and obtaining account information. 
const axios = require('axios');
const API_KEY = process.env.RIOT_API;
const itemJsonData = require('../../data/item.json');
const runeJsonData = require('../../data/rune.json');
const championJsonData = require('../../data/champion.json');
const summonerAbilityJsonData = require('../../data/summoner.json');
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
buildItemOutput = function (stats) {
    const itemArr = [ stats.item0, stats.item1, stats.item2, stats.item3, stats.item4, stats.item5, stats.item6];
    const outArr = itemArr.map( id  => {
        if (id > 0 && itemJsonData.data[id]) {
            return { 
                name: itemJsonData.data[id].name,
                url : "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" + itemJsonData.data[id].image.full
            }
        }
    });
    return outArr.filter(item => item !== undefined);
}

buildRuneOutput = function (runeArray) {
    if (runeArray) { 
        return runeArray.map( rune => {
            const runeId = rune.runeId;
            const name = runeJsonData.data[runeId].name;
            const imageName = runeJsonData.data[runeId].image.full;
            return ({ 
                runeId: runeId, 
                name: name,
                url: "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/rune/" + imageName
            });
        });
    }
    return [];
}

buildSpellOutput = function (spellId) {
    const data = summonerAbilityJsonData.data;
    let name = '';
    for (var key in data) { 
        if(data[key].key == spellId) { 
            name = data[key].id;
            break;
        }
    }
    return { 
        runeId : spellId,
        name : name, 
        url: "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/" + name  + ".png"
    }
}

// Filter JSON for target 
buildChampionOutput = function(championId) {
    const data = championJsonData.data;
    let name = '';
    for (var key in data) { 
        if (data[key].key == championId) { 
            name = data[key].id;
            break;
        }
    }
    const url = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + name + ".png";
    const champion = { 
        url : url,
        name: name
    }
    return champion;
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
                debugger
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
                debugger;
                const playerMatchOutput = {
                    champion: buildChampionOutput(playerData.championId),
                    spell1: buildSpellOutput(playerData.spell1Id),
                    spell2 : buildSpellOutput(playerData.spell2Id),
                    runes : buildRuneOutput(playerData.runes), 
                    gameDuration : length,
                    win : playerData.stats.win,
                    itemArr : buildItemOutput(playerData.stats),
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

module.exports = {
    getLatestGamesData : getLatestGamesData,
    getSummonersMatchHistory : getSummonersMatchHistory
}
