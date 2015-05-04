var assert = require('assert');
var multijson = require('../multijson');

describe('Multijson', function() {
  it('simple test', function() {
    var config = {'mc': 1};
    var parser = new multijson.ConfigParser();
    parser.parseObject(config);

    var config1 = {'mc': 8};
    parser.parseObject(config1);
    console.info('config', parser.config);
    assert.equal(parser.config.mc, 8);
  });

  var cobj = {
    server: {
      host: 'localhost',
      port: 10008
    }
  };
  it('should change the port', function() {
    var config = multijson.parseObjects(cobj,
					 {
					   'server.port': 9999
					 });
    assert.equal(config.server.port, 9999);
  });

  it('should change the host to an array', function() {
    var config = multijson.parseObjects(cobj,
					 {
					   'server.port': 9999,
					   'server.host': ['192.168.0.1', '192.168.2.1'],
					 });
    assert.equal(config.server.port, 9999);
    assert.equal(config.server.host[0], '192.168.0.1');
    assert.equal(config.server.host[1], '192.168.2.1');
  });

  it('test config parser', function() {
    var parser = new multijson.ConfigParser();
    parser.parseObject({"a.b.c": 7, "a": {"b.d": 8}});
    assert.equal(parser.config.a.b.c, 7);
    parser.parseObject({"a": {"b.c": 9}});
    assert.equal(parser.config.a.b.c, 9);
    assert.equal(parser.config.a.b.d, 8);
  });

  it('should parse config files', function() {
    var config = multijson.parseJSONFiles('test/conf.json', 'test/conf1.json');
    assert.equal(config.a, 1);
  });

  it('should replace the old array with shorter new array', function() {
    var parser = new multijson.ConfigParser();
    parser.parseObject({"a.b": ["c", {"d": "f"}]});
    parser.parseObject({"a.b": ["e"]});
    assert.deepEqual(parser.config.a.b, ["e"]);
  });
});
