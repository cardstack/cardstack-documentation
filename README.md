# cardstack-documentation

This respository contains learning guides for Cardstack.
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


## Contributing

We welcome additions and improvements to these guides!

To help out, you can either click the "edit" pencil on a page of the deployed app, or find the corresponding Markdown file in the `guides` directory.
Please also review the Cardstack [Code of Conduct](https://github.com/cardstack/cardstack/blob/master/CODE_OF_CONDUCT.md).

The guides themselves are written using Markdown syntax, and have a `.md` file extension. The app itself is powered by the `guidemaker` dependencies, so most changes to the way the app works should be submitted upstream.

### Running Tests

* `npm test`

This will run the linter, spellchecker, and Ember tests.
To add new words to the spellchecker, see `.spellcheck.dic`.

If you make wording changes, when you open a Pull Request,
you will see failing Percy tests. This is normal.
They fail when there is a visual difference.
A maintainer will review the new screenshots and approve them
or request changes.

### Linting

* `npm run lint:md`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

The contents of the `master` branch deploy automatically via Travis.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
