import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import { ReactMic } from 'react-mic';
import Recording from './Recording';

class Recorder extends Component {

  static defaultProps = {}

  state = {
    record: false,
    recordings: [],
  }

  toggle = () => this.setState(state => ({ record: !state.record }))

  onStop = ({
    blob: { type },
    blobURL: src,
    startTime: key
  }) => {
    console.log('onStop', { type, src, key });
    return this.setState(state => ({
      recordings: [...state.recordings, { type, src, key }]
    }));
  }

  render = () => <div>
    <ReactMic
      record={this.state.record}
      onStop={this.onStop}
    />
    <Toggle onToggle={this.toggle} label="Toggle" />
    {this.state.recordings.map((recording, index) => <Recording {...recording} name={index} />)}
  </div>
}

export default Recorder;
