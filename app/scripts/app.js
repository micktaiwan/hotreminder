'use strict';

angular.module('hotreminderApp', [
    'hotreminderApp.config',
    'hotreminderApp.services.notification',
    'hotreminderApp.services.db',
    'hotreminderApp.filters.filterStateBy',
    'google'
    ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/notification_test', {
        templateUrl: 'views/notification_test.html',
        controller: 'NotificationTestCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/:params', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/main'
      });
  });
