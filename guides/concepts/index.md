This section is a crash course in Cardstack concepts. It includes vocabulary that you'll find throughout the other topics, and it draws some parallels to other frameworks and JavaScript in general.


## Essential Vocabulary

### Cards

Cards are reusable units of functionality - like a blog article, a text editor, a payment system, and more.
A developer would use many cards, and cards inside of cards, to create the end user experience.
Each card can have its own data schema, which flows from the front end to the data layer. When someone is looking at a card, it is reflected in the browser URL. The information contained in that URL informs communication with the back end servers.

### The Cardstack monorepo

The Cardstack monorepo is a collection of the various elements that could be used to create a Cardstack environment. It contains some commonly-used Cards, the Cardstack Hub that connects data sources, and the code that ties everything together behind the scenes.

### Plugins and Data Adapters

A plugin, or data adapter, is made up of four functions needed to connect with a new data source. For example, someone could write or use plugins to connect to GitHub, Firebase, and a blockchain source. That same plugin code could be used by anyone running a Cardstack environment who wants to connect to the same data source.

### The Hub

The Cardstack Hub is where data from many sources come together. Developers can activate any number of plugins provided by Cardstack or insert their own. The Cardstack Hub does all the heavy lifting that takes the data retrieved by plugins and makes it available to the front end. To connect to a new data source, a developer only has to write a plugin, not modify the Hub. The Hub's code is contained within the Cardstack monorepo.

### The Cardstack Environment

It’s helpful to think of Cardstack “environments” rather than "apps." Although Cardstack is built for the web and not native, in some ways its mental model is more similar to an operating system than a web app. For example, say you make a Word doc, and then share it with someone else, who then makes revisions and sends it back to you via email. That’s analogous to a developer composing a Card, making it available for others to use, and accepting revisions. Someone could build an app _using_ Cardstack, but Cardstack itself is not an app.

### Schema

Schema is a general term to describe the shape that data takes. What attributes come back from an API request? When developing with Cardstack, you may define the schema that influences how data is stored, its relationships, and what it is named when it is used on the front end.

### Indexers, Searchers, and Writers

These packages are responsible for data operations like caching, searching, and modifying. They are found within the Cardstack monorepo, and they define the flow of data through a Cardstack environment. They are internal to how Cardstack works, but can be helpful to look at when trying to understand how and when data requests are made.

### JSON:API

Cardstack follows [JSON:API](https://jsonapi.org/), which is a popular specification for building APIs in JSON.
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

## Connecting with JavaScript Concepts

From an outside perspective it is clear that a lot of the underlying concepts in Cardstack reflect some of the useful architectural decisions of Ember. If you are familiar with Ember then you are likely going to understand the most/all of these concepts without too much effort.
