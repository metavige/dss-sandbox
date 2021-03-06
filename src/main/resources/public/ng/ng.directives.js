// APP DIRECTIVES
// main directives
angular.module('app.main', [])
// initiate body
.directive('body', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            element.on('click', 'a[href="#"], [data-toggle]', function (e) {
                e.preventDefault();
            });
        }
    };
})
.factory('ribbon', ['$rootScope',
	function ($rootScope) {
	    var ribbon = {
	        currentBreadcrumb: [],
	        updateBreadcrumb: function (crumbs) {
	            crumbs.push('Home');
	            var breadCrumb = crumbs.reverse();
	            ribbon.currentBreadcrumb = breadCrumb;
	            $rootScope.$broadcast('navItemSelected', breadCrumb);
	        }
	    };

	    return ribbon;
	}
])
.directive('action', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            /*
			 * SMART ACTIONS
			 */
            var smartActions = {

                // LOGOUT MSG 
                userLogout: function ($this) {

                    // ask verification
                    $.SmartMessageBox({
                        title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
                        content: $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
                        buttons: '[No][Yes]'

                    }, function (ButtonPressed) {
                        if (ButtonPressed == "Yes") {
                            $.root_.addClass('animated fadeOutUp');
                            setTimeout(logout, 1000);
                        }
                    });

                    function logout() {
                        window.location = $this.attr('href');
                    }

                },

                // RESET WIDGETS
                resetWidgets: function ($this) {
                    $.widresetMSG = $this.data('reset-msg');

                    $.SmartMessageBox({
                        title: "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
                        content: $.widresetMSG || "Would you like to RESET all your saved widgets and clear LocalStorage?",
                        buttons: '[No][Yes]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed == "Yes" && localStorage) {
                            localStorage.clear();
                            location.reload();
                        }

                    });
                },

                // MINIFY MENU
                minifyMenu: function ($this) {
                    if (!$.root_.hasClass("menu-on-top")) {
                        $.root_.toggleClass("minified");
                        $.root_.removeClass("hidden-menu");
                        $('html').removeClass("hidden-menu-mobile-lock");
                        $this.effect("highlight", {}, 500);
                    }
                },

                // TOGGLE MENU 
                toggleMenu: function () {
                    if (!$.root_.hasClass("menu-on-top")) {
                        $('html').toggleClass("hidden-menu-mobile-lock");
                        $.root_.toggleClass("hidden-menu");
                        $.root_.removeClass("minified");
                    } else if ($.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated")) {
                        $('html').toggleClass("hidden-menu-mobile-lock");
                        $.root_.toggleClass("hidden-menu");
                        $.root_.removeClass("minified");
                    }
                }

            };

            var actionEvents = {
                userLogout: function (e) {
                    smartActions.userLogout(element);
                },
                resetWidgets: function (e) {
                    smartActions.resetWidgets(element);
                },
                minifyMenu: function (e) {
                    smartActions.minifyMenu(element);
                },
                toggleMenu: function (e) {
                    smartActions.toggleMenu();
                }
            };

            if (angular.isDefined(attrs.action) && attrs.action != '') {
                var actionEvent = actionEvents[attrs.action];
                if (typeof actionEvent === 'function') {
                    element.on('click', function (e) {
                        actionEvent(e);
                        e.preventDefault();
                    });
                }
            }

        }
    };
})
.directive('header', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            // SHOW & HIDE MOBILE SEARCH FIELD
            angular.element('#search-mobile').click(function () {
                $.root_.addClass('search-mobile');
            });

            angular.element('#cancel-search-js').click(function () {
                $.root_.removeClass('search-mobile');
            });
        }
    };
})
.controller('breadcrumbController', ['$scope',
	function ($scope) {
	    $scope.breadcrumbs = [];
	    $scope.$on('navItemSelected', function (name, crumbs) {
	        $scope.setBreadcrumb(crumbs);
	    });

	    $scope.setBreadcrumb = function (crumbs) {
	        $scope.breadcrumbs = crumbs;
	    };
	}
])
.directive('breadcrumb', ['ribbon', 'localize', '$compile',
	function (ribbon, localize, $compile) {
	    return {
	        restrict: 'AE',
	        controller: 'breadcrumbController',
	        replace: true,
	        link: function (scope, element, attrs) {
	            scope.$watch('breadcrumbs', function (newVal, oldVal) {
	                if (newVal !== oldVal) {
	                    // update DOM
	                    scope.updateDOM();
	                }
	            });
	            scope.updateDOM = function () {
	                element.empty();
	                angular.forEach(scope.breadcrumbs, function (crumb) {
	                    var li = angular.element('<li data-localize="' + crumb + '">' + crumb + '</li>');
	                    li.text(localize.localizeText(crumb));

	                    $compile(li)(scope);
	                    element.append(li);
	                });
	            };

	            // set the current breadcrumb on load
	            scope.setBreadcrumb(ribbon.currentBreadcrumb);
	            scope.updateDOM();
	        },
	        template: '<ol class="breadcrumb"></ol>'
	    };
	}
]);

