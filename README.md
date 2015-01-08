#setupNocks

setupNocks is a helper module that automates mocking of all routes in an Express.js app using [Nock](https://github.com/pgte/nock) so you can test all your routes in isolation. The module load each route in your app, make one call to the route, create a nock for each route, and then forward all future requests to each route to the nock saved in your local environment.

If your app has calls to an API or database that take a long time to run or count towards your request limit, mocking those requests keeps you from having to make those calls each time you run the test but still return valid results.

**Table of Contents**

- [Install](#install)
- [Use](#use)
- [Options](#options)
- [TODOs](#TODOs)

# Install

```sh
$ npm install setup-nocks
```

# Use

In your test folder, create a new file called setup.js and include the following template:

```js
(function() {

  var setupNocks = require('setup-nocks')

  setupNocks.options = {
    projectName: 'AwesomeApp',
    url: "http://awesomeapp.com",
    projectOptions:
      {
        test_folder: 'path/to/test',
        nock_file_path: 'path/to/nockFile.js'
      },
    params:
      {
        "post /users":
          {
            user: "test_user",
          },
        "post /authenticate":
          {
            token: "ADNs01042n308nSLienf1081fn0i43"
          },
      }
  };

  setupNocks.run();

})();
```

Fill out the options according to your preferences, and then run
```sh
$ npm mocha test/setup.js
```
to create your nocks. Then in your tests, just include 

```js
var setupNocks = require('setupNocks');

describe('YourApp', function() {

  var recorder = setupNocks.prototype.record('OperaLocal', {nock_file_path: 'fixtures/OperaLocal.js'});
  before(recorder.before);
  
  //all your tests here

};
```
and all your tests for your routes will now hit your nocks instead of actually going to the server, vastly decreasing test runtime and keeping API and database calls to a minimum!

# Options

In the setup.js, you have several customizable options:

<table>
  <tr>
    <td>Project Name</td><td>The name of the app you're testing</td>
  </tr>
  <tr>
    <td>url</td><td>URL for which you'd like to mock requests, which will almost always be the url for your app</td>
  </tr>
  <tr>
    <td>project_options</td><td>Links to the path of your test folder and the path to which you'd like your fixtures saved</td>
  </tr>
  <tr>
    <td>params</td><td>If you would like to specify params for any routes when they're first mocked, you can specify them here. Especially useful for POST requests to ensure you get the right data returned.</td>
  </tr>
</table>

# TODOs

- Scan entire app to see if there are any other calls that should be mocked outside of routes folder (i.e. routes called through Angular on the front end)
