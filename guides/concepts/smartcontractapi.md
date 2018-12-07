# Smart Contract API

Let’s cover how we can access content from the [Cardstack Hub](https://medium.com/cardstack/what-is-the-cardstack-hub-1c9a9e3df343). 

The Cardstack Hub uses a **RESTful API** based on the JSON:API spec that web clients can use to interact with the Cardstack Hub. This allows web clients to perform find, create, update, and delete operations against the content within the Cardstack Hub.

_Note: we’d love to include support for GraphQL too! If you’re interested in helping out, we’re very appreciative of pull requests._

Along with this, Cardstack Hub leverages a sophisticated system of grants and permissions to ensure that clients of the API can only view and modify content for which they have been granted access. Accordingly, the Cardstack Hub’s Ethereum plugin applies a global _read-only_ grant to all the content that is indexed from the Cardstack Ethereum plugin.

At this time we do not have a _writer_ feature for writing to the blockchain from the API, but this will change in the future. 

### JSON:API

The Cardstack Hub exposes its underlying content via [JSON:API](http://jsonapi.org/). JSON:API is a very powerful specification for building API’s.

From the JSON:API website:
> _“JSON API is a specification for how a client should request that resources be fetched or modified, and how a server should respond to those requests. JSON API is designed to minimize both the number of requests and the amount of data transmitted between clients and servers. This efficiency is achieved without compromising readability, flexibility, or discoverability.”_

Let’s take a look at some example queries for Ethereum content made from our CARD token dashboard on [cardstack.com](cardstack.com).

On cardstack.com, we have defined an Ethereum data-source with the content-type of `card-tokens`. Our current CARD token smart contract is deployed to the address: `0xB07ec2c28834B889b1CE527Ca0F19364cD38935c`. To get the document that represents the CARD token smart contract, a web client issues the request that specifies the content-type of the document and the ID of the document (in this case the ID is just the address of the smart contract) : `GET https://hub.cardstack.com/api/card-tokens/0xB07ec2c28834B889b1CE527Ca0F19364cD38935c`.

The response looks like this:

```js
{
  "data": {
    "id": "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
    "type": "card-tokens",
    "attributes": {
      "ethereum-address": "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
      "balance-wei": "0",
      "card-token-total-admins-mapping": "0",
      "card-token-allow-transfers": true,
      "card-token-total-frozen-accounts-mapping": "0",
      "card-token-decimals": "18",
      "card-token-token-ledger": "0x13590104E574a9BDfd834a41D32d526f9FfC04db",
      "card-token-contribution-minimum": "0",
      "card-token-frozen-token": false,
      "card-token-successor": "0x0000000000000000000000000000000000000000",
      "card-token-registry": "0xfc8dEeB5cD80A3e8B8DE353Df9b5b09c71d3Ef17",
      "card-token-external-storage": "0x0174F7eAF415384BA8e8fa0884c0F3dC4604B6cC",
      "card-token-owner": "0x0AEaF8c2Fe778797CD5464E7EB8351d28da2E823",
      "card-token-total-super-admins-mapping": "4",
      "card-token-predecessor": "0x1ed2B1eaEd8e968bc36EB90a914660A71827A5E9",
      "card-token-is-deprecated": false,
      "card-token-ledger-name": "ledger-CARD",
      "card-token-halt-purchase": true,
      "card-token-storage-name": "cstStorage",
      "card-token-get-ledger-name-hash": "0x3ce199a1c5056a1082387f326c412e2770f23868c4064e317f4cc143d3b0fb24",
      "card-token-get-storage-name-hash": "0x3b490556deb6d6bcc6b6674ab40bed699c3086ffb6a43fd53f25257589cef605",
      "card-token-name": "Cardstack",
      "card-token-symbol": "CARD",
      "card-token-total-in-circulation": "2642628240961540000000000000",
      "card-token-cst-balance-limit": "647502000000000000000000",
      "card-token-buy-price": "37000",
      "card-token-circulation-cap": "2820000000000000000000000000",
      "card-token-foundation": "0x6D1627E046613482740ea35573a92E45558CB348",
      "card-token-total-supply": "6000000000000000000000000000",
      "card-token-tokens-available": "3357371759038460000000000000",
      "card-token-total-unvested-and-unreleased-tokens": "65776293000000000000000000",
      "card-token-vesting-mapping-size": "10",
      "card-token-total-custom-buyers-mapping": "561",
      "card-token-total-buyers-mapping": "4411",
      "card-token-total-transfer-whitelist-mapping": "4"
    },
    "meta": {
      "branch": "master",
      "source": "card-token",
      "blockheight": 6117030,
      "contractName": "card-token"
    }
  }
}
```
The data structure should look similar to the concepts introduced when we discussed the schema. Within the `attributes` property of the response you will find the output of all the read-only functions of the smart contract that take no parameters. Within the `meta` property of the response is the `blockheight` field, which provides context for all the attributes.

Let’s now look at a specific token holder’s balance. As with the unit test configuration in reference 5 line 17, the configuration for the CARD token smart contract used on cardstack.com also includes this configuration in the `eventContentTriggers`:

`Transfer: [ "card-token-balance-ofs" ]`

This means that whenever the CARD token contract emits a `Transfer` Ethereum event, the Cardstack Hub will index both the sender’s and receiver’s `card-token-balance-ofs` documents.

From etherscan.io, we can choose an arbitrary token holder and supply this to the API. Let’s use the token holder address `0x274f3c32c90517975e29dfc209a23f315c1e5fc7`. In this case we want the output of the `balanceOf()` function for the token holder’s address. To get this we can issue the request: `GET https://hub.cardstack.com/api/card-token-balance-ofs/0x274f3c32c90517975e29dfc209a23f315c1e5fc7`.

The response looks like this:
```js

{
  "data": {
    "id": "0x274f3c32c90517975e29dfc209a23f315c1e5fc7",
    "type": "card-token-balance-ofs",
    "attributes": {
      "ethereum-address": "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7",
      "mapping-number-value": "2126636558964787521778757"
    },
    "relationships": {
      "card-token-contract": {
        "data": {
          "id": "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
          "type": "card-tokens"
        }
      }
    },
    "meta": {
      "branch": "master",
      "source": "card-token",
      "blockheight": 6116632,
      "contractName": "card-token"
    }
  }
}
```
The attribute that holds the value for the output of the function `balanceOf(0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7)` would be the `mapping-number-value` (line 7 of reference 9) as this function has a single return value that is a `uint256` which is interpreted as a number by the Cardstack Hub.

Note that a current limitation is that you must use a lower-cased token address string for the ID of a child document of a smart contract when issuing the API request for the document. We use the `ethereum-address` attribute (line 6 of reference 9) to preserve the EIP-55 case sensitive form of the Ethereum address for the token holder.

The Cardstack Hub also supports much more sophisticated queries of documents. For example, if you wanted to get all the vested CARD token grants that that expire in 366 days you could issue a query that looks like this: `GET https://hub.cardstack.com/api/card-token-vesting-schedules?filter[vesting-schedule-duration-sec]=31622400` which would return the response:

```js

{
    "data": [
        {
            "id": "0x99e23c2ea424ac5be9c2468b98ba9bb973aa9720",
            "type": "card-token-vesting-schedules",
            "attributes": {
                "ethereum-address": "0x99e23C2Ea424ac5BE9C2468B98Ba9bB973aA9720",
                "vesting-schedule-start-date": "1529954716",
                "vesting-schedule-cliff-date": "1561490716",
                "vesting-schedule-duration-sec": "31622400",
                "vesting-schedule-fully-vested-amount": "149339724000000000000000000",
                "vesting-schedule-vested-amount": "2478454572486338797814207",
                "vesting-schedule-vested-available-amount": "0",
                "vesting-schedule-released-amount": "0",
                "vesting-schedule-revoke-date": "1530479524",
                "vesting-schedule-is-revocable": true
            },
            "relationships": {
                "card-token-contract": {
                    "data": {
                        "id": "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
                        "type": "card-tokens"
                    }
                }
            },
            "meta": {
                "branch": "master",
                "source": "card-token",
                "blockheight": 6083135,
                "contractName": "card-token"
            }
        },
        {
            "id": "0xda39489321a67511805eb1394146f54c407dbeb6",
            "type": "card-token-vesting-schedules",
            "attributes": {
                "ethereum-address": "0xdA39489321a67511805eB1394146f54c407dBeB6",
                "vesting-schedule-start-date": "1529959534",
                "vesting-schedule-cliff-date": "1561495534",
                "vesting-schedule-duration-sec": "31622400",
                "vesting-schedule-fully-vested-amount": "5625093000000000000000000",
                "vesting-schedule-vested-amount": "600359994093806921675774",
                "vesting-schedule-vested-available-amount": "0",
                "vesting-schedule-released-amount": "0",
                "vesting-schedule-revoke-date": "0",
                "vesting-schedule-is-revocable": true
            },
            "relationships": {
                "card-token-contract": {
                    "data": {
                        "id": "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
                        "type": "card-tokens"
                    }
                }
            },
            "meta": {
                "branch": "master",
                "source": "card-token",
                "blockheight": 6083135,
                "contractName": "card-token"
            }
        },
        {
            "id": "0xebf94760821386c594317569001f7de89f1bad35",
            "type": "card-token-vesting-schedules",
            "attributes": {
                "ethereum-address": "0xEBF94760821386C594317569001F7DE89f1bAd35",
                "vesting-schedule-start-date": "1530197906",
                "vesting-schedule-cliff-date": "1561733906",
                "vesting-schedule-duration-sec": "31622400",
                "vesting-schedule-fully-vested-amount": "3735622000000000000000000",
                "vesting-schedule-vested-amount": "56859128649185387573365",
                "vesting-schedule-vested-available-amount": "0",
                "vesting-schedule-released-amount": "0",
                "vesting-schedule-revoke-date": "1530679224",
                "vesting-schedule-is-revocable": true
            },
            "relationships": {
                "card-token-contract": {
                    "data": {
                        "id": "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
                        "type": "card-tokens"
                    }
                }
            },
            "meta": {
                "branch": "master",
                "source": "card-token",
                "blockheight": 6083135,
                "contractName": "card-token"
            }
        }
    ],
    "meta": {
        "total": 3
    }
}
```
