This section is a crash course in Cardstack concepts aimed at developers. It includes vocabulary that you'll find throughout the other topics, and it draws some parallels to other frameworks and JavaScript in general.


## Essential Vocabulary

### Card SDK

SDK stands for Software Development Kit. The Card SDK contains the public
API methods, properties, and events that developers can use to build their
own projects.

### Cards

From a user experience perspective, cards are reusable units of functionality - like a form, an invitation to an event, a payment system, and more.
People can create many different kinds of cards, make copies of them, share them, or use cards inside of other cards!

From a technical perspective, a card is a group of schema, data, features, and code that all travel together. They can be serialized into JSON and extended.
A helpful metaphor is to think about the browser as your operating system and the cards as apps.
The code that is part of a card can be executed by the Hub.
A card is responsible for only its own API, and should not manipulate the behavior of other cards. This is referred to as the "card boundary."

### The Hub

At a high level, the Hub is a back-end service that handles API requests for serializing, saving, searching, and updating cards.
You can think of the Hub as the back-end Node.js runtime for a card.
The Hub can have an index, which holds pointers to all the cards that exist in the system. The index gives you quick and easy access to cards.

Whenever a Hub starts up, it looks at all the realms and loads cards into the index. For example, the Hub may load cards from a specific
GitHub repository if there is a realm for them.
The Hub also checks regularly for new data.
This means that you can make requests to the Hub to create new cards, or you can create the card directly in a data source like a git repo,
and the Hub will check for and index those changes every so often.

The source code is part of the `hub` package in the [Cardstack mono-repo](https://github.com/cardstack/cardstack).

### Realms

A realm is a Card's home. It determines where a card comes from and who can access it.
A realm helps to establish the provenance of a card, i.e. its trail of ownership as it moves through a workflow.
Whenever cards in a realm change, the Hub updates its own index.

There are several types of realms:
- The meta realm, which is the authoritative list of realms that the hub should look for cards in
- The git realm, which is a hosted git repository that holds cards in the form of JSON files
- The file realm, which is a directory on your own hard drive that contains cards
- The ephemeral realm, which is a JavaScript map held in memory that is used only for testing

You can have many different realms for each type. For example, perhaps you may want to load in cards from
five different GitHub repositories. You would then have five git realms.
Every project automatically has at least one default realm in addition to the meta realm, which is referred to as the "default realm."
In most cases, the default realm is a git realm.

### Schema

Schema is a general term to describe the shape that a card's data takes. What attributes come back from an API request?
For example, a card may have a title, description, relationships to other cards, and more.

### Adoption

Every card inherits from, or "adopts from" another card.
If someone makes a brand-new blank card, it adopts from the built-in "base card" which is the most minimal form a card can take.
If someone creates an awesome card to showcase a product for their business, and they wanted to make more cards like it, they could 
adopt from that product card. All the cards that adopt from the product card inherit its schema. The schema cannot be overridden, but
features like visual appearance, JavaScript behavior, and more can be overridden as needed.

To give an example, if the original product card's styles change, so do the styles on the new card. But, the new card could also be edited
to have styles that are different than the card it adopted from.

Each card also still holds its own unique data like the values for a title, description, etc.

### The Cardstack mono-repo

The [Cardstack mono-repo](https://github.com/cardstack/cardstack) is a collection of the packages that could be used within a Cardstack project.
For example, it contains the Hub code and a front-end application.

## Putting it all together, a metaphor

Imagine a real library, where someone could go to borrow a copy of a new best-selling book.

The Cards are like the books.

The Hub has an index, which is like a library's catalog that you might use to quickly and easily locate books within the library.
If you didn't have an index, you could still find books, but it would be difficult!
The purpose of the index is to make it easy and fast to find a card.
The index can be destroyed or recreated as needed. It is a pointer back to the cards that exist in the system.

Realms are like the shelves that the books are found on.

## Connecting with JavaScript Concepts

To be able to read the codebase, get a sense of the mental models, and make your own creations using Cardstack, it helps to be familiar with these concepts.

### The front end

The front end is the code that runs in the browser. This includes the `cardhost` package, for example.

## The back end

The back end code runs in a Node.js server environment. This includes the `hub` package, for example.

### JSON:API

Cardstack follows [JSON:API](https://jsonapi.org/) internally, which is a popular specification for building APIs in JSON.
Think of it as "rules to follow" for how data should be serialized.
For example, if you wrote a data adapter that connected to a generic, non-JSON:API endpoint, your data adapter should rearrange the response contents to follow the JSON:API format.
Then, the Cardstack environment will be able to understand and use that data automatically.

Here's an example of a JSON:API response to `GET /articles`:

```json
{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "An Introduction to Cardstack"
    }
  }, {
    "type": "articles",
    "id": "2",
    "attributes": {
      "title": "What is Web 3.0?"
    }
  }]
}
```

### Classes

You might already be familiar with
[Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
from your work in JavaScript or other programming languages.
If you haven't worked much with Classes, take some time to refresh your understanding.

### async/await and Promises

Cardstack makes significant use of JavaScript's [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

### Data adapters

A lot of Cardstack's data handling concepts are inspired by trends toward flexible APIs, like GraphQL, and architectural decisions of Ember.
Many developers like GraphQL because you have flexibility in the data layer.
When it comes to Ember, Cardstack's data adapters and plugins have some mental model similarities to model loading, and `ember-data` adapters and serializers.

### Components

You can kind of think of a Card as a Component that transcends the front and back end concerns.
For example, a component in a traditional web app might be a form that sends a POST request to a back end.
In Cardstack, a Card might consist of the form, but also the data serialization and storage method.
