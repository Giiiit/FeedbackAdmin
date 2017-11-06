/**
 * Created by zx on 2016/9/14.
 */
'use strict';

angular.module('service')
    .factory('Login', ["$http", 'URL', 'ServiceHelper','AUTHORIZATION', function ($http, URL, ServiceHelper, AUTHORIZATION) {

        return {
            /***登录接口****/
            login: function ( data ) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'login' )
                })

            },
            /****登出*****/
            loginOut: function (data) {

                return $http({
                    method: 'GET',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'logout' )
                })

            },
            /****修改密码*****/
            updatePwd: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'updatePassword' )
                })

            }
        }

    }]);