// directives for localization
angular.module('app.localize', [])
	.factory('localize', ['$http', '$rootScope', '$window',
		function ($http, $rootScope, $window) {
		    var localize = {
		        currentLocaleData: {},
		        currentLang: {},
		        setLang: function (lang) {
		            // 取得多國語系資料
		            $http({
		                method: 'GET',
		                url: localize.getLangUrl(lang),
		                cache: false
		            }).success(function (data) {
		                localize.currentLocaleData = data;
		                localize.currentLang = lang;
		                $rootScope.$broadcast('localizeLanguageChanged');
		            }).error(function (data) {
		                console.log('Error updating language!');
		            });
		        },
		        getLangUrl: function (lang) {
		            return 'Scripts/langs/' + lang.langCode + '.js';
		        },
		        localizeText: function (sourceText) {
		            var v = localize.currentLocaleData[sourceText];
		            return (v == null) ? sourceText : v;
		        }
		    };

		    return localize;
		}
	])
	.directive('localize', ['localize',
	function (localize) {
	    return {
	        restrict: 'A',
	        scope: {
	            sourceText: '@localize'
	        },
	        link: function (scope, element, attrs) {
	            var changeLocaleText = function () {
	                var localizedText = localize.localizeText(scope.sourceText);
	                if (element.is('input, textarea')) element.attr('placeholder', localizedText);
	                else element.text(localizedText);
	            };
	            //接聽語系變更的事件，用來重新輸出所有的多國語言資料
	            scope.$on('localizeLanguageChanged', changeLocaleText);
	            changeLocaleText();
	        }
	    };
	}
	]);

