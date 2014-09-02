// Define App Inject
angular.module('dssApp', [
    'ngRoute',
    //'ngTouch',
    'ngTable',
    'restangular',
    'ngAnimate', 
    'ui.bootstrap',
    // === application core
    'app.controllers',
    'app.main',
    'app.navigation',
    'app.localize',
    // add dss application js
    'dss.directives',
    'dss.controllers',
    'dss.services'
]);

// Define App Config
angular.module('dssApp')
    .config(['$routeProvider', '$provide', '$locationProvider',
        function ($routeProvider, $provide, $locationProvider) {
    		 $locationProvider.html5Mode(true);
    	
            $routeProvider
                .when('/', {
                    redirectTo: '/station'
                })
                .when('/:page/', {
                    // we can enable ngAnimate and implement the fix here, but it's a bit laggy
                    templateUrl: function ($routeParams) {
                        return '/views/' + $routeParams.page + '.html';
                    },
                    controller: 'PageViewController'
                })
                .when('/:page/:child/', {
                    templateUrl: function ($routeParams) {
                        return '/views/' + $routeParams.page + '/' + $routeParams.child + '.html';
                    }/*,
                    controller: 'PageViewController'*/
                })
                .otherwise({
                    redirectTo: '/station'
                });


            // with this, you can use $log('Message') same as $log.info('Message');
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                // create a new function to be returned below as the $log service (instead of the $delegate)
                function logger() {
                    // if $log fn is called directly, default to "info" message
                    logger.info.apply(logger, arguments);
                }
                // add all the $log props into our new logger fn
                angular.extend(logger, $delegate);
                return logger;
            }]);

        }
    ])
    .config(['RestangularProvider', function (restangularProvider) {
        restangularProvider.setBaseUrl('/api'); 
    }]);