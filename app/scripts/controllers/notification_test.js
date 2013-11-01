'use strict';

angular.module('hotreminderApp')
  .controller('NotificationTestCtrl', function ($scope, Notification) {

    $scope.enableNotifications = function() {
        Notification.enableNotifications();
    };

    $scope.addNotification = function(){
        Notification.addNotifications(Notification.types.WARNING, this.notification);
    };

  });
