var app = {
  options: {},

  run: function() {
    var self = this;

    var recorder = self.prototype.record(self.options.projectName, self.options.projectOptions);

    before(recorder.before);
    var routes = self.options.routes || self.prototype.loadRoutes();
    var url = self.options.url
    for (var i = 0; i < routes.length; i++) {
      for (var j = 0; j < routes[i].stack.length; j++) {

        var verb = Object.keys(routes[i].stack[j].route.methods)[0];
        var uri = routes[i].stack[j].route.path;
        var params = self.options.params[verb + " " + uri] || {};

        self.prototype.setRoute(url, verb, uri, params);
      };
    };
    after(recorder.after);
  }

};

app.prototype = {

  request: require('supertest'),

  record: require('./record'),

  fs: require("fs"),

  path: require('path').join(__dirname, "../../routes/"),

  setRoute: function(url, verb, uri, params) {
    var self = this;
    if (verb == "get") {
      it('sets up the route ' + verb + " " + uri, function (done) {
        call = self.request(url)
          .get(uri)
          .send(params)
          .end(function(err, res) {
            return res;
        });
      });
    } else if (verb == "post") {
      it('sets up the route ' + verb + " " + uri, function (done) {
        call = self.request(url)
          .post(uri)
          .send(params)
          .end(function(err, res) {
            return res;
          });
      });
    } else if (verb == "put") {
      it('sets up the route ' + verb + " " + uri, function (done) {
        call = self.request(url)
          .put(uri)
          .send(params)
          .end(function(err, res) {
            return res;
        });
      });
    } else if (verb == "delete") {
      it('sets up the route ' + verb + " " + uri, function (done) {
        call = self.request(url)
          .delete(uri)
          .send(params)
          .end(function(err, res) {
            return res;
          });
      });
    };
  },

  loadRoutes: function() {
    var self = this;
    var output = [];
    self.fs.readdirSync(self.path).forEach(function(file) {
      output.push(require(self.path + file));
    });
    return output;
  }

};

module.exports = app;