// directives for navigation
angular.module('app.navigation', [])
	.controller('navigationController', ['$scope',
		function ($scope) {
		    console.log('navigation $scope', $scope);
		}
	])
	.directive('navigation', function () {
	    return {
	        restrict: 'AE',
	        controller: 'navigationController',
	        transclude: true,
	        replace: true,
	        link: function (scope, element, attrs) {

	            // SLIMSCROLL FOR NAV
	            if ($.fn.slimScroll) {
	                element.slimScroll({
	                    height: '100%'
	                });
	            }

	            $('<li class="nav-header">Main</li>').insertBefore(element.children().first());
	            
	            scope.getElement = function () {
	                return element;
	            };

	        },
	        template: '<ul class="nav nav-pills nav-stacked main-menu" data-ng-transclude=""></ul>'
	    };
	})
	.controller('NavGroupController', ['$scope',
		function ($scope) {
		    $scope.active = false;
		    $scope.hasIcon = angular.isDefined($scope.icon);
		    $scope.hasIconCaption = angular.isDefined($scope.iconCaption);

		    this.setActive = function (active) {
		        $scope.active = active;
		    };

		}
	])
	.directive('navGroup', function () {
	    return {
	        restrict: 'AE',
	        controller: 'NavGroupController',
	        transclude: true,
	        replace: true,
	        scope: {
	            icon: '@',
	            title: '@',
	            iconCaption: '@',
	            active: '=?'
	        },
	        template: '\
					<li data-ng-class="{active: active}">\
						<a href="">\
							<i data-ng-if="hasIcon" class="{{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
							<span class="menu-item-parent" data-localize="{{ title }}">{{ title }}</span>\
						</a>\
						<ul data-ng-transclude=""></ul>\
					</li>',

	    };
	})
	.controller('NavItemController', ['$rootScope', '$scope', '$location',
		function ($rootScope, $scope, $location) {
		    $scope.isChild = false;
		    $scope.active = false;
		    $scope.isActive = function (viewLocation) {
		        $scope.active = (viewLocation === $location.path() || (viewLocation + '/') === $location.path());
		        return $scope.active;
		    };

		    $scope.hasIcon = angular.isDefined($scope.icon);
		    $scope.hasIconCaption = angular.isDefined($scope.iconCaption);

		    $scope.getItemUrl = function (view) {
		        if (angular.isDefined($scope.href)) return $scope.href;
		        if (!angular.isDefined(view)) return '';
		        return '#' + view;
		    };

		    $scope.getItemTarget = function () {
		        return angular.isDefined($scope.target) ? $scope.target : '_self';
		    };

		}
	])
	.directive('navItem', ['ribbon', '$window', 'localize',
		function (ribbon, $window, localize) {
		    return {
		        require: ['^navigation', '^?navGroup'],
		        restrict: 'AE',
		        controller: 'NavItemController',
		        scope: {
		            title: '@',
		            view: '@',
		            icon: '@',
		            iconCaption: '@',
		            href: '@',
		            target: '@'
		        },
		        link: function (scope, element, attrs, parentCtrls) {
		            var navCtrl = parentCtrls[0],
						navgroupCtrl = parentCtrls[1];

		            scope.$watch('active', function (newVal, oldVal) {
		                if (newVal) {
		                    if (angular.isDefined(navgroupCtrl)) navgroupCtrl.setActive(true);
		                    $window.document.title = localize.localizeText(scope.title);
		                    scope.setBreadcrumb();
		                } else {
		                    if (angular.isDefined(navgroupCtrl)) navgroupCtrl.setActive(false);
		                }
		            });

		            // 20140812 Ricky 接聽事件，當變更多國語言時也順便變更標題
                    // 但是只有 active 的要變更，不然會有錯誤
		            scope.$on('localizeLanguageChanged', function () {
		                if (scope.active) {
		                    $window.document.title = localize.localizeText(scope.title);
		                }
		            });

		            scope.openParents = scope.isActive(scope.view);
		            scope.isChild = angular.isDefined(navgroupCtrl);

		            scope.setBreadcrumb = function () {
		                var crumbs = [];
		                crumbs.push(scope.title);
		                // get parent menus
		                var test = element.parents('nav li').each(function () {
		                    var el = angular.element(this);
		                    var parent = el.find('.menu-item-parent:eq(0)');
		                    crumbs.push(parent.data('localize').trim());
		                    if (scope.openParents) {
		                        // open menu on first load
		                        parent.trigger('click');
		                    }
		                });
		                // this should be only fired upon first load so let's set this to false now
		                scope.openParents = false;
		                ribbon.updateBreadcrumb(crumbs);
		            };

		            element.on('click', 'a[href!="#"]', function () {
		                if ($.root_.hasClass('mobile-view-activated')) {
		                    $.root_.removeClass('hidden-menu');
		                }
		            });

		        },
		        transclude: true,
		        replace: true,
		        template: '\
					<li data-ng-class="{active: isActive(view)}">\
						<a href="{{ getItemUrl(view) }}" target="{{ getItemTarget() }}" title="{{ title }}">\
							<i data-ng-if="hasIcon" class="{{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
							<span ng-class="{\'menu-item-parent\': !isChild}" data-localize="{{ title }}"> {{ title }} </span>\
							<span data-ng-transclude=""></span>\
						</a>\
					</li>'
		    };
		}]);

// directives for activity
angular.module('app.activity', [])
	.controller('ActivityController', ['$scope', '$http',
		function ($scope, $http) {
		    var ctrl = this,
				items = ctrl.items = $scope.items = [];

		    ctrl.loadItem = function (loadedItem, callback) {
		        angular.forEach(items, function (item) {
		            if (item.active && item !== loadedItem) {
		                item.active = false;
		                //item.onDeselect();
		            }
		        });

		        loadedItem.active = true;
		        if (angular.isDefined(loadedItem.onLoad)) {
		            loadedItem.onLoad(loadedItem);
		        }

		        $http.get(loadedItem.src).then(function (result) {
		            var content = result.data;
		            if (angular.isDefined(callback)) {
		                callback(content);
		            }
		        });
		    };

		    ctrl.addItem = function (item) {
		        items.push(item);
		        if (!angular.isDefined(item.active)) {
		            // set the default
		            item.active = false;
		        } else if (item.active) {
		            ctrl.loadItem(item);
		        }
		    };

		    ctrl.refresh = function (e) {
		        var btn = angular.element(e.currentTarget);
		        btn.button('loading');

		        if (angular.isDefined($scope.onRefresh)) {
		            $scope.onRefresh($scope, function () {
		                btn.button('reset');
		            });
		        } else {
		            btn.button('reset');
		        }
		    };
		}
	])

