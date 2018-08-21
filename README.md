# TICKLE Client

TICKLE playground for our Project

## What is left to do?
* Localisation
* Card template Editor
* Hierarchical View
* Timeline View
* Diary
* Analytics

### Todo bugfixes
* fix drag and drop on mobile and bugs with map events
* See issues


* Fork and clone the project:

### To run
* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) installed in your system.

```
git clone https://github.com/DinoJay/TickleClient
```

* Then install the dependencies:

```
npm install
```

* Run development server:

```
npm start
```

Open the web browser to `localhost:3000`

### To build the production package

```
npm run build
```


### Eslint
There is a .eslint.json config for eslint ready with React plugin.
To use it, you need to install additional dependencies though:

To do the actual linting, run:

```
npm run lint
```

### Notes on importing css styles
* styles having /src/ in their absolute path are considered part of the application and exported as local css modules.
* other styles are considered global styles used by many components and are included in the css bundle directly.

