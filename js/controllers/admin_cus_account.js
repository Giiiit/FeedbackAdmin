/**
 * Created by zx on 2016/9/21.
 */
'use strict';

angular.module('adminCusAccount',['ui.router','service','ui.bootstrap','ngmodel.format'])
    .controller('adminCusAccountController', [ 'Account','$scope','$cookies','$window', '$rootScope','$uibModal','$state','$timeout','Customer','Product','Login', function (Account, $scope,$cookies,$window,$rootScope,$uibModal,$state,$timeout,Customer,Product,Login) {

        // $scope.addCusAccSave = addCusAccSave;

        $scope.formatter = function(modelValue, filter, defaultValue) {
            console.log("arguments", arguments);
            if (modelValue) {
                return filter("currency")(modelValue);
            }
            return defaultValue;
        };

        $scope.all = function() {
            console.log("arguments", arguments);
            return true;
        };


        $scope.editCusAccSave = editCusAccSave;

        // 非空校验
        $rootScope.addCodeRequired={show: false}; //编号非空
        $rootScope.addNameRequired={show: false}; //名称非空
        $rootScope.addActiveRequired={show: false}; //账户启用非空
        $rootScope.addCusIdRequired={show: false}; //客户ID非空
        $rootScope.addCusIdRequired1={show: false}; //客户ID非空 1111111
        $rootScope.addProIdRequired={show: false}; //产品ID非空

        // 格式校验
        $rootScope.alphaDigit={show: false}; //数字、字母
        $rootScope.addPhone={show: false}; //电话号码
        $rootScope.addEmail={show: false}; //电子邮箱

        //过长
        $rootScope.codeTooLong={show: false};  //名称过长
        $rootScope.nameTooLong={show: false};   //编号过长
        $rootScope.addAddr={show: false};   //地址过长

        /******获取账户信息*****/
        var uId = $cookies.get("userId");
        Account.getAccountInfo({
            userId : uId
        }).success(function (response) {
            // if (response.data.return == "true"){
                $rootScope.username = response.data.userInfo.userName;
                $scope.userType = response.data.userInfo.userType;

                if ($scope.userType == undefined){
                    document.getElementById("admin_logo").text = "客户问题反馈平台（管理员入口）";
                }
            if(response.data.return == "false"){
                if(response.data.info == "当前会话不存在或者已经超时"){
                    $rootScope.responseInfo = response.state.info;
                    $timeout(function () {
                        var modalInstance = $uibModal.open({
                            size: 'sm',
                            animation: true,
                            templateUrl: './saveErrorTemp.html',
                            controller: 'ModalTimeoutController',
                            resolve: {},
                            opened:$rootScope.errInfo = $rootScope.responseInfo
                        });
                        modalInstance.closed.then(
                        );
                    });
                }
            }

        });

        /******获取客户账户管理列表内容*****/
        Account.getAccountList({
            userType:1,
            pageIndex : 1
            // pageSize : 10
        }).success(function (response) {
            $scope.cusAcc_list = response.data.list;

            $rootScope.itemLength = response.data.pageInfo.recordCount;

            response.data.list.forEach(function (data) {
                $rootScope.act = data.active;
                $rootScope.id = data.userId;
                $scope.code = data.userCode;
            });
        });
        /********* 启用账号 ***********/
        $scope.activeOff = function (uId,act,index,item){
            if(act == true){
                Account.stopAccountItem({
                    userId : uId
                }).success(function (response) {
                    if (response.state.return == "true"){
                        Account.getAccountList({
                            userType:1,
                            pageIndex : index,
                            pageSize : item
                        }).success(function (response) {
                            $scope.cusAcc_list = response.data.list;

                            $rootScope.itemLength = response.data.pageInfo.recordCount;

                            /*response.data.list.forEach(function (data) {
                                $rootScope.act = data.active;
                                $rootScope.id = data.userId;
                                $scope.code = data.userCode;
                            });*/

                        });
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
                    }
            })
        }
        };
        $scope.activeOn = function (uId,act,index,item){
            console.log(index);
            console.log(item);
            if(act == false){
                Account.startAccountItem({
                    userId : uId
                }).success(function (response) {
                    if (response.state.return == "true"){
                        Account.getAccountList({
                            userType:1,
                            pageIndex : index,
                            pageSize : item
                        }).success(function (response) {
                            $scope.cusAcc_list = response.data.list;

                            $rootScope.itemLength = response.data.pageInfo.recordCount;

                            response.data.list.forEach(function (data) {
                                $rootScope.act = data.active;
                                $rootScope.id = data.userId;
                                $scope.code = data.userCode;
                            });

                        });
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
                    }
            })
        }
        };

        /********刷新*********/
        $rootScope.refreshCusAcc = refreshCusAcc;
        function refreshCusAcc() {
            $window.location.reload()
        }
        /*************分页****************/
        $scope.perItems = [
            {item : 5},
            {item : 10},
            {item : 15},
            {item : 20},
            {item : 30},
            {item : 40}
        ];
        $scope.DoCtrlPagingAct = function (currentPage,item) {
            $rootScope.item = item;
            Account.getAccountList({
                userType:1,
                pageIndex : currentPage,
                pageSize : item
            }).success(function (response) {
                $scope.cusAcc_list = response.data.list;

                // $rootScope.itemLength = response.data.pageInfo.recordCount;
            });
        };
        $scope.changeItemsPerPage = function (item) {
            Account.getAccountList({
                userType:1,
                pageIndex : 1,
                pageSize : item
            }).success(function (response) {
                $scope.cusAcc_list = response.data.list;
            });
        };


        /******* 新增客户账户 ********/
        $scope.addCusName = addCusName;
        $scope.addCusSmpName = addCusSmpName;
        $scope.addCusPhone = addCusPhone;
        $scope.addCusEmail = addCusEmail;
        $scope.addCusAddr = addCusAddr;
        $scope.addCus = addCus;

        //新增页面显隐
        $scope.addCusAccList={show: true};
        $scope.addCusAccountShow=function() {
            $scope.addCusAccList={show: false};  //新增客户显显示

            // 表单清空
            $scope.Code = "";
            $scope.Name = "";
            $scope.Phone = "";
            $scope.Email = "";
            $scope.Address = "";
            $scope.Active = "";
            $scope.customerId = undefined;

            $rootScope.addCodeRequired={show: false}; //编号非空
            $rootScope.addNameRequired={show: false}; //名称非空
            $rootScope.addActiveRequired={show: false}; //账户启用非空
            $rootScope.addCusIdRequired1={show: false}; //客户ID非空
            $rootScope.addProIdRequired={show: false}; //产品ID非空

            Customer.getCustomerList().success(function (response) {

                $scope.cus_list = response.data;
            });
            Product.getProductList().success(function (response) {

                $rootScope.product_list = response.data;
            });

            $scope.selected = [];

            var updateSelected = function(action,id){
                if(action == 'add' && $scope.selected.indexOf(id) == -1){
                    $scope.selected.push(id);
                }
                if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
                    var idx = $scope.selected.indexOf(id);
                    $scope.selected.splice(idx,1);
                }
            };

            $scope.updateSelection = function($event, id){
                var checkbox = $event.target;
                var action = (checkbox.checked?'add':'remove');
                updateSelected(action,id);
            };

            $scope.isSelected = function(id){
                return $scope.selected.indexOf(id)>=0;
            }

        };
        $scope.addCusAccountHide=function() {
            $scope.addCusAccList = {show: true};  //新增客户隐藏
        };

        //新增保存
        function addCusName(Code) {

            if (Code != "" && Code.length > 64) {  //客户名称过长
                $rootScope.codeTooLong = {show: true};
                $rootScope.addCodeRequired = {show: false};
                $rootScope.alphaDigit = {show: false};
                return false;
            }else if (Code == "" || Code == null) {  //客户名称非空校验
                $rootScope.addCodeRequired={show: true};
                $rootScope.codeTooLong={show: false};
                $rootScope.alphaDigit = {show: false};
                return false;
            }else if ( !(/^[A-Za-z0-9]+$/.test(Code))){
                $rootScope.alphaDigit = {show: true};
                $rootScope.addCodeRequired={show: false};
                $rootScope.codeTooLong={show: false};
            }else if (!(Code == "" || Code == null) && !(Code.length > 64) && (/^[A-Za-z0-9]+$/.test(Code))){
                $rootScope.alphaDigit = {show: false};
                $rootScope.addCodeRequired={show: false};
                $rootScope.codeTooLong={show: false};
            }
        }
        function addCusSmpName(Name) {

            if (Name != "" && Name.length > 64) {  //客户名称过长
                $rootScope.nameTooLong = {show: true};
                $rootScope.addNameRequired = {show: false};
                return false;
            }else if (Name == "" || Name == null) {  //客户名称非空校验
                $rootScope.addNameRequired={show: true};
                $rootScope.nameTooLong={show: false};
                return false;
            }else if (!(Name == "" || Name == null) && !(Name.length > 64)){
                $rootScope.addNameRequired={show: false};
                $rootScope.nameTooLong={show: false};
            }
        }
        function addCusPhone(Phone) {
            if (!(/^\d{0,64}$/.test(Phone))) {  //电话过长
                $rootScope.addPhone={show: true};
                return false;
            }else {
                $rootScope.addPhone={show: false};
            }
        }
        function addCusEmail(Email) {
            if ((Email != "") && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(Email))) {  //邮箱格式
                $rootScope.addEmail={show: true};
                return false;
            }else {
                $rootScope.addEmail={show: false};
            }
        }
        function addCusAddr(Address) {
            if (Address.length > 1024) {  //地址过长
                $rootScope.addAddr={show: true};
                return false;
            }else {
                $rootScope.addAddr={show: false};
            }
        }
        function addCus(customerId) {
            if (customerId == undefined) {  //客户为空
                $rootScope.addCusIdRequired1={show: true};
                return false;
            }else if ((customerId != undefined) || (customerId != "") || (customerId != null)){
                $rootScope.addCusIdRequired1={show: false};
            }
        }

        $scope.addCusAccSave = addCusAccSave;
        function addCusAccSave(Code,Name,Phone,Email,Address,customerId,Active) {

            var active_obj = document.getElementsByName('active');
            var temp_active = false;
            for(var i = 0; i < active_obj.length; i ++){
                if(active_obj[i].checked){
                    temp_active = true;
                    break;
                }
            }

            if (Code == "" || Code == null) {         //编号为空
                $rootScope.addCodeRequired = {show: true};
                return false;
            }else if (Name == "" || Name == null) {         //名称为空
                $rootScope.addNameRequired={show: true};
                return false;
            }else if(customerId == "" || customerId == null) {  //客户为空
                $rootScope.addCusIdRequired1 = {show: true};
                return false;
            }else if($scope.selected.length == 0) {  //产品为空
                $rootScope.addProIdRequired={show: true};
                return false;
            }else if(temp_active == false) {  //启用为空
                $rootScope.addActiveRequired = {show: true};
                return false;
            }else if (($rootScope.alphaDigit.show == false) && ($rootScope.addCodeRequired.show == false) && ($rootScope.codeTooLong.show ==false) && ($rootScope.addNameRequired.show == false) && ($rootScope.nameTooLong.show == false) && ($rootScope.addPhone.show == false) && ($rootScope.addEmail.show == false) && ($rootScope.addAddr.show == false) && ($rootScope.addCusIdRequired.show == false) && ($scope.selected.length > 0) && (temp_active == true)){
                Account.addAccountItem({
                    userCode : Code,
                    userName : Name,
                    userType : 1,
                    userPhone : Phone,
                    userEmail : Email,
                    userAddress : Address,
                    customerId : customerId,
                    productCatalogIdList : $scope.selected.toString(),
                    active : Active
                }).success(function (response) {
                    if (response.state.return == "true") {
                        $rootScope.addProIdRequired={show: false};
                        $rootScope.addActiveRequired = {show: false};
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
                            $scope.addCusAccountHide(
                                $window.location.reload()
                            );
                        },900)

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
                        $rootScope.addNameRequired={show: false}; //名称非空隐藏
                        $rootScope.addCodeRequired={show: false}; //编号非空隐藏

                        return false;
                    }
                });
            }

        }
        /******* 新建客户账号 End ******/

        /*******编辑客户账号******/
        $scope.editCusName = editCusName;
        $scope.editCusSmpName = editCusSmpName;
        $scope.editCusPhone = editCusPhone;
        $scope.editCusEmail = editCusEmail;
        $scope.editCusAddr = editCusAddr;
        $scope.editCus = editCus;
        //编辑页面显隐
        $rootScope.editCusAccList = {show: false};
        $scope.editCusAccountShow = function (Id) { //编辑客户显示
            $rootScope.editCusAccList = {show: true};

            $rootScope.addCodeRequired={show: false}; //编号非空
            $rootScope.addNameRequired={show: false}; //名称非空
            $rootScope.addActiveRequired={show: false}; //账户启用非空

            Account.getAccountInfo({
                userId : Id
            }).success(function (response) {
                $scope.userId = response.data.userInfo.userId;
                $scope.cusCode = response.data.userInfo.userCode;
                $scope.cusName = response.data.userInfo.userName;
                $scope.cusPhone = response.data.userInfo.userPhone;
                $scope.cusEmail = response.data.userInfo.userEmail;
                $scope.cusAddress = response.data.userInfo.userAddress;
                $scope.cusId = response.data.userInfo.customerId;
                $scope.cusCustomer = response.data.userInfo.customerName;
                $scope.Active = response.data.userInfo.active;
                $scope.cusUserType = response.data.userInfo.userType;


                response.data.userProductCatalogList.forEach( function ( data ) {
                    data.customerNote = unescape( data.customerNote );
                } );
                // 所属产品列表
                $scope.proCatalog_list = response.userProductCatalogList;
            });

            Customer.getCustomerList().success(function (response) {

                response.data.forEach( function ( data ) {
                    $rootScope.cId = data.customerId;
                } );
                $rootScope.cus_list = response.data;

            });
            Product.getProductList().success(function (response) {

                $rootScope.product_list = response.data;
                // $rootScope.productCatalogId = response.data.productCatalogId;
            });


                $scope.selected = [];
                $scope.selectedTags = [];

                $scope.updateSelected = function(action,id,name){
                    if(action == 'add' && $scope.selected.indexOf(id) == -1){
                        $scope.selected.push(id);
                        $scope.selectedTags.push(name);
                    }
                    if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
                        var idx = $scope.selected.indexOf(id);
                        $scope.selected.splice(idx,1);
                        $scope.selectedTags.splice(idx,1);
                    }
                };

                $scope.updateSelection = function($event, id){
                    var checkbox = $event.target;
                    var action = (checkbox.checked?'add':'remove');
                    $scope.updateSelected(action,id,checkbox.name);
                };

                $scope.isSelected = function(id){
                    return $scope.selected.indexOf(id)>=0;
                }
        };

        $scope.editCusAccountHide=function() {
            // $scope.editCusAccList = {show: false};  //编辑客户隐藏
            $window.location.reload();
            return false;
        };


        // 编辑保存
        function editCusName(Code) {

            if (Code != "" && Code.length > 64) {  //客户名称过长
                $rootScope.codeTooLong = {show: true};
                $rootScope.addCodeRequired = {show: false};
                $rootScope.alphaDigit = {show: false};
                return false;
            }else if (Code == "" || Code == null) {  //客户名称非空校验
                $rootScope.addCodeRequired={show: true};
                $rootScope.codeTooLong={show: false};
                $rootScope.alphaDigit = {show: false};
                return false;
            }else if ( !(/^[A-Za-z0-9]+$/.test(Code))){
                $rootScope.alphaDigit = {show: true};
                $rootScope.addCodeRequired={show: false};
                $rootScope.codeTooLong={show: false};
            }else if (!(Code == "" || Code == null) && !(Code.length > 64) && (/^[A-Za-z0-9]+$/.test(Code))){
                $rootScope.alphaDigit = {show: false};
                $rootScope.addCodeRequired={show: false};
                $rootScope.codeTooLong={show: false};
            }
        }
        function editCusSmpName(Name) {

            if (Name != "" && Name.length > 64) {  //客户名称过长
                $rootScope.nameTooLong = {show: true};
                $rootScope.addNameRequired = {show: false};
                return false;
            }else if (Name == "" || Name == null) {  //客户名称非空校验
                $rootScope.addNameRequired={show: true};
                $rootScope.nameTooLong={show: false};
                return false;
            }else if (!(Name == "" || Name == null) && !(Name.length > 64)){
                $rootScope.addNameRequired={show: false};
                $rootScope.nameTooLong={show: false};
            }
        }
        function editCusPhone(Phone) {
            if (!(/^\d{0,64}$/.test(Phone))) {  //电话过长
                $rootScope.addPhone={show: true};
                return false;
            }else {
                $rootScope.addPhone={show: false};
            }
        }
        function editCusEmail(Email) {
            if ((Email != "") && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(Email))) {  //邮箱格式
                $rootScope.addEmail={show: true};
                return false;
            }else {
                $rootScope.addEmail={show: false};
            }
        }
        function editCusAddr(Address) {
            if (Address.length > 1024) {  //地址过长
                $rootScope.addAddr={show: true};
                return false;
            }else {
                $rootScope.addAddr={show: false};
            }
        }
        function editCus(customerId) {
            // alert(customerId);
            if (customerId == undefined) {  //客户为空
                $rootScope.addCusIdRequired1={show: true};
                return false;
            }else if ((customerId != undefined) || (customerId != "") || (customerId != null)){
                $rootScope.addCusIdRequired1={show: false};
                // alert(customerId);
            }
        }

        function editCusAccSave(cusCode,cusName,cusPhone,cusEmail,cusAddress,cusCustomer,Active) {
            /*var code = document.getElementById("editCusCode").value;
            var name = document.getElementById("editCusName").value;
            var phone = document.getElementById("editCusPhone").value;
            var email = document.getElementById("editCusEmail").value;

            var cusNameLength = document.getElementById("editCusName").value.replace(/[\u0391-\uFFE5]/g,"aa").length;
            var cusCodeLength = document.getElementById("editCusCode").value.length;*/

            /*if(name == "" && code == "" ){    //名称、编号 为空
                $rootScope.addNameRequired={show: true};
                $rootScope.addCodeRequired={show: true};
                return false;
            }else */
            if (cusName == "" || cusName == null) {         //名称为空
                $rootScope.addNameRequired={show: true};
                return false;
            }else if (cusCode == "" || cusCode == null) {         //编号为空
                $rootScope.addCodeRequired = {show: true};
                return false;
       /*     }else if (phone != "" && !(/^[1][3578][0-9]{9}$/.test(phone))){     //电话不为空但格式错误
                $rootScope.addPhone={show: true};
                return false;
            }else if(email != "" && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email))){     //邮箱不为空但格式错误
                $rootScope.addEmail={show: true};
                return false;
            }else if (cusCodeLength >= 64){
                $rootScope.codeTooLong={show: true};  //名称过长
                return false;
            }else if(cusNameLength >= 64){
                $rootScope.nameTooLong={show: true};
                return false;*/
            }else if (($rootScope.alphaDigit.show == false) && ($rootScope.addCodeRequired.show == false) && ($rootScope.codeTooLong.show ==false) && ($rootScope.addNameRequired.show == false) && ($rootScope.nameTooLong.show == false) && ($rootScope.addPhone.show == false) && ($rootScope.addEmail.show == false) && ($rootScope.addAddr.show == false) && ($rootScope.addCusIdRequired.show == false) && ($rootScope.addProIdRequired.show == false) && ($rootScope.addActiveRequired.show == false)){

            }else{
                /*$rootScope.addCodeRequired={show: false}; //编号非空隐藏
                $rootScope.addNameRequired={show: false}; //名称非空隐藏
                $rootScope.addPhone={show: false}; //电话格式隐藏
                $rootScope.addEmail={show: false}; //邮箱格式隐藏
                $rootScope.alphaDigit={show: false}; //数字、字母
                $rootScope.codeTooLong={show: false};  //名称过长
                $rootScope.nameTooLong={show: false};   //编号过长*/
                Account.updateAccountItem({
                    userId : $scope.userId,
                    userName : cusName,
                    userCode : cusCode,
                    userType : 1,
                    userPhone : cusPhone,
                    userEmail : cusEmail,
                    userAddress : cusAddress,
                    customerId : cusCustomer,
                    // productCatalogIdList : ,
                    active : Active
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
                            $scope.editCusAccountHide(
                                $rootScope.refreshCusAcc()
                            );
                        },900)
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
                        $rootScope.addNameRequired={show: false}; //名称非空隐藏
                        $rootScope.addCodeRequired={show: false}; //编号非空隐藏

                        return false;
                    }
                });
            }
        }
        /******** 编辑客户账号 End *********/

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
        $rootScope.logOutPanel = {show: false};
        $scope.logOutToggle = function () {
            $rootScope.logOutPanel = {show: true};
        };
        $scope.logOutToggle2 = function () {
            $rootScope.logOutPanel = {show: false};
        };

        /********** 登出 ***********/
        $scope.logOut = logOut;
        function logOut() {

            Login.loginOut().success(function (response) {
                if (response.state.return = "true") {
                    $window.location.href = "../index.html";
                } else {
                    alert(response.state.info);
                }

            });
        }


        /*******删除客户账户Modal********/
        $scope.deleteCus = deleteCus;

        function deleteCus(userId) {
            var modalInstance = $uibModal.open({
                size: 'sm',
                animation: true,
                templateUrl: './deleteTemp.html',
                controller: 'ModalDelCusAccountController',
                resolve: {},
                opened: $rootScope.CId = userId

            });
            modalInstance.closed.then(
            );
        }

    }])
    .config(["modelFormatConfig",
        function(modelFormatConfig) {
            modelFormatConfig["number"] = {
                "formatter": function(args) {
                    var modelValue = args.$modelValue,
                        filter = args.$filter;
                    return filter("number")(modelValue);
                },
                "parser": function(args) {
                    var val = parseInt(args.$viewValue.replace(/[^0-9\-]/g, ''), 10);
                    return isNaN(val) ? undefined : val;
                },
                "isEmpty": function(value) {
                    return !value.$modelValue;
                },
                "keyDown": function(args) {
                    var event = args.$event;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper.functionKeyBoard(event) || minus(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }

            }
        }
    ])
/*********删除客户账户Modal Controller**********/

    .controller('ModalDelCusAccountController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout,Account) {
            $rootScope.deleteSuccess={show: false};
            $scope.deleteFun = deleteFun;
            function deleteFun() {
                $scope.accId = $rootScope.CId; //从页面传来的ID赋值后再传
                Account.delAccountItem({
                    userId: $scope.accId
                }).success(function(response){
                    if(response.state.return == "true"){
                        $rootScope.deleteSuccess={show: true};
                        $timeout(function () {
                            $uibModalInstance.close(
                                $window.location.reload()
                            )
                        },1000)
                    }
                }

                )
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

        })
    /********* 会话超时 Modal Controller**********/

    .controller('ModalTimeoutController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout) {
            $scope.info = $rootScope.errInfo;
            // 关闭Modal
            $scope.close_modal = close_modal;

            $timeout(function () {
                $scope.logOut = function (){

                    Login.loginOut().success(function (response) {
                        if (response.state.return ="true"){
                            $window.location.href = "../index.html";
                        }else{
                            alert(response.state.info);
                        }

                    });
                }
            },2000);

            function close_modal() {
                $uibModalInstance.close();
            }

        });
