'use strict';

angular
  .module('organigramaApp', [
    'ngRoute','elasticsearch','services.config'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/inicio.html',
        controller: 'InicioCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
google.load('visualization', '1', {'packages' : ['orgchart']});
