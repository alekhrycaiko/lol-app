import React, {Component} from 'react';
export default class MatchHistory extends React.Component{ 
    constructor(props) { 
        super(props);
    }
    render() { 
        
        if (this.props.games) { 

        /*                 </div>
                                <div className="match-rune"> 
                                    {match.runes.map( rune => {
                                        return(
                                        <div> 
                                            <img className = "match-rune-image" src={rune.url}/>
                                        </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                */
        const matches = this.props.games.map( (match, index) => {
            // TODO: Check the match.win string check vs real data.
            // placeholder: "win"
            const mins = Math.floor(match.gameDuration / 60);
            const seconds =  match.gameDuration - mins * 60;
            let win = 'L';
            let outcomeClass = 'match match-loss'
            if (match.win) { 
                win = 'W';
                outcomeClass = 'match match-win'
            }
            return(
                <div className={outcomeClass}>
                        <div className="match-lhs"> 
                           <span> {win} </span>
                        </div>
                    <div className = "match-mid grid-container">
                            <div className="match-mid-champ-pics grid-4">
                               
                                <img src={match.champion.url}/>
                <div className="match-mid-abilites"> 
                                <img src={match.spell1.url}/>
                                <img src={match.spell2.url}/>
                </div>
                <div className="match-mid-abilites">
                            <img src={match.runes[0].url}/>
                            <img src={match.runes[1].url}/>
                </div>
                            <div className = "match-champion"> 
                                <span className="match-champion-name"> {match.champion.name} </span>
                                <span className="match-champion-level"> Level {match.champLevel} </span>
                            </div>
                            </div>

                            <div className = "match-stats">
                            <span className="match-kills"> {match.kills} Kills </span>  
                             <span className="match-deaths"> / {match.deaths} Deaths </span>  
                            <span className="match-assists"> /{match.assists} Assists </span>  
                            <div className="match-duration">
                                <span> {mins} mins {seconds} seconds spent playing.</span>
                            </div>
                                <span> {match.totalMinionsKilled} minions squashed.</span>
                                <div>     
                                  <span> {match.minionPerMin} minions squashed per min.</span>
                                </div> 
                            </div>
                        <div className="match-item-list">
                             {match.itemArr.map(item => {
                                return(
                                    <img className="match-item-image" src={item.url}/>
                                )
                             })}
                        </div>
                    </div>
                </div>
            )
        });
            return (
                <div className="matchhistory-container">
                    {matches} 
                </div>
            
            )
        } 
        else { 
            return(<span> Loading ...  </span>)
        }
    }
}

