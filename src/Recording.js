import React from 'react';
import download from 'downloadjs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ContentClear from 'material-ui/svg-icons/content/clear';
import dedent from 'dedent';
import './App.css';
export default ({
  sentence, transcript,
  blob, ends, tags,
  clear = sentence => console.log('clearing sentence ', sentence),
}) => {
  tags = tags.map(date => date - ends[0]);

  return <div>
    <video src={URL.createObjectURL(blob)} controls>
      <track default
        label="Hanzi"
        src={createURL(tags)(transcript[0].replace(/\s+/g, ''))}
        type="text/vtt"
        kind="subtitles"
      />
      <track
        label="Pinyin"
        src={createURL(tags)(transcript[1].split(' '))}
        type="text/vtt"
        kind="subtitles"
      />
    </video>
    <FloatingActionButton
      className="FloatingActionButton"
      onClick={save(blob, JSON.stringify(tags, null, 2), sentence)}>
      <FileFileDownload/>
    </FloatingActionButton>
    <FloatingActionButton
      className="FloatingActionButton"
      onClick={clear(sentence)}>
      <ContentClear/>
    </FloatingActionButton>
  </div>
}

function createURL(tags) {
  return text => URL.createObjectURL(new Blob([createVTT(tags.map((time, index) => ({
    time, text: text[index]
  })))], { type: 'text/vtt' }))
}

function createVTT(tags) {
  return dedent`WEBVTT

    ${tags.map(toCue).join('\n\n')}
  `;
}

function toCue({ time, text, side = 500 }) {
  return dedent`
    ${format(time, -side)} --> ${format(time, side)}
    ${text}
  `
}

function format(unix) {
  let seconds = (~~(unix/1000)).toString().slice(-2).padStart(2, 0);
  return `00:${seconds}.${unix % 1000}`;
}

function save(blob, tags, name) {
  return () => {
    download(blob, `${name}.webm`, 'audio/webm');
    download(tags, `${name}.json`, 'text/json');
  }
}
