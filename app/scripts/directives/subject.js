angular.module("hotreminderApp.directives.subject", ['ui']).directive('subject', function($rootScope, $timeout, Db) {
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

      if(!$scope.s.show) $scope.s.show = false;
      $scope.setState = function(state) {
        Db.setState($scope.s.id, state);
/*        var obj = $rootScope.iterate($scope.s, ['states', $scope.user.id, 'state']);
        obj = state;
        $scope.$digest();
        console.log(obj);
*/
        if(!$scope.s.states) $scope.s.states = {};
        if(!$scope.s.states[$scope.user.id]) $scope.s.states[$scope.user.id] = {};
        $scope.s.states[$scope.user.id].state = state;
        $scope.s.showComments = false;
      };
      $scope.deleteSubject = function() {
        if(!$scope.s.id) console.log('no subject id')
        else Db.deleteSubject($scope.s.id);
      };
      $scope.addComment = function() {
        var comment = Db.addComment($scope.s.id, $scope.comment.text);
        $scope.comment.text = "";
/*        if(comment) { // adding a comment and will be erased over by the network update
          if(!$scope.s.comments) $scope.s.comments = {};
          comment.text = "(sending) " + comment.text;
          $scope.s.comments[comment.id] = comment;
        }*/
      };
      $scope.deleteComment = function(cid) {
        Db.deleteComment($scope.s.id, cid);
        delete $scope.s.comments[cid];
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
