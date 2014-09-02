'use strict';

/**
 * @ngdoc function
 * @name dss.controllers:StationCtrl
 * @description
 * # StationCtrl
 * Controller of the dssApp
 */
angular.module('dss.controllers')
    .controller('StationCtrl', ['$scope', 'crud',
        function($scope, CRUDService) {

            $scope.routes = new CRUDService('routes');
            
            $scope.selectRoute = function(route) {
                $scope.routes.set(route.clone());
            };
            $scope.createRoute = function() {
                $scope.routes.set({
                	routeId: '',
                    name: '',
                    note: ''
                });
            };

            $scope.editStations = function(route) {
                $scope.stations = new CRUDService('routes/' + route.id + '/stations');
            };
            
            $scope.selectStation = function(station) {
                $scope.stations.set(station.clone());
            };
            $scope.createStation = function() {
                $scope.stations.set({
                	stationId: '',
                    name: '',
                    note: '',
                    sorting: 0
                });
            };

        }
    ]);
