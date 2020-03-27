One of the most important things to know about Cards is that there is a tight coupling between the data backing a Card and the presentational aspects of a Card. To say it another way, a Card is made of both visual elements and the data model that describes the attributes of that Card.

In this section, you will learn about common Card properties.

The average user does not need to know or understand this information,
but it may be helpful for developers.

## Defining a Schema

Every Card has a schema, where the types of data the card relies on are defined.
For example, a blog post Card might have a title, description, publish date, topic, and more.
The schema is a Card's attributes and configuration.

### The defaults of a Card

Every Card inherits from the `base-card`. A base card has some default styling and features to get
you going. If you inspect a Card's JSON, you will see some of the following properties:

The following cs fields exist on cards:

**`csRealm`**: The realm that the card currently resides in.

**`csId`**: distinguishes the card within its `originalRealm`. In some cases
  it may be chosen by the person creating the card. In others it may be
  chosen by the hub.
  
**`csOriginalRealm`**: The realm that the card was first created in. Often times 
  this value will be undefined, when this value is undefined that means that the 
  `csRealm` (the realm the card currently resides in), is also the realm the card 
  was first created in.
  
**`csTitle`**: A human-friendly name for the card. This value is the value that users 
  can use to identify a card in a card catalog.
  
**`csDescription`**: A brief description of the card.

**`csFiles`**: A map of files that belong to the card. This may include `.js`, `.hbs`, `.css`, 
  or any other file that can be serialized into a string. These files can also be 
  organized in a directory structure, like so:

```js
  csFiles: {
    templates: {
      "isolated.hbs": "Hello World",
      "embedded.hbs": "Hello Mars"
    },
    styles: {
      "isolated.css": ".card-boundary: { background-color: pink; }",
      "embedded.css": ".card-boundary: { background-color: blue; }",
    }
  }
```

**`csPeerDependencies`**: this represents the `peerDependencies` portion 
  of the `package.json` file that a card relies upon. e.g:

```js
  csPeerDependencies: {
    '@cardstack/hub': '*',
    '@cardstack/core': '*'
  },
```

**`csFieldSets`**: this is an object that holds the fields that are available
  in the card in various card formats, e.g.:

```js
  csFieldSets: {
    isolated: ['title', 'author', 'body'],
    embedded: ['title', 'author']
  }
```

**`csFields`**: this is an object that holds the field cards (as card values)
  for the fields that the card uses. Only the card's own fields appear here. The
  card's adopted fields' field card appear in the adopted card's `csFields` property.
  The name of the property is the name of the field in the card, and the value of this
  property is card value of a card that adopts from a "card type" that this field represents.
  E.g.:

```js
  csFields: {
    title: {
      csAdoptsFrom: {
        data: {
          id: "https://base.cardstack.com/public/cards/string-field",
          type: "cards"
        }
      }
    },
    body: {
      csAdoptsFrom: {
        data: {
          id: "https://base.cardstack.com/public/cards/string-field",
          type: "cards"
        }
      }
    }
  }
```
    
  **`csFeatures`**: This is an object that maps card features for this card 
  to the card file associated with the specified feature. For JavaScript
  files you can specify just the JavaScript file which assumes the feature
  can be found at the default export of the JavaScript module. Or you can
  specify an array, where the first item in the array is the JavaScript file,
  and the second part of the array is the named export that defined the feature.
  A card can also inherit a feature from its adoption chain if its not specified
  directly in the card.
  E.g.:

```json
  csFeatures": {
    "isolated-css": "isolated.css",
    "embedded-css": "embedded.css",
    "indexer": "indexer.js",
    "writer": "writer.js",
    "field-validate": ["field-hooks.js", "validate"],
    "field-deserialize": ["field-hooks.js", "deserialize"]
  }
```

**`csFieldOrder`**: This is an ordered list of fields to render (both 
  the card's own fields and adopted fields). This is primarily used 
  by the base card's isolated and embedded templates when deciding
  the order in which to render fields.
  
  **`csCreated`**: This is an ISO-8601 `datetime` string of when the card
  was created.
  
  **`csUpdated`**: This is an ISO-8601 `datetime` string of when the card
  was last updated.
  
  **`csFieldArity`**: This is a field that is used exclusively for cards that
  appear in the `csFields` property of a card. `csFieldArity` describes
  the cardinality of the field and currently can be either the value
  "singular" or the value "plural".


## Fields

Every card can contain other other cards that display data, influence layout, or allow user inputs.
Out of the box, the Card Builder provides some basic cards called "fields" that are form inputs of many different types:

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

## Isolated and Embedded

Sometimes, you only want a field on a card to show up when it is viewed at different sizes.
This is possible using "isolated" and "embedded" fields.
You can think of these as "full size" vs "thumbnail size."

For example, you may want a card's title to show up every time it is displayed, but not its description.
You could make that happen by either checking or unchecking the option for that field when working in Schema mode, or you could modify the `csFieldSets` property directly if you are working in [dev mode](./index/).

