'use strict';

angular.module('myApp',['ui.router','service','ngCookies','ui.bootstrap'])
    .config(['$stateProvider','$locationProvider', '$urlRouterProvider', function ($stateProvider,$locationProvider,$urlRouterProvider){
        $urlRouterProvider.when("", "/client");
        $stateProvider
            .state("client", {
                url: "/client",
                templateUrl: "client_login.html",
                controller: 'clientController'
            })
    }])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    /**********全局参数定义************/
    .controller('AppController', ['$rootScope', '$state','$stateParams', '$cookies',
        function ($rootScope, $state, $stateParams, $cookies) {
            $rootScope.cookie = $cookies;
        }
    ])

    /*****客户端登录处理******/
   .controller('clientController',['$scope','$rootScope','$cookies','$window','$state','$document', '$uibModal','Login', 'ServiceHelper',function($scope,$rootScope,$cookies,$window,$state,$document,$uibModal,Login,ServiceHelper){
        $scope.login = login;

        // $scope.keyLogin = keyLogin;

       $rootScope.usernameNull={show: false};

       $rootScope.passwordNull={show: false};

       $rootScope.tooLong={show: false};

       $rootScope.loginAlert={show: false};

       $document.bind("keypress", function(event) {
           $scope.$apply(function (){
               if(event.keyCode == 13){
                   login();
               }
           })
       });

       function login() {
            var userName = document.getElementById("uName").value;

            var userNameLength = document.getElementById("uName").value.replace(/[\u0391-\uFFE5]/g,"aa").length;

            var userPass = document.getElementById("uPass").value;

            var userPassLength = document.getElementById("uPass").value.length;

            if (userName == "" || userName == null) {
                $rootScope.usernameNull={show: true};
                $rootScope.tooLong={show: false};
                if(userPass == "" || userPass == null){
                    $rootScope.passwordNull={show: true};
                }else {
                    $rootScope.passwordNull={show: false};
                }
                return false;
            } else if (userPass == "" || userPass == null) {
                if  (userName == "" || userName == null){
                    $rootScope.usernameNull={show: true};
                }else{
                    $rootScope.usernameNull={show: false};
                }
                $rootScope.tooLong={show: false};
                $rootScope.passwordNull={show: true};
                return false;
            } else {
                if(userNameLength >= 64 || userPassLength >= 32){
                    $rootScope.tooLong={show: true};
                }else{
                    $rootScope.usernameNull={show: false};

                    $rootScope.passwordNull={show: false};

                    $rootScope.usernameTooLong={show: false};

                    $rootScope.tooLong={show: false};

                    $rootScope.loginAlert={show: false};
                    Login.login( {
                        userCode: $scope.username,
                        userPassword: $scope.password
                    } ).success(function (response) {
                        if (response.state.return == 'true') {
                            $rootScope.cookie.put('sessionId', response.data.sessionId);
                            $rootScope.cookie.put('userName', response.data.userName);
                            $rootScope.cookie.put('userCode', response.data.userCode);
                            $rootScope.cookie.put('userId', response.data.userId);
                            ServiceHelper.setSessionId($rootScope.cookie.get('sessionId'));
                            if(response.data.userType == null){
                                $window.location.href = "./html/product_manage.html";
                            }else {
                                $window.location.href = "./html/main.html";
                            }
                        } else {
                            $scope.logInfo = response.state.info;
                            if ($scope.logInfo != "" || $scope.logInfo != null){
                                $rootScope.loginAlert={show: true};
                            }else{
                                $rootScope.loginAlert={show: false};
                            }

                        }
                    })
                }

            }

        }
    }])

    /*********** 登录页面后台处理 ***************/

    .directive('loginBox',function(){
        return{
            restrict : 'A',
            controller:function($scope,$element){
                $scope.$watch('window', function(){
                    var top = (window.innerHeight - 380)/2 + 'px';
                    $element.css('margin-top',top);

                });
            }
        };
    });


