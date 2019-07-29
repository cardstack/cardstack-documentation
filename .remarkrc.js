// .remarkrc.js
/* eslint-env node */
const unified = require("unified");
const read = require("fs").readFileSync;
const ember = require("ember-dictionary");

exports.plugins = [
  [
    require("remark-retext"),
    unified().use({
      plugins: [
        require("retext-english"),
        require("retext-repeated-words"),
        [
            require("retext-spell"),
            {
              dictionary: ember,
              personal: read("./.spellcheck.dic")
            }
          ]
      ]
    })
  ]

];
