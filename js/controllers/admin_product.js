'use strict';

angular.module('adminProduct',['ui.router','service','ui.bootstrap'])

    .controller('adminProductController', [ 'Product','$scope','$cookies','$window', '$rootScope','$uibModal','$state','$timeout','Account','Login',
        function (Product, $scope,$cookies,$window,$rootScope,$uibModal,$state,$timeout,Account,Login) {


        $scope.editProName = editProName;
        $scope.editProPrincipal = editProPrincipal;
        $scope.editProNote = editProNote;

        /******获取产品目录列表内容*****/
        Product.getProductList().success(function (response) {

            response.data.forEach( function ( data ) {
                data.productCatalogNote = unescape( data.productCatalogNote );
            } );
            $rootScope.product_list = response.data;
            $rootScope.productCatalogId = response.data.productCatalogId;

        });

        /******获取账户信息*****/
        var uId = $cookies.get("userId");
        Account.getAccountInfo({
            userId : uId
        }).success(function (response) {

            $rootScope.username = response.data.userInfo.userName;
            $scope.userType = response.data.userInfo.userType;

            if ($scope.userType == undefined){
                document.getElementById("admin_logo").text = "客户问题反馈平台（管理员入口）";
            }

        });


        /*******编辑产品******/

        //编辑页面显隐
        $rootScope.productListPage={show: false};
        $scope.editProShow=function(productId) {
            $rootScope.productListPage={show: true};

            Product.getProductInfo({
                productCatalogId : productId
            }).success(function (response) {
                    $scope.productCId = response.data.productCatalogId;
                    $scope.productCName = response.data.productCatalogName;
                    $scope.productCNote = unescape(response.data.productCatalogNote);
                    $scope.productCPrincipal = response.data.productCatalogPrincipal
            })
        };
        $scope.editProHide=function() {
            $rootScope.productListPage={show: false};
            $rootScope.editRequired={show: false};
            $rootScope.editNameTooLong={show: false};
            $rootScope.editPrincipalTooLong={show: false};
            $rootScope.editNoteTooLong={show: false};
        };

        $rootScope.editRequired={show: false};
        $rootScope.editNameTooLong={show: false};
        $rootScope.editPrincipalTooLong={show: false};
        $rootScope.editNoteTooLong={show: false};

            /*var editProductName = document.getElementById("editProductName").value;
            var editProductNameLength = document.getElementById("editProductName").value.replace(/[\u0391-\uFFE5]/g,"aa").length;
            var editProductPrincipalLength = document.getElementById("editProductPrincipal").value.replace(/[\u0391-\uFFE5]/g,"aa").length;
            var editProductNoteLength = document.getElementById("editProductNote").value.replace(/[\u0391-\uFFE5]/g,"aa").length;*/

        function editProName(productCName) {

            if (productCName != "" && productCName.length > 64) {  //产品名称过长
                $rootScope.editNameTooLong = {show: true};
                $rootScope.editRequired = {show: false};
                return false;
            }else if (productCName == "" || productCName == null) {  //产品名称非空校验
                    $rootScope.editRequired={show: true};
                    $rootScope.editNameTooLong={show: false};
                    return false;
            }else {
                $rootScope.editRequired={show: false};
                $rootScope.editNameTooLong={show: false};
            }
        }
        function editProPrincipal(productCPrincipal) {
            if (productCPrincipal.length >= 64) {  //负责人过长
                $rootScope.editPrincipalTooLong={show: true};
                return false;
            }else {
                $rootScope.editPrincipalTooLong={show: false};
            }
        }
        function editProNote(productCNote) {
            if (productCNote.length >= 1024) {  //产品备注过长
                $rootScope.editNoteTooLong={show: true};
                return false;
            }else {
                $rootScope.editNoteTooLong={show: false};
            }
        }

        // 编辑保存
            $scope.editSave = editSave;
        function editSave(productCName,productCPrincipal,productCNote) {

            if (productCName == "" || productCName == null) {  //产品名称非空校验
                $rootScope.editRequired={show: true};
                return false;
            }else if (($rootScope.editRequired.show == false) && ($rootScope.editNoteTooLong.show == false) && ($rootScope.editPrincipalTooLong.show == false) && ($rootScope.editRequired.show == false) && ($rootScope.editNameTooLong.show == false)){

                Product.editSaveProduct({
                    productCatalogName: productCName,
                    productCatalogPrincipal: productCPrincipal,
                    productCatalogNote: productCNote,
                    productCatalogId: $scope.productCId
                }).success(function(response){
                    if (response.state.return == "true") {
                        $rootScope.editExist={show: false};
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
                            $scope.editProHide(
                                Product.getProductList().success(function (response) {
                                    response.data.forEach( function ( data ) {
                                        data.productCatalogNote = unescape( data.productCatalogNote );
                                    } );
                                    $rootScope.product_list = response.data;
                                })
                            );
                        },900)
                    }else if (response.state.return == "false"){
                        $rootScope.responseInfo = response.state.info;
                        $rootScope.editRequired={show: false};
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

        /********刷新*********/
        $scope.refreshProduct = refreshProduct;
        function refreshProduct() {
            Product.getProductList().success(function (response) {

                response.data.forEach( function ( data ) {
                    data.productCatalogNote = unescape( data.productCatalogNote );
                } );
                $rootScope.product_list = response.data;

            });
        }



        /*******删除产品Modal********/
        $scope.deletePro1 = deletePro1;

        function deletePro1(productCatalogId) {
            var modalInstance = $uibModal.open({
                size: 'sm',
                animation: true,
                templateUrl: './deleteTemp.html',
                controller: 'ModalDelProductItemController',
                resolve: {},
                opened:$rootScope.pId = productCatalogId

            });
            modalInstance.closed.then(
            );
        }

        /*******新增产品Modal********/

        $scope.addProduct = addProduct;

        function addProduct() {
            var modalInstance = $uibModal.open({
                size: 'md',
                animation: true,
                templateUrl: './addProductItemTemp.html',
                controller: 'ModalAddProductController',
                resolve: {
                }
            });
            modalInstance.closed.then(
            );
        }

    }])

/****************新增产品Modal Controller*********************/
    .controller('ModalAddProductController',
        function ($scope,$rootScope,$window, $uibModalInstance,$uibModal,$timeout,Product) {
            $scope.add_product = add_product;
            $scope.addProName = addProName;
            $scope.addProPrincipal = addProPrincipal;
            $scope.addProNote = addProNote;
            $rootScope.addRequired={show: false};
            $rootScope.addNameTooLong={show: false};
            $rootScope.addPrincipalTooLong={show: false};
            $rootScope.addNoteTooLong={show: false};
            function addProName(proName) {

                if (proName != "" && proName.length > 64) {  //产品名称过长
                    $rootScope.addNameTooLong = {show: true};
                    $rootScope.addRequired = {show: false};
                    return false;
                }else if (proName == "" || proName == null) {  //产品名称非空校验
                    $rootScope.addRequired={show: true};
                    $rootScope.addNameTooLong={show: false};
                    return false;
                }else if (!(proName == "" || proName == null) && !(proName.length > 64)){
                    $rootScope.addRequired={show: false};
                    $rootScope.addNameTooLong={show: false};
                }
            }
            function addProPrincipal(proPrincipal) {
                if (proPrincipal.length > 64) {  //负责人过长
                    $rootScope.addPrincipalTooLong={show: true};
                    return false;
                }else {
                    $rootScope.addPrincipalTooLong={show: false};
                }
            }
            function addProNote(proNote) {
                if (proNote.length > 1024) {  //描述过长
                    $rootScope.addNoteTooLong={show: true};
                    return false;
                }else {
                    $rootScope.addNoteTooLong={show: false};
                }
            }
            function add_product(productCatalogName,productCatalogNote,productCatalogPrincipal) {

                if (productCatalogName == "" || productCatalogName == null) {  // 校验 : 判断产品名称是否为空
                    $rootScope.addRequired={show: true};
                    return false;
                }else if(($rootScope.addRequired.show == false)&&($rootScope.addNameTooLong.show == false)&&($rootScope.addPrincipalTooLong.show == false)&&($rootScope.addNoteTooLong.show == false)){
                    Product.addProductItem({
                        productCatalogName: productCatalogName,
                        productCatalogNote: productCatalogNote,
                        productCatalogPrincipal: productCatalogPrincipal
                    }).success(function (response) {
                        if(response.state.return == "false") {
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
                        } else if(response.state.return == "true"){

                            $uibModalInstance.close(
                                $timeout(function () {
                                    Product.getProductList().success(function (response) {

                                        response.data.forEach(function (data) {
                                            data.productCatalogNote = unescape(data.productCatalogNote);
                                        });
                                        $rootScope.product_list = response.data;

                                    })
                                },1000)
                            );
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
                        }
                    }).error();
                }
            }
            // 关闭Modal
            $scope.close_modal = close_modal;
            function close_modal() {
                $uibModalInstance.close();
            }

        })

/*********删除产品Modal Controller**********/

    .controller('ModalDelProductItemController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout,Product) {
            $rootScope.deleteSuccess={show: false};
            $scope.deleteFun = deleteFun;
            function deleteFun() {
                $rootScope.proId = $rootScope.pId; //从adminProductController页面传来的productCatalogId赋值后再传
                Product.delProductItem({
                    productCatalogId: $rootScope.proId
                }).success(function(response){
                    if(response.state.return == "true"){
                        $rootScope.deleteSuccess={show: true};
                         $timeout(function () {
                         $uibModalInstance.close(
                         Product.getProductList()
                         .success(function (response) {
                         response.data.forEach( function ( data ) {
                         data.productCatalogNote = unescape( data.productCatalogNote );
                         } );
                         $rootScope.product_list = response.data;

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


        })
    /********* 编辑保存成功 Modal Controller**********/

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

