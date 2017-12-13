import React from 'react';

export default ({
  key, src, type, name
}) =>  <div key={key}>
  <audio controls src={src} type={type} />
  <a href={src} download={name + '.webm'} target="_blank">Download {name}</a>
</div>
