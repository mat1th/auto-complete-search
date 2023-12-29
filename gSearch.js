// The parrent element should be a <ul/>.
// `<ul id="<yourid>"></ul>`

var gSearch = (function () {
  var _values = {};
  var _openXHRs = {};

  var _settings = {
    minTimeOut: 200 // Default timeout time
  };

  /**
   * Log a message, only if you did enable `debugEnabled`.
   * @param   {String} {Object or  String} The message that will be loged
   * @returns {none}
   */
  var _debug = function (message, message2) {
    if (_values.debugEnabled === true) {
      console.debug(message, message2);
    }
  };

  /**
   * Selects the element with the id you have defined.
   * @param   {Object}    The id or class from the html node you would like to get
   * @returns {Object}    A nodeList object from the HTML element.
   */
  var _selectId = function (selector) {
    return document.getElementById(selector);
  };

  /**
   * Gets the base url
   * @param   {String, String} The api key and de CX record
   * @returns {String}         The base url
   */
  var _url = function (apiKey, cx, seachstring) {
    return 'https://www.googleapis.com/customsearch/v1/?key=' + apiKey + '&cx=' + cx + '&q=' + seachstring;
  };

  /**
   * Gets the base url
   * @param   {Array}  The auto complete list from the google API
   * @returns {String} A string with li's
   */
  var _createAutocompleteList = function (autoCompleteList) {
    var list = _selectId(_values.targetId);
    var maxresults = (autoCompleteList.length > _values.maxSuggestions) ? _values.maxSuggestions : autoCompleteList.length;
    list.innerHTML = '';
    for (var i = 0; i < maxresults; i++) {

      var listItem = document.createElement('li');
      var linkItem = document.createElement('a');

      linkItem.href = autoCompleteList[i].formattedUrl;
      linkItem.innerHTML = autoCompleteList[i].title;
      listItem.appendChild(linkItem);
      list.appendChild(listItem);
    }
  };

  /**
   * Creates a get XMLHttpRequest you can use it by: 
   * ```
   * var _client = new DP.helper.GetData(),   
   * _client.get('url', function(response) {})
   * ```
   * @param   {String, String}  The url form the page you would like to get
   * @returns {Object}          The page content you would like to get.
   */
  var _GetData = function () {
    // Fix For IE8 and earlier versions.
    if (!Date.now) {
      Date.now = function () {
        return new Date().valueOf();
      };
    }

    /**
     * Checks if there is already a request and if there is one close that request and save the 
     * new request to the object . It also sets the time of the request.
     * @param   {httpRequest} The url form the page you would like to get.
     */
    var _beforeRequest = function (httpRequest) {
      if (_openXHRs[_values.seachFieldId]) {
        // If we have an open XML HTTP Request for this autoComplete ID, abort it.
        _openXHRs[_values.seachFieldId].abort();

        _settings._lastRequest = Date.now();
        _debug('the old request is aborted');
      }
      // If the use has given a loading element render it
      if (_values.loadingText !== undefined) {
        _debug('The loading div is shown');
      }
      // Set the new request for this id;
      _openXHRs[_values.seachFieldId] = httpRequest;
      _debug('The new request is set', httpRequest);
    };

    // Checks if the XMLHttpRequest is supported by the browser
    if (window.XMLHttpRequest) {
      this.get = function (aUrl, aCallback) {

        // Check if the last request is more than 200 secods ago;
        if (_settings._lastRequest !== undefined && (Date.now() - _settings._lastRequest < _settings.minTimeOut)) {
          return;
        }

        // Create a new request
        var httpRequest = new XMLHttpRequest();
        _beforeRequest(httpRequest); // Check if there is already a request created.

        // Watch on change
        httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            aCallback(JSON.parse(httpRequest.responseText));

            // If the use has given a loading element render it
            if (_values.loadingText !== undefined) {
              // _loading(false);
            }

          } else if (httpRequest.status == 404) {
            // If the use has given a loading element render it
            aCallback('error');
          }
        };
        // Open the request to the url
        httpRequest.open('GET', aUrl, true);
        httpRequest.send(null);

        _debug('The GET request is send to:', aUrl);
      };
    } else {
      // Log that it does not work
      _debug('XMLHttpRequest is not available, so gSeach doesn\'t work', 'window.XMLHttpRequest is not available');

      return false;
    }
  };

  /**
   * Watch the input field and creates a request if the input has changed.
   */
  var _watchInput = function () {

    _selectId(_values.seachFieldId).addEventListener('input', function (e) {
      _debug('page', e.target.value);

      var client = new _GetData();

      // Create request
      client.get(_url(_values.apiKey, _values.cx, e.target.value), callback);

      function callback(data) {
        // Check if there is no error and if there ar items
        if (data !== false && data !== 'error' && data.items !== undefined) {
          _createAutocompleteList(data.items);
        } else {
          _selectId(_values.targetId).innerHTML = ''; // Clear the <ul/> element
        }
        if (_values.callback !== undefined) _values.callback();
      }
    });
  };

  /**
   * The setup of the search
   * @param   {Object}    All the parameters of the function
   */
  var autoComplete = function (data) {
    _values = data;

    window.onload = function (e) {
      _watchInput();
    };
  };

  return {
    autoComplete: autoComplete
  };

})();
