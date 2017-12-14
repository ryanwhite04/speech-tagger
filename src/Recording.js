import React from 'react';
import download from 'downloadjs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ContentClear from 'material-ui/svg-icons/content/clear';
import dedent from 'dedent';

let styles = {
  fab: {
    margin: 20,
  },
};

console.log({ download });

export default ({
  sentence, transcript,
  blob: { blob, blobURL, endTime },
  tags,
  clear = sentence => console.log('clearing sentence ', sentence),
}) => {
  let vtt = new Blob([createVTT(tags)], { type: 'text/vtt' });
  // let url = URL.createObjectURL(vtt);
  let url = `${process.env.PUBLIC_URL}/example.vtt`;
  return <div>
    <video src={blobURL} autoPlay controls>
      <track default src={url} type="text/vtt" kind="subtitles"/>
    </video>
    <FloatingActionButton style={styles.fab} onClick={save(blob, JSON.stringify(tags, null, 2), sentence)}>
      <FileFileDownload/>
    </FloatingActionButton>
    <FloatingActionButton style={styles.fab} onClick={clear(sentence)}>
      <ContentClear/>
    </FloatingActionButton>
  </div>
}

function createVTT(tags) {

  let addHour = ([second, ...rest]) =>
    `00:${second.padStart(2, 0)}.${rest.join('')}`.padStart(6, 0);

  let format = (time, delay = 0) =>
    addHour((time + delay).toString().padStart(4, 0));

  let toCue = ({ time, text }, delay = 1000) => {
    console.log('toCue', { time, text })
    return dedent`\n
      ${format(time)} --> ${format(time, delay)}
      ${text}\n
    `
  }

  let vtt =  dedent`
    WEBVTT
    Kind: captions
    Language: zh
    ${tags.map(toCue)}
  `;

  console.log({ vtt });
  return vtt;
}

function save(blob, tags, name) {
  return () => {
    download(blob, `${name}.webm`, 'audio/webm');
    download(tags, `${name}.json`, 'text/json');
  }
}
