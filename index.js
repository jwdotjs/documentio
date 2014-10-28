var _ = require('lodash');

var samples = require('./samples');

var DEFAULT_LIMIT = 1;

function generate(sampleDefinition, options) {
  var generatedRows = [];

  if (! options) {
    options = [];
  }

  if (! options.limit || isNaN(options.limit) || options.limit < 0) {
    options.limit = DEFAULT_LIMIT;
  }

  _.times(options.limit, function() {
    var generatedRow = {};
    _.each(sampleDefinition, function(fieldOptions, fieldName) {
      generatedRow[fieldName] = recurseUserDefinition(sampleDefinition, fieldOptions);
    });

    generatedRows.push(generatedRow);
  });

  return generatedRows;
}

function recurseUserDefinition(sampleDefinition, fieldOptions) {
  if (_.isEmpty(fieldOptions)) {
    return false;
  }

  var fetchedSample = {};

  if (_.isString(fieldOptions)) {
    return fetchSample(fieldOptions);
  } else if (fieldOptions.type) {
    var parameters = _.omit(fieldOptions, 'type');
    return fetchSample(fieldOptions.type, parameters); // pick parameters from the object later
  } else if (_.isObject(fieldOptions)) {
    var row = {};
    var nestedSampleDefinition = fieldOptions; // assume its a nested object
    _.each(nestedSampleDefinition, function (newFieldOptions, newFieldName) {
      row[newFieldName] = recurseUserDefinition(nestedSampleDefinition, newFieldOptions);
    });

    return row;
  }

  return fetchedSample;
}

function fetchSample(type, parameters) {
  if (typeof parameters === 'undefined') {
    parameters = [];
  }

  switch(type) {
    case 'name':
      return samples.names[_.random(0, samples.names.length)];
    case 'age':
      var startAge = parameters.range[0] ? parameters.range[0] : 1;
      var endAge = parameters.range[1] ? parameters.range[1] : 100;

      return _.random(startAge, endAge);
    case 'weight':
      var startWeight = parameters.range[0] ? parameters.range[0] : 1;
      var endWeight = parameters.range[1] ? parameters.range[1] : 300;
      return _.random(startWeight, endWeight);
    case 'state':
      return _.sample(_.values(samples.states));
    case 'stateAbbreviation':
      return _.sample(_.keys(samples.states));
    case 'address':
      var address = _.random(1, 10000) + ' ' +
                    _.sample(samples.cardinalDirections) + ' ' +
                    _.sample(samples.streetNames) + ' ' +
                    _.sample(samples.streetTypes);
      if(_.random(0, 500) > 400) {
        address += ' #' + _.random(1, 300);
      }
      return address;
    case 'phone':
      return '(' + _.random(100, 999) + ') ' +
             _.random(100, 999) + '-' +
             _.random(1000, 9999);
    case 'integer':
    case 'number':
      var startNumber = parameters.range[0] ? parameters.range[0] : 0;
      var endNumber = parameters.range[1] ? parameters.range[1] : 100000;
      return _.random(startNumber, endNumber);
    case 'string':
    case 'text':
      var words = samples.baconIpsum.split(' ');
      var wordCount = words.length;
      var randomLength = parameters.length && parameters.length <= wordCount ?
                         _.parseInt(parameters.length) : _.random(1, wordCount);
      var finalText = '';
      for(var i = 0; i < randomLength; i++) {
        finalText += words[i];
        if(i + 1 !== randomLength) {
          finalText += ' ';
        } else {
          finalText += '...';
        }
      }
      return finalText;
  }
}

module.exports = {
  generate : generate
};
