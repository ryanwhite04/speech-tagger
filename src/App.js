import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Recorder from './Recorder';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import transcripts from './transcripts';
import AppBar from 'material-ui/AppBar';
import './App.css';
export default class App extends Component {

  state = {
    sentence: 0,
    complete: [],
  };

  next = () => {

  }

  prev = () => {

  }

  pick = () => {
    // this.setState(sentence)
  }

  handleChange = (event, index, value) => this.setState({ sentence: value });

  get transcripts() {
    return process.env.NODE_ENV === 'development' ? [
      ['abcd', 'a b c d'],
      ['efgh', 'e f g h'],
      ['ijkl', 'i j k l'],
      transcripts[0],
    ] : transcripts;
  }

  get items() {
    return this.transcripts.map((transcript, i) =>
      <MenuItem value={i} key={i} primaryText={`Sentence ${i}`} secondaryText={transcript[0]} />
    );
  }

  get transcript() {
    return this.transcripts[this.state.sentence]
  }

  render = () => <MuiThemeProvider>
    <div>
      <AppBar title="Speech Tagger"/>
      <Recorder sentence={this.state.sentence} transcript={this.transcript}/>
      <SelectField
        value={this.state.sentence}
        onChange={this.handleChange}
        autoWidth
        maxHeight={200}
      >{this.items}
      </SelectField>
    </div>
  </MuiThemeProvider>
}
