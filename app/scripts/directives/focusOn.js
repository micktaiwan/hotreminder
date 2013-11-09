angular.module("hotreminderApp.directives.focusOn", ['ui']).directive('focusOn', function(){
  return {
    restrict: 'A',
    link: function($scope, element, attributes) {
      $scope.$watch(attributes.focusOn, function() {
        element[0].focus();
      });
    }
  };
});
