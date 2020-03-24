You can think of a Card as a "mini app" that can be run in different places within an app, or shared between different apps.
For example, someone might build a Card that fetches and displays user information from a GitHub profile.
The information could be displayed on a standalone page, or as a small widget on another page.
Every Card has its own templates, styling, JavaScript files, tests, and more.

In this section of the Guides, you will learn how to run the Card Builder on your own computer
so that you can learn and explore.

The average Cardstack user never needs to look at a terminal or a code editor; they do their
work using visual interactions in the browser. But for developers, there are some
additional powerful tools available, which we refer to as "Dev Mode." Keep reading to learn more!

## Prerequisites

See [The Quickstart](../getting-started/) for the list of prerequisites that you should have installed on your computer in order to follow this tutorial.

## Running the builder app locally

First, we'll install the Cardstack repository:

```bash
git clone https://github.com/cardstack/cardstack.git
cd cardstack
yarn install
```

There are a lot of files in here! You just downloaded the Card Builder and many of its key
dependencies.
You will be doing your own work in just a small number of files, so don't worry about most of these.

Next, make sure you have Docker running. Then open up the `cardhost` app files, and run this command
to create a temporary database for your local development work:

```bash
cd packages/cardhost
yarn start-prereqs
```

Now, you can run the app itself:

```bash
yarn start
```

This will spin up two local servers - the Hub, which is a back end server, and the Builder,
which is the front end application that you could use to create cards in a visual way.

