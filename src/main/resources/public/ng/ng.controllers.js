angular.module('app.controllers', [])
    .factory('settings', ['$rootScope',
        function ($rootScope) {
            // supported languages

            var settings = {
                languages: [{
                    language: 'English',
                    translation: 'English',
                    langCode: 'en-us',
                    flagCode: 'us'
                }, {
                    language: 'Simplified Chinese',
                    translation: '简体中文',
                    langCode: 'zh-cn',
                    flagCode: 'cn'
                }, {
                    language: 'Traditional Chinese',
                    translation: '繁體中文',
                    langCode: 'zh-tw',
                    flagCode: 'tw'
                }],

            };

            return settings;

        }
    ])

.controller('PageViewController', ['$scope', '$route', '$animate',
    function ($scope, $route, $animate) {
        // controler of the dynamically loaded views, for DEMO purposes only.
        /*$scope.$on('$viewContentLoaded', function() {

		});*/
        //console.log('$scope', $scope);
        // console.log('$route', $route);
        // pageSetUp();
    }
])

.controller('LangController', ['$scope', 'settings', 'localize',
    function ($scope, settings, localize) {
        $scope.languages = settings.languages;
        $scope.currentLang = settings.currentLang;
        $scope.setLang = function (lang) {
            settings.currentLang = lang;
            $scope.currentLang = lang;
            localize.setLang(lang);
        };

        // set the default language
        $scope.setLang($scope.currentLang);
    }
])

.filter('TrustHtml', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
}]);
