'use strict';

(function() {
    angular.module('dss.services')
        .factory('RouteStationService', ['Restangular',
            function(restangular) {
                var routeService = restangular.service('routes');

                return {
                    getRoutes: function() {
                        return routeService.getList();
                    }
                };
            }
        ]);
})();
