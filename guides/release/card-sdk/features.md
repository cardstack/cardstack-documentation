Every card has a set of features that can be inherited from other cards or overidden.
Features determine how a card is saved, what it looks like, data validation, and more.

Every Cardstack project has a base card with some built-in features to get you started.

## Example features

You can see a full list of supported features in the [Card API](https://github.com/cardstack/cardstack/blob/master/packages/hub/card.ts) source code.
Here, we will cover some of the most commonly edited features of a card.

- `writer` - handles saving and updating a card
- `indexer` - defines what goes into the index and how often it is refreshed
- `isolated-layout` - holds the template that determines how a card looks when viewed alone.
- `isolated-css` - the CSS rules associated with the `isolated-layout`
- `embedded-layout` - holds the template that determines how a card looks when it is viewed as part of another card
- `embedded-css` - the CSS rules associated with the `embedded-layout`
- `field-view-layout` if a card is used as a field, this holds the template that determines how a card looks in "view" mode
- `field-view-layout` if a card is used as a field, this holds the template that determines how a card looks when someone edits the data
- `field-validate` - if a card is used as an editable field, it can have validation code. For example, this could check that something typed into a text input is a valid email.
- `field-deserialize` - sometimes, the data for a field should not be shown in its raw form, but rather processed for display. An example is turning a date string into a date object that the front end can use.

## Where are features used?

A card's features span both front and back end concerns.
For example, the `isolated-css` is used by the browser, while the `writer` code is used by the Hub on the back end.
