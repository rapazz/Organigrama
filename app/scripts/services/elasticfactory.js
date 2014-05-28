'use strict';

angular.module('organigramaApp')
  .factory('elasticFactory', function(esFactory,configuration) {
        return esFactory({ host: configuration.servidorBackEnd })
    });
