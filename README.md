# cardstack-documentation

This respository contains work-in-progress learning guides for Cardstack.
The app is deployed at [docs.cardstack.com](https://docs.cardstack.com/release/).

These guides have two audiences:

- developers who want to build something using Cardstack
- developers working to add new features or fixes to the Cardstack codebase

The goal is to help people who are new to the project to understand some of the most common concepts and features. The guides are not meant to cover the whole API surface of Cardstack.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd cardstack-documentation`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

## Contributing

We welcome additions and improvements to these guides!

To help out, you can either click the "edit" pencil on a page of the deployed app, or find the corresponding Markdown file in the `guides` directory.
Please also review the Cardstack [Code of Conduct](https://github.com/cardstack/cardstack/blob/master/CODE_OF_CONDUCT.md).

The guides themselves are written using Markdown syntax, and have a `.md` file extension. The app itself is powered by the `guidemaker` dependencies, so most changes to the way the app works should be submitted upstream.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

The contents of the `master` branch deploy automatically.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