.directive('activity', function () {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        controller: 'ActivityController',
        scope: {
            onRefresh: '=onrefresh',
        },
        template: '<span data-ng-transclude=""></span>'
    };
})

.directive('activityButton', function () {
    return {
        restrict: 'AE',
        require: '^activity',
        replace: true,
        transclude: true,
        controller: function ($scope) {

        },
        scope: {
            icon: '@',
            total: '='
        },
        template: '\
					<span id="activity" class="activity-dropdown">\
						<i ng-class="icon"></i>\
						<b class="badge"> {{ total }} </b>\
					</span>',
        link: function (scope, element, attrs, activityCtrl) {

            attrs.$observe('icon', function (value) {
                if (!angular.isDefined(value))
                    scope.icon = 'fa fa-user';
            });

            element.on('click', function (e) {
                var $this = $(this);

                if ($this.find('.badge').hasClass('bg-color-red')) {
                    $this.find('.badge').removeClassPrefix('bg-color-');
                    $this.find('.badge').text("0");
                    // console.log("Ajax call for activity")
                }

                if (!$this.next('.ajax-dropdown').is(':visible')) {
                    $this.next('.ajax-dropdown').fadeIn(150);
                    $this.addClass('active');
                } else {
                    $this.next('.ajax-dropdown').fadeOut(150);
                    $this.removeClass('active');
                }

                var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
                //console.log(mytest)

                e.preventDefault();
            });

            if (scope.total > 0) {
                var $badge = element.find('.badge');
                $badge.addClass("bg-color-red bounceIn animated");
            }
        }
    };
})

.controller('ActivityContentController', ['$scope',
	function ($scope) {
	    var ctrl = this;
	    $scope.currentContent = '';
	    ctrl.loadContent = function (content) {
	        $scope.currentContent = content;
	    };
	}
])

.directive('activityContent', ['$compile',
	function ($compile) {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        require: '^activity',
	        replace: true,
	        scope: {
	            footer: '=?'
	        },
	        controller: 'ActivityContentController',
	        template: '\
				<div class="ajax-dropdown">\
					<div class="btn-group btn-group-justified" data-toggle="buttons" data-ng-transclude=""></div>\
					<div class="ajax-notifications custom-scroll">\
						<div class="alert alert-transparent">\
							<h4>Click a button to show messages here</h4>\
							This blank page message helps protect your privacy, or you can show the first message here automatically.\
						</div>\
						<i class="fa fa-lock fa-4x fa-border"></i>\
					</div>\
					<span> {{ footer }}\
						<button type="button" data-loading-text="Loading..." data-ng-click="refresh($event)" class="btn btn-xs btn-default pull-right" data-activty-refresh-button="">\
						<i class="fa fa-refresh"></i>\
						</button>\
					</span>\
				</div>',
	        link: function (scope, element, attrs, activityCtrl) {
	            scope.refresh = function (e) {
	                activityCtrl.refresh(e);
	            };

	            scope.$watch('currentContent', function (newContent, oldContent) {
	                if (newContent !== oldContent) {
	                    var el = element.find('.ajax-notifications').html(newContent);
	                    $compile(el)(scope);
	                }
	            });
	        }
	    };
	}
])

.directive('activityItem', function () {
    return {
        restrict: 'AE',
        require: ['^activity', '^activityContent'],
        scope: {
            src: '=',
            onLoad: '=onload',
            active: '=?'
        },
        controller: function () {

        },
        transclude: true,
        replace: true,
        template: '\
				<label class="btn btn-default" data-ng-click="loadItem()" ng-class="{active: active}">\
					<input type="radio" name="activity">\
					<span data-ng-transclude=""></span>\
				</label>',
        link: function (scope, element, attrs, parentCtrls) {
            var activityCtrl = parentCtrls[0],
				contentCtrl = parentCtrls[1];

            scope.$watch('active', function (active) {
                if (active) {
                    activityCtrl.loadItem(scope, function (content) {
                        contentCtrl.loadContent(content);
                    });
                }
            });
            activityCtrl.addItem(scope);

            scope.loadItem = function () {
                scope.active = true;
            };
        }
    };
});
