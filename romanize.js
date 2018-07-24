/* global require */

// const csv = require('csvtojson')
const fs = require('fs').promises
const idioms = require('./src/idioms')
const chengyu = require('./src/chengyu')

/*

async function main() {
  await fs.writeFile('chengyu.json', JSON.stringify(await read('chengyu.csv'), null, 2)).catch(console.log)
  await fs.writeFile('idioms.json', JSON.stringify(await read('idioms.csv'), null, 2)).catch(console.log)
}

async function read(path) {
  return (await csv().fromFile(path)).map(({
    Chinese: chinese,
    Pinyin: pinyin,
    English: english,
  }) => ({ chinese, pinyin, english }))
}

*/

  get transcript() {
    let { chinese, pinyin, english } = this.props.transcripts[this.props.match.params.sentence]
    chinese = chinese.replace(/[,\s]+/g, '').split('')
    pinyin = romanize(pinyin).split(' ')
    let tones = pinyin.map(syllable => {
      return [
        /[āēīōūǖ]/,
        /[áéíóúǘ]/,
        /[ǎěǐǒǔǚ]/,
        /[àèìòùǜ]/,
      ].reduce((tone, regex, i) =>
        syllable.search(regex) > -1 ?
          !tone ? (i+1) : -1 : tone,
      0)
    })
    log('transcript', {
      chinese, pinyin, english, tones
    })
    return [chinese, pinyin, english, tones]
  }


function syllables(pinyin) {

  // 216
  return pinyin
    .replace('\'', ' ')
    .replace(/([^bcdfhjklmpqrstvwyxz])([bcdfhjklmpqrstvwyxz])/g, (s, a, b) => `${a} ${b}`)
    .replace(/([^bcdfhjklmpqrstvwyxz])ng([^bcdfhjklmpqrstvwyxz ,])/g, (s, a, b) => `${a}n g${b}`)
    .split(' ')
    // .replace(' ng', 'ng')
    // .replace(' n', 'n')
}

main()