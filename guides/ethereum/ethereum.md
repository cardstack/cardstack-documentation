# The Cardstack Ethereum Plugin
In a nutshell, the [Ethereum plugin](https://github.com/cardstack/cardstack/tree/master/packages/ethereum) makes it so that:

1. The Cardstack Hub can introspect your smart contract to derive a schema.
2. The Cardstack Hub can ingest content from your smart contract as it emits Ethereum events.
3. Web clients can query your smart contract using simple RESTful web requests without any specialized Ethereum libraries.

The Cardstack Ethereum plugin handles Ethereum-based smart contracts data sources, including oracles. It is the responsibility of the Cardstack Ethereum Plugin to ingest the state of specified smart contract(s), and reflect that within the Cardstack _index_.

The Cardstack Ethereum plugin currently supports the _indexing_ feature. In the near future we intend to create a _writer_ feature for the Ethereum plugin, but in the meantime the Cardstack Hub only performs reads from the blockchain.

### Schema
When an application declares that it wishes to use the Cardstack Ethereum plugin, it provides the Cardstack Hub with a configuration file that describes, among other things, the **ABI of the smart contract** to index. The ABI of a smart contract is basically Ethereum’s way of describing the schema of a smart contract. Within the ABI, you can find all the events that the smart contract will emit, as well as all the different methods that can be invoked by a smart contract.

The Cardstack Ethereum plugin decomposes the provided smart contract’s ABI into Cardstack’s own **schema representation**. The entities that are created include:

* An entity that represents the contract itself, whose attributes include a property for each read-only function that accepts no parameters.
* A one-to-many relationship between a contract entity and child entity for each read-only function whose parameters accept a single `address` type. In Solidity these are commonly referred to as `mapping` and are used to represent ledgers.
* The child entity for a contract’s mapping relationship will contain attributes for each of the return values of the read-only function described above (in Solidity a function can have multiple return values).

Right now we only create child entities from read-only functions that have a single address parameter (as it is very well suited to ledgers), but this can certainly be extended in the future to read-only functions with different signatures.

Within Cardstack we define the schema of an entity as a **_content-type_**. We use a very simple naming convention to define the name of each content type and the content-type’s attributes.

Let’s take a look at the unit tests that we use for the Cardstack Hub’s Ethereum plugin as an example. (For those that are curious, we integrate Truffle into our testing framework to be able to fully test Ethereum contracts in our tests.)

In our unit tests we leverage a simple ERC20 contract that has a few extra methods to make things interesting. (You can find the Solidity code for the contract we use for testing [here](https://github.com/cardstack/cardstack/blob/master/packages/ethereum/contracts/SampleToken.sol).) See how we assert the schema is built correctly from our unit tests:
```js 
const contractName = 'sample-token';

.
.
.

describe('ethereum-indexer', function() {
    let dataSource, token;

    async function setup() {
      let factory = new JSONAPIFactory();
      token = await SampleToken.new();
      await token.fund({ value: web3.toWei(0.01, 'ether'), from: accountOne });

      dataSource = factory.addResource('data-sources', contractName)
        .withAttributes({
          'source-type': '@cardstack/ethereum',
          params: {
            branches: {
              master: { jsonRpcUrl: "ws://localhost:7545" }
            },
            contract: {
              abi: token.abi,
              addresses: { master: token.address },
              eventContentTriggers: {
                Transfer: [ "sample-token-balance-ofs" ],
                Mint: [ "sample-token-balance-ofs" ],
                WhiteList: [ "sample-token-approved-buyers", "sample-token-custom-buyer-limits" ],
                VestedTokenGrant: [ "sample-token-vesting-schedules" ]
              }
            }
          },
        });

      env = await createDefaultEnvironment(`${__dirname}/..`, factory.getModels());
      buffer = env.lookup(`plugin-services:${require.resolve('../cardstack/buffer')}`);
      ethereumService = buffer.ethereumService;

      await waitForEthereumEvents(buffer);
    }

    beforeEach(setup);
    afterEach(teardown);
```
    
The code snippet in Reference 1 above is the test setup for the tests where we make assertions for the correct behavior of the Cardstack Ethereum plugin, specifically you can see the data-source configuration on lines 15–33.

Let’s focus on line 15 for now. On line 15 we are creating a resource that describes the Ethereum data source that we want to ingest into the Cardstack Hub. Specifically, we name this data source “sample-token”. The data-source “sample-token” refers to the smart contract that was deployed to the blockchain (in this case the Truffle private blockchain) on line 12, which is the smart contract I referred to above.

```js
 let schema = await env.lookup('hub:searchers').get(env.session, 'master', 'content-types', 'sample-tokens');
      expect(schema).to.deep.equal({
        "data": {
          "id": "sample-tokens",
          "type": "content-types",
          "meta": {
            "source": contractName
          },
          "relationships": {
            "fields": {
              "data": [
                {
                  "type": "fields",
                  "id": "ethereum-address"
                },
                {
                  "type": "fields",
                  "id": "balance-wei"
                },
                {
                  "id": "sample-token-minting-finished",
                  "type": "fields"
                },
                {
                  "type": "fields",
                  "id": "sample-token-name"
                },
                {
                  "type": "fields",
                  "id": "sample-token-total-supply"
                },
                {
                  "type": "fields",
                  "id": "sample-token-balance-limit"
                },
                {
                  "id": "sample-token-owner",
                  "type": "fields"
                },
                {
                  "type": "fields",
                  "id": "sample-token-symbol"
                },
                {
                  "type": "fields",
                  "id": "sample-token-buyer-count"
                },
                {
                  "id": "sample-token-token-frozen",
                  "type": "fields"
                }
              ]
            },
            "data-source": {
              "data": {
                "type": "data-sources",
                "id": dataSource.id
              }
            }
          }
        }
      });
```
In the code snippet of Reference 2 above we are showing how the “sample-token” smart contract is converted into the Cardstack Hub schema’s _content-type_. On line 4, you can see that the name of the content-type for the “sample-token” smart contract is just the plural inflection of the name of the data source, which is `sample-tokens`. 

The attributes for the `sample-tokens` content-type are the read-only functions of the smart contract that take no parameters. The naming convention here is the dasherized name of the smart contract function prefixed with the name of the smart contract (attribute schema is shared across all content types, so we must namespace our attribute names). Since `sample-tokens` is an ERC20 contract the typical ERC20 functions will be included in the attributes. For instance, the ERC20 function `name()` appears as the attribute `sample-token-name` (line 26). Same for the ERC20 function `symbol()`, which appears as the attribute `sample-token-symbol` (line 42). We have a bunch of non-ERC20 functions in this smart contract as well, like `tokenFrozen()`, which returns a boolean indicating if the token is frozen. This attribute appears in the schema as `sample-token-token-frozen` (line 49).

Additionally, for smart contracts we also add 2 extra attributes:

1. `ethereum-address` which is the Ethereum address that the contract is deployed to
2. `balance-wei` which is the amount of wei held by the contract’s address

```js
      schema = await env.lookup('hub:searchers').get(env.session, 'master', 'content-types', 'sample-token-balance-ofs');
      expect(schema).to.deep.equal({
        "data": {
          "type": "content-types",
          "id": "sample-token-balance-ofs",
          "relationships": {
            "fields": {
              "data": [
                {
                  "type": "fields",
                  "id": "ethereum-address"
                },
                {
                  "type": "fields",
                  "id": "sample-token-contract"
                },
                {
                  "type": "fields",
                  "id": "mapping-number-value"
                }
              ]
            },
            "data-source": {
              "data": {
                "type": "data-sources",
                "id": dataSource.id
              }
            }
          },
          "meta": {
            "source": contractName
          }
        }
      });
```

In the code snippet of Reference 3 above, we are showing the _content-type_ of the sample-token’s ERC20 function `balanceOf()`. Because `balanceOf()` is a read-only function that takes a single parameter of type `address`, we decompose it into its own _content-type_. This content-type’s name appears on line 5, and is the plural inflection of the dasherized method name and is prefixed by the contract name: `sample-token-balance-ofs` (which, admittedly, is a little awkward in this case). The idea is that there will exist a `sample-token-balance-ofs` record for each ledger entry in the sample-token contract, that will have a relationship to the original contract (line 15).

The attributes for the `sample-token-balance-ofs` are based on the return values of the sample-token contract’s `balanceOf()` function. In this case, there is only a single return value for an address’s token balance which is a `uint256`. The Cardstack Hub interprets that particular Solidity type as a number, and adds a `mapping-number-value` attribute to this type which holds the token balance for a ledger entry of the sample-token contract. In the interest of conserving attribute field names, all the smart contract child content-types leverage a `mapping-*-valu`e field where * is the type of the mapping.

So in the case of the sample-token’s Solidity function:

`mapping(address => bool) public approvedBuyer;`

The `sample-token-approved-buyers` content-type will possess a `mapping-boolean-value` field to represent the boolean value for each address that is an approved buyer.

Additionally, each child content-type, as with the contract content-type, possesses an `ethereum-address` attribute field that represents the address of the ledger entry of the child content-type.

```js
      schema = await env.lookup('hub:searchers').get(env.session, 'master', 'content-types', 'sample-token-vesting-schedules');
      expect(schema).to.deep.equal({
        "data": {
          "type": "content-types",
          "id": "sample-token-vesting-schedules",
          "relationships": {
            "fields": {
              "data": [
                {
                  "type": "fields",
                  "id": "ethereum-address"
                },
                {
                  "type": "fields",
                  "id": "sample-token-contract"
                },
                {
                  "type": "fields",
                  "id": "vesting-schedule-start-date"
                },
                {
                  "type": "fields",
                  "id": "vesting-schedule-cliff-date"
                },
                {
                  "type": "fields",
                  "id": "vesting-schedule-duration-sec"
                },
                {
                  "type": "fields",
                  "id": "vesting-schedule-fully-vested-amount"
                },
                {
                  "type": "fields",
                  "id": "vesting-schedule-revoke-date"
                },
                {
                  "type": "fields",
                  "id": "vesting-schedule-is-revocable"
                }
              ]
            },
            "data-source": {
              "data": {
                "type": "data-sources",
                "id": dataSource.id
              }
            }
          },
          "meta": {
            "source": contractName
          }
        }
      });
```
For functions that return multiple named values, the attributes of the content-type for the function is the dasherized name of the function followed by the dasherized name of the return value. So for example, the content-type schema for `sample-token-vesting-scehdule` of the Solidity function `vestingSchedule()` in sample-token [GitHub](https://github.com/cardstack/cardstack/blob/09fcfd4a27b54a959247ee173b48d8862a5c5672/packages/ethereum/contracts/SampleToken.sol#L84-L97) would possess the attributes asserted in reference 4 above.

### Indexing

The Cardstack Ethereum plugin additionally defines rules around what aspects of the smart contract are indexed as well as when the smart contract is indexed. These rules are encapsulated in the Ethereum data source configuration. You can see the code snippet of Reference 1 on lines 25–29.

In the current configuration, the Cardstack Hub will index all data sources every 10 minutes. Additionally, the Cardstack Hub will index the Ethereum data-source every time an Ethereum event is emitted from the configured smart-contract.

For the periodic 10 minute indexing, each data source can decide the content that is eligible to index. The Cardstack Hub provides each data source with essentially a notepad that the data source can jot down notes to help it to decide what to index when the next 10 minute indexing cycle begins.

For the Ethereum data source, we keep track of the block height for each indexing cycle. When the 10 minute indexing cycle occurs, the Ethereum data source indexes all the activity that has occurred against the smart contract since the last block height indexing happened.

For Ethereum events that are emitted from the smart contract configured as the data source, we use the data-source configuration to tell the Cardstack Hub which Ethereum events should trigger content indexing.

Consider the data source configuration for the [“sample-token”](https://github.com/cardstack/cardstack/blob/09fcfd4a27b54a959247ee173b48d8862a5c5672/packages/ethereum/contracts/SampleToken.sol#L84-L97) contract in our unit tests:
```js

async function setup() {
      let factory = new JSONAPIFactory();
      token = await SampleToken.new();
      await token.fund({ value: web3.toWei(0.01, 'ether'), from: accountOne });

      dataSource = factory.addResource('data-sources', contractName)
        .withAttributes({
          'source-type': '@cardstack/ethereum',
          params: {
            branches: {
              master: { jsonRpcUrl: "ws://localhost:7545" }
            },
            contract: {
              abi: token.abi,
              addresses: { master: token.address },
              eventContentTriggers: {
                Transfer: [ "sample-token-balance-ofs" ],
                Mint: [ "sample-token-balance-ofs" ],
                WhiteList: [ "sample-token-approved-buyers", "sample-token-custom-buyer-limits" ],
                VestedTokenGrant: [ "sample-token-vesting-schedules" ]
              }
            }
          },
        });
```
On lines 17–20 of Reference 5 you can see the Ethereum events that have been configured as events that that trigger indexing of the contract.

Let’s take a deeper dive into line 17 of Reference 5 above and break down how this works:

`Transfer: [ "sample-token-balance-ofs" ]`

The property name `Transfer` is the name of the Ethereum event that triggers indexing. The `Transfer` event is defined as part of the ERC20 specification and is emitted whenever a token changes hands. So line 17 above means that whenever the “sample-token” contract emits a `Transfer` event, indexing will occur. The array `["sample-token-balance-ofs"]` refers to the content-type that will be indexed — in this case, the content-type `sample-token-balance-ofs`, which corresponds to the `balanceOf()` ERC20 function of the “sample-token” contract.

When the `Transfer` event is emitted, the Cardstack Hub will parse the event arguments that are of an `address` type from the `Transfer` event, and then invoke the `balanceOf()` function for each address in the emitted event. The resulting `balanceOf()` responses are then ingested into the Cardstack Hub as new/updated `sample-token-balance-ofs` content.

In this manner we indicate to the Cardstack Hub which Ethereum events are of interest to the indexer, which functions should be called against the contract, and what content should be ingested into the Cardstack _index_.

```js
it("indexes mapping entry content types when a contract fires an ethereum event", async function() {
      try {
        await env.lookup('hub:searchers').get(env.session, 'master', 'sample-token-balance-ofs', accountOne);
        throw new Error("balance-of record should not exist for this address");
      } catch (err) {
        expect(err.message).to.equal(`No such resource master/sample-token-balance-ofs/${accountOne}`);
      }

      try {
        await env.lookup('hub:searchers').get(env.session, 'master', 'sample-token-balance-ofs', accountTwo);
        throw new Error("balance-of record should not exist for this address");
      } catch (err) {
        expect(err.message).to.equal(`No such resource master/sample-token-balance-ofs/${accountTwo}`);
      }

      await token.mint(accountOne, 100);
      await token.transfer(accountTwo, 10, { from: accountOne });

      await waitForEthereumEvents(buffer);

      let accountOneLedgerEntry = await env.lookup('hub:searchers').get(env.session, 'master', 'sample-token-balance-ofs', accountOne);
      expect(accountOneLedgerEntry.data.attributes["ethereum-address"]).to.not.equal(accountOneLedgerEntry.data.id, 'the case between the addresses is different');
      accountOneLedgerEntry.data.attributes["ethereum-address"] = accountOneLedgerEntry.data.attributes["ethereum-address"].toLowerCase();
      delete accountOneLedgerEntry.data.meta;
      expect(accountOneLedgerEntry).to.deep.equal({
        "data": {
          "id": accountOne,
          "type": "sample-token-balance-ofs",
          "attributes": {
            "ethereum-address": accountOne,
            "mapping-number-value": "90"
          },
          "relationships": {
            "sample-token-contract": {
              "data": {
                "id": token.address,
                "type": "sample-tokens"
              }
            }
          },
        }
      });

      let accountTwoLedgerEntry = await env.lookup('hub:searchers').get(env.session, 'master', 'sample-token-balance-ofs', accountTwo);
      expect(accountTwoLedgerEntry.data.attributes["mapping-number-value"]).to.equal("10", "the token balance is correct");
    });
```
In reference 6 above on line 17, an Ethereum `transfer()` function is invoked against the contract and it triggers the `Transfer` Ethereum event. Subsequently, the emitted `Transfer` Ethereum event causes the Cardstack Hub to index both the sender and the recipient `sample-token-balance-ofs` documents based on the `Transfer` Ethereum event arguments.

```js

    async function setup() {
      let factory = new JSONAPIFactory();
      token = await SampleToken.new();

      await token.mint(accountOne, 100);

      factory.addResource('data-sources', contractName)
        .withAttributes({
          'source-type': '@cardstack/ethereum',
          params: {
            branches: {
              master: { jsonRpcUrl: "ws://localhost:7545" }
            },
            contract: {
              abi: token.abi,
              addresses: { master: token.address },
              eventContentTriggers: {
                MintingFinished: []
              }
            }
          },
        });

      env = await createDefaultEnvironment(`${__dirname}/..`, factory.getModels());
      buffer = env.lookup(`plugin-services:${require.resolve('../cardstack/buffer')}`);
      ethereumService = buffer.ethereumService;

      await waitForEthereumEvents(buffer);
    }

    beforeEach(setup);
    afterEach(teardown);

    it('can update contract document from event content trigger', async function() {
      let contract = await env.lookup('hub:searchers').get(env.session, 'master', 'sample-tokens', token.address);
      expect(contract.data.attributes['sample-token-minting-finished']).to.equal(false, 'the minting-finished field is correct');

      await token.finishMinting();
      await waitForEthereumEvents(buffer);

      contract = await env.lookup('hub:searchers').get(env.session, 'master', 'sample-tokens', token.address);
      expect(contract.data.attributes['sample-token-minting-finished']).to.equal(true, 'the minting-finished field is correct');
    });
  });
```
In addition to updating the specified content-type, `sample-token-balance-ofs` for the `Transfer` event, the Cardstack Hub also updates the `sample-tokens` content-type for the underlying smart contract, as the events that are fired may actually trigger changes to the other attributes upon the underlying smart contract. In which case, the Cardstack Hub will invoke all the read-only functions that do not accept a parameter upon the underlying contract in order to update the `sample-tokens` content. This is demonstrated in reference 7 above.

In the data-source configuration on line 18 in reference 7, we have configured the Cardstack Hub to index when the `MintingFinished` event is emitted from the “sample-token” contract. On line 38 in reference 7, the invocation `token.finishMinting()` emits the `MintingFinished` event.

Finally, on line 42 in reference 7 we assert that the underlying contract, whose content is a `sample-tokens` type, has updated its `sample-token-minting-finished` attribute.

With the Cardstack Hub introspecting your smart contract and ingesting Ethereum events as they occur, web clients can query your smart contract using simple RESTful web requests without any specialized Ethereum libraries.
