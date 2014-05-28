'use strict';

angular.module('services.config', [])
  .constant('configuration', {
    imagenes: '@@imagenes',
    servidorBackEnd:  '@@servidorBackEnd'
  });
