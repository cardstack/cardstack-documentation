Every card belongs to a realm. You can think of a realm as an environment where cards are available. For example, if a user has access to a particular realm, they can see its cards.

## How realms are created

Every time you start up the Card Builder, it pulls in cards automatically from realms.

For example, in `cardstack/packages/hub/main.ts`, you can see that there is a realm created for the Card Catalog.
The Catalog has a git URL found at `https://github.com/cardstack/card-catalog.git`.
It contains some [featured cards and templates](https://github.com/cardstack/card-catalog) that are loaded automatically into the app.
