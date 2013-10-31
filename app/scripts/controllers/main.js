'use strict';

angular.module('hotreminderApp')

  .controller('MainCtrl', function ($scope, Db, Notification) {
    $scope.subjects = Db.subjects;
    $scope.todo = Db.todo;

    $scope.enableNotifications = function() {
        Notification.enableNotifications();
    };

    $scope.addNotification = function(){
        Notification.addNotifications(Notification.types.WARNING, this.notification);
    };

  });
