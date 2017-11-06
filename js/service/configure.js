'use strict';

angular.module('service', ['ngCookies'])
    .config(function ($httpProvider) {

        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

        $httpProvider.defaults.transformRequest = [function (data) {
            /***
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             **/
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
        }];
    })
    .constant('AUTHORIZATION',{
        url: {
            // 登录
            login: '/public/login.do',
            logout:'/public/logout.do',
            updatePassword:'/public/changeuserpassword.do',
            // 产品
            productList:'/productcatalog/list.do',
            productInfo:'/productcatalog/info.do',
            delProduct:'/productcatalog/delete.do',
            addProduct:'/productcatalog/add.do',
            updateProduct:'/productcatalog/update.do',
            // 客户管理
            customerList:'/customer/list.do',
            customerInfo:'/customer/info.do',
            delCustomer:'/customer/delete.do',
            addCustomer:'/customer/add.do',
            updateCustomer:'/customer/update.do',
            updateFile:'/customer/updatefile.do',
            getFile:'/customer/getfile.do',
            // 临时文件
            getTFile:'/tempfile/getfile.do',
            addTFile:'/tempfile/uploadfile.do',
            // 账号管理
            accountList:'/user/list.do',
            accountInfo:'/user/info.do',
            addAccount:'/user/add.do',
            updateAccount:'/user/update.do',
            delAccount:'/user/delete.do',
            startAccount:'/user/start.do',
            stopAccount:'/user/stop.do',
            resetAccount:'/user/resetuserpassword.do',
            changeAccount:'/user/updateusercontact.do',
            // 问题反馈
            problemlist:'/problemfeedback/list.do',
            probleminfo:'/problemfeedback/info.do',
            addproblem:'/problemfeedback/add.do',
            deleteproblem:'/problemfeedback/delete.do',
            addreply:'/problemfeedback/addreply.do',
            deletereply:'/problemfeedback/deletereply.do',
            setstate:'/problemfeedback/setstate.do',
            getproblemfile:'/problemfeedback/getproblemfeedbackfile.do',
            getreplyfile:'/problemfeedback/getproblemreplyfile.do'

        }
    })
   .constant('URL', '/problem/do/system')        //本地
    .constant('PAGE_SIZE', 20)
    .constant('DATE_FORMAT', 'YYYY-MM-DD')
    .constant('DATE_FORMAT_MINUTE', 'YYYY-MM-DD HH:mm:ss')

    .factory('ServiceHelper', ['URL', 'AUTHORIZATION','$cookies', function (URL, AUTHORIZATION,$cookies) {

        if ( !AUTHORIZATION.sessionId ) {
            AUTHORIZATION.sessionId = $cookies.get( 'sessionId' );
        }
        if ( !AUTHORIZATION.userName ) {
            AUTHORIZATION.userName = $cookies.get( 'userName' );
        }

        return {
            setSessionId: function (sessionId) {

                AUTHORIZATION.sessionId = sessionId;

            },
            wrapAuthorazation: function (data) {

                if (!data) {
                    data = {};
                }
                return data;

            },

            getURL: function ( token, session ) {
                if ( !AUTHORIZATION.url[ token ] ) {
                    throw new Error( '没有找到URL：' + token );
                }

                if ( AUTHORIZATION.sessionId && session !== false ) {
                    return URL + AUTHORIZATION.url[ token ] + ';sessionId=' +  AUTHORIZATION.sessionId;
                }

                return URL + AUTHORIZATION.url[ token ];
            }
        }

    }]);
