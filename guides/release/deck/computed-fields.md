NOTE: This file is in the process of being updated for 0.18. Information may be outdated.

A computed field is a property of a Card content-type that can be recalculated as data changes.

The computed field could do complex processing, or something as small as returning whether an `article` has been published, as shown in [this example](https://github.com/cardstack/cardboard/blob/master/cards/article/cardstack/computed-field-types/is-draft.js) in the Cardboard project:

```js
exports.type = '@cardstack/core-types::boolean';

exports.compute = async function(model) {
  let publishedDate = await model.getField('published-date');

  return !publishedDate;
};
```

To find other examples of Computed fields, search for the `computed-field-types` directory within a project like [Cardboard](https://github.com/cardstack/cardboard) or [Card Folio](https://github.com/cardstack/portfolio).