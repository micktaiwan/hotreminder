angular.module("hotreminderApp.directives.subject", ['ui']).directive('subject', function($timeout, Db) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      s: '=object',
      user: '=user',
      changed: '&'
    },
    templateUrl : 'views/subject.html',

    controller: function($scope) {

      $scope.s.show = false;
      $scope.setState = function(state) {
        Db.setState($scope.s.id, state);
      };
      $scope.deleteSubject = function() {
        Db.deleteSubject($scope.s.id);
      };
      $scope.addComment = function() {
        Db.addComment($scope.s.id, $scope.comment.text);
      };
      $scope.deleteComment = function(cid) {
        Db.deleteComment($scope.s.id, cid.id);
      };
    },

    link: function(scope, element, attrs) {

      scope.editorEnabled = false;

      scope.save = function($event) {
        if ($event != null) $event.preventDefault();
        scope.s = angular.copy(scope.edit);
        Db.edit(scope.s.id, {modificationDate: (new Date()).getTime(), title: scope.s.title, content: scope.s.content});
        scope.editorEnabled = false;
      };

      scope.cancel = function($event) {
        if ($event != null) $event.preventDefault();
        scope.editorEnabled = false;
      };

      scope.enableEditor = function() {
        scope.edit = angular.copy(scope.s);
        scope.editorEnabled = true;
        $timeout(function() {
          element.find('input').focus().select();
        }, 20);
      };
    }
  }
});
