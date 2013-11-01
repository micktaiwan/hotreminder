'use strict';

angular.module('hotreminderApp')

  .controller('MainCtrl', function ($scope, Db, Notification) {
    Db.init();
    $scope.subjects = [];

    Db.getSubjects(function(values) {
      console.log('getting subjects');
      $scope.subjects = []; // we reinitialize all subjects
      for(var i in values) {
        $scope.subjects.push(values[i]);
      };
      console.log($scope.subjects.length+' subjects')
    });

    $scope.addSubject = function(title, content) {
      console.log(title);
      Db.addSubject(title, content, 'Mick');
    };

    $scope.enableNotifications = function() {
        Notification.enableNotifications();
    };

    $scope.addNotification = function(){
        Notification.addNotifications(Notification.types.WARNING, this.notification);
    };

  });
