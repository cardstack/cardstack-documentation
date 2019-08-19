_This page is a work-in-progress! To help with content, click on the pencil icon in the top right corner._

Let's build an admin dashboard for editing Cards!
By the end, you will have content that you and your collaborators can edit online.
We'll use the [`@cardstack/github-auth`](https://github.com/cardstack/cardstack/tree/master/packages/github-auth) plugin for authentication, and configure grants and roles for the Card.

In this example, we'll imagine that we are adding scores to entries in a photography contest. All visitors to the site should be able to see the scores, but only admins should be able to create and view comments.

## Background knowledge

Before you get started, you should be familiar with [Grants](../../grants/), and you should have created a Card that can be edite locally using the Right Edge and `mock-auth`.
You will also need a free account on [GitHub](https://github.com).

## Create the scorecard

- short section with the card, some attributes, and a template
- create a board to hold all cards

## Adding read permissions

- everyone group
- screenshot

## Adding write permissions

- admins group

## Install `github-auth`

- explain what the plugin does/OAuth
- yarn install

## Connect the plugin to GitHub

- authorizing users
- local env management
- deployed env management
- safe key handling
- screenshots

## Trying it out

- screenshots