'use strict';

angular.module('personalCenter',['ui.router','service','ui.bootstrap'])

    .controller('personalCenterController', ['$scope','$cookies','$window', '$rootScope','$uibModal','$state','$timeout','Account','Login', function ($scope,$cookies,$window,$rootScope,$uibModal,$state,$timeout,Account,Login) {

        $rootScope.adminNav = {show: false};

        /******获取账户信息*****/
        var uId = $cookies.get("userId");
        Account.getAccountInfo({
            userId : uId
        }).success(function (response) {

            $rootScope.myInfo = response.data.userInfo;
            $rootScope.username = response.data.userInfo.userName;
            $scope.userType = response.data.userInfo.userType;

            if ($scope.userType == undefined){
                document.getElementById("admin_logo").text = "客户问题反馈平台（管理员入口）";
            } else if ($scope.userType == 1){
                document.getElementById("admin_logo").text = "客户问题反馈平台 — 客户入口";
                $rootScope.adminNav = {show: true};
            } else if ($scope.userType == 2){
                document.getElementById("admin_logo").text = "客户问题反馈平台 — 售后入口";
                $rootScope.adminNav = {show: true};
            }

        });


        /*******编辑联系方式******/

        $rootScope.addPhone={show: false};
        $rootScope.addEmail={show: false};
        $scope.editMyPhone = function (myPhone) {
            if (!(/^\d{0,64}$/.test(myPhone))) {  //电话过长
                $rootScope.addPhone={show: true};
                return false;
            }else {
                $rootScope.addPhone={show: false};
            }
        };
        $scope.editMyEmail = function (myEmail) {
            if ((myEmail != "") && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(myEmail))) {  //邮箱格式
                $rootScope.addEmail={show: true};
                return false;
            }else {
                $rootScope.addEmail={show: false};
            }
        };


        //编辑页面显隐
        $rootScope.MyPage={show: false};
        $scope.editMyShow=function() {
            $rootScope.MyPage={show: true};
            var uId = $cookies.get("userId");
            Account.getAccountInfo({
                userId : uId
            }).success(function (response) {

                $scope.myId = response.data.userInfo.userId;
                $scope.myPhone = response.data.userInfo.userPhone;
                $scope.myEmail = response.data.userInfo.userEmail;
                $scope.myAddr = response.data.userInfo.userAddress;

            });
        };
        $scope.editMyHide=function() {
            $rootScope.MyPage={show: false};
            $scope.addPhone={show: false};
            $scope.addEmail={show: false};
        };
        // 编辑保存
        $scope.editSaveMy = function (myPhone,myEmail,myAddr) {
            var uId = $cookies.get("userId");

            if (($scope.addPhone.show == false) && ($scope.addEmail.show == false)){
                Account.changeAccountItem({
                    userId: uId,
                    userPhone: myPhone,
                    userEmail: myEmail,
                    userAddress: myAddr
                }).success(function(response){
                    if(response.state.return == "true"){
                        $timeout(function () {
                            var modalInstance = $uibModal.open({
                                size: 'sm',
                                animation: true,
                                templateUrl: './saveSuccessTemp.html',
                                controller: 'ModalSaveSuccessController',
                                resolve: {}
                            });
                            modalInstance.closed.then(
                            );

                        });
                        $timeout(function(){
                            /*var uId = $cookies.get("userId");
                            $scope.editMyHide(
                                Account.getAccountInfo({
                                    userId : uId
                                }).success(function (response) {
                                    $rootScope.myInfo = response.data.userInfo;

                                })
                            )*/
                            $window.location.reload();
                        },950)


                    }else if(response.state.return == "false"){
                        $rootScope.responseInfo = response.state.info;
                        $timeout(function () {
                            var modalInstance = $uibModal.open({
                                size: 'sm',
                                animation: true,
                                templateUrl: './saveErrorTemp.html',
                                controller: 'ModalSaveErrorController',
                                resolve: {},
                                opened:$rootScope.errInfo = $rootScope.responseInfo
                            });
                            modalInstance.closed.then(
                            );
                        });
                    }
                });
            }
        };

        /********刷新*********/
        $scope.refreshProduct = refreshProduct;
        function refreshProduct() {
            Account.getAccountInfo({
                userId: uId
            }).success(function (response) {

                $rootScope.myInfo = response.data.userInfo;

            });
        }



        /********* 账号管理 显隐 *********/
        $rootScope.accManage={show: false};
        $scope.accManageToggle = function(){
            $rootScope.accManage={show: true};
        };
        $scope.accManageToggle2 = function(){
            $rootScope.accManage={show: false};
        };
        $scope.toCusAccount = function(){
            $window.location.href = "./account_manage_cus.html";
        };
        $scope.toAdmAccount = function(){
            $window.location.href = "./account_manage_adm.html";
        };

        /********* 个人中心 *********/
        $scope.toMyCenter = function(){
            $window.location.href = "./personal_center.html";
        };


        /********* 登出显隐 *********/
        $rootScope.logOutPanel={show: false};
        $scope.logOutToggle = function(){
            $rootScope.logOutPanel={show: true};
        };
        $scope.logOutToggle2 = function(){
            $rootScope.logOutPanel={show: false};
        };

        /********** 登出 ***********/
        $scope.logOut = logOut;
        function logOut(){

            Login.loginOut().success(function (response) {
                if (response.state.return ="true"){
                    $window.location.href = "../index.html";
                }else{
                    alert(response.state.info);
                }

            });
        }


        /*******修改密码Modal********/
        $scope.resetPwd = resetPwd;

        function resetPwd() {
            var modalInstance = $uibModal.open({
                size: 'sm',
                animation: true,
                templateUrl: './resetPwdTemp.html',
                controller: 'ModalResetPwdController',
                resolve: {}
            });
            modalInstance.closed.then(
            );
        }

    }])

