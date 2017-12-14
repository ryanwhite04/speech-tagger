import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AvMic from 'material-ui/svg-icons/av/mic';
import AvMicOff from 'material-ui/svg-icons/av/mic-off';
import { ReactMic } from 'react-mic';
import Recording from './Recording';

let styles = {
  container: {
    margin: 24,
    // background: 'blue',
  },
  fab: {
    margin: 20,
  }
};

class Recorder extends Component {

  static defaultProps = {}

  state = {
    record: false,
    recordings: [],
    tags: [],
  }

  start = () => {
    console.log('start', this.state);
    this.setState({
      record: true,
      tags: [{
        time: new Date().getTime(),
        text: this.props.transcript[1].split(' ')[0],
      }],
    });
  }

  stop = () => {
    console.log('stop', this.state);
    this.setState({ record: false });
  }

  toggle = () => {
    console.log('toggle', this.state);
    this.state.record ? this.stop() : this.start();
  }

  tag = () => {
    console.log('tag', this.state);
    this.state.tags.length < this.props.transcript[1].split(' ').length  ?
      this.setState(({ tags }) => ({ tags: [...tags, {
        time: new Date().getTime(),
        text: this.props.transcript[1].split(' ')[tags.length],
      }]})) : this.setState({ record: false });
  }

  onStop = blob => {
    console.log('onStop', this.state, { blob });
    this.state.tags.length === this.props.transcript[1].split(' ').length &&
      this.setState(({ recordings, tags }) => ({
        recordings: [...recordings, {
          sentence: this.props.sentence,
          blob,
          tags,
          clear: this.clear,
        }]
      }));
  }

  clear = sentence => () => {
    console.log('clear', this.state, { sentence });
    this.setState(({ recordings }) => ({
      recordings: recordings.filter(sentence => sentence !== this.props.sentence ),
    }))
  }

  render = () => {
    console.log('render', this.state);
    return <div style={styles.container}>
      <div>{this.props.children}</div>
      <ul>
        <li>Hanzi: {this.props.transcript[0]}</li>
        <li>Pinyin: {this.props.transcript[1]}</li>
        <li>Characters: {this.props.transcript[1].split(' ').length}</li>
      </ul>
      <div>
        <FloatingActionButton style={styles.fab} onClick={this.toggle}>
           {this.state.record ? <AvMicOff/> : <AvMic/>}
        </FloatingActionButton>
        <FloatingActionButton style={styles.fab} onClick={this.tag} disabled={!this.state.record}>
          <ContentAdd/>
        </FloatingActionButton>
        <span>Tags: {this.state.tags.length - (this.state.record ? 1 : 0)} / {this.props.transcript[1].split(' ').length}</span>
      </div>
      <div>
        {this.state.recordings.map(recording => <Recording {...recording} key={recording.sentence} />)}
      </div>
      <ReactMic
        record={this.state.record}
        onStop={this.onStop}
      />
    </div>;
  }
}

export default Recorder;
