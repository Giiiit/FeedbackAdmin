/**
 * Created by ZX on 2016/9/25.
 */
'use strict';

angular.module('service')
    .factory('Problem', ["$http", 'URL', 'ServiceHelper','AUTHORIZATION', function ($http, URL, ServiceHelper, AUTHORIZATION) {

        return {
            /***问题列表****/
            problemList: function ( data ) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'problemlist' )
                })

            },
            /****问题信息*****/
            problemInfo: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'probleminfo' )
                })

            },
            /****新增问题*****/
            addProblem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'addproblem' )
                })

            },
            /****删除问题*****/
            delProblem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'deleteproblem' )
                })

            },
            /****新增回复*****/
            addReply: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'addreply' )
                })

            },
            /****删除回复*****/
            delReply: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'deletereply' )
                })

            },
            /****设置问题状态*****/
            setState: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'setstate' )
                })

            },
            /****获取问题文件*****/
            getProblemFile: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'getproblemfile' )
                })

            },
            /****获取回复文件*****/
            getReplyFile: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'getreplyfile' )
                })

            }
        }

    }]);