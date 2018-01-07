import React, {Component} from 'react';
import MatchHistory from './MatchHistory.jsx';
import axios from 'axios';
class MatchHistoryContainer extends React.Component { 

    constructor(props) {
        super(props);
        this.state = { 
            games : [],
            hasErr : false
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
            this.setState({
                hasErr : true
            });
        }
    }
    render() {
        if (this.state.hasErr) {
           return (<div> Error connecting to API </div>);
        } else { 
        return(
                <MatchHistory summoner={this.state.games.name} games={this.state.games.data}/>
            )
        }
    }
}
export default MatchHistoryContainer;
