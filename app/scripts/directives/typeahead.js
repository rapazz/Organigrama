'use strict';

angular.module('organigramaApp')
    .directive('typeahead', function(elasticFactory,$timeout) {

        return {
            restrict: 'AEC',
            scope: {
                items: '=',
                prompt:'@',
                nombre: '@',
                cargo:'@',
                codigo:'=',
                model: '=',
                onSelect:'&'
            },
            link:function(scope,elem,attrs){

                scope.handleSelection=function(selectedItem){



                    scope.current=0;
                    scope.selected=true;
                    scope.codigo=selectedItem
                    $timeout(function(){

                        scope.onSelect(selectedItem);

                    },200);
                };
                scope.current=0;
                scope.selected=true;
                scope.isCurrent=function(index){

                    return scope.current==index;
                };
                scope.autocomplete =function(index)
                {

if (scope.model !=undefined)
                    if (scope.model.length > 2)
                    elasticFactory.search(
                        {
                            index: 'kcc',
                            size: 15,
                            body: {
                                "fields" : ["nombre", "cargo","jefe"],
                                "query": {

                                    "multi_match": {
                                        "query" : scope.model,
                                        "fields" : [ "nombre^2", "cargo" ]
                                    }
                                }
                            }

                        }).then(function (response) {
                            scope.items = response.hits.hits;
                        }
                    )


                }
                scope.setCurrent=function(index){

                    scope.current=index;
                };
            },
            templateUrl: 'views/templateurl.html'
        }
    });
