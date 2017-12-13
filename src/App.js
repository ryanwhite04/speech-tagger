import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Recorder from './Recorder';
import transcripts from './transcripts';
import './App.css';

console.log(transcripts.slice(0, 10))
export default () => <MuiThemeProvider>
  <Recorder />
</MuiThemeProvider>;
