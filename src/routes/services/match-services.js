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
        const link = `https://${region}.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}/recent`;
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
                    url: `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/${imageName}`
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
                url: `https://ddragon.leagueoflegends.com/cdn/6.24.1/img/rune/${imageName}`
            });
        });
    },

    buildSpellOutput (spellId) {
        const {data}  = summonerAbilityJsonData;
        const spellName = R.find((item => data[item].key == spellId))(R.keys(data));
        return { 
            runeId : spellId,
            name : spellName, 
            url: `https://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/${spellName}.png`
        }
    },

    // Filter JSON for target 
    buildChampionOutput (championId) {
        const {data} = championJsonData;
        const championName = R.find((item => data[item].key == championId))(R.keys(data));
        return { 
            url : `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${championName}.png`,
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
                const link = `https://${region}.api.riotgames.com/lol/match/v3/matches/${gameId}`;
                axios.get(link, {params: {'api_key' : API_KEY}})
                .then(gameObject => {
                    const {data: {gameDuration : length, participantIdentities : ids, participants : participantsObj}}  = gameObject;
                    const {participantId: playerNumber} = R.find(idObj => idObj.player.summonerName === summonerName)(ids);
                    const playerData  = R.find(player => player.participantId === playerNumber)(participantsObj);
                    const {stats, stats: {assists, champLevel, deaths, kills, totalMinionsKilled, win}, championId, runes, spell1Id, spell2Id} = playerData;
                    const minutes = Math.floor(length / 60);
                    const minionPerMin = Math.round((totalMinionsKilled / minutes  + 0.00001) * 100) / 100
                    
                    const playerMatchOutput = {
                        champion: this.buildChampionOutput(championId),
                        spell1: this.buildSpellOutput(spell1Id),
                        spell2 : this.buildSpellOutput(spell2Id),
                        runes : this.buildRuneOutput(runes), 
                        gameDuration : length,
                        win : win,
                        itemArr : this.buildItemOutput(stats),
                        kills: kills,
                        deaths: deaths,
                        assists: assists,
                        totalMinionsKilled: totalMinionsKilled,
                        minionPerMin: minionPerMin,
                        champLevel : champLevel
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
