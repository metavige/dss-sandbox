'use strict';

/**
 * @ngdoc service
 * @name dss.services.crud
 * @description
 * # crud
 * Service in the dssApp.
 */
angular.module('dss.services')
    .factory('crud', ['Restangular', 'ngTableParams',
        function crud(restangular, NgTableParams) {

            var CRUDService = (function() {
                function CRUDService(serviceApi) {
                    //   this.dataStore = data;
                	this.dataService = restangular.service(serviceApi);
                	this.current = null;

                	this.load();
                }
                CRUDService.prototype.set = function(data) {
                	this.current = data;
                };
                CRUDService.prototype.load = function() {
                	var _this = this; 
                	_this.dataService.getList().then(function(data) {
                		_this.dataStore = data;

                		_this.tableParams = new NgTableParams({
                            page: 1,
                            count: 10
                        }, {
                            counts: [],
                            total: _this.dataStore.length, // length of data
                            getData: function($defer, params) {
                                $defer.resolve(_this.dataStore.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                    });
                    
                };
                CRUDService.prototype.remove = function(data) {
                	var _this = this;
                    data.remove().then(function() {
                        // message?
                        console.log('removed', arguments);

                        // reload data
                        _this.load();
                    });
                };
                CRUDService.prototype.save = function() {
                    var _this = this;
                    if (this.current.id) {
                        this.current.save().then(function(data) {
                            console.log('updated', arguments);
                            for (var idx in _this.dataStore) {
                                if (angular.equals(_this.dataStore[idx].id, _this.current.id)) {
                                	_this.dataStore[idx] = data;
                                    break;
                                }
                            }
                            
                            _this.current = null;
                            _this.load();
                        }, function(response) {
                            // Error handle
                        	console.log('updated error', arguments);
                        });

                        // for (var idx in this.dataStore) {
                        //     if (angular.equals(this.dataStore[idx].id, this.current.id)) {
                        //         this.dataStore[idx] = this.current;
                        //         break;
                        //     }
                        // }
                    } else {
                        this.dataService.post(this.current).then(function() {
                            console.log('created', arguments);

                            _this.load();
                            _this.current = null;
                        }, function(response) {
                            // Error handle
                        });
                        // this.current.id = this.dataStore[this.dataStore.length - 1].id + 1;
                        // this.dataStore.push(this.current);
                    }

                };
                return CRUDService;
            })();

            return CRUDService;
        }
    ]);
