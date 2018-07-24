import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import idioms from './idioms'
import chengyu from './chengyu'
import config from './config'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

const state = {
  blob: false,
  tags: [],
  record: false,
  message: 'Welcome',
}

ReactDOM.render(<Router basename={config.PUBLIC_URL}>
  <Switch>
    <Redirect from="/" exact to={{
      pathname: localStorage.getItem('sentence') || '/0',
      state,
    }}/>
    <Route path="/:sentence" render={props => {
      return (props.location.state && props.match.params.sentence ?
        (<App version={config.version} {...props} transcripts={[...idioms, ...chengyu]}/>) :
        (<Redirect to={{...props.location, state}}/>)
      )
    }}/>
  </Switch>
</Router>, document.getElementById('root'))
registerServiceWorker()
