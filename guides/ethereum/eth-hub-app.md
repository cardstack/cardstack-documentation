# Running an Ethereum Hub Application
Once the Cardstack Hub starts up, it will discover the data sources that you have configured in the `cardstack/` folder of your project and begin indexing those data sources.

The Ethereum data source takes a couple minutes to index all the Ethereum events, but the contract content itself should be indexed within seconds of the Cardstack Hub starting. Let’s start exploring our contract!

The Rinkeby CARD token contract is being served at the endpoint: `http://localhost:3000/api/card-tokens/0x013c05c37d24d96e4cc23e5d0efcd2aa13d81d7c`

IMAGE 1

The read-only functions of the smart contract that do not take a parameter are available as attributes of the HTTP GET response above using the prefix `card-token` and the dasherized name of the smart contract function.

As the configured Ethereum events are emitted every ten minutes from `cardstack/card-token.js`, the attributes of the smart contract above are updated in the Cardstack index. Additionally, the `meta` property provides context of when the smart contract was last indexed with the `blockheight` property.

Another one of the content types that we are indexing, specified in `cardstack/card-token.js`, is `card-token-balance-ofs`. The `card-token-balance-ofs` content type represents the various token balances in our smart contract (this corresponds to the ERC20 `balanceOf()` smart contract function). We can get a listing of all the token addresses by issuing this GET: `http://localhost:3000/api/card-token-balance-ofs`

IMAGE 2

This response will return all the token balances using a default page size of 10 token balances per page (the page size can be altered using query parameters).

Also, you’ll note that the `meta` property in this response indicates how many total records exist, as well as provides a link to get the next page of token balances.

The address of the token holder can be found in the `attributes.mapping-number-value property` within each `card-token-balance-ofs` resource in the response above. (Note that we use a JavaScript string type to represent this number, as Ethereum numbers can be much much larger.)

We can issue the request `http://localhost:3000/api/card-token-balance-ofs/0x88e1d504fd6551a7b7b19e1aa6881de1a9f18ca7` to look at the balance for a specific token holder, whose address is `0x88e1d504fd6551a7b7b19e1aa6881de1a9f18ca7`

IMAGE 3

Additionally, within the `card-token-balance-of` resource is an array of `Transfer` events related to the ledger address. The `Transfer` event is an ERC20 event that is emitted when there is a token transfer that occurs in the smart contract. This this is the `card-token-transfer-events` content type.

We can use a query parameter to search for all the `card-token-transfer-events` where the token holder is a recipient of a token transfer by issuing a request `GET http://localhost:3000/api/card-token-transfer-events?filter[transfer-event-to]=0x88e1D504Fd6551A7B7b19e1Aa6881de1A9F18ca7`

IMAGE 4

The `card-token-transfer-events` content type describes all the event arguments in the Ethereum event it represents. In this case, that includes the `from`, `to`, and `value` event arguments for the ERC20 `Transfer` event. Additionally, the block number as well as the transaction ID that this event was emitted from is included in the response body for this resource.
