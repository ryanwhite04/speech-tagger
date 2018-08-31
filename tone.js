export function romanize(pinyin) {

  // 216
  return pinyin
    .replace('\'', ' ')
    .replace(/([^bcdfhjklmpqrstvwyxz])([bcdfhjklmpqrstvwyxz])/g, (s, a, b) => `${a} ${b}`)
    .replace(/([^bcdfhjklmpqrstvwyxz])ng([^bcdfhjklmpqrstvwyxz ,])/g, (s, a, b) => `${a}n g${b}`)
    // .replace(' ng', 'ng')
    // .replace(' n', 'n')
}

export function extractTone(syllable) {
  return [
    /[āēīōūǖ]/,
    /[áéíóúǘ]/,
    /[ǎěǐǒǔǚ]/,
    /[àèìòùǜ]/,
  ].reduce((tone, regex, i) =>
    syllable.search(regex) > -1 ? !tone ? (i+1) : -1 : tone, 0)
}

export function transcript({ chinese, pinyin, english }) {
  chinese = chinese
    .replace(/[,\s]+/g, '')
    .split('')
    .reduce((stripped, syllable, i) => {
      return syllable === '，' ? stripped : [...stripped, (chinese[i+1] === '，') ? `${syllable}，` : syllable]
    }, [])
    
  pinyin = romanize(pinyin)
    .split(' ')
    .reduce((stripped, syllable, i) => {
      return syllable ? [...stripped, pinyin[i+1] ? syllable : `${syllable} `] : stripped
    }, [])
  
  const tones = pinyin.map(extractTone)
  
  return [chinese, pinyin, english, tones]
}

function getTones(pinyin) {
  pinyin = romanize(pinyin)
    .split(' ')
    .reduce((stripped, syllable, i) => {
      return syllable ? [...stripped, pinyin[i+1] ? syllable : `${syllable} `] : stripped
    }, [])
  
  const tones = pinyin.map(extractTone)
}