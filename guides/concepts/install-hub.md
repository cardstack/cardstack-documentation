# Install a Cardstack Hub

Let’s install and configure a Cardstack Hub for an Ember.js application.

First, let’s install the `@cardstack/hub` Ember.js add-on. From your `sample-smart-contract` project folder execute the following:

`ember install @cardstack/hub`

We also want to add some additional npm packages. Using yarn, let’s add the following packages to our project:

`yarn add @cardstack/ethereum @cardstack/jsonapi @cardstack/test-support @cardstack/eslint-config eslint-plugin-node`

To make life easier inside of whatever code editor you are using, we have bundled an eslint configuration that is inclusive of Ember.js’s eslint rules as well as rules for the Cardstack Hub. Edit the `.eslintrc.js` file and use the following configuration instead of the one that was created for you:

```js
module.exports = {
  root: true,
  extends: '@cardstack/eslint-config/browser'
};
```
Now let’s configure an Ethereum data source. We happen to have a CARD token contract deployed to Rinkeby at the address `0x013c05c37d24d96e4cc23e5d0efcd2aa13d81d7c`.

(If you are curious, the source code for the CARD token can be found on [GitHub](https://github.com/cardstack/sample-smart-contract).)

In the `cardstack/` directory within our project, let’s create a new subdirectory for our data sources called `data-sources`. And within that, we will create a data source configuration file for the Rinkeby CARD token called `card-token.js`.

`mkdir cardstack/data-sources
touch cardstack/data-sources/card-token.js`

Now, let’s edit the `cardstack/data-sources/card-token.js` file. Within the `@cardstack/test-support` package is a very handy module: `JSONAPIFactory`. We can use this module to easily construct the objects and relationships that the Cardstack Hub consumes, as well as to emit models in an order that respects relationships that you have defined.

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');
const tokenAbi = require("../token-abi");
let factory = new JSONAPIFactory();
factory.addResource('data-sources', 'card-token')
  .withAttributes({
    'source-type': '@cardstack/ethereum',
    params: {
      branches: {
        master: { jsonRpcUrl: "ws:localhost:8546" }
      },
      contract: {
        abi: tokenAbi,
        addresses: { master: "0x013c05c37d24d96e4cc23e5d0efcd2aa13d81d7c" },
        eventContentTriggers: {
          Mint: [],
          WhiteList: [ "card-token-approved-buyers", "card-token-custom-buyer-limits" ],
          Transfer: [ "card-token-balance-ofs" ]
        }
      }
    }
  });
```
On line 2, we reference an ABI file for the smart contract. For our CARD token, you can find the ABI as a JavaScript file [here](https://gist.github.com/habdelra/29da9e669f654123e4bea64fb8b4e84b).

Let’s place this file at `cardstack/token-abi.js`.

You’ll notice on line 9 we are referring to a URL where we can access the WebSocket interface for an Ethereum Geth node pointing to the Rinkeby network.

We specify the address of the CARD token contract available on the Rinkeby network on line 13, as well as the smart contract events that we are interested in on lines 15–17.
