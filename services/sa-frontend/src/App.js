import React, {Component} from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Polarity from "./components/Polarity";
import keycloak from './keycloak'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import jwt_decode from "jwt-decode";

const style = {
    marginLeft: 12,
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sentence: '',
            polarity: undefined,
        };

        this.eventLogger = this.eventLogger.bind(this);
        this.tokenLogger = this.tokenLogger.bind(this);
    }

    eventLogger(event, error) {
        console.debug('onKeycloakEvent', event, error)
    }
    
    tokenLogger(token) {
        console.log('onKeycloakTokens', token)
        // This SHOULD NOT be done for real services 
        // that handle any sorts of traffic
        localStorage.setItem('jwtToken', token.token)
        this.setState({token: token.token, username: jwt_decode(token.idToken).preferred_username})
    }

    analyzeSentence() {
        fetch('/sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            body: JSON.stringify({sentence: this.textField.getValue()})
        })
            .then(response => {
                if (response.status === 403) {
                    this.setState({ 
                        errorMsg: 'Unauthorized'
                    })
                } else {
                    response.json().then(data => {
                        this.setState({ sentence: data.sentence, polarity: data.polarity})
                    })
                }
                
            })
    }

    onEnterPress = e => {
        if (e.key === 'Enter') {
            this.analyzeSentence();
        }
    };

    render() {
        const polarityComponent = this.state.polarity !== undefined ?
        <Polarity sentence={this.state.sentence} polarity={this.state.polarity}/> :
        null;
    
        const errorMsg = this.state.errorMsg !== undefined ?
        <p>{this.state.errorMsg}</p> :
        null;
    

        return <ReactKeycloakProvider authClient={keycloak}
                                        initOptions={{ onLoad: "login-required", flow: 'implicit', checkLoginIframe: false}}
                                        onEvent={this.eventLogger}
                                        onTokens={this.tokenLogger}>
            <MuiThemeProvider>
                <div>
                    { this.state.username ? <Chip style={{position: 'absolute', right: '10px'}}> { this.state.username } </Chip> : null }
                    <div className="centerize">
                        <Paper zDepth={1} className="content">
                            <h2>Sentiment Analyser</h2>
                            <TextField ref={ref => this.textField = ref} onKeyUp={this.onEnterPress.bind(this)}
                                        hintText="Type your sentence"/>
                            <RaisedButton className="green" label="Send" style={style} onClick={this.analyzeSentence.bind(this)}/>
                            {polarityComponent}
                            {errorMsg}
                        </Paper>
                    </div>
                </div>
            </MuiThemeProvider>
        </ReactKeycloakProvider>
    }
}

export default App;
