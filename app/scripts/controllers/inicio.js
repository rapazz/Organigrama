'use strict';

angular.module('organigramaApp')
  .controller('InicioCtrl', function ($scope,elasticFactory,configuration) {
        $scope.rut='';



        function toTitleCase(str)
        {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }



    var crearNodo = function (objcontactos,tipo)
    {


        for (var i=0; i<= objcontactos.length-1 ;i++)
        {
            var tips = "<p align='left'><b>Empresa:</b> <small>" +toTitleCase(objcontactos[i].fields.empresa[0]) +"</small><br><b>Anexo:</b> <small>"  +objcontactos[i].fields.anexo[0] + "</small><br><b>Ubicacion:</b><small> " +objcontactos[i].fields.faena[0] +"</small><br><b>Email:</b> <small>" + objcontactos[i].fields.email[0] + "</small></p>"
            var contenido =[];
            contenido.push({v: objcontactos[i].fields.rut[0].split("-")[0],  f:'' + '<table><tr><td align="center"><span style="sans-serif;font-weight: bold;font-size:10; font-style:italic">'+toTitleCase(objcontactos[i].fields.nombre[0])+'</span></td></tr><tr><td align="center" ><img   data-toggle="tooltip" data-placement="bottom" title="'+ tips+'"  src="'+ configuration.ServidorImagenes+ objcontactos[i].fields.rut[0] +'.jpg"  height="70px" width="80px" align="center"></a> </td></tr><tr><td align="center"><span style="font-weight: ;font-size:9">' +  objcontactos[i].fields.cargo[0]  +'<span></td></tr></table>'})
            if (tipo!='JEFE')
            contenido.push(objcontactos[i].fields.jefe[0].split("-")[0])
            else
            contenido.push('')
            contenido.push(objcontactos[i].fields.rut[0].split("-")[0])
            contenido.push(objcontactos[i].fields.jefe[0].split("-")[0])
            $scope.organigrama.push(contenido)

        }

    }



       $scope.primerOrganigrama = function(rut)
        {
            $scope.organigrama =[]

            if (rut==undefined)
            rut = $scope.rut.split('-')[0]
            elasticFactory.search(
                {
                    index: 'contactos',
                    size: 15,

                    body:
                    {
                        "fields" : ["nombre", "cargo","jefe","email","empresa","anexo","rut","faena"],
                        "query" : {
                            "filtered" : {
                                "query": {
                                    "match_all": {}
                                },
                                "filter" : {
                                    "term" : {
                                        rut:rut  // Presidencia
                                    }
                                }
                            }

                        }
                    }

                }).then(function (response) {
                    var   objcontactos = response.hits.hits;
                    var organigrama=[]

                    var primerNodo = new  crearNodo(objcontactos,'JEFE')
                    var  hijos = new cargarHijos(rut)



                }
            )


        }



var cargarHijos = function (padre)
{

    elasticFactory.search(
        {
            index: 'contactos',
            size: 1000,

            body:
            {
                "fields" : ["nombre", "cargo","jefe","email","empresa","anexo","rut","faena"],
                "query" : {
                    "filtered" : {
                        "query": {
                            "match_all": {}
                        },
                        "filter" : {
                            "term" : {
                                jefe:padre  // Presidencia
                            }
                        }
                    }

                }
            }

        }).then(function (response) {

            var el = document.getElementById('orgchart');
            var orgChart = new google.visualization.OrgChart(el);
            var   objcontactos = response.hits.hits;
            var Nodo = new  crearNodo(objcontactos,'')
            var data = new google.visualization.DataTable();
          //  var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('string', 'Manager');
            data.addColumn('string', 'id');
            data.addColumn('string', 'jefe');
          data.addRows($scope.organigrama);
            orgChart.draw(data,{allowHtml:true,nodeClass:'hulu-orgchart-node'});


            google.visualization.events.addListener(orgChart, 'select',
                function() {

                    var  row = orgChart.getSelection()[0].row
if (data.getValue(row,3)!='0')
                    if (data.getValue(row,1)=='')
                        $scope.primerOrganigrama(data.getValue(row,3))
                    else
                        $scope.primerOrganigrama(data.getValue(row,2))

                });

            angular.element(document).ready(function () {

               //$("img").popover({ trigger: "hover",html:true });
                $("img").tooltip({ trigger: "hover",html:true });


                /*
                 $(document).tooltip({
                     content: function () {
                         return $(this).prop('title');
                     },
                     show: null,
                     close: function (event, ui) {
                         ui.tooltip.hover(

                             function () {
                                 $(this).stop(true).fadeTo(400, 1);
                             },

                             function () {
                                 $(this).fadeOut("400", function () {
                                     $(this).remove();
                                 })
                             });
                     }
                 });
 */

            })

        }
    )




}








var x = new $scope.primerOrganigrama('12110661')



    });
