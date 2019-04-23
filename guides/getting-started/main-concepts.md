This section is a crash course in Cardstack concepts. It includes vocabulary that you'll find throughout the other topics, and it draws some parallels to other frameworks and JavaScript in general.


## Essential Vocabulary

### Cards

Cards are reusable units of functionality - like a form, a text editor, a payment system, and more.
A developer would use many cards, and cards inside of cards, to create the end user experience.
Each card contains both front and back end functionality, such as its own data schema. When someone is looking at a card, it is reflected in the browser URL.
The information contained in that URL informs communication with the back end servers.
You might say that a card is a vertical slice of an application. For example, a blog article card handles both the presentation of the article and the API endpoints that serve the JSON.

### Schema

Schema is a general term to describe the shape that data takes. What attributes come back from an API request? When developing with Cardstack, you may use a Card to define the schema that influences how data is stored, its relationships, and what it is named when it is used on the front end.

### The Cardstack Environment

It’s helpful to think of Cardstack “environments” rather than "apps." 
Although Cardstack is built for the web and not native, in some ways its mental model is more similar to an operating system than a web app.
For example, say you make a Word doc, and then share it with someone else, who then makes revisions and sends it back to you via email.
That’s analogous to a developer authoring a Card, making it available for others to use, and accepting revisions. Someone could build an app _using_ Cardstack, but Cardstack itself is not an app.

### Plugins and Data Adapters

A plugin, or data adapter, is the connection point for adding new data sources.
For example, someone could write or use plugins to connect to GitHub, Firebase, and/or a blockchain source.
That same plugin code could be used by anyone running a Cardstack environment who wants to connect to the same data source.

A plugin is usually made up of four functions:

1. Indexer - an asynchronous process that fetches data from external sources, does some JSON preprocessing, and add the data into an index to allow for quick access when the front end requests for it.
2. Searcher - when querying/fetching data from the front end, the searcher will access the data from the index.
3. Writer - when the front end sends a POST/PATCH request (want to write back to the data source), the writer handles that.
4. Authenticator - handles authenticating the app or user to retrieve data

### The Hub

The Cardstack Hub is a smart caching layer that uses plugins to indexe data from different sources and make it quickly available for the front end.
Developers can activate any number of plugins provided by Cardstack or insert their own.
For example, the Hub could pull in data from GitHub, an enterprise CMS (content management system), and its own postgres database, and use it within the same project.
To connect to a new data source, a developer only has to write a plugin, not modify the Hub directly. The Hub does all the heavy lifting that takes the data retrieved by plugins and preprocesses it into JSON responses. The source code is part of the [Cardstack mono-repo](https://github.com/cardstack/cardstack).

### The Cardstack mono-repo

The [Cardstack mono-repo](https://github.com/cardstack/cardstack) is a collection of the features that could be used within a Cardstack project.
It contains some commonly-used Cards, the Cardstack Hub that connects data sources, and the code that ties everything together behind the scenes.

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

## Connecting with JavaScript Concepts

To be able to read the codebase, get a sense of the mental models, and make your own creations using Cardstack, it helps to be familiar with these concepts.

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