import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AvMic from 'material-ui/svg-icons/av/mic';
import AvMicOff from 'material-ui/svg-icons/av/mic-off';
import { ReactMic } from 'react-mic';
import Mousetrap from 'mousetrap';
import SnackBar from 'material-ui/Snackbar';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import Paper from 'material-ui/Paper';

export default class Recorder extends Component {

  static defaultProps = {}

  state = {
    record: false,
    recordings: {},
    tags: [],
    error: false,
    message: "There is an error",
    time: Date.now(),
  }

  componentDidMount() {
    Mousetrap.bind(['space'], e => {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      this.toggle()
    });
    Mousetrap.bind(['enter'], this.onEnter);
    Mousetrap.bind(['backspace'], this.clear);
  }

  componentWillUnmount() {
    Mousetrap.unbind(['space'], e => {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      this.next()
    });
    Mousetrap.unbind(['enter'], this.onEnter);
    Mousetrap.unbind(['backspace'], this.clear);
  }

  onEnter = () => {
    this.state.record ? this.tag() : this.save()
  }

  next = () => {
    if (this.state.record) {
      // add a tag
      this.tag();
    } else {
      // start the recording
      this.toggle();
    }
  }

  save = () => {
    // Download the recording
  }

  clear = () => {
    this.setState({ recordings: {} })
  }

  toggle = () => this.setState(({ record, time }) => ({
    record: !record,
    time: record ? time : Date.now(),
  }))

  tag = () => this.setState(({ record, tags }) => {
    return record && tags.length < this.count ?
      { tags: [...tags, Date.now() ] } :

      // Maybe should present error instead
      { record: false }
  })

  onStop = ({ blob }) => this.state.tags.length === this.count ? this.setState(({
    // state
    recordings, tags, time
  }, {
    // props
    transcript, sentence
  }) => ({
    tags: [],
    recordings: {...recordings, [sentence]: {
      transcript,
      blob,
      tags,
      ends: [time, Date.now()],

      // deletes itself
      // TODO might want to delete object URL too later
      clear: s => () => this.setState(({ recordings }) => {
        delete recordings[s];
        return { recordings };
      }),
    }}
  })) : this.setState({ tags: [] })

  get count() {
    return this.props.transcript[1].split(' ').length;
  }

  render = () => <div>
    <Paper zDepth={2} style={{ maxWidth: 420, margin: '64px auto' }}>
    <Card>
      <CardTitle
        title={`Sentence ${this.props.sentence}`}
        subtitle={`${this.state.tags.length}/${this.count}`}
      />
      <CardMedia>
        <ReactMic
          record={this.state.record}
          onStop={this.onStop}
        />
      </CardMedia>
      <CardHeader title="Hanzi" subtitle={this.props.transcript[0]} />
      <CardHeader title="Pinyin" subtitle={this.props.transcript[1]} />
      <CardText>
        {this.props.children}
      </CardText>
      <CardActions>
        <FloatingActionButton
          className="FloatingActionButton"
          onClick={this.toggle}>
           {this.state.record ? <AvMicOff/> : <AvMic/>}
        </FloatingActionButton>
        <FloatingActionButton
          className="FloatingActionButton"
          onClick={this.tag}
          disabled={!this.state.record || this.state.tags.length === this.count}
        ><ContentAdd/>
        </FloatingActionButton>
      </CardActions>
    </Card>
    </Paper>
    <SnackBar
      open={this.state.error}
      message={this.state.message}
      autoHideDuration={4000}
      onRequestClose={() => this.setState({ error: false })}
    />
  </div>
}
