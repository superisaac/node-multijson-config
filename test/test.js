var assert = require('assert');
var multijson = require('../multijson');

describe('Multijson', function() {
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

});
