Until this point, we have covered the essential concepts and features of a Cardstack application. Now, it is time for you to try out your new skills and knowledge on an interactive tutorial. In this tutorial, we will build a Movie Tracking application using the Cardstack framework.

Movies are irreplaceable parts of the 21st century social life. People are continuously watching new movies, recieving numerous movie recommendations to watch, and even cuts a couple movies in the middle. Considering all this data, wouldn't it be very useful to have a tool that can record all the movies that you watched, currently watching, or noted to watch. With Cardstack framework, you can easily build this practical dailylife tool.

First, go ahead and clone this GitHub repo, which is an empty [Cardstack Project Template] (https://github.com/cardstack/project-template).

## Creating the Movie Card

In order to record each movie, we will need to create a card called 'movie'. Go ahead, and paste these command to your Terminal,

`cd project-template`

`ember generate card movie`

Remember that, you will need to make an addition to the `devDependencies` of the main app's `package.json`. The main app is in a directory that shares a name with your project, such as `my-project-name/my-project-name/package.json`. Go ahead, and paste the following to the `devDependencies`:

```js
"cardboard-movie": "*",
```

Don't forget to run `yarn install` in your Terminal after doing any change to the `devDependencies`!

## Adding the Movie Fields

Even though we created a card that will resemble the movie data, we need to spesify which properties of a movie will this movie card have. Remember that we will define the data backing of a card in its schema, which is in its `static-model.js` file. Let's view this file by following the path `cards/movie/cardstack/static-model.js`.

You should be seeing the default schema

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'movies')
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

Besides a title, a movie should have a year, a genre, a short summary, and a boolean value of if it is still playing or not. Go ahead, and add these fields to your movie schema, with appropriate `fieldType`.

```js
let factory = new JSONAPIFactory();
factory.addResource('content-types', 'movies')
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'year').withAttributes({
      fieldType: '@cardstack/core-types::integer'
    }),
    factory.addResource('fields', 'genre').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'summary').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'playing').withAttributes({
      fieldType: '@cardstack/core-types::boolean'
    }),
  ]);
```

###Viewing the Movie Card

In order to view a card, we first need to design its template view. For now, we can just work on the `isolated` view of our movie card. Follow the path `cards/movie/addon/templates/isolated.hbs` and replace the existing code with the following code 

```html 
<div class="movie-isolated">
  <h1 data-test-movie-isolated-title>Title: {{content.title}}</h1>
  <h1 data-test-movie-isolated-title>Year: {{content.year}}</h1>
  <h1 data-test-movie-isolated-title>Genre: {{content.genre}}</h1>
  <h1 data-test-movie-isolated-title>Short Summary: {{content.summary}}</h1>
  <h1 data-test-movie-isolated-title>Currently Playing: {{#if content.playing}} Yes {{else}} No {{/if}}</h1>
</div>
```
Now that we have a schema and a template view for this movie card, we can create an instance of it. Paste the below code to the bottom of the `cards/movie/cardstack/static-model.js`

```js
factory.addResource('movies', 1).withAttributes({
    title: 'Avengers Endgame',
    year: 2019,
    genre: 'adventure',
    summary: 'After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe.',
    playing: true
  });
```

If you go ahead and run the app, and use the route `/movies/1`, you can see the isolated template of your movie card.

Congratulations!! You just created, structured and viewed your first Cardstack Card.

Now that you know how to create an instance of a movie card, you can go ahead and store more Marvel Cinematic Universe movies to your schema. You can create your own movie cards, or just use the code below:

```js
factory.addResource('movies', 2).withAttributes({
    title: 'Spiderman: Far From Home',
    year: 2019,
    genre: 'adventure',
    summary: 'Following the events of Avengers: Endgame, Spider-Man must step up to take on new threats in a world that has changed forever.',
    playing: false,
  });
  factory.addResource('movies', 3).withAttributes({
    title: 'Thor Ragnarok',
    year: 2017,
    genre: 'comedy',
    summary: 'Thor (Chris Hemsworth) is imprisoned on the planet Sakaar, and must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela (Cate Blanchett).',
    playing: false,
  });
  factory.addResource('movies', 4).withAttributes({
    title: 'Doctor Strange',
    year: 2016,
    genre: 'science-fiction',
    summary: 'While on a journey of physical and spiritual healing, a brilliant neurosurgeon is drawn into the world of the mystic arts.',
    playing: false,
  });
  factory.addResource('movies', 5).withAttributes({
    title: 'Black Widow',
    year: 2020,
    genre: 'horror',
    summary: 'Not announced',
    playing: false,
  });
  factory.addResource('movies', 6).withAttributes({
    title: 'Iron Man',
    year: 2008,
    genre: 'adventure',
    summary: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
    playing: false,
  });
  factory.addResource('movies', 7).withAttributes({
    title: 'Captain America Civil War',
    year: 2016,
    genre: 'action',
    summary: 'Political involvement in the Avengers affairs causes a rift between Captain America and Iron Man.',
    playing: false,
  });
  factory.addResource('movies', 8).withAttributes({
    title: 'Guardians of the Galaxy Vol. 3',
    year: 2020,
    genre: 'comedy',
    summary: 'Not announced',
    playing: false,
  });
```


###Creating the Main Board

For our application, we will also need a main board card that we will display and categorize the movie cards. So, let's go ahead and create the main-board card. Repeate the steps from only the 'Creating the Movie Card' section with replacing 'movie' with 'main-board'.

### Adding the Main-Board Fields

