EXAMPLE USAGE

```
var documentio = require('documentio');

sampleDefinition = {
  name : {
    first : "name",
    middle : "name",
    last : "name"
  },
  address : "address",
  age : {
    type : "age",
    range : [50, 75]
  },
  string : {
    type : "string",
    length : 10 // in words
  }
};

var options = {
  limit : 10
};

var results = documentio.generate(sampleDefinition, options);
```
