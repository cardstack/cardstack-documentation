A route is a URL where data can be requested and received.
For example, when you visit `cardstack.com`, you are requesting the HTML, JavaScript, and CSS that creates the page before you.

Likewise, the Builder app itself has routes (or URLS) that you can visit to interact with your cards.
Every card also has a route of its own that encodes its identity and relationships to other cards.

## Understanding card URLs

Whenever you view a card in the builder, you can see how the card's own URL is part of the app's URL:

```
https://builder.stack.cards/cards/https:%2F%2Fcardstack.com%2Fapi%2Frealms%2Fcard-catalog%2Fcards%2Fevent-ticket
```

You can see the card's id, `event-ticket` at the end. You can see that the realm it comes from is `card-catalog`.

## How routes are created

Routes are created automatically every time you create a card. By default, every new card created with the Builder is assigned a semi-random, unique ID that becomes part of its route.
