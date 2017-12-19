import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import transcripts from './transcripts'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

const state = {
  blob: false,
  tags: [],
  record: false,
  message: "Welcome",
};

ReactDOM.render(<Router basename={process.env.PUBLIC_URL}>
  <Switch>
    <Redirect from="/" exact to={{
      pathname: localStorage.getItem('sentence') || '/0',
      state,
    }}/>
    <Route path="/:sentence" render={props => (
      props.location.state && props.match.params.sentence ?
        (<App {...props} transcripts={transcripts}/>) :
        (<Redirect to={{...props.location, state}}/>)
    )}/>
  </Switch>
</Router>, document.getElementById('root'));
registerServiceWorker();
