angular.module('orderCloud')
    .config(AutoLoginConfig)
    .factory('AutoLoginService', AutoLoginService)
    .controller('AutoLoginCtrl', AutoLoginController)
;

function AutoLoginConfig($stateProvider) {
    $stateProvider
        .state('autoLogin', {
            url: '/autoLogin/:token/:timestamp',
            templateUrl: 'autoLogin/templates/autoLogin.tpl.html',
            controller: 'AutoLoginCtrl',
            controllerAs: 'autoLogin'
        })
    ;
}

function AutoLoginService($q, $window, $state, toastr, OrderCloud, TokenRefresh, clientid, buyerid, anonymous) {
    return {
        SendVerificationCode: _sendVerificationCode,
        ResetPassword: _resetPassword,
        RememberMe: _rememberMe,
        Logout: _logout
    };
}

function AutoLoginController($state, $stateParams, $exceptionHandler, OrderCloud, LoginService, TokenRefresh, buyerid) {
    var vm = this;

    vm.token = $stateParams.token;
    vm.timestamp = $stateParams.timestamp;
    vm.encryptstamp = $stateParams.encryptstamp;

    // TODO: Check that stamp matches with encryptstamp


    vm.form = 'login';
    vm.submit = function() {
        OrderCloud.BuyerID.Set(buyerid);
        OrderCloud.Auth.SetToken(vm.token);
        $state.go('home');
    };

    var OneMinuteAgo = new Date().getTime() - 60000;
    if(vm.timestamp > OneMinuteAgo){
      vm.submit();
    }

}