/**************** 修改密码 Modal Controller*********************/
    .controller('ModalResetPwdController',
        function ($scope,$rootScope,$window, $uibModalInstance,$uibModal,$cookies,Login,$timeout) {
            $scope.pwdRepeat={show: false};
            $scope.codeTooLong={show: false};
            $rootScope.alphaDigit={show: false};
            $rootScope.updateSuccess={show: false};
            $scope.restPassword = function () {
                var uId = $cookies.get("userId");

                var oldPwd = document.getElementById("old").value;
                var newPwd = document.getElementById("new").value;
                var cmtPwd = document.getElementById("newCMT").value;

                var oldLength = document.getElementById("old").value.length;
                var newLength = document.getElementById("new").value.length;
                var cmtLength = document.getElementById("newCMT").value.length;

                if( !(/^[A-Za-z0-9]+$/.test(oldLength))){      //编号格式
                    $rootScope.alphaDigit={show: true};
                    $scope.codeTooLong={show: false};
                    return false;
                }else if ((newLength >= 32) || (cmtLength >= 32)){
                    $rootScope.codeTooLong={show: true};  //密码过长
                    $rootScope.alphaDigit={show: false};
                    return false;
                }else{
                    Login.updatePwd({
                        userId : uId,
                        oldPassword : oldPwd,
                        newPassword : newPwd,
                        commitPassword : cmtPwd
                    }).success(function (response) {
                        if (response.state.return == "true") {
                            $scope.codeTooLong = {show: false};
                            $scope.pwdRequired = {show: false};
                            $rootScope.alphaDigit={show: false};
                            $scope.pwdRepeat={show: false};

                            $rootScope.updateSuccess={show: true};
                            $timeout(function(){
                                $uibModalInstance.close(
                                    Login.loginOut().success(function (response) {
                                        if (response.state.return ="true"){
                                            $window.location.href = "../index.html";
                                        }else{
                                            alert(response.state.info);
                                        }

                                    })
                                )
                            },2000);
                        } else if (response.state.return == "false") {
                                $rootScope.responseInfo = response.state.info;
                                $scope.pwdRepeat = {show: true};
                                $scope.codeTooLong = {show: false};
                                $rootScope.alphaDigit={show: false};
                                return false;
                        }

                    })
                }
            };
            // 关闭Modal
            $scope.close_modal = close_modal;
            function close_modal() {
                $uibModalInstance.close();
            }

            $scope.logOut = logOut;
            function logOut(){

                Login.loginOut().success(function (response) {
                    if (response.state.return ="true"){
                        $window.location.href = "../index.html";
                    }else{
                        alert(response.state.info);
                    }

                });
            }

        })

    /********* 修改联系方式成功 Modal Controller**********/

    .controller('ModalSaveSuccessController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout) {

            // 关闭Modal
            $scope.close_modal = close_modal;

            $timeout(function () {
                $uibModalInstance.close();
            },1000);

            function close_modal() {
                $uibModalInstance.close();
            }

        })
    /********* 保存失败 Modal Controller**********/

    .controller('ModalSaveErrorController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout) {
            $scope.info = $rootScope.errInfo;
            // 关闭Modal
            $scope.close_modal = close_modal;

            $timeout(function () {
                $uibModalInstance.close();
            },2000);

            function close_modal() {
                $uibModalInstance.close();
            }

        });

