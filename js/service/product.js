/**
 * Created by zx on 2016/9/14.
 */
'use strict';

angular.module('service')
    .factory('Product', ["$http", 'URL', 'ServiceHelper', function ($http, URL, ServiceHelper) {

        return {
/*****产品目录*****/
            getProductList: function (data) {

                return $http({
                    method: 'GET',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'productList' )
                });

            },
            getProductInfo: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'productInfo' )
                });

            },
            delProductItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'delProduct' )
                });

            },
            addProductItem: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'addProduct' )
                });

            },
            editSaveProduct: function (data) {

                return $http({
                    method: 'POST',
                    data: ServiceHelper.wrapAuthorazation(data),
                    url: ServiceHelper.getURL( 'updateProduct' )
                });

            }

        }

    }]);
