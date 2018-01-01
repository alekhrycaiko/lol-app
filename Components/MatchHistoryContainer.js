import React, {Component} from 'react';
import MatchHistory from './MatchHistory';
import axios from 'axios';
class MatchHistoryContainer extends React.Component { 

    constructor(props) {
        super(props);
        this.state = { 
            games : []
        }
    }
    async componentDidMount() {
        try { 
            let urlParams = new URLSearchParams(window.location.search);
            let name = urlParams.get('name');
            let region = urlParams.get('region');
            let result = await axios.get('/summoner', {
                params: {name : name, region: region }
            });
            this.setState({
                games : result.data
            });
        } catch (e) { 
            console.log("Error performing request to summoner API : " + e);
        }
    }
    render() {
        return(
             <MatchHistory summoner={this.state.games.name} games={this.state.games.data}/>)
    }
}
export default MatchHistoryContainer;
