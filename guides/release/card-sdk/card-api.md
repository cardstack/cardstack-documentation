In this section, you will learn about some of a card's abstractions and inspect source code to learn how a card works under the hood.

One thing is important to keep in mind - almost everything is a card!

From a user experience perspective, cards are reusable units of functionality - like a form, an invitation to an event, a payment system, and more.
People can create many different kinds of cards, make copies of them, share them, or use cards inside of other cards!

From a technical perspective, a card is a group of schema, data, features, and code that all travel together. They can be serialized into JSON and extended.
A helpful metaphor is to think about the browser as your operating system and the cards as apps.
The code that is part of a card can be executed by the Hub.

## Cards within cards

Any card can be used within another card. You can learn more about this in [Relationships](../../deck/relationships/).

## Cards as fields

Fields are special cards that are meant to be used when composing a form.

Every card can contain other cards that display data, influence layout, or allow user inputs.
Out of the box, Cardstack provides some basic "fields" that are form inputs of many different types:

* `boolean` _(ex. `true`)_
* `call-to-action` - a URL that looks like a button
* `date` _(ex. `"2018-07-22"`)_
* `datetime`
* `image-reference` _(ex. `"https://example.com/images/some-photo.jpg"`)_
* `relative-image-reference` _(ex. `"/images/some-photo.jpg"`)_
* `integer` _(ex. `37`)_
* `string` _(ex. `"sandwich", "Dave"`)_
* `url` _(ex. `"https://example.com/about"`)_

Every field can have an id and name. The ID is used in the Card's HTML markup, and the name is displayed on the card.

## Isolated and Embedded cards

Sometimes, you only want a field on a card to show up when it is viewed at different sizes.
This is possible using "isolated" and "embedded" fields.
You can think of these as "full size" vs "thumbnail size."

For example, you may want a card's title to show up every time it is displayed, but not its description.
You could make that happen by either checking or unchecking the option for that field when working in Schema mode, or you could modify the `csFieldSets` property directly if you are working in [dev mode](./index/).

_Coming soon:_ You will be able to drop any card into another card as a field! The "embedded" layout will play an important role.

## Card boundary

A card boundary is a term to describe the limits of what a card can change. Each card is responsible for its own behavior and should not try to influence the behavior of other cards that it is used together with.

For example, if you write some CSS for a card, you will see that there is a `card-boundary` class in the markup.
It's the highest level element that you should try to write styles for.

## The base card

Every Cardstack environment comes with a "base card," the most minimal representation of a card.

You can see the source code for the base card [here](https://github.com/cardstack/cardstack/tree/master/cards/base).

## Adoption

Every card inherits from, or "adopts from" another card. Any card can be adopted from.

If someone makes a brand-new blank card, it adopts from the built-in "base card" which is the most minimal form a card can take.
If someone creates an awesome card to showcase a product for their business, and they wanted to make more cards like it, they could 
adopt from that product card. All the cards that adopt from the product card inherit its schema, styles, and more.

When a card adopts from another card, its schema cannot be overridden, but
features like visual appearance, JavaScript behavior, and more can be overridden as needed.

To give an example, if the original product card's styles change, so do the styles on the new card. But, the new card could also be edited
to have styles that are different than the card it adopted from.
Each card also still holds its own unique data like the values for a title, description, etc.

One way to explore adoption is to create a card with some custom CSS. Make a new card that adopts from it. Try changing the first card's CSS, and you'll see the second card's CSS change as well! Likewise, if you make changes to only the second card's CSS, you will see that you have overridden the styles.

### The adoption chain

Cards maintain their connection to where they were adopted from, all the way up the chain.

For example, if you created a chain of three cards that adopt from one another, and changed the "grandparent" card's styles, you would see those changes flow through the other cards.
