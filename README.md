multijson-config
========

A smart way to merge multile JSON config files/objects into a single config object

Author: superisaac.ke@gmail.com

Install
========

```
npm install multijson-config
```

Examples
========

```
var multijson = require('multijson-config')
var config = multijson.parseJSONFiles('config.default.json', 'config1.json', 'config2.json')
```

How it works
========

Normally it parses a chain of JSON config files. But the dot separated key can be interpreted as nested objects

```
{
  "a.b.c.d": 100
}	
```
is equal to the standard JSON object
```
{
   "a": {"b": {"c": {"d": 100}}}
}
```

By adding the above role, JSON configs can replace the prior default values.



