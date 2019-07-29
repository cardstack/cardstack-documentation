Welcome to Cardstack! Follow these step-by-step instructions to start exploring the Card SDK.
The Card SDK can be used to build complex apps that power companies and products, but 
for this Quickstart, we'll start small.

## Installation

First, you need the following installed on your Mac, Linux, or Windows computer:

- [git](https://git-scm.com/)
- [npm](https://www.npmjs.com/get-npm) and [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/get-started) - a free container manager
- [Ember CLI](https://cli.emberjs.com/release/)
- Linux and Mac systems should also install [Watchman](https://facebook.github.io/watchman/)
- If you are developing in a Windows environment, use [Bash](https://docs.microsoft.com/en-us/windows/wsl/install-win10) if you would like to be able to follow this tutorial's commands exactly as written, and [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools).
- It is optional, but recommended, to install the [Ember Inspector](https://guides.emberjs.com/release/ember-inspector/) for debugging your front end work.

Developers should be familiar with JavaScript, HTML, and git in order to follow
along with these Guides.

## Download an existing project

Developers using Cardstack will spend most of their time working on Cards,
which are reusable across many projects.
The best way to learn the Card SDK is to build a Card within an existing project.
You can use the [project-template](https://github.com/cardstack/project-template)

```bash
git clone https://github.com/cardstack/project-template.git
yarn install
```

## Create a new Card

```bash
cd project-template/cardhost
ember generate card photographer
```

In the `devDependencies` of `cardhost/package.json`, add the Card:

```json
"cardhost-photographer": "*",
```

At this step, pay careful attention to when a Card's name is singular or plural, and
make sure you are editing the correct `package.json`, since there are multiple files
with this name in the project.

Then in the terminal, activate your new Card with:

```bash
yarn install
```

## Create Card data

In `cards/photographers/cardstack/static-model.js`, we will add some attributes to the
`photograph` schema, and create some sample data.

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'photographers')
  .withRelated('fields', [
    factory.addResource('fields', 'name').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'biography').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

// this is the seed data
factory.addResource('photographers', 1).withAttributes({
  name: 'Dorothea Lange',
  biography: "Known for her role in the development of documentary photography."
});

let models = factory.getModels();
module.exports = function() { return models; };
```

## Set up the template

Next, open `cards/photographer/addon/templates/isolated.hbs`. Here, we will add some
HTML markup to display a single `photographer` record:

```handlebars
<div class="photographer-isolated">
  <h1 data-test-photographer-isolated-title>{{content.name}}</h1>
  <p>{{content.biography}}</p>
</div>
```

Next, it's time to start up the environment so that you can see your Card in the browser.

## Start the back end services

Check to see if you have Docker running before using these commands in the terminal. They will start some Docker containers that manage the Cardstack
environment, create an API, and provide a local postgres database that holds your application data.

```bash
yarn start-prereqs
yarn start-hub
```

Leave this tab open and running in your terminal.

If you need to stop the Docker containers, you can use `yarn stop-prereqs`.

These commands will vary across applications, so check out the README
if you are looking at different Cardstack projects.

## Start the front end application

Next, let's start the front end and see Cardstack in action.

```
yarn start-ember
```

Visit [http://localhost:4200](http://localhost:4200) to see the main app in action:

Your newly added Card can be found at [http://localhost:4200/photographers/1](http://localhost:4200/photographers/1).

## Preview editing mode with the Edges

The Card SDK provides an editing mode for Cards, called Edges.
To see what it looks like, add the following to `cardhost/app/templates/application.hbs`:

```handlebars
{{#mock-login as |login|}} <button {{action login}}>View editor</button>{{/mock-login}}
```

Restart your local servers with `Control-c`, `yarn start-hub`, and `yarn start-ember`.

Now when you visit [http://localhost:4200/photographers/1](http://localhost:4200/photographers/1), you can click "edit content", select the arrow icon in the top right corner. You will see the Right Edge, which is automatically generated from the Card Schema!
You won't be able to make any edits yet, because we did not set up any grants, so keep reading these Guides!
You will learn how to allow editing with the Edges,
save data, set up relationships, use Cards within Cards, set up different user permission levels, connect to different data sources,
use intelligent data caching, and more!

![Text boxes in a panel on the right edge](/images/quickstart.png)

## Learn more

To learn more about the features of the Card SDK, continue reading these Guides or try out
[one of our tutorials](./developer-cookbook/movielist-tutorial).
