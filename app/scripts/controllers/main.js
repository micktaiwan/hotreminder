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
    $scope.user = null;
    $scope.subjects = [];
    $scope.lastUpdates = [];

    var u = Google.getUser();
    if(!u || !u.id ) {
      $location.path('/');
      return;
    }

    $scope.user = u;

    var getSubjectById = function(id) {
      var rv = null;
      $scope.subjects.some(function(s) {
        //console.log(s.title + ' ('+s.id+')')
        if(s.id==id) {
          rv = s;
          return;
        }
      });
      return rv;
    };

    var onCommentAdded = function(sid, comment) {
      console.log("Received comment for subject "+sid);
      //console.log(comment);
      var s = getSubjectById(sid);
      if(!s) return;
      if(!s.comments) s.comments = {};
      s.comments[comment.id] = comment;
      s.showComments = true;
    }

    $scope.addNotification = function(type, notif){
      Notification.addNotifications(type, notif);
    };

    $scope.getSubjectsCallback = function (values) {
      $scope.subjects = []; // we reinitialize all subjects (useless if we detach onvalue callback)
      for(var i in values) {
        $scope.subjects.push(Db.newSubject(values[i], onCommentAdded));
      };
      console.log($scope.subjects.length+' subjects');
    }

    // Db.getSubjects($scope.getSubjectsCallback);

    Db.getLastUpdates(function(values) {
      $scope.lastUpdates = [];
      for(var i in values) {
        $scope.lastUpdates.push(values[i]);
      };
      console.log($scope.lastUpdates.length+' updates');
    });

    Db.onAddingSubject(function(subject) {
      console.log("Received subject " + subject.title + ' (' + subject.id + ')');
      $scope.subjects.push(Db.newSubject(subject, onCommentAdded));
    });

    Db.onDeletingSubject(function(subject) {
      $scope.deleteSubject(subject);
    });

    $scope.addSubject = function(title, content) {
      console.log('Adding subject ' + title + ' (id: ' + Db.addSubject(title, content) + ')');
      $scope.title    = '';
      $scope.content  = '';
    };

    $scope.deleteSubject = function(subject) {
      var s = getSubjectById(subject.id);
      var i = $scope.subjects.indexOf(s);
      $scope.subjects.splice(i, 1);
      console.log("Deleted " + subject.title);
    };

  });
