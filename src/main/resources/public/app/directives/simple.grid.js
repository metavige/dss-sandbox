/**
 * New node file
 */
(function() {
    angular.module('dss.directives')
        .controller('SimpleGridController', ['$scope',
            function() {
                // 我自己作了一個 Helper Service 用來產生 Ng-Table 相關的參數，搭配後端查詢條件
                $scope.tableParams = ngTableHelper.createTableParam(function($defer, criteria) {
                    $scope.$emit('onGridFetch', $defer, criteria);
                });

                $scope.unselected = function(item) {
                    angular.forEach($scope.tableParams.data, function(value, key) {
                        if (value == item && item != $scope.$selectedItem)
                            return;
                        value.$selected = false;
                    });
                };

                $scope.$watch('$selectedItem', function(newData, oldData, scope) {
                    if (newData === null) {
                        $scope.$emit('onGridUnselect');
                    } else {
                        newData.$selected = true;
                        $scope.$emit('onGridSelect', newData);
                    }
                });

                $scope.selected = function(item) {
                    // 先取消全部的選項
                    $scope.unselected(item);

                    // 如果是選擇相同一項，表示取消
                    if ($scope.$selectedItem == item) {
                        $scope.$selectedItem = null;
                        return;
                    }

                    $scope.$selectedItem = item;
                };

                // 用來接聽 Grid 重新更新的事件
                $scope.$on('onGridRefresh', function(event) {
                    $scope.tableParams.reload();
                });

                // 這是用來處理當查詢頁面查詢出來的最後一頁資料，並沒有結果的時候
                // 就往前一頁顯示，但只有在第二頁之後需要這樣
                $scope.$watch('tableParams.data', function(newData, oldData, scope) {
                    $scope.$selectedItem = null;

                    //$log.debug('watch tableParams.data: ', arguments);
                    if (newData.length == 0) {
                        var currentPage = $scope.tableParams.page();
                        $log.debug('current page: ', currentPage);
                        if (currentPage > 1) {
                            $scope.tableParams.page(currentPage - 1);
                        }
                    }
                });
            }
        ])
        .directive('simpleGrid', [
            '$log', 'NgTableHelper',
            function($log, ngTableHelper) {
                return {
                    restrict: 'AC',
                    scope: {
                        crudService: '=',
                        name: '@'
                    },
                    controller: 'SimpleGridController'
                };
            }
        ]);
})();
