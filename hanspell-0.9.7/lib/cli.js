#!/usr/bin/env node

const hanspell = require('./index');
const typomap = new Map();
let sentence = '';

// Node v8 supports zero-length lookahead and lookbehind assertions.
const lookaround = (() => {
  try {
    RegExp('(?<=[^ㄱ-ㅎㅏ-ㅣ가-힣])test(?=[^ㄱ-ㅎㅏ-ㅣ가-힣])');
    return true;
  } catch (err) {
    return false;
  }
})();

function fixTypo(input, output) {
  try {
    if (input !== output.suggestions[0]) {
      let escaped = input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      if (lookaround) {
        escaped = `(^|(?<=[^ㄱ-ㅎㅏ-ㅣ가-힣]))${escaped}((?=[^ㄱ-ㅎㅏ-ㅣ가-힣])|$)`;
      }
      sentence = sentence.replace(new RegExp(escaped, 'g'), output.suggestions[0]);
    }
  } catch (err) {
    return;
  }
}

function fixTypos(data) {
  data.forEach((typo) => {
    if (typomap.get(typo.token) == null) {
      fixTypo(typo.token, typo);
      typomap.set(typo.token, true);
    }
  });

  console.log(JSON.stringify({ "suggest": data, "result": sentence }));
}

const HTTP_TIMEOUT = 
  process.env.HANSPELL_TIMEOUT != null ? parseInt(process.env.HANSPELL_TIMEOUT, 10) : 20000;


sentence = process.argv[2];
// hanspell.spellCheckByDAUM(sentence, HTTP_TIMEOUT, fixTypos);
hanspell.spellCheckByPNU(sentence, HTTP_TIMEOUT, fixTypos);