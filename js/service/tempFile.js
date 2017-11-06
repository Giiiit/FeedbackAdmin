/**
 * Created by zx on 2016/9/21.
 */
'use strict';

angular.module('service')
    .factory('TempFile', ["$http", 'URL', 'ServiceHelper', function ($http, URL, ServiceHelper) {

        return {

            getTempFile: function (data) {

                return $http({
                    method: 'GET',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'getTFile' )
                });

            },
            addTempFile: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'addTFile' )
                });

            }

        }

    }]);
