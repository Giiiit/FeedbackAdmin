/**
 * Created by zx on 2016/9/21.
 */
'use strict';

angular.module('adminUserAccount',['ui.router','service','ui.bootstrap'])
    .controller('adminUserAccountController', [ 'Account','$scope','$cookies','$window', '$rootScope','$uibModal','$state','$timeout','Login', function (Account, $scope,$cookies,$window,$rootScope,$uibModal,$state,$timeout,Login) {

        $scope.editAdmAccSave = editAdmAccSave;

        // 非空校验
        $rootScope.addCodeRequired={show: false}; //编号非空
        $rootScope.addNameRequired={show: false}; //名称非空
        $rootScope.addActiveRequired={show: false}; //账户启用非空
        // 格式校验
        $rootScope.alphaDigit={show: false}; //数字、字母
        $rootScope.addPhone={show: false}; //电话号码
        $rootScope.addEmail={show: false}; //电子邮箱
        //过长
        $rootScope.codeTooLong={show: false};  //名称过长
        $rootScope.nameTooLong={show: false};   //编号过长
        $rootScope.addAddr={show: false};   //地址过长


        /******获取售后账户管理列表内容*****/
        Account.getAccountList({
            userType:2
            }).success(function (response) {
            $scope.admAcc_list = response.data.list;
            $rootScope.itemLength = response.data.pageInfo.recordCount;

        });

        /******获取账户信息*****/
        var uId = $cookies.get("userId");
        Account.getAccountInfo({
            userId : uId
        }).success(function (response) {

            $rootScope.username = response.data.userInfo.userName;
            $scope.userType = response.data.userInfo.userType;

            if ($scope.userType == undefined) {
                document.getElementById("admin_logo").text = "客户问题反馈平台（管理员入口）";
            }

        });

        /******** 启用账号 *********/
        $scope.activeOff = function (uId,act){
            if(act == true){
                Account.stopAccountItem({
                    userId : uId
                }).success(function (response) {
                    if (response.state.return == "true"){
                        Account.getAccountList({
                            userType:2
                        }).success(function (response) {
                            $scope.admAcc_list = response.data.list;
                            $rootScope.itemLength = response.data.pageInfo.recordCount;

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
        $scope.activeOn = function (uId,act){
            if(act == false){
                Account.startAccountItem({
                    userId : uId
                }).success(function (response) {
                    if (response.state.return == "true"){
                        Account.getAccountList({
                            userType:2
                        }).success(function (response) {
                            $scope.admAcc_list = response.data.list;
                            $rootScope.itemLength = response.data.pageInfo.recordCount;

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
        $rootScope.refreshProduct = refreshProduct;
        function refreshProduct() {
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
                userType:2,
                pageIndex : currentPage,
                pageSize : item
            }).success(function (response) {
                $scope.admAcc_list = response.data.list;

                // $rootScope.itemLength = response.data.pageInfo.recordCount;
            });
        };
        $scope.changeItemsPerPage = function (item) {
            Account.getAccountList({
                userType:2,
                pageIndex : 1,
                pageSize : item
            }).success(function (response) {
                $scope.admAcc_list = response.data.list;
            });
        };

        /******* 新增售后账户 ********/
        $scope.addCusName = addCusName;
        $scope.addCusSmpName = addCusSmpName;
        $scope.addCusPhone = addCusPhone;
        $scope.addCusEmail = addCusEmail;
        $scope.addCusAddr = addCusAddr;
        //新增页面显隐

        $scope.addAdmAccList={show: true};
        $rootScope.addAdmAccountShow=function() {
            $scope.addAdmAccList.show=!$scope.addAdmAccList.show;  //新增客户toggle显隐
            // 表单清空
            $scope.Code = "";
            $scope.Name = "";
            $scope.Phone = "";
            $scope.Email = "";
            $scope.Address = "";
            $scope.Active = "";

            $rootScope.addCodeRequired={show: false}; //编号非空
            $rootScope.addNameRequired={show: false}; //名称非空
            $rootScope.addActiveRequired={show: false}; //账户启用非空



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

        $scope.addAdmAccSave = addAdmAccSave;
        function addAdmAccSave(Code,Name,Phone,Email,Address,Active) {
            var active_obj = document.getElementsByName('active');
            var temp_active = false;
            for(var i = 0; i < active_obj.length; i ++){
                if(active_obj[i].checked){
                    temp_active = true;
                    break;
                }
            }

            if (Code == "" || Code == null) {
                $rootScope.addCodeRequired = {show: true};
                return false;
            }else if (Name == "" || Name == null) {
                $rootScope.addNameRequired={show: true};
                return false;
            }else if(temp_active == false) {
                $rootScope.addActiveRequired = {show: true};
                return false;
            }else if ((temp_active == true) && ($rootScope.alphaDigit.show == false) && ($rootScope.addCodeRequired.show == false) && ($rootScope.codeTooLong.show == false) && ($rootScope.addNameRequired.show == false) && ($rootScope.nameTooLong.show == false) && ($rootScope.addPhone.show == false) && ($rootScope.addEmail.show == false) && ($rootScope.addAddr.show == false)){
                /*}else if ((code != "" || code != null) && (name == "" || name == null)){   //售后编号不为空 名称为空
                $rootScope.addNameRequired={show: true};
                $rootScope.addCodeRequired={show: false};
                return false;
            }else if ((code == "" || code == null) && (name != "" || name != null)){   //售后名称不为空 编号为空
                $rootScope.addNameRequired={show: false};
                $rootScope.addCodeRequired={show: true};
                return false;
            }else if (phone != "" && !(/^[1][3578][0-9]{9}$/.test(phone))){
                $rootScope.addPhone={show: true};
                $rootScope.addCodeRequired={show: false};
                $rootScope.addNameRequired={show: false};
                return false;
            }else if(email != "" && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email))){
                $rootScope.addEmail={show: true};
                return false;
            }else if( !(/^[A-Za-z0-9]+$/.test(code))){      //编号格式
                $rootScope.alphaDigit={show: true};
                return false;
            }else if (admCodeLength >= 64){
                $rootScope.codeTooLong={show: true};  //名称过长
                return false;
            }else if(admNameLength >= 64){
                $rootScope.nameTooLong={show: true};
                return false;
            }else{
                $rootScope.addCodeRequired={show: false}; //编号非空
                $rootScope.addNameRequired={show: false}; //名称非空
                $rootScope.addActiveRequired={show: false}; //账户启用非空
                $rootScope.addPhone={show: false}; //电话号码
                $rootScope.addEmail={show: false}; //电子邮箱
                $rootScope.alphaDigit={show: false}; //数字、字母
                $rootScope.codeTooLong={show: false};  //名称过长
                $rootScope.nameTooLong={show: false};   //编号过长*/
                Account.addAccountItem({
                    userCode : Code,
                    userName : Name,
                    userType : 2,
                    userPhone : Phone,
                    userEmail : Email,
                    userAddress : Address,
                    active : Active
                }).success(function (response) {
                    if (response.state.return == "true") {
                        $rootScope.addActiveRequired={show: false};
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
                            $scope.addAdmAccountShow(
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
                        $rootScope.addCodeRequired={show: false}; //全称非空
                        $rootScope.addNameRequired={show: false}; //简称非空
                        return false;
                    }
                });
            }

        }



        /*******编辑售后账号******/
        $scope.editCusName = editCusName;
        $scope.editCusSmpName = editCusSmpName;
        $scope.editCusPhone = editCusPhone;
        $scope.editCusEmail = editCusEmail;
        $scope.editCusAddr = editCusAddr;
        //编辑页面显隐
        $rootScope.editAdmAccList={show: false};
        $rootScope.editAdmAccSaveShow=function(admId) {
            $rootScope.editAdmAccList={show: true};

            Account.getAccountInfo({
                userId : admId
            }).success(function (response) {
                $scope.userId = response.data.userInfo.userId;
                $scope.admCode = response.data.userInfo.userCode;
                $scope.admName = response.data.userInfo.userName;
                $scope.admPhone = response.data.userInfo.userPhone;
                $scope.admEmail = response.data.userInfo.userEmail;
                $scope.admAddress = response.data.userInfo.userAddress;
                $scope.admId = response.data.userInfo.customerId;
                $scope.admCustomer = response.data.userInfo.customerName;
                $scope.admActive = response.data.userInfo.active;
                $scope.admUserType = response.data.userInfo.userType;

            });
        };

        $rootScope.editAdmAccountHide=function() {
            // $scope.editAdmAccList = {show: false};  //编辑售后隐藏
            $window.location.reload();
            return false;
        };
        // 编辑保存

        function editCusName(admCode) {

            if (admCode != "" && admCode.length > 64) {  //客户名称过长
                $rootScope.codeTooLong = {show: true};
                $rootScope.addCodeRequired = {show: false};
                $rootScope.alphaDigit = {show: false};
                return false;
            }else if (admCode == "" || admCode == null) {  //客户名称非空校验
                $rootScope.addCodeRequired={show: true};
                $rootScope.alphaDigit={show: false};
                $rootScope.codeTooLong={show: false};
                return false;
            }else if ( !(/^[A-Za-z0-9]+$/.test(admCode))) {  //数字 字母
                $rootScope.alphaDigit={show: true};
                $rootScope.addCodeRequired={show: false};
                $rootScope.codeTooLong={show: false};
                return false;
            }else if (!(admCode == "" || admCode == null) && !(admCode.length > 64) && (/^[A-Za-z0-9]+$/.test(admCode))){
                $rootScope.addCodeRequired={show: false};
                $rootScope.alphaDigit={show: false};
                $rootScope.codeTooLong={show: false};
            }
        }
        function editCusSmpName(admName) {

            if (admName != "" && admName.length > 64) {  //客户名称过长
                $rootScope.nameTooLong = {show: true};
                $rootScope.addNameRequired = {show: false};
                return false;
            }else if (admName == "" || admName == null) {  //客户名称非空校验
                $rootScope.addNameRequired={show: true};
                $rootScope.nameTooLong={show: false};
                return false;
            }else if (!(admName == "" || admName == null) && !(admName.length > 64)){
                $rootScope.addNameRequired={show: false};
                $rootScope.nameTooLong={show: false};
            }
        }
        function editCusPhone(admPhone) {
            if (!(/^\d{0,64}$/.test(admPhone))) {  //电话过长
                $rootScope.addPhone={show: true};
                return false;
            }else {
                $rootScope.addPhone={show: false};
            }
        }
        function editCusEmail(admEmail) {
            if ((admEmail    != "") && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(admEmail))) {  //邮箱格式
                $rootScope.addEmail={show: true};
                return false;
            }else {
                $rootScope.addEmail={show: false};
            }
        }
        function editCusAddr(admAddress) {
            if (admAddress.length > 1024) {  //传真过长
                $rootScope.addAddr={show: true};
                return false;
            }else {
                $rootScope.addAddr={show: false};
            }
        }
        function editAdmAccSave(admCode,admName,admPhone,admEmail,admAddress,admActive) {
            /*var editAdmCode = document.getElementById("editAdmCode").value;
            var editAdmName = document.getElementById("editAdmName").value;
            var editAdmPhone = document.getElementById("editAdmPhone").value;
            var editAdmEmail = document.getElementById("editAdmEmail").value;

            var editAdmCodeLength = document.getElementById("editAdmCode").value.length;
            var editAdmNameLength = document.getElementById("editAdmName").value.replace(/[\u0391-\uFFE5]/g,"aa").length;
*/

            if (admCode == "" || admCode == null) {  //售后编号非空校验
                $rootScope.addCodeRequired={show: true};
                return false;
            }else if (admName == "" || admName == null) {   //售后名称非空校验
                $rootScope.addNameRequired = {show: true};
                return false;
            }else if (($rootScope.alphaDigit.show == false) && ($rootScope.addCodeRequired.show == false) && ($rootScope.codeTooLong.show == false) && ($rootScope.addNameRequired.show == false) && ($rootScope.nameTooLong.show == false) && ($rootScope.addPhone.show == false) && ($rootScope.addEmail.show == false) && ($rootScope.addAddr.show == false) && ($rootScope.addActiveRequired.show == false)){
            /*}else if ((editAdmCode != "" || editAdmCode != null) && (editAdmName == "" || editAdmName == null)){   //售后编号不为空 名称为空
                $rootScope.addNameRequired={show: true};
                $rootScope.addCodeRequired={show: false};
                return false;
            }else if ((editAdmCode == "" || editAdmCode == null) && (editAdmName != "" || editAdmName != null)){   //售后名称不为空 编号为空
                $rootScope.addNameRequired={show: false};
                $rootScope.addCodeRequired={show: true};
                return false;
            }else if (editAdmPhone != "" && !(/^[1][3578][0-9]{9}$/.test(editAdmPhone))){
                $rootScope.addPhone={show: true};
                $rootScope.addCodeRequired={show: false};
                $rootScope.addNameRequired={show: false};
                return false;
            }else if(editAdmEmail != "" && !(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(editAdmEmail))){
                $rootScope.addEmail={show: true};
                return false;
            }else if( !(/^[A-Za-z0-9]+$/.test(editAdmCode))){      //编号格式
                $rootScope.alphaDigit={show: true};
                return false;
            }else if (editAdmCodeLength >= 64){
                $rootScope.codeTooLong={show: true};  //名称过长
                return false;
            }else if(editAdmNameLength >= 64){
                $rootScope.nameTooLong={show: true};
                return false;
            }else{
                $rootScope.addCodeRequired={show: false}; //编号非空隐藏
                $rootScope.addNameRequired={show: false}; //名称非空隐藏
                $rootScope.addPhone={show: false}; //电话格式隐藏
                $rootScope.addEmail={show: false}; //邮箱格式隐藏
                $rootScope.alphaDigit={show: false}; //数字、字母
                $rootScope.codeTooLong={show: false};  //名称过长
                $rootScope.nameTooLong={show: false};   //编号过长*/
                Account.updateAccountItem({
                    userId : $scope.userId,
                    userCode : admCode,
                    userName : admName,
                    userType : 2,
                    userPhone : admPhone,
                    userEmail : admEmail,
                    userAddress : admAddress,
                    active : admActive
                }).success(function(response){
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
                            $scope.editAdmAccountHide(
                                $window.location.reload()
                            );
                        },900)

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
                        $rootScope.editRequired={show: false};
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


        /*******删除售后账户Modal********/
        $scope.deletePro1 = deletePro1;

        function deletePro1(admId) {
            var modalInstance = $uibModal.open({
                size: 'sm',
                animation: true,
                templateUrl: './deleteTemp.html',
                controller: 'ModalDelAdmAccController',
                resolve: {},
                opened:$rootScope.aId = admId

            });
            modalInstance.closed.then(
            );
        }

    }])


/*********删除售后账户Modal Controller**********/

    .controller('ModalDelAdmAccController',
        function ($scope,$rootScope,$window, $uibModalInstance,$timeout,Account) {
            $rootScope.deleteSuccess={show: false};
            $scope.deleteFun = deleteFun;
            function deleteFun() {
                $rootScope.admId = $rootScope.aId; //从adminProductController页面传来的productCatalogId赋值后再传
                Account.delAccountItem({
                    userId: $rootScope.admId
                }).success(function (response) {
                    if(response.state.return == "true"){
                        $rootScope.deleteSuccess={show: true};
                        $timeout(function () {
                            $uibModalInstance.close(
                                $rootScope.refreshProduct()
                            );
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
