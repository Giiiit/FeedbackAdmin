/**
 * Created by zx on 2016/9/21.
 */
'use strict';

angular.module('service')
    .factory('Account', ["$http", 'URL', 'ServiceHelper', function ($http, URL, ServiceHelper) {

        return {
        /*****账户管理*****/
            getAccountList: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'accountList' )
                });

            },
            getAccountInfo: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'accountInfo' )
                });

            },
            addAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'addAccount' )
                });

            },
            updateAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'updateAccount' )
                });

            },
            delAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'delAccount' )
                });

            },
            startAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'startAccount' )
                });

            },
            stopAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'stopAccount' )
                });

            },
            resetAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'resetAccount' )
                });

            },
            changeAccountItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'changeAccount' )
                });

            }

        }

    }]);