For the movie card, we just added some basic features for holding data. In the main-board card, we will use the magic of the Cardstack application, and put multiple movie cards on top of the main-board card. Go to the `cards/main-board/cardstack/static-model.js` and replace the existing code with the following code

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'main-boards')
  .withAttributes({
    defaultIncludes: ['movies', 'to-watch-movies','currently-watching-movies','watched-movies'],
    fieldsets: {
      isolated: [
        {field: 'movies', format: 'embedded'}, 
        {field: 'to-watch-movies', format: 'embedded'},
        {field: 'currently-watching-movies', format: 'embedded'},
        {field: 'watched-movies', format: 'embedded'}
      ]
    }
  })
  .withRelated('fields', [
    {type: 'fields', id: 'title'},
    factory.addResource('fields', 'message').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'watched-movies').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'movies' }]),

    factory.addResource('fields', 'currently-watching-movies').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'movies' }]),

    factory.addResource('fields', 'to-watch-movies').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'movies' }]),
  ]);

```
### The Main-Board Fields Explained

This Cardstack Framework feature deserves a little more attention, so we will try to understand it more. 

Let's first take a look at the `.withRelated` portion of the schema. The first difference between the movie card schema and the main-board card schema is the main-board card schema accesses the `title` field that has been created by the movie card with `{type: 'fields', id: 'title'}` notation. This is a very powerful feature, since it prevents redundant `fields` and memory usage. 

Second, all three of the `watched-movies`, `currently-watching-movies`, and `to-watch-movies` fields have their own `.withRelated` portions. The reason behind this is their special `fieldTypes`. Instead of a primitive data type, these fields have a `has-many` relationship with, in this case, `movies` `content-type`. In other words, each of these fields will be related to a bunch of movies, so we can use them as lists. We will see have we can display these movies after.

Third, let's take a look at the `withAttributes` portion of the schema. Remember that `defaultIncludes` attribute sets which fields to be included at the start of the application. In our case, we want all of our fields to be included. Moreover, remember that `filedsets` attribute helps us to set which fields to be displayed in a particular format. In our case, we won't be using the `embedded` view of the main-board card, and want to include all fields in the `isolated` view.

###Viewing the Main-Board Card

Now that we set up our schema for the main-board card, we can go ahead and create our first main-board instance. Copy the below code to the bottom of the `cards/main-board/cardstack/static-model.js` file.

```js
factory.addResource('main-boards', 'main').withAttributes({
    title: 'Welcome to your personalized Movie Tracker',
    message: 'Please choose which category to view'
  })
  .withRelated('watched-movies', [
    { type: 'movies', id: '1' },
    { type: 'movies', id: '2' },
  ])
  .withRelated('currently-watching-movies', [
    { type: 'movies', id: '3' },
    { type: 'movies', id: '4' },
  ])
  .withRelated('to-watch-movies', [
    { type: 'movies', id: '5' },
    { type: 'movies', id: '6' },
  ]);
```

As you can see, since we already created the movie instances, we can relate them to appropriate fields, or in our case movie lists, with a very easy notion.

Now that we set our dat abacking with the schema, we can go ahead and design the frontend in `cards/main-board/addon/templates/isolated.hbs`. You can replace the existing code with the following code

```HTML
<div class="main-board-isolated">
  <h1 data-test-main-board-isolated-title>{{content.title}}</h1>
  <h3 data-test-main-board-isolated-message>{{content.message}}</h3>
  <br><br>
  <div class='container list-types-buttons'>
    <div class='btn-group'>
      <button {{action showSelectedMovies 'watchedMovies'}}>Watched Movies</button>
      <button {{action showSelectedMovies 'currentlyWatchingMovies'}}>Currently Watching Movies</button>
      <button {{action showSelectedMovies 'toWatchMovies'}}>To Watch Movies</button>
    </div>
  </div>
  <div class="movie-list">
    {{#if showBoard}}
      {{#if (eq movieAmount 1)}}
        <h3 data-test-main-board-isolated-title>There is 1 movie on this list.</h3>
      {{else}}
        <h3 data-test-main-board-isolated-title>There are {{movieAmount}} movies on this list.</h3>
      {{/if}}
      <ol>
        {{#cs-field content selectedStatue as |movies|}}
          {{#each movies as |movie|}}
            <li>{{cardstack-content content=movie format='embedded'}}</li>
          {{/each}}
        {{/cs-field}}
      </ol>
    {{/if}}
  </div>
</div>
```

Obviously we used actions and local variables in this template, so you need to replace the existing code in `cards/main-board/addon/components/isolated.js` with the below code as well

```js
import Component from '@ember/component';
import layout from '../templates/isolated';
import { computed } from '@ember/object';

export default Component.extend({ 
    layout,
    init() {
        this._super(...arguments);
        this.set('statues', {
            'watchedMovies' : this.content.watchedMovies,
            'currentlyWatchingMovies' : this.content.currentlyWatchingMovies,
            'toWatchMovies' : this.content.toWatchMovies,
        })
    },
    addEvent: false,
    deleteEvent: false,
    addButtonDisable: false,
    deleteButtonDisable: false,
    showBoard: false,
    selectedStatue: "",

    toggleAddEvent: function() {
        this.set('addEvent', !this.addEvent);
        this.set('deleteButtonDisable', !this.deleteButtonDisable);
    },

    toggleDeleteEvent: function() {
        this.set('deleteEvent', !this.deleteEvent);
        this.set('addButtonDisable', !this.addButtonDisable);
    },

    movieAmount: computed('selectedStatue', function() {
        return this.get('statues')[this.get('selectedStatue')].length;
    }),

    showSelectedMovies: function(statue) {
        this.set('showBoard', true);
        this.set('selectedStatue', statue);
    }

 });
```
Now, you can run the application and follow the route `/main-boards/main` you will see a fully functioning Movie Tracking application.

###Editing the Data
