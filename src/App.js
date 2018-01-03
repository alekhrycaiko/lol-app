// Root Parent of application. could be something like a player page.
import React from 'react';
import ReactDOM from 'react-dom';

import ErrorBoundary from './Components/ErrorBoundary';
import MatchHistoryContainer from './Components/MatchHistoryContainer';
import "./stylesheets/MatchHistory.scss";
export default class App extends React.Component { 
    constructor(props) { 
        super(props);
    }
    render() { 
        return(
            <ErrorBoundary>    
                <MatchHistoryContainer/>
            </ErrorBoundary>
        )

    }
}
ReactDOM.render(<App />, document.getElementById('root'));
