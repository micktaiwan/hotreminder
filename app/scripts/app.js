'use strict';

angular.module('hotreminderApp', [
    'hotreminderApp.services.notification'
    ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/notification_test', {
        templateUrl: 'views/notification_test.html',
        controller: 'NotificationTestCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
