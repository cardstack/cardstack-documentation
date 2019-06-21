It’s helpful to think of Cardstack “environments” rather than "apps." 
Although Cardstack is built for the web and not native, in some ways its mental model is more similar to an operating system than a web app.
For example, say you make a Word doc, and then share it with someone else, who then makes revisions and sends it back to you via email.
That’s analogous to a developer authoring a Card, making it available for others to use, and accepting revisions. Someone could build an app _using_ Cardstack, but Cardstack itself is not an app.

## What goes in the Cardstack Environment?

A Cardstack environment is the context that Cards run in. By default, it contains:

- an application that Cards render in
- An API that receives requests from the front end, persists changes, and indexes data from external resources
- An ephemeral data cache so that requests have speedy responses
- Many data plugins for connecting to different kinds of data sources
- UI interfaces for editing content

## Learn more

To learn more about the Cardstack environment, watch this [Introduction to the Cardstack Hub](https://www.youtube.com/watch?v=Jmc40SYS-uU).
