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
      $scope.setState = function(subject, state) {
        Db.setState(subject, state);
      };
      $scope.deleteSubject = function(id) {
        Db.deleteSubject(id);
      };
    },

    link: function(scope, element, attrs) {

      scope.editorEnabled = false;

      scope.unEdit = function($event) {
        scope.s = angular.copy(scope.s);
        scope.editorEnabled = false;
        if ($event != null) $event.preventDefault();
        scope.changed();
      };

      scope.enableEditor = function() {
        scope.s = angular.copy(scope.s);
        scope.editorEnabled = true;
        // The enabled element needs focus and we wait for some milliseconds before allowing to focus on it, so HTML can be compiled
        $timeout(function() {
          element.find('input').focus().select();
        }, 20);
      };
    }
  }
});
