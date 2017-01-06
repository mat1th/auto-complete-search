# gSearch.js

This is a simple autoComplete search based on the google search API.

## Use the script

Insert the gSearch js in your HTML.

```html
<script src='gSearch/gSearch.js'></script>
```

After that you need to add a 'ul' in the html where the suggestions should be placed.

```html
<ul id="searchAutocomplete"></ul>
```

At the end you can call the autoComplete Search function.  

```javascript
gSearch.autoComplete({
   seachFieldId: 'searchfield',//the search field (required)
   targetId: 'searchAutocomplete', //the ul that should contain the results (required)
   apiKey: '<your key>', // The api key (required)
   cx: '<your CX', // your CX key (required)
   maxSuggestions: 5, //the max amount of suggestions
   callback: function () { // a function that will be called after the search is complete
     console.log('callback!');
   },
   debugEnabled: true
 });
```
