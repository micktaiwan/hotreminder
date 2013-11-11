'use strict';

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

angular.module('hotreminderApp')

  .controller('MainCtrl', function ($rootScope, $scope, $location, Google, Db, Notification) {

    $rootScope.current_date = new Date().getTime();
    $rootScope.weekNumber   = new Date().getWeek();
/*    $rootScope.iterate = function(obj, props, index) {
      console.log(obj);
      if(!index) index = 0;
      if(index>=props.length) return obj[props[index-1]];
      if(!obj[props[index]]) obj[obj[props[index]]] = {};
      return $rootScope.iterate(obj[props[index]], props, index+1);
    };
*/
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

/*    Db.getSubjects(function(values) {
      $scope.subjects = []; // we reinitialize all subjects (useless if we detach onvalue callback)
      for(var i in values) {
        $scope.subjects.push(Db.newSubject(i, values[i]));
      };
      dataRef.off('value');
      console.log($scope.subjects.length+' subjects');
    });
*/
    Db.onAddingSubject(function(subject) {
      $scope.subjects.push(Db.newSubject(subject));
      console.log("Added " + subject.title);
    });

    Db.onDeletingSubject(function(subject) {
      $scope.deleteSubject(subject);
    });

    $scope.addSubject = function(title, content) {
      Db.addSubject(title, content);
      $scope.title    = '';
      $scope.content  = '';
    };

    $scope.getSubjectById = function(id) {
      $scope.subjects.forEach(function(s) {if(s.id==id) return s});
      return null;
    };

    $scope.deleteSubject = function(subject) {
      var s = $scope.getSubjectById(subject.id);
      var i = $scope.subjects.indexOf(s);
      $scope.subjects.splice(i, 1);
      console.log("Deleted " + subject.title);
    };


  });
