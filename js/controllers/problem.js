/**
 * Created by ZX on 2016/9/28.
 */
'use strict';

angular.module('problem',['ui.router','service','ui.bootstrap'])

    .controller('problemController', [ '$scope','$cookies','$window','$location', '$rootScope','$uibModal','$state','$timeout','Problem','Product','Customer','Account','Login',
        function ($scope,$cookies,$window,$location,$rootScope,$uibModal,$state,$timeout,Problem,Product,Customer, Account,Login) {

            /*$scope.menuFixed = menuFixed;
            $scope.changePos = changePos;
            function menuFixed(id){
                var obj = document.getElementById(id);
                var _getHeight = obj.offsetTop;

                $window.onscroll = function(){
                    changePos(id,_getHeight);
                }
            }
            function changePos(id,height){
                var obj = document.getElementById(id);
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop < height){
                    obj.style.position = 'relative';
                }else{
                    obj.style.position = 'fixed';
                }
            }

            $window.onload = function(){
                $scope.menuFixed('nav');
            };*/
            $rootScope.publishNew={show: true};

            (function () {
                if (window.location.href.indexOf("st=1") != -1){
                    $rootScope.publishNew={show: true};
                }else{
                    $rootScope.publishNew={show: false};
                }
            })();



            $scope.toProblemList = toProblemList;

            function toProblemList() {
                $window.location.href = "./main.html";

            }

            /*******账户信息*********/
            var uId = $cookies.get("userId");
            Account.getAccountInfo({
                userId : uId
            }).success(function (response) {

                $rootScope.username = response.data.userInfo.userName;
                $rootScope.userType = response.data.userInfo.userType;
                $scope.pro = response.userProductCatalogList;

                if ($rootScope.userType == 1){
                    document.getElementById("admin_logo").text = "客户问题反馈平台 — 客户入口";
                } else if ($rootScope.userType == 2){
                    document.getElementById("admin_logo").text = "客户问题反馈平台 — 售后入口";
                }

                /*var pro_list = [];
                angular.forEach($scope.pro,function (data) {
                    // if (userId == 18){
                        pro_list.push(data);
                    // }
                });
                // console.log($scope.pro);*/
            });

            /*********问题信息**********/
            $rootScope.problemReplytList={show: true};
            var producerId = window.location.href;
            var pid = producerId.split('pId=')[1];
            if (producerId.indexOf("pId=") != -1){
                Problem.problemInfo({
                    problemId : pid
                }).success(function (response) {
                    if(response.state.return = "true"){
                        $scope.proTitle = response.data.problemFeedbackInfo.problemTitle;
                        $scope.proContent = response.data.problemFeedbackInfo.problemContent;
                        $scope.createUDate = response.data.problemFeedbackInfo.createDate;
                        $scope.createUName = response.data.problemFeedbackInfo.createUserName;
                        $rootScope.problemId = response.data.problemFeedbackInfo.problemId;
                        $rootScope.createUserId = response.data.problemFeedbackInfo.createUserId;

                        $scope.reply_list = response.data.problemReplyList;

                        if($scope.reply_list.length == 1 && $scope.reply_list.replyId == null){
                            $rootScope.problemReplytList={show: false};
                        }

                        // $window.location.reload($scope.newProblemId);
                    }
                });
            }


            /************ 发布回复 ******************/
            $scope.publishReply = publishReply;
            function publishReply(reContent){
                Problem.addReply({
                    problemId : $rootScope.problemId,
                    createUserId : $rootScope.createUserId,
                    replyContent : reContent
                }).success(function (response) {
                    if(response.state.return = "true"){
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
                        // $uibModalInstance.close(
                            $timeout(function () {
                                // $window.location.reload();
                            },500);
                        // );
                    }else if(response.state.return == "false") {
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
                        return false;
                    }
                })
            }


            /****************** 发布问题 *********************/
            $scope.publish = publish;
            function publish(newTitle,newContent){
                Problem.addProblem({
                    problemTitle : newTitle,
                    problemContent : newContent,
                    createUserId : uId,
                    problemType : $rootScope.userType,
                    productCatalogId : 26
                }).success(function (response) {
                    if(response.state.return = "true"){
                        $scope.newProblemId = response.data.problemId;
                        // $window.location.reload($scope.newProblemId);
                        $rootScope.publishNew={show: false};
                        Problem.problemInfo({
                            problemId : $scope.newProblemId
                        }).success(function (response) {
                            if(response.state.return = "true"){
                                $scope.proTitle = response.data.problemFeedbackInfo.problemTitle;
                                $scope.proContent = response.data.problemFeedbackInfo.problemContent;
                                $scope.createUDate = response.data.problemFeedbackInfo.createDate;
                                $scope.createUName = response.data.problemFeedbackInfo.createUserName;
                                $rootScope.problemId = response.data.problemFeedbackInfo.problemId;
                                $rootScope.createUserId = response.data.problemFeedbackInfo.createUserId;

                                $scope.reply_list = response.data.problemReplyList;

                                if($scope.reply_list.length == 1 && $scope.reply_list.replyId == null){
                                    $rootScope.problemReplytList={show: false};
                                }

                                // $window.location.reload($scope.newProblemId);
                            }
                        });
                    }

                })
            }

            /*Problem.problemInfo({
                problemId : $scope.newProblemId
            }).success(

            );*/



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


    }])
    /********* 保存成功 Modal Controller**********/

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