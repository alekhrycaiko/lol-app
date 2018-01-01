// Root Parent of application. could be something like a player page.
import React from 'react';
import ReactDOM from 'react-dom';
import MatchHistoryContainer from './Components/MatchHistoryContainer';
export default class App extends React.Component { 
    constructor(props) { 
        super(props);
    }
    render() { 
        return(
            <div class = "bob">
                <MatchHistoryContainer/>
            </div>
        )

    }
}
ReactDOM.render(<App />, document.getElementById('root'));