Visit this URL in the browser to see your app running: [http://localhost:4200](http://localhost:4200)

If you are having trouble with any of these steps, read the "Troubleshooting Tips" at the end of this article or drop by our [Discord chat](http://localhost:4200), and we'll help you get going!

## Try making a Card

Before we look at the code, let's use the visual tools of the Builder to create a Card.
This will be helpful context when we get to "Dev Mode" later.

From the browser, click on the Profile icon in the left edge and choose "log in."
This allows you to simulate being a logged-in user, and make changes to your own local data,
without requiring a username and password. It is for testing purposes only.

Once you are logged in, in the left edge, click on the Catalog button (it looks like a grid) and
choose a card to make a copy of.

Visit the "Edit" mode to fill in forms, or the "Schema" mode to drag and drop new fields in.
Visit "Layout" and click the "Custom Theme" button to write some CSS.

Feel free to explore! You can't permanently break anything, and your data is all
stored on your computer only.


## Enable Dev Mode

Now that we know that your local server works, let's turn on Dev Mode.
In Dev Mode, Cards are saved to your hard drive as files, and you can look at the data
that they are made of.

Stop your server from the terminal with `Control-C`.

Next, create a new git repository somewhere on your hard drive, outside of the `cardstack` repository. This will be the directory for
your new cards. Use `pwd` to print the full directory path. You'll need it in the next step.

```bash
mkdir my-cards
cd my-cards
git init
pwd
```

Now, back in `cardhost`, start your local server and set `DEV_DIR` to your own path:

```bash
DEV_DIR="your/path/goes/here" yarn start
```

Now, try creating another card in the builder.
Drag at least one field into it, such as
text or number. We'll need it later.

You will see your card show up in the `DEV_DIR` you specified!
There will be a new directory that has your card's
randomly-generated id for the directory name.
Inside is `card.json` and `package.json`.
`card.json` has all the information needed to create a card.
It will look something like this:

```json
{
  "data": {
    "attributes": {
      "csCreated": "2020-03-23T21:11:05.993Z",
      "csFields": {
      },
      "csTitle": "my-new-card",
      "csUpdated": "2020-03-23T21:11:05.993Z"
    },
    "relationships": {
      "csAdoptsFrom": {
        "data": {
          "id": "https://base.cardstack.com/public/cards/base",
          "type": "cards"
        }
      }
    },
    "type": "cards"
  },
  "included": [
    {
      "attributes": {
        "csCreated": "2020-03-23T21:11:06.016Z",
        "csDescription": "This represents cards of any type",
        "csFeatures": {
          "embedded-css": "embedded.css",
          "isolated-css": "isolated.css"
        },
        "csFiles": {
          "card.json": "{\n  \"data\": {\n    \"type\": \"cards\",\n    \"attributes\": {\n      \"csTitle\": \"Base Card\",\n      \"csDescription\": \"This represents cards of any type\",\n      \"csFeatures\": {\n        \"isolated-css\": \"isolated.css\",\n        \"embedded-css\": \"embedded.css\"\n      }\n    },\n    \"relationships\": {\n    }\n  }\n}",
          "embedded.css": "(omitted for the example)",
          "isolated.css": "(omitted for the example)",
          "package.json": "(omitted for the example)"
        },
        "csId": "base",
        "csPeerDependencies": {
          "@cardstack/hub": "*"
        },
        "csTitle": "Base Card",
        "csUpdated": "2020-03-23T21:11:06.016Z"
      },
      "id": "https://base.cardstack.com/public/cards/base",
      "meta": {
        "cardDir": "/Users/jenweber/projects/cardstack/node_modules/@cardstack/base-card"
      },
      "relationships": {
      },
      "type": "cards"
    }
  ]
}
```

## Making changes using Dev Mode

Now that we have the Card JSON, we can make changes to it using the
Card Builder or modifying the JSON itself, aka the "Card Document."
In some cases, this is faster or more powerful than creating cards directly in the
builder; it is a tool at your disposal as a Card Creator!

Try changing the `csTitle` of the card you made earlier:

```json
"csTitle": "My New Title Goes Here",
```

Save, and refresh the browser page showing the card.
You should see your new title in the card's header.
If you study the JSON carefully, you will find that
you can add new fields, change CSS, and more.

Next, try adding a new field.
Under `csFields`, copy one of the fields you created,
paste it just inside the `csFields` block,
and give it a new dasherized name, such as `dev-mode-field-name`.
Don't forget to add a comma to separate your records.
You will also need to add the new field name in the
`isolated` fields list and the `csFieldOrder`, like shown below:

```json
"csFieldOrder": [
  "field-1", "dev-mode-field-name"
],
"csFieldSets": {
  "embedded": [
  ],
  "isolated": [
    "field-1", "dev-mode-field-name"
  ]
},
"csFields": {
  "field-1": {
    "attributes": {
      "csFieldArity": "singular",
      "csFields": {
      }
    },
    "relationships": {
      "csAdoptsFrom": {
        "data": {
          "id": "https://base.cardstack.com/public/cards/string-field",
          "type": "cards"
        }
      }
    }
  },
  "dev-mode-field-name": {
    "attributes": {
      "csFieldArity": "singular",
      "csFields": {
      }
    },
    "relationships": {
      "csAdoptsFrom": {
        "data": {
          "id": "https://base.cardstack.com/public/cards/string-field",
          "type": "cards"
        }
      }
    }
  }
},
```

`csFieldOrder` determines the order of the fields on the page.
`isolated` is a list of the fields that should be included when the card is show in isolated (full page) mode, as opposed to what is shown in the `embedded` (thumbnail size).

## Saving data long-term

In this tutorial, we covered saving data to a local git repository. But what about saving it long-term?
The Card Builder is designed to also save data to a private git repository hosted on GitHub.
You can use this repository for deployed apps as well as local development.
Stay tuned for more tutorials to help you get this set up!

<!-- TODO -->

## Troubleshooting tips

Having trouble? Not sure where to look? These notes might help you out as you create Cards, add sample data records, and try to display them.

- Make sure you are running Node version 12 or later. Try `node -v` in the terminal
- Is Docker running? Try `docker ps`. If it says "Cannot connect," launch the Docker app, wait until it is finished loading, and try again.
- To see the data available in the local Cardstack Hub database, you can use postgres and SQL commands. In the terminal, run `docker exec -it cardstack-pg psql -U postgres pgsearch_cardboard_development`. This will open up a postgres shell. Many columns in tables are quite wide, so try selecting only from specific columns like `id`. The `documents` table is where Card data goes, so a sample query could be `SELECT id FROM documents;`
- Did you get the latest commits from the `master` branch of the Cardstack repository, and now things don't work? You might have some build artifacts lying around. Commit any work you want to keep, then delete the `packages` and `cards` directories. Clear out your `node_modules` throughout the repository with `npx lerna clean`. Run `git reset --hard HEAD` to discard all uncommitted changes (i.e. get a clean slate), then `yarn install`. Stop your local database with `yarn stop-prereqs`. Finally, follow the tutorial steps above, beginning with `yarn install` to start the database and the app again.
- Did you update the version of the `cardstack` repository that you are using? There might be orphaned JavaScript files lying around. Delete the contents of `cardstack/packages` and then discard the changes and `yarn install` to get back to a fresh set of modules.
- Visit our [Discord chat](http://localhost:4200) for help

### Starting over

Sometimes, you just need a clean environment for debugging if something is not working how you expect.
Follow these steps to get back to square one.
Please note that some of these commands are destructive to any uncommitted work, so don't do them if you are afraid of losing the changes you see during `git status`.

From `cardstack/packages/cardhost`:

`Control-C` to stop your local servers.

```sh
yarn stop-prereqs # stop the docker container, if one is running
```

From `cardhost`:

```sh
npx lerna clean # wipes out node_modules at all levels in the directory
rm -rf packages cards # delete any lingering compiled/generated files
git reset --hard HEAD # put the packages directory back to its original state in git
yarn install
```

## Learn more

Cards are a lot more than just components. See [Cards at Rest, Cards in Motion](https://medium.com/cardstack/cards-at-rest-cards-in-motion-4a0f88a8b6c5) and [Building the Card Catalog](https://medium.com/cardstack/building-the-card-catalog-bf034445d05e) to learn more about what makes them different from traditional web apps.

You can also watch the [Card Folio community demo](https://medium.com/cardstack/cardstacks-card-folio-app-community-demo-c81b873ab596) and read [Community Q&A](https://medium.com/cardstack/community-q-a-the-card-folio-app-c07125a2e18d) to get the big picture for how Cards compose together.
