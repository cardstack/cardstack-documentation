A realm is a Card's home. It determines where a card comes from and who can access it.
A realm helps to establish the provenance of a card, i.e. its trail of ownership as it moves through a workflow.
Whenever cards in a realm change, the Hub updates its own index.

## Types of realms

There are several types of realms that are available out-of-the box:

- The meta realm, which is the authoritative list of realms that the hub should look for cards in
- The git realm, which is a hosted git repository that holds cards in the form of JSON files
- The file realm, which is a directory on your own hard drive that contains cards
- The ephemeral realm, which is a JavaScript map held in memory that is used only for testing

You can have many different realms for each type. For example, perhaps you may want to load in cards from
five different GitHub repositories. You would then have five git realms.

To be precise, every realm that is active in a Cardstack project is an _instance_ of one of these types of realms.

## What is a default realm?

Every project automatically has at least one realm in addition to the meta realm, which is commonly referred to as the "default realm."
In most cases, the default realm is a git realm.

## How are realms created?

Every time you start up the Card Builder, it pulls in cards automatically from realms.

For example, in `cardstack/packages/hub/main.ts`, you can see that there is a realm created for the Card Catalog.
The Catalog has a git URL found at `https://github.com/cardstack/card-catalog.git`.
It contains some [featured cards and templates](https://github.com/cardstack/card-catalog) that are loaded automatically into the app.

## Adopting cards across realms

A card that lives in one realm can be adopted from and added to another realm.
For example, a card loaded in from the public [Card Catalog](../../publishing/catalog/) can be adopted from, and the new card can be added into a realm for another git repository.

## An example realm

A realm is actually a card! You can see an example here in the [`files-realm`](https://github.com/cardstack/cardstack/tree/master/cards/files-realm) source code
