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

module.exports.parseObjects = function() {
  var arr = [];
  for(var i=0; i<arguments.length; i++) {
    var data = arguments[i];
    flatternObject(arr, [], data);        
  }
  var config = {};
  arr.forEach(function(t) {
    rebuild(config, t.path, t.val);
  });
  return config;
};

module.exports.parseJSONFiles = function() {
  var objList = [];
  for(var i=0; i<arguments.length; i++) {
    var fn = arguments[i];
    var data = fs.readFileSync(fn);
    data = JSON.parse(data);
    objList.push(data);
  }
  return module.exports.parseObjects.apply(this, objList);
};
