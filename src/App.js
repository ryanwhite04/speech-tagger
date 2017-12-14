import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Recorder from './Recorder';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import transcripts from './transcripts';
import './App.css';

let items = transcripts
  .slice(0, 100).map((transcript, i) =>
    <MenuItem value={i} key={i} primaryText={`Sentence ${i}`} secondaryText={transcript[0]} />
)

export default class App extends Component {
  state = {
    sentence: 0,
  };

  handleChange = (event, index, value) => this.setState({ sentence: value });

  render = () => {
    // let transcript = transcripts[this.state.sentence];
    let transcript = [
      'abcd',
      'a b c d',
    ];
    return <MuiThemeProvider>
      <Recorder sentence={this.state.sentence} transcript={transcript}>
        <SelectField
          value={this.state.sentence}
          onChange={this.handleChange}
          autoWidth
          maxHeight={200}
        >{items}
        </SelectField>
      </Recorder>
    </MuiThemeProvider>;
  }
}
