var fs = require('fs');

/**
 * Build a nested js object from a flattern tuple "a.b.c.d" => [num|str]
 */
function build(path, val) {
  for(var i=path.length-1; i>=0; i--) {
    var key = path[i];
    var obj = (typeof key == 'number')?[]:{};
    obj[key] = val;
    val = obj;
  }
  return val;
}

/**
 * Build js object from a sequence of "a.b.c.d" => [num|str]
 */
function rebuild(config, path, val) {
  if(path.length == 1) {
    config[path[0]] = val;
    return;
  }
  var key = path.shift();
  var node = config[key];
  if(typeof node == 'object') {
    rebuild(node, path, val);
  } else {
    config[key] = build(path, val);
  }
}

/**
 * Parse a normal js object into a sequence of "a.b.c.d" => [num|str]
 */
function flatternObject(arr, path, data) {
  if(data instanceof Array) {
    arr.push({path: path, val: []});
    data.forEach(function(v, i) {
      flatternObject(arr, path.concat([i]), v);
    });
  } else if (typeof data == 'object') {
    for(var key in data) {
      var val = data[key];
      var npath = path.concat(key.split('.'));
      flatternObject(arr, npath, val);
    }
  } else {
    arr.push({path: path, val: data});
  }
  return arr;
}

function ConfigParser() {
  this.config = {};
}

ConfigParser.prototype.parseObject = function(obj) {
  var self = this;
  var arr = [];
  flatternObject(arr, [], obj);
  arr.forEach(function(t) {
    rebuild(self.config, t.path, t.val);
  });
};

ConfigParser.prototype.parseFile = function(fname) {
  var data = fs.readFileSync(fname);
  data = JSON.parse(data)
  this.parseObject(data);
};

module.exports.parseObjects = function() {
  var parser = new ConfigParser();
  for(var i=0; i<arguments.length; i++) {
    var data = arguments[i];
    parser.parseObject(data);
  }
  return parser.config;
};

module.exports.parseJSONFiles = function() {
  var parser = new ConfigParser();
  for(var i=0; i<arguments.length; i++) {
    var fn = arguments[i];
    if(fs.existsSync(fn)) {
      parser.parseFile(fn);
    }
  }
  return parser.config;
};

module.exports.ConfigParser = ConfigParser;

