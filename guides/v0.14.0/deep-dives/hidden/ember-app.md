# Create an Ember Application

The Cardstack Hub is ideally suited to be consumed by an [Ember.js](ember.js) application (albeit, it doesn’t have to be). Since Ember.js applications are easy to setup and have great tooling, let’s start there.

Creating an Ember.js application is really simple. Let’s start by installing the [yarn](https://yarnpkg.com/en/) package manager. The simplest way to install yarn, if you haven’t already, is to execute:

`curl -o- -L https://yarnpkg.com/install.sh | bash`

Now let’s install the Ember.js tooling by executing the following from any directory:

`yarn global add ember-cli`

This will allow the `ember` executable to be available from your command line.

Next let’s create the Cardstack Application. We’ll name it: `smart-contract-example`. Execute the following command:

`ember new smart-contract-example`

This will create a directory called `smart-contract-example/` and setup a vanilla Ember.js application. Try out your Ember.js application by changing to the application directory that was just created and starting the development server:

`cd smart-contract-example
ember serve`

You should see something that look like the following:

IMAGE 1

Your Ember.js application is now running on your machine. You can view it at [http://localhost:4200](http://localhost:4200).

IMAGE 2

The Ember.js application that we just set up can be used to build a user interface that then consumes API from the Cardstack Hub.
