import React, { Component } from 'react'
import dedent from 'dedent';
import download from 'downloadjs';
import debug from 'debug';
import './App.css'
import { ReactMic } from 'react-mic';
import Mousetrap from 'mousetrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  red500,
  green500,
} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar'
import SnackBar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AvMic from 'material-ui/svg-icons/av/mic';
import AvMicOff from 'material-ui/svg-icons/av/mic-off';
import { Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';

const log = debug('main');

const theme = getMuiTheme({
  appBar: {
    position: 'fixed',
  }
});

export default class App extends Component {

  log = debug('App')
  bindings = [
    ['space', e => this.onSpace(e)],
    ['enter', e => this.onEnter(e)],
    ['backspace', e => this.onBackspace(e)],
  ]
  componentDidMount = () => this.bindings.map(binding => Mousetrap.bind(...binding))
  componentWillUnmount = () => this.bindings.map(binding => Mousetrap.unBind(...binding))
  onSpace = e => {
    this.log('onSpace', this.props);
    if (e.preventDefault) {
      e.preventDefault( );
    } else {
      e.returnValue = false;
    }
    this.props.location.state.record && !this.complete ?
      this.tag() :
      this.toggle();
  }
  toggle = () => {
    this.log('toggle', this.props);
    this.replace({
      record: !this.props.location.state.record,
      time: Date.now(),
    })
  }
  tag = () => {
    this.log('tag', this.props);
    let state = this.props.location.state;
    this.replace({
      tags: [...state.tags, Date.now() - state.time],
    })
  }
  onStop = ({ blob }) => {
    this.log('onStop', this.props)
    this.complete ? this.replace({
      blob,
      message: 'Nice',
    }) : this.replace({
      tags: [],
      message: 'You need to tag all of the syllables',
    })
  }
  save = () => {
    this.log('save', this.props);
    if (this.props.location.state.blob) {
      [
        [this.props.location.state.blob, `${this.props.match.params.sentence}.webm`, 'audio/webm'],
        [JSON.stringify(this.props.location.state.tags, null, 2), `${this.props.match.params.sentence}.json`, 'text/json'],
      ].map(data => download(...data));
      this.next();
    } else {
      this.replace({
        blob: false,
        tags: [],
        record: false,
        time: Date.now(),
        message: "Finish a recording before moving on to the next one",
      })
    }
  }
  clear = () => {
    this.log('clear', this.props);
    this.replace({
      blob: false,
      tags: [],
      record: false,
      time: Date.now(),
      message: "Let's try this again",
    })
  }
  replace = state => this.props.history.replace({
    ...this.props.location,
    state: {
      ...this.props.location.state,
      ...state,
    }
  })
  next = () => {
    this.log('next', this.props);
    const sentence = 1 + parseInt(this.props.match.params.sentence);
    this.props.history.push(`/${sentence}`, {
      blob: false,
      tags: [],
      record: false,
      message: 'On to the next one!',
    })
  }
  back = () => {
    this.log('back', this.props);
    this.props.history.goBack()
  }
  get transcript() {
    let [hanzi, pinyin] = this.props.transcripts[this.props.match.params.sentence];
    return [
      hanzi.replace(/\s+/g, '').split(''),
      pinyin.split(' '),
    ]
  }
  get count() {
    return this.transcript[0].length
  }
  get complete() {
    return this.props.location.state.tags.length === this.count
  }
  get expanded() {
    return !this.props.location.state.record && this.complete
  }
  render = () => {
    this.log('render', this.props);
    return (<MuiThemeProvider muiTheme={theme}>
      <div>
        <Header title="Speech Tagger" href="https://github.com/ryanwhite04/speech-tagger"/>
        <Paper zDepth={2} style={{ maxWidth: 420, margin: '64px auto' }}>
          <Card expanded={this.expanded}>
            <CardTitle
              title={`Sentence ${this.props.match.params.sentence}`}
              subtitle={`${this.props.location.state.tags.length}/${this.transcript[0].length}`}
              />
            <CardMedia><ReactMic className="mic" record={this.props.location.state.record} onStop={this.onStop}/></CardMedia>
            <CardHeader title="Hanzi" subtitle={
              <p>
                <span style={{ color: green500 }}>{this.transcript[0].slice(0, this.props.location.state.tags.length).join('')}</span>
                <span>{this.transcript[0].slice(this.props.location.state.tags.length).join('')}</span>
              </p>
            }/>
            <CardHeader title="Pinyin" subtitle={
              <p>
                <span style={{ color: green500 }}>{this.transcript[1].slice(0, this.props.location.state.tags.length).join(' ')} </span>
                <span>{this.transcript[1].slice(this.props.location.state.tags.length).join(' ')}</span>
              </p>
            }/>
            <CardActions>{
                this.props.location.state.record ?
                  <FlatButton label="Stop Recording" backgroundColor={red500} onClick={this.toggle} icon={<AvMicOff/>}/> :
                  <FlatButton label="Start Recording" backgroundColor={green500} onClick={this.toggle} icon={<AvMic/>}/>
              }
              <FlatButton label="Add Tag"
                onClick={this.tag}
                disabled={!this.props.location.state.record || this.props.location.state.tags.length === this.transcript[0].length}
                icon={<ContentAdd/>}
              />
              <FlatButton label="Restart" className="Button" onClick={this.clear} icon={<ContentClear/>}/>
              <FlatButton label="Download" className="Button" icon={<FileFileDownload/>} onClick={this.save}/>
            </CardActions>
            <CardMedia expandable={true}>
              <video src={this.props.location.state.blob ? URL.createObjectURL(this.props.location.state.blob) : undefined} controls>
                {this.props.location.state.blob && [{
                  default: true,
                  label: 'Hanzi',
                  transcript: this.transcript[0],
                  type: 'text/vtt',
                  kind :'subtitles',
                }, {
                  label: 'Pinyin',
                  transcript: this.transcript[1],
                  type: 'text/vtt',
                  kind: 'subtitles',
                }].map(cue(this.props.location.state.tags))}
              </video>
            </CardMedia>
          </Card>
        </Paper>
        <Toast>{this.props.location.state.message}</Toast>
      </div>
    </MuiThemeProvider>)
  }
}

function Toast({ children }) {
  return (<SnackBar
    open={!!children}
    message={children}
    autoHideDuration={4000}
    />)
}

function GitHubIcon(props) {

  log('GitHubIcon', { props });
  return (<SvgIcon {...props}>{
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  }</SvgIcon>);
}

function Header({ title, href }) {

  log('Header', { title, href });
  return (<AppBar title={title} iconElementRight={
    <IconButton href={href}><GitHubIcon/></IconButton>
  }/>);
}

function cue(tags) {
  return track => {

    log('cue', { tags }, { track });
    return (<track
      key={track.label}
      {...track}
      src={URL.createObjectURL(getTrackBlob(tags)(track.transcript))}
    />)
  }
}

function getTrackBlob(tags) {
  return transcript => {

    log('getTrackBlob', { tags }, { transcript });
    return new Blob([createVTT(tags.map((time, index) => ({
      time, text: transcript[index]
    })))], { type: 'text/vtt' })
  }
}

function createVTT(tags) {

  log('createVTT', { tags });
  return dedent`WEBVTT

    ${tags.map(toCue).join('\n\n')}
  `;
}

function toCue ({ time, text, side = 500 }) {

  log('toCue', { time, text, side });
  return dedent`
    ${format(time - side)} --> ${format(time + side)}
    ${text}
  `
}

function format(unix) {

  log('format', { unix });
  let seconds = (~~(unix/1000)).toString().slice(-2).padStart(2, 0);
  return `00:${seconds}.${unix % 1000}`;
}
