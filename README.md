# TICKLE Client

TICKLE playground for our Project


## For Marcus?
* placeholder image user
* center icons on dropbox
* adapt map styling


## What is left to do?
  * Localisation (different languages)
  * Card template Editor (in progress)
  * Learning Analytics (User profile and recommendation) and Web Analytics (Google Analytics)
  * Porting to PWA (Progressive Web App)
  * Unit testing
  * Adding more challenge types
  * Partial automatize the card creation process by adding content to the cards from web services (Google maps, Brussels tourism API, Wikipedia, etc.)
  * Card Hierarchical View
    * Hierarchy editor (file tree view)
  * Card Timeline View
    * editor
  * User Diary (show related cards)
  * create Mission editor and reward cards
  * Manually creating Content for Cards
  * add routing for location of cards and open navigation in google maps
  * add neighborhood range in geo card author (define the bounds of the card)

### Todo bugfixes
* fix drag and drop on mobile and bugs with map events (and the corresponding component)
* ~untangle flip container from cardfront~
* ~find better abstraction for readcardfront and cardfront (with or without modal)~
* ~fix ID issue in (Card)Stack~
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

