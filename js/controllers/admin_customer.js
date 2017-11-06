/**
 * Created by zx on 2016/9/20.
 */
'use strict';

angular.module('adminCustomer',['ui.router','service','ui.bootstrap','angularFileUpload'])
    .controller('adminCustomerController', [ 'Customer','$scope','$cookies','$window', '$rootScope','$uibModal','$timeout','Account','Login','ServiceHelper','FileUploader', function (Customer, $scope,$cookies,$window,$rootScope,$uibModal,$timeout,Account,Login,ServiceHelper,FileUploader) {



        // 非空校验
        $rootScope.addNameRequired={show: false}; //全称非空
        $rootScope.addSmpRequired={show: false}; //简称非空
        //输入过长
        $rootScope.addNameTooLong={show: false};
        $rootScope.addSmpNameTooLong={show: false};
        $rootScope.addAddr={show: false};
        $rootScope.addNote={show: false};
        // 格式校验
        $rootScope.addPhone={show: false}; //电话号码
        $rootScope.addFax={show: false}; //传真号码
        $rootScope.addEmail={show: false}; //电子邮箱

        /******获取客户列表内容*****/
        Customer.getCustomerList().success(function (response) {

            response.data.forEach( function ( data ) {
                data.customerNote = unescape( data.customerNote );
            } );
            $rootScope.customer_list = response.data;
            // $rootScope.customerId = response.data.customerId;
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



        /*******编辑客户******/
        $scope.editCusSave = editCusSave;
        $scope.editCusName = editCusName;
        $scope.editCusSmpName = editCusSmpName;
        $scope.editCusPhone = editCusPhone;
        $scope.editCusFax = editCusFax;
        $scope.editCusEmail = editCusEmail;
        $scope.editCusAddr = editCusAddr;
        $scope.editCusNote = editCusNote;

        //编辑页面显隐
        $scope.customerListPage={show: false};
        $scope.editCusShow=function(cId) {
            $scope.customerListPage={show: true}; //列表页隐藏
            Customer.getCustomerInfo({
                customerId : cId
            }).success(function (response) {
                $scope.cusId = response.data.customerId,
                $scope.cusName = response.data.customerName,
                $scope.cusSmpName = response.data.customerSmpName,
                $scope.cusPhone = response.data.customerPhone,
                $scope.cusFax = response.data.customerFax,
                $scope.cusEmail = response.data.customerEmail,
                $scope.cusAddress = response.data.customerAddress,
                $scope.cusNote = response.data.customerNote,
                $scope.attachName = response.data.attachmentName,
                $scope.attachSvrName = response.data.attachmentSvrName
            })
        };
        $scope.editCusHide=function() {
            $scope.customerListPage={show: false}; //列表页显示
            $scope.addNameRequired={show: false};
            $scope.addNameTooLong={show: false};
            $scope.addSmpRequired={show: false};
            $scope.addSmpNameTooLong={show: false};
            $scope.addPhone={show: false};
            $scope.addFax={show: false};
            $scope.addEmail={show: false};
            $scope.addAddr={show: false};
            $scope.addNote={show: false};
        };
        // 编辑保存
        function editCusName(cusName) {

            if (cusName != "" && cusName.length > 64) {  //客户名称过长
                $rootScope.addNameTooLong = {show: true};
                $rootScope.addNameRequired = {show: false};
                return false;
            }else if (cusName == "" || cusName == null) {  //客户名称非空校验
                $rootScope.addNameRequired={show: true};
                $rootScope.addNameTooLong={show: false};
                return false;
            }else if (!(cusName == "" || cusName == null) && !(cusName.length > 5)){
                $rootScope.addNameRequired={show: false};
                $rootScope.addNameTooLong={show: false};
            }
        }
        function editCusSmpName(cusSmpName) {

            if (cusSmpName != "" && cusSmpName.length > 64) {  //客户名称过长
                $rootScope.addSmpNameTooLong = {show: true};
                $rootScope.addSmpRequired = {show: false};
                return false;
            }else if (cusSmpName == "" || cusSmpName == null) {  //客户名称非空校验
                $rootScope.addSmpRequired={show: true};
                $rootScope.addSmpNameTooLong={show: false};
                return false;
            }else if (!(cusSmpName == "" || cusSmpName == null) && !(cusSmpName.length > 5)){
                $rootScope.addSmpRequired={show: false};
                $rootScope.addSmpNameTooLong={show: false};
            }
        }
        function editCusPhone(cusPhone) {
            if (!(/^\d{0,64}$/.test(cusPhone))) {  //电话过长
                $rootScope.addPhone={show: true};
                return false;
            }else {
                $rootScope.addPhone={show: false};
            }
        }
        function editCusFax(cusFax) {
            if (!(/^\d{0,64}$/.test(cusFax))) {  //传真过长
                $rootScope.addFax={show: true};
                return false;
            }else {
                $rootScope.addFax={show: false};
            }
        }
        function editCusEmail(cusEmail) {
            if ((cusEmail != "") && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(cusEmail))) {  //邮箱格式
                $rootScope.addEmail={show: true};
                return false;
            }else {
                $rootScope.addEmail={show: false};
            }
        }
        function editCusAddr(cusAddress) {
            if (cusAddress.length > 1024) {  //传真过长
                $rootScope.addAddr={show: true};
                return false;
            }else {
                $rootScope.addAddr={show: false};
            }
        }
        function editCusNote(cusNote) {
            if (cusNote.length > 1024) {  //传真过长
                $rootScope.addNote={show: true};
                return false;
            }else {
                $rootScope.addNote={show: false};
            }
        }

        function editCusSave(cusName,cusSmpName,cusPhone,cusFax,cusEmail,cusAddress,cusNote,attachName) {
            if (cusName == "" || cusName == null){
                $rootScope.addNameRequired={show: true};
                return false;
            }else if(cusSmpName == "" || cusSmpName == null){
                $rootScope.addSmpRequired={show: true};
            }else
            if (($rootScope.addNameRequired.show == false) && ($rootScope.addNameTooLong.show == false) && ($rootScope.addSmpRequired.show == false) && ($rootScope.addSmpNameTooLong.show == false) && ($rootScope.addPhone.show == false) && ($rootScope.addFax.show == false) && ($rootScope.addEmail.show == false) && ($rootScope.addAddr.show == false) && ($rootScope.addNote.show == false)){

                    Customer.editSaveCustomer({
                    customerId : $scope.cusId,
                    customerName : cusName,
                    customerSmpName : cusSmpName,
                    customerPhone : cusPhone,
                    customerFax : cusFax,
                    customerEmail : cusEmail,
                    customerAddress : cusAddress,
                    customerNote : cusNote,
                    attachmentName : attachName
                }).success(function(response){
                    if (response.state.return == "true") {
                        $rootScope.addNameExist={show: false}; //全称是否重复
                        $rootScope.addSmpExist={show: false}; //简称是否重复
                        $rootScope.addPhone={show: false}; //电话号码
                        $rootScope.addFax={show: false}; //传真号码
                        $rootScope.addEmail={show: false}; //电子邮箱
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
                        $timeout(function () {
                            $scope.editCusHide(
                                $rootScope.refreshCustomer()
                            );
                        },1000)

                    }else if (response.state.return == "false"){
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
                        $rootScope.addNameRequired={show: false}; //全称非空
                        $rootScope.addSmpRequired={show: false}; //简称非空
                        return false;
                    }
                })
            }
        }

        /********刷新*********/
        $rootScope.refreshCustomer = refreshCustomer;
        function refreshCustomer() {
            Customer.getCustomerList().success(function (response) {

                response.data.forEach( function ( data ) {
                    data.customerNote = unescape( data.customerNote );
                } );
                $rootScope.customer_list = response.data;
                $rootScope.customerId = response.data.customerId;
            })
        }

        /******* 新增客户 ********/
        $scope.addSave = addSave;
        $scope.addCusName = addCusName;
        $scope.addCusSmpName = addCusSmpName;
        $scope.addCusPhone = addCusPhone;
        $scope.addCusFax = addCusFax;
        $scope.addCusEmail = addCusEmail;
        $scope.addCusAddr = addCusAddr;
        $scope.addCusNote = addCusNote;
        //新增页面显隐

        $rootScope.customerAddPage={show: true};
        $rootScope.addCustomerShow=function() {
            $rootScope.customerAddPage.show=!$rootScope.customerAddPage.show;  //新增客户toggle显隐
            // 表单清空
            $scope.cusName = "";
            $scope.cusSmpName = "";
            $scope.cusPhone = "";
            $scope.cusFax = "";
            $scope.cusEmail = "";
            $scope.cusAddress = "";
            $scope.cusNote = "";
            $scope.attachName = "";
            $scope.cusName = "";
            $scope.cusName = "";
            $scope.cusName = "";

            // 非空校验
            $rootScope.addNameRequired={show: false}; //全称非空
            $rootScope.addSmpRequired={show: false}; //简称非空
            //输入过长
            $rootScope.addNameTooLong={show: false};
            $rootScope.addSmpNameTooLong={show: false};
            $rootScope.addAddr={show: false};
            $rootScope.addNote={show: false};
            // 格式校验
            $rootScope.addPhone={show: false}; //电话号码
            $rootScope.addFax={show: false}; //传真号码
            $rootScope.addEmail={show: false}; //电子邮箱
        };

        //新增保存

        function addCusName(cusName) {

            if (cusName != "" && cusName.length > 64) {  //客户名称过长
                $rootScope.addNameTooLong = {show: true};
                $rootScope.addNameRequired = {show: false};
                return false;
            }else if (cusName == "" || cusName == null) {  //客户名称非空校验
                $rootScope.addNameRequired={show: true};
                $rootScope.addNameTooLong={show: false};
                return false;
            }else if (!(cusName == "" || cusName == null) && !(cusName.length > 64)){
                $rootScope.addNameRequired={show: false};
                $rootScope.addNameTooLong={show: false};
            }
        }
        function addCusSmpName(cusSmpName) {

            if (cusSmpName != "" && cusSmpName.length > 64) {  //客户名称过长
                $rootScope.addSmpNameTooLong = {show: true};
                $rootScope.addSmpRequired = {show: false};
                return false;
            }else if (cusSmpName == "" || cusSmpName == null) {  //客户名称非空校验
                $rootScope.addSmpRequired={show: true};
                $rootScope.addSmpNameTooLong={show: false};
                return false;
            }else if (!(cusSmpName == "" || cusSmpName == null) && !(cusSmpName.length > 64)){
                $rootScope.addSmpRequired={show: false};
                $rootScope.addSmpNameTooLong={show: false};
            }
        }
        function addCusPhone(cusPhone) {
            if (!(/^\d{0,64}$/.test(cusPhone))) {  //电话过长
                $rootScope.addPhone={show: true};
                return false;
            }else {
                $rootScope.addPhone={show: false};
            }
        }
        function addCusFax(cusFax) {
            if (!(/^\d{0,64}$/.test(cusFax))) {  //传真过长
                $rootScope.addFax={show: true};
                return false;
            }else {
                $rootScope.addFax={show: false};
            }
        }
        function addCusEmail(cusEmail) {
            if ((cusEmail != "") && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(cusEmail))) {  //邮箱格式
                $rootScope.addEmail={show: true};
                return false;
            }else {
                $rootScope.addEmail={show: false};
            }
        }
        function addCusAddr(cusAddress) {
            if (cusAddress.length > 1024) {  //传真过长
                $rootScope.addAddr={show: true};
                return false;
            }else {
                $rootScope.addAddr={show: false};
            }
        }
        function addCusNote(cusNote) {
            if (cusNote.length > 1024) {  //传真过长
                $rootScope.addNote={show: true};
                return false;
            }else {
                $rootScope.addNote={show: false};
            }
        }

        function addSave(cusName,cusSmpName,cusPhone,cusFax,cusEmail,cusAddress,cusNote,attachName) {
            if (cusName == "" || cusName == null){
                $rootScope.addNameRequired={show: true};
                return false;
            }else if(cusSmpName == "" || cusSmpName == null){
                $rootScope.addSmpRequired={show: true};
            }else
            if (($rootScope.addNameRequired.show == false) && ($rootScope.addNameTooLong.show == false) && ($rootScope.addSmpRequired.show == false) && ($rootScope.addSmpNameTooLong.show == false) && ($rootScope.addPhone.show == false) && ($rootScope.addFax.show == false) && ($rootScope.addEmail.show == false) && ($rootScope.addAddr.show == false) && ($rootScope.addNote.show == false)){

                Customer.addCustomerItem({
                    customerName : cusName,
                    customerSmpName : cusSmpName,
                    customerPhone : cusPhone,
                    customerFax : cusFax,
                    customerEmail : cusEmail,
                    customerAddress : cusAddress,
                    customerNote : cusNote,
                    attachmentName : attachName
                }).success(function (response) {
                    if (response.state.return == "true") {
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
                        $timeout(function () {
                            $rootScope.addCustomerShow();
                            $rootScope.refreshCustomer()
                        },900);

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
                        $rootScope.addNameRequired={show: false}; //全称非空隐藏
                        $rootScope.addSmpRequired={show: false}; //简称非空隐藏
                        return false;
                    }
                });
            }

        }

        /**************** 新增 文件上传 ********************/
        // $scope.uploadStatus = false; //定义上传后返回的状态

        var headers = { 'X-Requested-With': 'XMLHttpRequest' };
        var uploader = $scope.uploader = new FileUploader({
            url: ServiceHelper.getURL( 'addTFile' ),
            queueLimit: 1,     //文件个数
            removeAfterUpload: false,   //上传后删除文件
            headers: headers
            // autoUpload: true
        });
        $scope.clearItems = function(){    //重新选择文件时，清空队列，达到覆盖文件的效果
            uploader.clearQueue();
        };
        uploader.onAfterAddingFile = function(fileItem) {
            $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            // $scope.uploadStatus = true;   //上传成功则把状态改为true
            if(response.state.info == "true"){
                console.log($scope.info);
            }
        };
        $scope.UploadFile = function(){
            uploader.uploadAll();
        };



        /*******删除客户Modal********/

        $scope.deleteCus = deleteCus;

        function deleteCus(customerId) {
            var modalInstance = $uibModal.open({
                size: 'md',
                animation: true,
                templateUrl: './deleteTemp.html',
                controller: 'ModalDelCustomerItemController',
                resolve: {},
                opened:$rootScope.cId = customerId
            });
            modalInstance.closed.then(
            );
        }

    }])


    /*********删除客户Modal Controller**********/

    .controller('ModalDelCustomerItemController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout,Customer) {
            $rootScope.deleteSuccess={show: false};
            $scope.deleteFun = deleteFun;
            function deleteFun() {
                $rootScope.cusId = $rootScope.cId; //从adminProductController页面传来的productCatalogId赋值后再传
                Customer.delCustomerItem({
                    customerId: $rootScope.cusId
                }).success(function (response) {
                    if(response.state.return == "true"){
                        $rootScope.deleteSuccess={show: true};
                        $timeout(function () {
                            $uibModalInstance.close(
                                $rootScope.refreshCustomer()
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
