
(function () {
    angular.module('dss.services')
    	.factory('NgTableHelper', [
        '$log', 'ngTableParams', function ($log, ngTableParams) {
        	var _this = this;
        	
            var createNewInitParam = function () {
                return {
                    page: 1,
                    count: 5
                };
            };

            return {
                createTableParam: function (callback) {
                    _this.params = new ngTableParams(createNewInitParam(), {
                        total: 0,
                        getData: function ($defer, params) {
                            // 產生 Criteria 物件
                            var criteria = {
                                pageSize: params.count(),
                                pageIndex: params.page(),
                                sort: '',
                                order: ''
                            };

                            var filters = params.filter();
                            criteria = angular.extend(criteria, filters);

                            var sorting = params.sorting();
                            for (var k in sorting) {
                                criteria.sort = k;
                                criteria.order = sorting[k];
                            }

                            $log.debug(criteria);

                            callback.apply(_this, [$defer, criteria]);
                        }
                    });

                    return _this.params;
                }
            };
        }]);
})();
