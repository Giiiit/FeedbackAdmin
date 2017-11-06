/**
 * Created by zx on 2016/9/18.
 */
'use strict';

angular.module('service')
    .factory('Customer', ["$http", 'URL', 'ServiceHelper', function ($http, URL, ServiceHelper) {

        return {
/*****客户管理*****/
            getCustomerList: function (data) {

                return $http({
                    method: 'GET',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'customerList' )
                });

            },
            getCustomerInfo: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'customerInfo' )
                });

            },
            delCustomerItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'delCustomer' )
                });

            },
            addCustomerItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'addCustomer' )
                });

            },
            editSaveCustomer: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'updateCustomer' )
                });

            },
            editSaveFile: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'updateFile' )
                });

            },
            getSaveFile: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'getFile' )
                });

            }

        }

    }]);
