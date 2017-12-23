import React, { Component } from 'react'
import dedent from 'dedent'
import download from 'downloadjs'
import debug from 'debug'
import './App.css'
import { ReactMic } from 'react-mic'
import Mousetrap from 'mousetrap'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {
  red500,
  // green500,
  cyan500,
  green500,
} from 'material-ui/styles/colors'
import AppBar from 'material-ui/AppBar'
import SnackBar from 'material-ui/Snackbar'
import Paper from 'material-ui/Paper'
// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton'
import SvgIcon from 'material-ui/SvgIcon'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileFileDownload from 'material-ui/svg-icons/file/file-download'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionHelp from 'material-ui/svg-icons/action/help'
import ActionLock from 'material-ui/svg-icons/action/lock'
import AvMic from 'material-ui/svg-icons/av/mic'
import AvMicOff from 'material-ui/svg-icons/av/mic-off'
import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before'
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next'
import { Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card'
import Guide from './Guide'

const log = debug('main')

const theme = getMuiTheme({
  appBar: {
    position: 'fixed',
  },
  iconButton: {
    width: 96,
    height: 96,
    padding: 48,
  }
})

const messages = {
  errors: {
    tag: {
      complete: "You've already tagged all the syllables, turn off the mic to review (Hit spacebar)",
      notRecording: "You aren't recording, turn on the mic first. (Hit spacebar)",
    },
    toggle: {
      incomplete: 'You need to tag all of the syllables',
    },
    save: {
      incomplete: 'Finish a recording before moving on to the next one',
    }
  },
  notify: {
    toggle: {
      off: "Have a listen, and if it's all good, hit enter to download and move onto the next one."
    },
    clear: {
      success: "Let's try this again",
    },
    save: {
      complete: 'Downloaded! Now move on to the next one',
    },
    next: {
      success: 'This is the next recording',
    }
  }
}

const steps = [
  {
    label: 'Start Recording',
    content: (<p>Click the {<AvMic/>} button or press the <b>Spacebar</b> key.</p>),
  },
  {
    label: 'Tag a Syllable',
    content: (<p>Click the {<ContentAdd/>} button or press the <b>Enter</b> key <i><b>as</b> you pronounce the first syllable</i>.</p>),
  },
  {
    label: 'Tag the remaining Syllables',
    content: (<p>Click the {<ContentAdd/>} button or press the <b>Enter</b> key <i><b>as</b> you pronounce each remaining syllable</i>.</p>),
  },
  {
    label: 'Stop Recording',
    content: (<p>Click the {<AvMicOff/>} button or press the <b>Spacebar</b> key.</p>),
  },
  {
    label: 'Download Files',
    content: (<p>
      Click the {<FileFileDownload/>} button or press the <b>Enter</b> key.
      Two files should be downloaded for each recording, a .webm file and a .json file.
      If not, go to site setting by clicking on the <ActionLock color={green500}/> to the left of the URL.
      In the menu, change the <b><i>Automatic Downloads</i></b> optino to <b><i>Allow</i></b>.
    </p>),
  },
  {
    label: 'Move to next Sentence',
    content: (<p>Click the {<ImageNavigateNext/>} button or press the <b>Right Arrow</b> key.</p>),
  },
]

export default class App extends Component {

  log = debug('App')
  
  bindings = [
    ['space', e => this.onSpace(e)],
    ['enter', e => this.onEnter(e)],
    ['backspace', e => this.onBackspace(e)],
    ['left', e => this.onLeft(e)],
    ['right', e => this.onRight(e)],
  ]

  componentDidMount = () => this.bindings.map(binding => Mousetrap.bind(...binding))
  componentWillUnmount = () => this.bindings.map(binding => Mousetrap.unBind(...binding))
  onSpace = e => {
    this.log('onSpace', this.props)
    if (e.preventDefault) {
      e.preventDefault( )
    } else {
      e.returnValue = false
    }
    this.log('search', this.search)
    // this.props.location.state.record && !this.complete ?
    // this.tag() :
    this.toggle()
  }
  onEnter = e => {
    if (e.preventDefault) {
      e.preventDefault( )
    } else {
      e.returnValue = false
    }
    this.log('onEnter', this.props)
    this.expanded ? this.save(): this.tag()
  }
  onBackspace = e => {
    if (e.preventDefault) {
      e.preventDefault( )
    } else {
      e.returnValue = false
    }
    this.log('onBackspace', this.props)
    this.clear()
  }
  onLeft = e => {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }
    this.log('onLeft', this.props)
    this.prev()
  }
  onRight = e => {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }
    this.log('onRight', this.props)
    this.next()
  }
  toggle = () => {
    this.log('toggle', this.props)
    this.replace({
      record: !this.props.location.state.record,
      time: Date.now(),
    })
  }
  tag = () => {
    this.log('tag', this.props)
    let state = this.props.location.state
    this.recording ?

      // Recording
      this.complete ?

        // Recording and complete, already finished
        this.replace({ message: messages.errors.tag.complete}) :

        // Recording but not complete, should tag
        this.replace({
          tags: [...state.tags, Date.now() - state.time],
        }) :

      // Not Recording, shouldn't tag
      this.replace({
        message: messages.errors.tag.notRecording
      })
  }
  onStop = ({ blob }) => {
    this.log('onStop', this.props)
    this.complete ? this.replace({
      blob,
      message: messages.notify.toggle.off,
    }) : this.replace({
      tags: [],
      message: messages.errors.toggle.incomplete,
    })
  }
  save = () => {
    this.log('save', this.props)
    if (this.complete) {
      [
        [this.props.location.state.blob, `${this.props.match.params.sentence}.webm`, 'audio/webm'],
        [JSON.stringify(this.props.location.state.tags, null, 2), `${this.props.match.params.sentence}.json`, 'text/json'],
      ].map(data => download(...data))
      this.replace({
        message: messages.notify.save.complete,
      })
    } else {
      this.replace({
        blob: false,
        tags: [],
        record: false,
        time: Date.now(),
        message: messages.errors.save.incomplete,
      })
    }
  }
  clear = () => {
    this.log('clear', this.props)
    this.replace({
      blob: false,
      tags: [],
      record: false,
      time: Date.now(),
      message: messages.notify.clear.success,
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
    this.log('next', this.props)
    const sentence = 1 + parseInt(this.props.match.params.sentence, 10)
    this.props.history.push(`/${sentence}`, {
      blob: false,
      tags: [],
      record: false,
      message: messages.notify.next.success,
    })
  }
  prev = () => {
    this.log('back', this.props)
    this.props.history.goBack()
  }
  get search() {
    return new URLSearchParams(this.props.location.search)
  }
  get transcript() {
    let [hanzi, pinyin] = this.props.transcripts[this.props.match.params.sentence]
    return [
      hanzi.replace(/\s+/g, '').split(''),
      pinyin.split(' '),
    ]
  }
  get count() {
    return this.transcript[0].length
  }
  get recording() {
    return this.props.location.state.record
  }
  get complete() {
    return this.props.location.state.tags.length === this.count
  }
  get expanded() {
    return !this.props.location.state.record && this.complete
  }
  render = () => {
    this.log('render', this.props)
    const {
      transcript,
      prev, next,
      save,
      expanded,
      recording,
      complete,
      tag, clear, toggle, onStop, replace,
      props: {
        match: {
          params: {
            sentence
          }
        },
        location: {
          state: {
            help = false,
            step = 0,
            tags = [],
            record = false,
            blob,
            message,
          }
        }
      }
    } = this
    return (<MuiThemeProvider muiTheme={theme}>
      <div>
        <Header
          title="Speech Tagger"
          showMenuIconButton={false}
          href="https://github.com/ryanwhite04/speech-tagger"
          style={{ position: 'fixed', top: 0 }}
        />
        <Guide open={help} step={step} {...{
          setStep: (step, count) => () => step < count && replace({ step }),
          close: () => replace({ help: false }),
        }} steps={steps}
        />
        <Paper zDepth={2} style={{ maxWidth: 420, margin: '96px auto 64px auto' }}>
          <Card expanded={expanded}>
            <CardTitle
              title={`Sentence ${sentence}`}
              subtitle={`${tags.length}/${transcript[0].length}`}
            >
              <FloatingActionButton className="Help" onClick={() => replace({ help: true })}>
                <ActionHelp />
              </FloatingActionButton>
            </CardTitle>
            <CardMedia>
              <ReactMic
                className="Mic"
                strokeColor={cyan500}
                record={record}
                onStop={onStop}
              />
            </CardMedia>
            <CardHeader title="Hanzi" subtitle="For native chinese speakers"/>
            <CardText>
              <span style={{ color: cyan500 }}>{transcript[0].slice(0, tags.length).join('')}</span>
              <span>{transcript[0].slice(tags.length).join('')}</span>
            </CardText>
            <CardHeader title="Pinyin" subtitle="For learners of mandarin"/>
            <CardText>
              <span style={{ color: cyan500 }}>{transcript[1].slice(0, tags.length).join(' ')} </span>
              <span>{transcript[1].slice(tags.length).join(' ')}</span>
            </CardText>
            <CardActions>{
              record ?
                <Button text="Stop Recording" color={red500} onClick={toggle}>
                  <AvMicOff/>
                </Button> :
                <Button text="Start Recording" color={cyan500} onClick={toggle}>
                  <AvMic/>
                </Button>
            }
            <Button text="Add Tag" color={cyan500} onClick={tag}
              disabled={expanded || complete || !recording}
            >
              <ContentAdd/>
            </Button>
            <Button color={red500} text="Restart" onClick={clear}
              disabled={!recording && !complete}
            >
              <ContentClear/>
            </Button>
            <Button text="Download" onClick={save}
              disabled={!expanded}
            >
              <FileFileDownload/>
            </Button>
            </CardActions>
            <CardMedia expandable={true}>
              <video controls style={{ backgroundColor: cyan500 }}
                src={blob ? URL.createObjectURL(blob) : undefined}>
                {blob && [{
                  default: true,
                  label: 'Hanzi',
                  transcript: transcript[0],
                  type: 'text/vtt',
                  kind :'subtitles',
                }, {
                  label: 'Pinyin',
                  transcript: transcript[1],
                  type: 'text/vtt',
                  kind: 'subtitles',
                }].map(cue(tags))}
              </video>
            </CardMedia>
          </Card>
        </Paper>
        <FloatingActionButton className="Prev" onClick={prev}>
          <ImageNavigateBefore/>
        </FloatingActionButton>
        <FloatingActionButton className="Next" onClick={next}>
          <ImageNavigateNext/>
        </FloatingActionButton>
        <Toast>{message}</Toast>
      </div>
    </MuiThemeProvider>)
  }
}

function Button(props) {
  // return (<IconButton label="Add Tag"
  //   onClick={this.tag}
  //   disabled={this.expanded || this.complete || !this.recording}
  //   icon={<ContentAdd/>}
  // />)
  const iconStyle = {
    width: 48,
    height: 48,
    color: props.color || 'auto',
  }
  return (<IconButton tooltip={props.text} iconStyle={iconStyle} style={{
    width: 96,
    height: 96,
    padding: 48,
  }}
  className="Button" {...props} touch/>)
}

function Toast({ children }) {
  return (<SnackBar
    open={!!children}
    message={children}
    autoHideDuration={4000}
  />)
}

function GitHubIcon(props) {

  log('GitHubIcon', { props })
  return (<SvgIcon {...props}>{
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  }</SvgIcon>)
}

function Header({ title, href, showMenuIconButton, style }) {

  log('Header', { title, href, showMenuIconButton, style })
  return (<AppBar title={title} style={style}
    showMenuIconButton={showMenuIconButton}
    iconElementRight={<IconButton href={href}><GitHubIcon/></IconButton>}
  />)
}

function cue(tags) {
  return track => {

    log('cue', { tags }, { track })
    return (<track
      key={track.label}
      {...track}
      src={URL.createObjectURL(getTrackBlob(tags)(track.transcript))}
    />)
  }
}

function getTrackBlob(tags) {
  return transcript => {

    log('getTrackBlob', { tags }, { transcript })
    return new Blob([createVTT(tags.map((time, index) => ({
      time, text: transcript[index]
    })))], { type: 'text/vtt' })
  }
}

function createVTT(tags) {

  log('createVTT', { tags })
  return dedent`WEBVTT

    ${tags.map(toCue).join('\n\n')}
  `
}

function toCue ({ time, text, side = 500 }) {

  log('toCue', { time, text, side })
  return dedent`
    ${format(time - side)} --> ${format(time + side)}
    ${text}
  `
}

function format(unix) {

  log('format', { unix })
  let seconds = (~~(unix/1000)).toString().slice(-2).padStart(2, 0)
  return `00:${seconds}.${unix % 1000}`
}
