/**
 * Created by ZX on 2016/9/25.
 */
'use strict';

angular.module('main',['ui.router','service','ui.bootstrap','tm.pagination'])

    .controller('mainController', [ '$scope','$cookies','$window', '$rootScope','$uibModal','$state','$timeout','Problem','Product','Customer','Account','Login',
        function ($scope,$cookies,$window,$rootScope,$uibModal,$state,$timeout,Problem,Product,Customer, Account,Login) {

            $scope.menuFixed = menuFixed;
            $scope.changePos = changePos;
            (function () {
                menuFixed('choose-bar')
            })();
            function menuFixed(id){
                var obj = document.getElementById(id);
                var _getHeight = obj.offsetTop;

                window.onscroll = function(){
                    changePos(id,_getHeight);
                }
            }
            function changePos(id,height){
                var obj = document.getElementById(id);
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop < height){
                    obj.style.position = 'relative';
                    obj.style.marginTop = '0';
                }else{
                    obj.style.position = 'fixed';
                    obj.style.marginTop = '-148px';
                }
            }


            $scope.addProblem = addProblem;

            function addProblem() {
                $window.location.href = "./problem.html?st=1";
            }

            $rootScope.isSales={show: false};
            var uId = $cookies.get("userId");

            Account.getAccountInfo({
                userId : uId
            }).success(function (response) {

                $rootScope.username = response.data.userInfo.userName;
                $scope.userType = response.data.userInfo.userType;

                if ($scope.userType == 1){
                    document.getElementById("admin_logo").text = "客户问题反馈平台 — 客户入口";
                    $rootScope.isSales={show: false};
                } else if ($scope.userType == 2){
                    document.getElementById("admin_logo").text = "客户问题反馈平台 — 售后入口";
                    $rootScope.isSales={show: true};
                    Customer.getCustomerList().success(function (response) {
                        $rootScope.cus_list = response.data;
                    });
                    Product.getProductList().success(function (response) {
                        $rootScope.product_list = response.data;
                    });
                }

            });


            /********刷新*********/
            $scope.refreshProblem = function () {
                Problem.problemList({
                    userId : uId
                }).success(function (response) {
                    $rootScope.problem_list = response.data;
                    $rootScope.problem_Id = response.data.problemId;
                });
            };

            /**************获取问题列表******************/
            Problem.problemList({
                userId : uId
            }).success(function (response) {
                $rootScope.problem_list = response.data.list;
                $rootScope.problem_Id = response.data.problemId;
                $rootScope.problemState1 = response.data.problemState;
                $rootScope.dl = response.data.length;
            });

                $scope.paginationConf = {
                    currentPage: 1,
                    totalItems: 5,
                    itemsPerPage: 2,
                    pagesLength: 9,
                    perPageOptions: [10, 20, 30, 40, 50],
                    onChange: function(){
                    }
                };

                /***** 问题筛选 ****/

            $rootScope.isProblem={show: false};

            $scope.state = [
                {stValue : "待解决", stId : 1},
                {stValue : "解决中", stId : 2},
                {stValue : "未解决", stId : 3}
            ];
            $scope.type = [
                {tpValue : "公告",tpType : 2},
                {tpValue : "问题",tpType : 1}
            ];


            $scope.change = function(tpType){
                if (tpType == 1){
                    $rootScope.isProblem={show: true};
                }else{
                    $rootScope.isProblem={show: false};
                }
            };

            /****** 设置问题状态 ********/
            $scope.engineer = 2;
            $scope.state2 = [
                {stValue2 : "待解决", stId2 : 1},
                {stValue2 : "解决中", stId2 : 2},
                {stValue2 : "未解决", stId2 : 3}
            ];

            $scope.changeState = function(id,stId2){
                Problem.setState({
                    problemId : id,
                    problemState : stId2
                }).success(function (response) {
                    if(response.state.return == "true"){
                        Problem.problemList({
                            userId : uId
                        }).success(function (response) {
                            $rootScope.problem_list = response.data;
                            $rootScope.problem_Id = response.data.problemId;
                        });
                    }
                })
            };



            $scope.chooseProblemList = chooseProblemList;
            function chooseProblemList(sid,tpType,cid,pid){

                Problem.problemList({
                    userId : uId,
                    problemState : sid,
                    problemType : tpType,
                    customerId : cid,
                    productCatalogId : pid
                }).success(function (response) {
                    $rootScope.problem_list = response.data.list;
                    // $rootScope.problem_Id = response.data.problemId;
                });

                // var selectSta = document.getElementById("selectState");  //取单选框问题种类
                // var index = selectSta.selectedIndex; // 选中索引
                // var text = selectSta.options[index].text; // 选中文本
                // var sls = selectSta.options[index].value; // 选中值
                // var sls = selectSta.options;
                // var StaId = "";
                // var TypeId = "";
                // var keep0 = true;
                // angular.forEach(sls,function (data) {
                //     if (keep0 == true){
                //         if(data.selected && data.id == "notice"){
                //             keep0 = false;
                //             StaId = data.value;
                //             TypeId = "2";
                //             console.log(123 + TypeId);
                //         }else if(data.selected && data.name == "proSt"){
                //             keep0 = false;
                //             StaId = data.value;
                //             TypeId = "1";
                //             console.log(321);
                //         }
                //         console.log(TypeId);
                    // }
                // });
                /*var selectCus = document.getElementById("selectCustomer");  //取单选框客户ID
                var slc = selectCus.options;
                var CusId = "";
                var keep = true;
                angular.forEach(slc,function (data) {
                    if (keep == true){
                        if(data.selected){
                            keep = false;
                            CusId = data.id;
                        }
                        // console.log(CusId);
                    }
                });
                var selectPro = document.getElementById("selectProduct");  //取单选框产品ID
                var slp = selectPro.options;
                var ProId = "";
                var keep2 = true;
                angular.forEach(slp,function (data) {
                    if (keep2 == true){
                        if(data.selected){
                            keep2 = false;
                            ProId = data.id;
                        }
                        // console.log(ProId);
                    }
                });*/

                /*var selectPro = document.getElementById("selectProduct");  //取单选框客户ID
                var ProId = [];
                for(i=0;i<selectPro.length;i++){
                    if(selectPro.options[i].selected){
                        ProId = selectPro[i].value;
                    }
                }*/
            }

            $scope.toDetail = toDetail;
            function toDetail(id) {
                $window.location.href = "./problem.html?pId="+id;
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

            /*******删除问题Modal********/
            $scope.deletePro1 = deletePro1;

            function deletePro1(problemId) {
                var modalInstance = $uibModal.open({
                    size: 'sm',
                    animation: true,
                    templateUrl: './deleteTemp.html',
                    controller: 'ModalDelProblemItemController',
                    resolve: {},
                    opened:$rootScope.pId = problemId

                });
                modalInstance.closed.then(
                );
            }


    }])
    /*********删除问题Modal Controller**********/

    .controller('ModalDelProblemItemController',
        function ($scope,$rootScope,$window,$cookies, $uibModalInstance,$timeout,Problem) {
            $rootScope.deleteSuccess={show: false};

            var uId = $cookies.get("userId");
            $scope.deleteFun = deleteFun;
            function deleteFun() {
                $rootScope.proId = $rootScope.pId; //从adminProductController页面传来的problemId赋值后再传
                Problem.delProblem({
                    problemId: $rootScope.proId
                }).success(function(response){
                    if(response.state.return == "true"){
                        $rootScope.deleteSuccess={show: true};
                        $timeout(function () {
                            $uibModalInstance.close(
                                Problem.problemList({
                                    userId : uId
                                }).success(function (response) {
                                    $rootScope.problem_list = response.data;
                                    $rootScope.problem_Id = response.data.problemId;

                                    })
                            )
                        },1000)
                    }
                })
            }
            // 关闭Modal
            $scope.close_modal = close_modal;
            function close_modal() {
                $uibModalInstance.close();
            }


        });