'use strict';

angular.module('hotreminderApp')

  .controller('MainCtrl', function ($rootScope, $scope, $location, Google, Db, Notification) {

    var u = Google.getUser();
    if(!u || !u.id ) {
      $location.path('/');
      return;
    }

    $scope.subjects = [];
    $scope.user = u;

    $scope.addNotification = function(type, notif){
      Notification.addNotifications(type, notif);
    };

    Db.getSubjects(function(values) {
      $scope.subjects = []; // we reinitialize all subjects
      //  $scope.subjects.push(values[i]);
      for(var i in values) {
        $scope.subjects.push(Db.newSubject(i, values[i].title, values[i].content, values[i].author, values[i].states, values[i].date));
      };
      console.log($scope.subjects.length+' subjects');
      //$scope.addNotification(Notification.types.INFO, $scope.subjects.length+' subjects');
    });

    $scope.addSubject = function(title, content) {
      Db.addSubject(title, content);
    };
    $scope.deleteSubject = function(id) {
      Db.deleteSubject(id);
    };
    $scope.setState = function(subject, state) {
      Db.setState(subject, state);
    };

  });
