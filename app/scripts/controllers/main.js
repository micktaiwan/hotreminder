'use strict';

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

angular.module('hotreminderApp')

  .controller('MainCtrl', function ($rootScope, $scope, $location, Google, Db, Notification) {

    $rootScope.current_date = new Date().getTime();
    $rootScope.weekNumber = (new Date()).getWeek();

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
      for(var i in values) {
        $scope.subjects.push(Db.newSubject(i, values[i]));
      };
      console.log($scope.subjects.length+' subjects');
    });

    $scope.addSubject = function(title, content) {
      Db.addSubject(title, content);
      $scope.title    = '';
      $scope.content  = '';
    };

  });
