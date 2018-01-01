import React, {Component} from 'react';
export default class MatchHistory extends React.Component{ 
    constructor(props) { 
        super(props);
    }
    render() { 
        if (this.props.games) { 
        const matchHistoryElement = this.props.games.forEach(item => { 
            return (<p> item.duration </p>)
        });
        return (
            <ul> 
                {this.props.games.map( (item, index) => {
                    return <li> {item.gameDuration} </li> ;
                })}
            </ul>    
            )
        } else { 
            return(<span> Loading ...  </span>)
        }
    }
}

