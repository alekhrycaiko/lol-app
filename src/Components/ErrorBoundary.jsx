import React, {Component} from 'react';

export default class ErrorBoundary extends React.Component { 
    constructor(props) { 
        super(props);
        this.state = {
            hasErr : false
        }
    }
    componentDidCatch(err, info) { 
        this.setState({
            hasErr : true
        });
    }
    render() {
        if (this.state.hasErr) {
            return <h1> Oh no! Something went wrong! Unable to display match history. </h1>
        }
        return this.props.children
    }
}
