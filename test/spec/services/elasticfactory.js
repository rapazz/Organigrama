'use strict';

describe('Service: elasticFactory', function () {

  // load the service's module
  beforeEach(module('organigramaApp'));

  // instantiate service
  var elasticFactory;
  beforeEach(inject(function (_elasticFactory_) {
    elasticFactory = _elasticFactory_;
  }));

  it('should do something', function () {
    expect(!!elasticFactory).toBe(true);
  });

});
