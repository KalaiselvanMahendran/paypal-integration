var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        // home
        .state('home', {
            url: '/',
            templateUrl: '/partials/home.html',
            controller: 'homeCtrl'
        })

        // success
        .state('success', {
            url: '/success',
            templateUrl: '/partials/success.html',
            controller: 'successCtrl'
        })

        // cancel
        .state('cancel', {
            url: '/cancel',
            templateUrl: '/partials/cancel.html',
            controller: 'cancelCtrl'
        });

});

app.controller('homeCtrl', function($scope, $http, $window) {
    $scope.msg = "Hello Kalai"

    $scope.submit = function() {
        $http.get('/create').then(function(response){
            if(response.data.success) {
                $window.location.href = response.data.url;
            }
            else {
                console.log(response);
            }
        })
    };
});

app.controller('cancelCtrl', function($scope, $http, $window) {
    $scope.title = "Cancel"

    $http.get('/cancel').then(function(response){
        $scope.cancelObj = response.data;
    })
});

app.controller('successCtrl', function($scope, $http, $window) {
    $scope.title = "Success"

    $http.get('/execute').then(function(response){
        $scope.successObj = response.data;
    })
});
